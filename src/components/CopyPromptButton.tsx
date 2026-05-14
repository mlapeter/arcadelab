"use client";

import { useState } from "react";

interface Props {
  text: string;
}

export default function CopyPromptButton({ text }: Props) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // clipboard may be unavailable; fail silently
        }
      }}
      className="rpg-btn rpg-btn-purple inline-flex items-center gap-2 px-4 py-2 text-[10px]"
      aria-label="Copy prompt to clipboard"
    >
      <span className="text-base">{copied ? "✓" : "📋"}</span>
      <span>{copied ? "Copied!" : "Copy prompt"}</span>
    </button>
  );
}
