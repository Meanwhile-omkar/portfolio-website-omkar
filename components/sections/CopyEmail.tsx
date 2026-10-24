"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
      className="font-note text-[17px] text-ink-soft underline decoration-dashed underline-offset-4 hover:text-ink"
      aria-live="polite"
    >
      {copied ? "copied! paste it anywhere" : `or copy ${email}`}
    </button>
  );
}
