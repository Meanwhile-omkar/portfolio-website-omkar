// Behaviour tracking for the SSC page, sent to Microsoft Clarity (session recordings, heatmaps, funnels).
// Events become funnel steps in Clarity; tags let you filter recordings (e.g. "medium = Marathi").

type Clarity = ((cmd: string, ...args: unknown[]) => void) & { q?: unknown[] };
declare global {
  interface Window {
    clarity?: Clarity;
  }
}

// Sessions with these events are always kept as recordings (Clarity otherwise samples).
const KEEP = new Set(["paper_download", "paper_view", "no_results", "form_sent", "form_contact_missing", "zip_download", "show_papers"]);

// Events can fire before Clarity's script has loaded (e.g. the jump to the papers on a shared link).
// Create the same queue Clarity's own snippet creates, so those early events are kept and sent once it loads.
function clarity(): Clarity | undefined {
  if (typeof window === "undefined") return undefined;
  if (!window.clarity) {
    const stub = function (...args: unknown[]) {
      (stub.q = stub.q || []).push(args);
    } as Clarity;
    window.clarity = stub;
  }
  return window.clarity;
}

export function track(event: string, tags?: Record<string, string | number | undefined>) {
  const c = clarity();
  if (!c) return;
  try {
    if (tags) for (const [k, v] of Object.entries(tags)) if (v !== undefined && v !== "") c("set", k, String(v));
    c("event", event);
    if (KEEP.has(event)) c("upgrade", event);
  } catch {}
}

export function tag(key: string, value: string | number | undefined) {
  const c = clarity();
  if (!c || value === undefined || value === "") return;
  try {
    c("set", key, String(value));
  } catch {}
}
