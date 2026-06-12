"use client";

import { useState, useEffect, useRef } from "react";
import { parseGameHeader, type ParsedGame } from "@/lib/parse-game";
import { isCreatorCodeMessage } from "@/lib/safety";
import { extractPastedCode, suggestCreatorCode, type DetectedCode } from "@/lib/creator-codes";
import { getCreatorIdentity, saveCreatorIdentity, type CreatorIdentity } from "@/lib/identity";
import BanPanel from "@/components/BanPanel";

type Phase = "paste" | "welcome" | "confirm" | "success";

/** Error text with "arcadelab.ai/appeal" rendered as a real link. */
function ErrorMessage({ message }: { message: string }) {
  const parts = message.split("arcadelab.ai/appeal");
  return (
    <p className="text-[10px] text-accent-red">
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && (
            <a href="/appeal" className="underline hover:text-accent-gold">
              arcadelab.ai/appeal
            </a>
          )}
          {part}
        </span>
      ))}
    </p>
  );
}

interface PublishResult {
  url: string;
  slug: string;
  title: string;
  /** Server merged this publish into a recent game with the same title. */
  updated?: boolean;
  message?: string;
}

export default function PublishForm({ updateSlug, remixOfSlug }: { updateSlug?: string; remixOfSlug?: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Identity
  const [identity, setIdentity] = useState<CreatorIdentity | null>(null);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [recoverySuggestion, setRecoverySuggestion] = useState("");
  const [recovering, setRecovering] = useState(false);
  const recoveryInputRef = useRef<HTMLInputElement>(null);

  // Pasted-code sign-in offer
  const [signInOffer, setSignInOffer] = useState<{
    code: string;
    display_name: string;
    /** The raw paste, when the code is a typo correction of it. */
    typoFrom?: string;
    /** Current account has published games — show the "stays safe" line. */
    showStaySafe: boolean;
  } | null>(null);
  const [checkingCode, setCheckingCode] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [notice, setNotice] = useState("");

  // Same-device register suggestion (asked at most once)
  const [registerSuggestion, setRegisterSuggestion] = useState<{
    name: string;
    parsed: ParsedGame;
  } | null>(null);
  const suggestionAskedRef = useRef(false);

  // Game
  const [focused, setFocused] = useState(false);
  const [rawCode, setRawCode] = useState("");
  const [parsed, setParsed] = useState<ParsedGame | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Update mode
  const [existingGame, setExistingGame] = useState<{
    id: string;
    title: string;
    description: string | null;
  } | null>(null);
  const [loadingGame, setLoadingGame] = useState(!!updateSlug);

  // Remix
  const [remixOf] = useState(remixOfSlug || "");
  const [remixInfo, setRemixInfo] = useState<{ title: string; creator_name: string } | null>(null);

  // UI
  const [phase, setPhase] = useState<Phase>("paste");
  const [error, setError] = useState("");
  const [banned, setBanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Load saved identity on mount
  useEffect(() => {
    setIdentity(getCreatorIdentity());
  }, []);

  // Fetch existing game info in update mode
  useEffect(() => {
    if (!updateSlug) return;

    async function fetchGame() {
      setLoadingGame(true);
      try {
        const res = await fetch(`/api/games/by-slug/${updateSlug}`);
        const data = await res.json();

        if (!res.ok) {
          setError("Couldn't find that game");
          setLoadingGame(false);
          return;
        }

        const savedIdentity = getCreatorIdentity();
        if (!savedIdentity || savedIdentity.creator_id !== data.creator_id) {
          setError("You can only update your own games");
          setLoadingGame(false);
          return;
        }

        setExistingGame({
          id: data.id,
          title: data.title,
          description: data.description,
        });
      } catch {
        setError("Couldn't connect — try again");
      } finally {
        setLoadingGame(false);
      }
    }

    fetchGame();
  }, [updateSlug]);

  // Fetch remix info
  useEffect(() => {
    if (!remixOfSlug) return;

    async function fetchRemixInfo() {
      try {
        const res = await fetch(`/api/games/by-slug/${remixOfSlug}`);
        if (res.ok) {
          const data = await res.json();
          setRemixInfo({ title: data.title, creator_name: data.creator_name });
        }
      } catch {
        // silently fail
      }
    }

    fetchRemixInfo();
  }, [remixOfSlug]);

  async function handlePaste(code: string) {
    // A pasted creator code — bare, or the reminder message — is a sign-in
    // attempt, not a game. Offer to sign in instead of rejecting it.
    const detected = extractPastedCode(code);
    if (detected) {
      setRawCode("");
      setParsed(null);
      await offerSignIn(detected);
      return;
    }

    // Fallback for mangled reminder messages where no code can be extracted.
    // Must never be echoed into the preview.
    if (isCreatorCodeMessage(code)) {
      setRawCode("");
      setParsed(null);
      setError(
        "That looks like your creator code message — keep it private! It's how you publish. Paste your game's HTML code here instead."
      );
      return;
    }

    setSignInOffer(null);
    setNotice("");
    setRawCode(code);
    if (!code.trim()) {
      setParsed(null);
      return;
    }

    const result = parseGameHeader(code);
    setParsed(result);
    setTitle(result.title || existingGame?.title || "");
    setDescription(result.description || existingGame?.description || "");
    setError("");

    // A creator_code in the game header wins over whatever this browser
    // remembers — it's how identity survives any device. Skipped in update
    // mode, where ownership was already checked at load.
    if (!updateSlug && result.creator_code && result.creator_code !== identity?.creator_code) {
      if (await adoptHeaderIdentity(result.creator_code)) return;
    }

    if (identity) {
      setPhase("confirm");
    } else if (updateSlug) {
      setError("You need to be logged in to update a game");
    } else {
      autoCreateAccount(result);
    }
  }

  /** Resolve a pasted code (peek — no cookie yet) and offer to sign in. */
  async function offerSignIn(detected: DetectedCode) {
    const candidate = detected.valid ? detected.raw : detected.suggestion!;
    setError("");
    setNotice("");
    setSignInOffer(null);

    if (identity?.creator_code === candidate) {
      setNotice(`You're already signed in as ${identity.display_name}! Paste your game code to publish.`);
      return;
    }

    setCheckingCode(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_code: candidate,
          peek: true,
          ...(identity && { current_creator_id: identity.creator_id }),
        }),
      });
      const data = await res.json();

      if (!res.ok || data.error || !data.display_name) {
        setError("Hmm, that code doesn't match anyone — check for typos!");
        return;
      }

      // Signed in as an account with zero games? Just switch — abandoning the
      // empty account is the whole retirement ceremony.
      if (identity && (data.games_count ?? 0) === 0) {
        await signInAs(candidate);
        return;
      }

      setSignInOffer({
        code: candidate,
        display_name: data.display_name,
        typoFrom: detected.valid ? undefined : detected.raw,
        showStaySafe: !!identity,
      });
    } catch {
      setError("Couldn't connect — try again");
    } finally {
      setCheckingCode(false);
    }
  }

  /** Verify for real (sets the identity cookie) and become that account. */
  async function signInAs(code: string) {
    setSigningIn(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creator_code: code }),
      });
      const data = await res.json();

      if (!res.ok || data.error || !data.id) {
        setError(data.error || "Code not found — check for typos!");
        return;
      }

      const newIdentity: CreatorIdentity = {
        creator_id: data.id,
        creator_code: data.creator_code,
        display_name: data.display_name,
      };
      saveCreatorIdentity(newIdentity);
      setIdentity(newIdentity);
      setSignInOffer(null);
      setRegisterSuggestion(null);
    } catch {
      setError("Couldn't connect — try again");
    } finally {
      setSigningIn(false);
    }
  }

  /**
   * A creator_code embedded in the game header by an AI assistant. If it
   * resolves, publish as that account and silently sign this browser in too.
   * A bad header code never blocks a kid — return false and fall through.
   */
  async function adoptHeaderIdentity(code: string): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creator_code: code }),
      });
      const data = await res.json();
      if (!res.ok || data.error || !data.id) return false;

      const newIdentity: CreatorIdentity = {
        creator_id: data.id,
        creator_code: data.creator_code,
        display_name: data.display_name,
      };
      saveCreatorIdentity(newIdentity);
      setIdentity(newIdentity);
      setPhase("confirm");
      return true;
    } catch {
      return false;
    }
  }

  async function autoCreateAccount(parsedGame: ParsedGame, fresh = false) {
    setCreatingAccount(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: null,
          auto: true,
          // Once the "Are you {name}?" question has been asked, never re-ask.
          ...((fresh || suggestionAskedRef.current) && { fresh: true }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong creating your account");
        setCreatingAccount(false);
        return;
      }

      // Same device made an account recently — ask once. Never auto-link: the
      // only way to become that account is pasting its code.
      if (data.suggestion) {
        suggestionAskedRef.current = true;
        setRegisterSuggestion({ name: data.suggestion.display_name, parsed: parsedGame });
        return;
      }

      const newIdentity: CreatorIdentity = {
        creator_id: data.id,
        creator_code: data.creator_code,
        display_name: data.display_name,
      };
      saveCreatorIdentity(newIdentity);
      setIdentity(newIdentity);
      setParsed(parsedGame);
      setPhase("welcome");
    } catch {
      setError("Couldn't connect — try again");
    } finally {
      setCreatingAccount(false);
    }
  }

  function copySecretCode() {
    if (!identity) return;
    const text = `My ArcadeLab creator code is ${identity.creator_code} — it's how I publish games on arcadelab.ai. Please remember it for me! (It's not a password, just a fun code that links to my creator name.)`;
    navigator.clipboard.writeText(text);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 3000);
  }

  function proceedToConfirm() {
    setPhase("confirm");
  }

  async function handleRecovery(codeOverride?: string) {
    const code = (codeOverride ?? recoveryCode).trim().toUpperCase();
    if (!code) return;

    setRecovering(true);
    setRecoveryError("");
    setRecoverySuggestion("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creator_code: code }),
      });

      const data = await res.json();

      if (!res.ok || data.error || !data.id) {
        const suggestion = res.ok ? suggestCreatorCode(code) : null;
        if (suggestion && suggestion !== code) {
          setRecoverySuggestion(suggestion);
          setRecoveryError("Hmm, that code doesn't match anyone.");
        } else {
          setRecoveryError(data.error || "Code not found");
        }
        return;
      }

      const recoveredIdentity: CreatorIdentity = {
        creator_id: data.id,
        creator_code: data.creator_code,
        display_name: data.display_name,
      };
      saveCreatorIdentity(recoveredIdentity);
      setIdentity(recoveredIdentity);
      setRecoveryCode("");
      setRegisterSuggestion(null);
      // They pasted a game before signing in (register-suggestion flow) —
      // go straight to publishing it.
      if (parsed && !updateSlug) setPhase("confirm");
    } catch {
      setRecoveryError("Couldn't connect — try again");
    } finally {
      setRecovering(false);
    }
  }

  async function handlePublish() {
    if (!identity || !parsed) return;

    const finalTitle = title.trim() || "Untitled Game";
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_code: identity.creator_code,
          title: finalTitle,
          description: description.trim() || undefined,
          html: parsed.gameHtml,
          libraries: parsed.libraries,
          emoji: parsed.emoji || undefined,
          color: parsed.color || undefined,
          remix_of: parsed.remix_of || remixOf || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.banned) {
          setBanned(true); // friendly ban panel instead of a scary red box
          return;
        }
        const msg = data.warnings ? `${data.error}: ${data.warnings.join(", ")}` : data.error || "Failed to publish";
        setError(msg);
        return;
      }

      setPublishResult({
        url: data.url,
        slug: data.slug,
        title: data.title,
        updated: data.updated,
        message: data.message,
      });
      setPhase("success");
    } catch {
      setError("Couldn't connect — try again");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!identity || !parsed || !existingGame) return;

    const finalTitle = title.trim() || existingGame.title;
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/games/${existingGame.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_code: identity.creator_code,
          title: finalTitle,
          description: description.trim() || undefined,
          html: parsed.gameHtml,
          libraries: parsed.libraries,
          emoji: parsed.emoji || undefined,
          color: parsed.color || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.banned) {
          setBanned(true);
          return;
        }
        const msg = data.warnings ? `${data.error}: ${data.warnings.join(", ")}` : data.error || "Failed to update";
        setError(msg);
        return;
      }

      setPublishResult({
        url: data.url,
        slug: data.slug,
        title: data.title,
      });
      setPhase("success");
    } catch {
      setError("Couldn't connect — try again");
    } finally {
      setLoading(false);
    }
  }

  function copyUrl() {
    if (publishResult) {
      navigator.clipboard.writeText(publishResult.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function reset() {
    setRawCode("");
    setParsed(null);
    setTitle("");
    setDescription("");
    setPublishResult(null);
    setError("");
    setPhase("paste");
  }

  // ── PASTE PHASE ──
  if (phase === "paste") {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        {/* Update mode: existing game info */}
        {updateSlug && loadingGame && (
          <div className="text-center py-4">
            <span className="text-2xl pixel-blink">⏳</span>
            <p className="mt-2 text-[10px] text-parchment/50">Loading game info...</p>
          </div>
        )}

        {existingGame && (
          <div className="rpg-panel p-3 text-center">
            <p className="text-[10px] text-wood-mid/70">
              Updating <span className="text-accent-gold">{existingGame.title}</span>
            </p>
            <p className="text-[10px] text-wood-mid/50 mt-1">Paste your new game code below</p>
          </div>
        )}

        {/* Remix banner */}
        {remixInfo && (
          <div className="rpg-panel p-3 text-center">
            <p className="text-[10px] text-wood-mid/70">
              🔀 Remixing <span className="text-accent-gold">{remixInfo.title}</span> by {remixInfo.creator_name}
            </p>
          </div>
        )}

        {/* Identity banner for returning users (new game mode only) */}
        {!updateSlug && identity && (
          <div className="rpg-panel p-3 text-center">
            <p className="text-[10px] text-wood-mid/70">
              Publishing as <span className="text-wood-dark font-bold">{identity.display_name}</span>
            </p>
          </div>
        )}

        <div
          className="rpg-panel-dark relative cursor-pointer p-4"
          onClick={async () => {
            if (rawCode || focused) {
              textareaRef.current?.focus();
              return;
            }
            try {
              const text = await navigator.clipboard.readText();
              // Codes are short — catch them even below the 50-char threshold.
              if (text && (text.trim().length > 50 || extractPastedCode(text))) {
                handlePaste(text);
              } else if (text && text.trim()) {
                setRawCode(text);
                setFocused(true);
              } else {
                setFocused(true);
                textareaRef.current?.focus();
              }
            } catch {
              // Clipboard access denied — show textarea with cursor
              setFocused(true);
              textareaRef.current?.focus();
            }
          }}
        >
          <textarea
            ref={textareaRef}
            value={rawCode}
            onChange={(e) => {
              const val = e.target.value;
              setRawCode(val);
              if (val.trim().length > 50) {
                handlePaste(val);
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = e.clipboardData.getData("text");
              handlePaste(pasted);
            }}
            aria-label="Paste your game code here"
            onFocus={() => setFocused(true)}
            className={`w-full resize-none bg-transparent text-[10px] text-parchment focus:outline-none ${rawCode || focused ? "min-h-[40vh]" : "min-h-0 h-0 absolute opacity-0"}`}
            spellCheck={false}
          />
          {!rawCode && !focused && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <span className="text-7xl">📋</span>
              <p className="text-sm text-parchment/70">Paste your game code</p>
              <p className="text-[10px] text-parchment/30">Tap here to paste from clipboard</p>
            </div>
          )}
        </div>

        {creatingAccount && (
          <div className="text-center py-4">
            <span className="text-2xl pixel-blink">⏳</span>
            <p className="mt-2 text-[10px] text-parchment/50">Setting up your account...</p>
          </div>
        )}

        {checkingCode && (
          <div className="text-center py-4">
            <span className="text-2xl pixel-blink">⏳</span>
            <p className="mt-2 text-[10px] text-parchment/50">Checking that code...</p>
          </div>
        )}

        {error && (
          <div className="rpg-panel p-3">
            <ErrorMessage message={error} />
          </div>
        )}

        {notice && (
          <div className="rpg-panel p-3 text-center">
            <p className="text-[10px] text-wood-dark/70 normal-case">{notice}</p>
          </div>
        )}

        {/* Pasted-code sign-in offer */}
        {signInOffer && (
          <div className="rpg-panel p-4 space-y-3 text-center">
            {signInOffer.typoFrom && (
              <p className="text-[10px] text-wood-mid/70 normal-case">
                Looks like a small typo — did you mean{" "}
                <span className="text-accent-purple">{signInOffer.code}</span>?
              </p>
            )}
            <p className="text-xs text-wood-dark">
              Sign in as <span className="font-bold">{signInOffer.display_name}</span>?
            </p>
            {signInOffer.showStaySafe && identity && (
              <p className="text-[10px] text-wood-mid/60 normal-case">
                Your games as {identity.display_name} stay safe — paste that code anytime to switch back.
              </p>
            )}
            <button
              onClick={() => signInAs(signInOffer.code)}
              disabled={signingIn}
              className="rpg-btn rpg-btn-green w-full px-6 py-4 text-[10px] disabled:opacity-50"
            >
              {signingIn ? "Signing in..." : `✓ Sign in as ${signInOffer.display_name}`}
            </button>
            <button
              onClick={() => {
                setSignInOffer(null);
                setRawCode("");
              }}
              className="text-[10px] text-wood-mid/50 hover:text-wood-dark block mx-auto"
            >
              No thanks
            </button>
          </div>
        )}

        {/* Same-device register suggestion (asked at most once) */}
        {registerSuggestion && (
          <div className="rpg-panel p-4 space-y-3 text-center">
            <p className="text-xs text-wood-dark">
              Are you <span className="font-bold">{registerSuggestion.name}</span>?
            </p>
            <p className="text-[10px] text-wood-mid/70 normal-case">
              Paste your creator code to keep publishing as them — or keep going as someone new.
            </p>
            <button
              onClick={() => {
                setRegisterSuggestion(null);
                setTimeout(() => recoveryInputRef.current?.focus(), 0);
              }}
              className="rpg-btn rpg-btn-purple w-full px-4 py-3 text-[10px]"
            >
              🔑 I have my creator code
            </button>
            <button
              onClick={() => {
                const pendingParsed = registerSuggestion.parsed;
                setRegisterSuggestion(null);
                autoCreateAccount(pendingParsed, true);
              }}
              className="rpg-btn w-full px-4 py-3 text-[10px]"
            >
              ✨ I&apos;m someone new
            </button>
          </div>
        )}

        {/* Published before? Creator code entry */}
        {!identity && !signInOffer && !registerSuggestion && (
          <div className="rpg-panel p-4 space-y-3">
            <p className="text-[10px] text-wood-dark text-center">
              🔑 Published before? Enter your creator code to keep your name.
            </p>
            <div className="flex gap-2">
              <input
                ref={recoveryInputRef}
                type="text"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                placeholder="WORD-WORD-WORD-00"
                aria-label="Your creator code"
                className="flex-1 border-4 border-wood-mid bg-parchment-dark px-3 py-2 text-[10px] text-wood-dark placeholder:text-wood-mid/40 focus:outline-none focus:border-accent-purple"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRecovery();
                }}
              />
              <button
                onClick={() => handleRecovery()}
                disabled={recovering || !recoveryCode.trim()}
                className="rpg-btn rpg-btn-purple px-4 py-2 text-[10px] disabled:opacity-50"
              >
                {recovering ? "..." : "Go"}
              </button>
            </div>
            {recoveryError && <p className="text-[10px] text-accent-red">{recoveryError}</p>}
            {recoverySuggestion && (
              <button
                onClick={() => {
                  setRecoveryCode(recoverySuggestion);
                  handleRecovery(recoverySuggestion);
                }}
                className="rpg-btn rpg-btn-green w-full px-4 py-2 text-[10px]"
              >
                Did you mean {recoverySuggestion}?
              </button>
            )}
            {/* Came here from "Are you {name}?" but can't find the code —
                always a way forward, never a dead end. */}
            {parsed && suggestionAskedRef.current && (
              <button
                onClick={() => autoCreateAccount(parsed, true)}
                className="text-[10px] text-wood-mid/50 hover:text-wood-dark block mx-auto"
              >
                ✨ Actually, I&apos;m someone new
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── WELCOME PHASE (new account created) ──
  if (phase === "welcome" && identity) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="text-5xl pixel-float">🎉</div>

        <h2 className="text-sm sm:text-base text-accent-gold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          You are {identity.display_name}!
        </h2>

        <div className="rpg-panel p-5 space-y-3">
          <p className="text-[10px] text-wood-mid/70">Your creator code is</p>
          <p className="text-sm sm:text-base text-accent-purple pixel-pulse">{identity.creator_code}</p>
          <p className="text-[10px] text-wood-mid/50 normal-case">
            Save this! You need it to publish from other devices
          </p>
        </div>

        <button onClick={copySecretCode} className="rpg-btn w-full px-6 py-4 text-[10px]">
          {codeCopied ? "✓ Copied!" : "📋 Copy Creator Code"}
        </button>

        <p className="text-[10px] text-parchment/40">Tip: Paste it in your AI chat so it remembers for you</p>

        <button onClick={proceedToConfirm} className="rpg-btn rpg-btn-purple w-full px-6 py-4 text-[10px]">
          ▶ Continue to publish
        </button>
      </div>
    );
  }

  // ── CONFIRM PHASE ──
  if (phase === "confirm" && parsed) {
    return (
      <div className="mx-auto max-w-2xl space-y-5 pb-16">
        {/* Preview */}
        <div
          className="pixel-border-green bg-black"
          style={{ boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.5), 6px 6px 0 rgba(0,0,0,0.3)" }}
        >
          <iframe
            sandbox="allow-scripts"
            srcDoc={parsed.gameHtml}
            style={{ width: "100%", height: "45vh", border: "none" }}
            title="Game preview"
          />
        </div>

        {/* Title */}
        {!parsed.title ? (
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your game called?"
            maxLength={60}
            autoFocus
            className="w-full border-4 border-wood-mid bg-parchment px-4 py-3 text-center text-xs text-wood-dark placeholder:text-wood-mid/40 focus:outline-none focus:border-accent-purple"
          />
        ) : (
          <h2 className="text-center text-sm text-accent-gold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">{title}</h2>
        )}

        {/* Identity */}
        {identity && (
          <p className="text-center text-[10px] text-parchment/50">
            by <span className="text-parchment/70">{identity.display_name}</span>
          </p>
        )}

        {banned && <BanPanel creatorCode={identity?.creator_code} />}

        {error && !banned && (
          <div className="rpg-panel p-3">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Publish/Update button */}
        <button
          onClick={updateSlug ? handleUpdate : handlePublish}
          disabled={loading || !identity || banned}
          className="rpg-btn rpg-btn-green w-full px-6 py-5 text-xs disabled:opacity-50"
        >
          {loading
            ? updateSlug
              ? "Updating..."
              : "Publishing..."
            : updateSlug
              ? "✏️ Update My Game!"
              : "🚀 Publish My Game!"}
        </button>

        <button onClick={reset} className="mx-auto block text-[10px] text-parchment/30 hover:text-parchment/60">
          ← Start over
        </button>
      </div>
    );
  }

  // ── SUCCESS PHASE ──
  if (phase === "success" && publishResult) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="text-sm sm:text-base text-accent-gold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          {updateSlug || publishResult.updated ? "Game updated!" : "Nice! Your game is live!"}
        </h2>
        {publishResult.message && (
          <p className="text-[10px] text-parchment/60 normal-case">{publishResult.message}</p>
        )}
        <p className="text-[10px] text-parchment/60">
          {updateSlug || publishResult.updated
            ? "Your changes are live now:"
            : "Share this link with friends:"}
        </p>

        <div className="rpg-panel p-3 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={publishResult.url}
            className="flex-1 bg-transparent text-[10px] text-wood-dark outline-none normal-case"
            aria-label="Game URL"
          />
          <button onClick={copyUrl} className="rpg-btn rpg-btn-purple px-3 py-2 text-[10px]">
            {copied ? "✓" : "Copy"}
          </button>
        </div>

        <div className="flex gap-3">
          <a
            href={`/play/${publishResult.slug}`}
            className="rpg-btn rpg-btn-green flex-1 px-4 py-3 text-[10px] text-center"
          >
            {updateSlug ? "← Back to Game" : "▶ Play It"}
          </a>
          {!updateSlug && (
            <button onClick={reset} className="rpg-btn flex-1 px-4 py-3 text-[10px] text-center">
              🎮 Make Another
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
