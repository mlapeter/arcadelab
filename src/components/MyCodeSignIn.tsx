"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { saveCreatorIdentity } from "@/lib/identity";

/**
 * Prototype: /my/ROCKET-WOLF-COMET-73 signs this device in as that creator.
 * Not linked from anywhere yet — pending a risk assessment.
 */
export default function MyCodeSignIn({ code }: { code: string }) {
  const [state, setState] = useState<"checking" | "success" | "error">("checking");
  const [name, setName] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creator_code: code }),
        });
        if (!res.ok) throw new Error();
        const creator = await res.json();
        if (cancelled) return;
        saveCreatorIdentity({
          creator_id: creator.id,
          creator_code: creator.creator_code,
          display_name: creator.display_name,
        });
        setName(creator.display_name);
        setState("success");
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (state === "checking") {
    return <p className="text-[10px] text-parchment/60">Checking your code...</p>;
  }

  if (state === "success") {
    return (
      <div className="space-y-6">
        <div className="text-5xl">🎉</div>
        <h1 className="text-sm sm:text-base text-accent-gold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          You&apos;re signed in as {name}!
        </h1>
        <Link href="/publish" className="rpg-btn rpg-btn-green inline-block px-6 py-4 text-[10px]">
          ▶ Go publish
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-sm sm:text-base text-accent-gold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
        That link doesn&apos;t work — check your creator code!
      </h1>
      <Link href="/publish" className="rpg-btn rpg-btn-purple inline-block px-6 py-4 text-[10px]">
        Go to publish
      </Link>
    </div>
  );
}
