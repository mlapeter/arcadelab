// Send-only email to the admin via the Resend REST API. No inbox, no
// templates, no queue — one POST. When RESEND_API_KEY is unset (local dev,
// or simply not set up yet) we log the email instead of sending it, so every
// feature that emails works identically without it.

const RESEND_URL = "https://api.resend.com/emails";

/** Email the admin. Returns true if sent (or logged in log mode). */
export async function sendAdminEmail(subject: string, text: string): Promise<boolean> {
  const to = process.env.ADMIN_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "ArcadeLab <robot@arcadelab.ai>";

  if (!apiKey || !to) {
    console.log(`[email log-mode] To: ${to || "(ADMIN_EMAIL unset)"}\nSubject: ${subject}\n${text}`);
    return true;
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });
    if (!res.ok) console.error(`[email] Resend ${res.status}: ${await res.text()}`);
    return res.ok;
  } catch (e) {
    console.error("[email] send failed:", e);
    return false;
  }
}
