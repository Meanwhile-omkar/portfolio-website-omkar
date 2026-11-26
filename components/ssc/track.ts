// Behaviour tracking for the SSC page, sent to Microsoft Clarity (session recordings, heatmaps, funnels).
// Events become funnel steps in Clarity; tags let you filter recordings (e.g. "medium = Marathi").
// Does nothing until the Clarity script is loaded (see ClarityScript.tsx), so it is safe to call anywhere.

type Clarity = (cmd: string, ...args: unknown[]) => void;
declare global {
  interface Window {
    clarity?: Clarity;
  }
}

// Sessions with these events are always kept as recordings (Clarity otherwise samples).
const KEEP = new Set(["paper_download", "paper_view", "no_results", "form_sent", "form_contact_missing", "zip_download"]);

export function track(event: string, tags?: Record<string, string | number | undefined>) {
  if (typeof window === "undefined" || !window.clarity) return;
  try {
    if (tags) for (const [k, v] of Object.entries(tags)) if (v !== undefined && v !== "") window.clarity("set", k, String(v));
    window.clarity("event", event);
    if (KEEP.has(event)) window.clarity("upgrade", event);
  } catch {}
}

export function tag(key: string, value: string | number | undefined) {
  if (typeof window === "undefined" || !window.clarity || value === undefined || value === "") return;
  try {
    window.clarity("set", key, String(value));
  } catch {}
}
