import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  chatEnabled,
  underDailyCaps,
  countSession,
  addDailyTokens,
  packState,
  unpackState,
  resolveSubject,
  runChatTurn,
  runVerdict,
  applyOutcome,
  FALLBACK_MESSAGE,
  MAX_MESSAGES,
  MAX_MESSAGE_CHARS,
  type ChatState,
} from "@/lib/appeal-chat";

/**
 * POST /api/appeals/chat — one turn of the appeals chat.
 * Body: { message, contact?, appealId?, state?, sig? }
 * (state+sig = the HMAC-signed transcript from the previous turn; absent on
 * the first message.)
 *
 * Expected outcomes return 200 — including the "fallback" ones, where the
 * client shows FALLBACK_MESSAGE and ends the chat. The plain appeal form
 * already captured the appeal, so falling back never loses anything.
 */
export async function POST(request: NextRequest) {
  if (!rateLimit(`appeal-chat:${getClientIp(request)}`, { maxRequests: 8, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many requests — slow down!" }, { status: 429 });
  }

  let body: {
    message?: string;
    contact?: string;
    appealId?: string;
    state?: string;
    sig?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Say something first!" });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json({ error: "That's a bit long — can you trim it down?" });
  }

  // Resume a session (verify the signed transcript) or start a fresh one.
  let state: ChatState | null = null;
  const isNew = !body.state;
  if (body.state && body.sig) {
    state = unpackState(body.state, body.sig);
    if (!state) {
      // Tampered or corrupted transcript — not a kid-facing condition.
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }
  }

  // Kill switch, missing API key, or daily caps → kind fallback, plain form
  // has it covered.
  if (!chatEnabled() || !underDailyCaps(isNew)) {
    return NextResponse.json({ fallback: true, message: FALLBACK_MESSAGE });
  }

  if (!state) {
    const contact = typeof body.contact === "string" ? body.contact.trim().slice(0, 200) : "";
    state = {
      v: 1,
      startedAt: new Date().toISOString(),
      appealId: typeof body.appealId === "string" ? body.appealId.slice(0, 40) : undefined,
      contact,
      subject: await resolveSubject(contact),
      messages: [],
      tokens: 0,
    };
    countSession();
  }

  if (state.resolved) {
    return NextResponse.json({
      fallback: true,
      message: "This appeal is already wrapped up — a human will see the whole conversation. 💛",
    });
  }

  const userMessages = state.messages.filter((m) => m.role === "user").length;
  if (userMessages >= MAX_MESSAGES) {
    return NextResponse.json({ fallback: true, message: FALLBACK_MESSAGE });
  }

  state.messages.push({ role: "user", content: message });
  // The subject is frozen once found; until then, each message may reveal it
  // (a pasted game link or creator code).
  if (!state.subject) {
    state.subject = await resolveSubject(`${state.contact}\n${message}`);
  }

  const turn = await runChatTurn(state);
  if (!turn) {
    return NextResponse.json({ fallback: true, message: FALLBACK_MESSAGE });
  }
  state.tokens += turn.tokens;
  addDailyTokens(turn.tokens);

  let reply = turn.reply;
  let resolved: string | undefined;

  if (turn.ready && turn.claimSummary) {
    const verdict = await runVerdict(state, turn.claimSummary);
    state.tokens += verdict.tokens;
    addDailyTokens(verdict.tokens);
    const outcome = await applyOutcome(state, verdict, turn.claimSummary);
    reply = outcome.message;
    resolved = outcome.resolve;
    state.resolved = resolved;
    console.log(
      `[appeal-chat] session resolved: ${resolved} · ${state.messages.length} messages · ~${state.tokens} tokens`
    );
  }

  state.messages.push({ role: "assistant", content: reply });
  const packed = packState(state);
  return NextResponse.json({
    reply,
    resolved,
    state: packed.state,
    sig: packed.sig,
  });
}
