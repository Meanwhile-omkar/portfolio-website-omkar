"use client";

import { useState } from "react";
import { Tape } from "@/components/sketch/Paper";
import type { Lang } from "./i18n";
import { track } from "./track";

// Messages go to Omkar's inbox through FormSubmit (formsubmit.co): no backend or API key needed.
// A Gmail or WhatsApp number is required for anything except a plain thank-you, so there is a way to reply.
// Each message also says how the student found the page, which is the best signal of where visitors come from.

const TOPICS = [
  { key: "thanks", en: "Say thank you 💛", mr: "धन्यवाद म्हणायचे 💛" },
  { key: "request", en: "Ask for a paper", mr: "प्रश्नपत्रिका हवी आहे" },
  { key: "mistake", en: "Report a mistake", mr: "चूक कळवायची आहे" },
  { key: "other", en: "Something else", mr: "दुसरे काही" },
] as const;
type Topic = (typeof TOPICS)[number]["key"];

const FOUND = [
  { key: "google", en: "Google search", mr: "Google सर्च" },
  { key: "whatsapp", en: "WhatsApp / Telegram", mr: "WhatsApp / Telegram" },
  { key: "social", en: "Instagram / YouTube", mr: "Instagram / YouTube" },
  { key: "friend", en: "Friend or teacher", mr: "मित्र किंवा शिक्षक" },
  { key: "ai", en: "ChatGPT / AI", mr: "ChatGPT / AI" },
  { key: "other", en: "Somewhere else", mr: "इतर" },
] as const;

const W = {
  en: {
    title: "Talk to me",
    intro:
      "I'm Omkar. I put this together so nobody has to hunt for papers before the boards. Tell me what helped, what's missing, or what else you need. I read every message.",
    about: "What's it about?",
    name: "Your name (optional)",
    reach: "Your Gmail or WhatsApp number",
    reachNeed: "Needed so I can reply or send you the paper.",
    reachOptional: "Your Gmail or WhatsApp number (optional)",
    reachBad: "Please enter a valid email or a 10-digit phone number, so I can reply to you.",
    msg: "Your message",
    msgPh: "e.g. Please add Marathi medium prelim papers for Science 2…",
    found: "How did you find this page? (optional)",
    send: "Send message",
    sending: "Sending…",
    ok: "Got it, thank you! I'll read it soon. All the best for your boards 🎉",
    okReply: "Got it! I'll reply to you on the number or email you gave. All the best for your boards 🎉",
    fail: "That didn't go through. Please email me instead:",
    orMail: "Or email me directly:",
  },
  mr: {
    title: "माझ्याशी बोला",
    intro:
      "मी ओंकार. बोर्ड परीक्षेपूर्वी कोणालाही प्रश्नपत्रिका शोधत बसावे लागू नये म्हणून हे बनवले आहे. काय उपयोगी पडले, काय नाही, किंवा अजून काय हवे आहे ते मला सांगा. मी प्रत्येक संदेश वाचतो.",
    about: "कशाबद्दल आहे?",
    name: "तुमचे नाव (ऐच्छिक)",
    reach: "तुमचा Gmail किंवा WhatsApp नंबर",
    reachNeed: "उत्तर देण्यासाठी किंवा प्रश्नपत्रिका पाठवण्यासाठी हे लागेल.",
    reachOptional: "तुमचा Gmail किंवा WhatsApp नंबर (ऐच्छिक)",
    reachBad: "कृपया योग्य ईमेल किंवा १० अंकी फोन नंबर लिहा, म्हणजे मी उत्तर देऊ शकेन.",
    msg: "तुमचा संदेश",
    msgPh: "उदा. विज्ञान भाग २ च्या मराठी माध्यमाच्या सराव प्रश्नपत्रिका टाका…",
    found: "हे पान तुम्हाला कसे सापडले? (ऐच्छिक)",
    send: "संदेश पाठवा",
    sending: "पाठवत आहे…",
    ok: "संदेश मिळाला, धन्यवाद! लवकरच वाचेन. बोर्ड परीक्षेसाठी खूप शुभेच्छा 🎉",
    okReply: "संदेश मिळाला! तुम्ही दिलेल्या नंबरवर किंवा ईमेलवर मी उत्तर देईन. बोर्ड परीक्षेसाठी खूप शुभेच्छा 🎉",
    fail: "संदेश गेला नाही. कृपया थेट ईमेल करा:",
    orMail: "किंवा थेट ईमेल करा:",
  },
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
// Indian mobile, with or without +91 / 0 in front; spaces and dashes are fine.
const PHONE = /^(?:\+?91|0)?[6-9]\d{9}$/;
function contactKind(v: string): "email" | "phone" | null {
  const s = v.trim();
  if (EMAIL.test(s)) return "email";
  if (PHONE.test(s.replace(/[\s()-]/g, ""))) return "phone";
  return null;
}

export default function TalkToMe({ lang, email }: { lang: Lang; email: string }) {
  const w = W[lang];
  const [topic, setTopic] = useState<Topic>("request");
  const [found, setFound] = useState<string>("");
  const [reach, setReach] = useState("");
  const [reachErr, setReachErr] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "fail">("idle");
  const needReach = topic !== "thanks";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("_honey")) return; // bots fill the hidden field
    const msgEl = e.currentTarget.elements.namedItem("message") as HTMLTextAreaElement | null;
    if (msgEl && msgEl.value.trim().length < 3) {
      msgEl.reportValidity();
      msgEl.focus();
      return;
    }
    const kind = reach.trim() ? contactKind(reach) : null;
    if ((needReach && !kind) || (reach.trim() && !kind)) {
      setReachErr(true);
      track("form_contact_missing", { form_topic: topic });
      document.getElementById("talk-reach")?.focus();
      return;
    }
    setState("sending");
    const topicEn = TOPICS.find((t) => t.key === topic)?.en;
    const params = new URLSearchParams(location.search);
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `SSC papers page: ${topicEn}${kind ? ` (reply to ${reach.trim()})` : ""}`,
          _template: "table",
          _captcha: "false",
          ...(kind === "email" ? { _replyto: reach.trim() } : {}),
          topic: topicEn,
          name: f.get("name") || "(not given)",
          reply_to: reach.trim() ? `${reach.trim()} (${kind})` : "(not given)",
          message: f.get("message"),
          found_via: FOUND.find((x) => x.key === found)?.en ?? "(not answered)",
          came_from: document.referrer || "(no referrer: typed link, app or bookmark)",
          utm: ["utm_source", "utm_medium", "utm_campaign"].map((k) => params.get(k)).filter(Boolean).join(" / ") || "(none)",
          page: window.location.href,
        }),
      });
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && String(data.success) !== "false";
      setState(ok ? "ok" : "fail");
      track(ok ? "form_sent" : "form_failed", { form_topic: topic, found_via: found || undefined });
    } catch {
      setState("fail");
    }
  }

  const field =
    "w-full rounded-2xl border-2 border-ink/15 bg-white px-4 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-blue";

  return (
    <section id="talk" aria-labelledby="talk-h" className="mt-14 scroll-mt-24">
      <div className="grid gap-6 rounded-3xl border-2 border-ink bg-[#fff8dc] p-5 shadow-[5px_5px_0_#1d1d1f] md:grid-cols-[1fr_1.2fr] md:p-8">
        <div className="relative">
          <Tape className="-top-8 left-4" color="#ee46d3" />
          <h2 id="talk-h" className="font-marker text-[52px] leading-none text-ink">
            {w.title} <span aria-hidden>✍️</span>
          </h2>
          <p className="mt-3 font-note text-[17px] leading-snug text-ink">{w.intro}</p>
          <p className="mt-5 text-[14px] text-ink-soft">
            {w.orMail}{" "}
            <a href={`mailto:${email}?subject=${encodeURIComponent("SSC papers page")}`} className="font-medium text-blue underline-offset-4 hover:underline">
              {email}
            </a>
          </p>
        </div>

        {state === "ok" ? (
          <div className="grid place-items-center rounded-2xl border-2 border-dashed border-ink/25 bg-white p-8 text-center">
            <p className="font-note text-[20px] text-ink">{reach.trim() ? w.okReply : w.ok}</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-3" data-clarity-mask="true">
            <fieldset>
              <legend className="label mb-2">{w.about}</legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    aria-pressed={topic === t.key}
                    onClick={() => {
                      setTopic(t.key);
                      setReachErr(false);
                    }}
                    className={`rounded-full border-2 px-3.5 py-1.5 text-[14px] font-medium transition-all ${
                      topic === t.key ? "border-ink bg-ink text-white shadow-[2px_2px_0_#ee46d3]" : "border-ink/15 bg-white text-ink hover:border-ink/50"
                    }`}
                  >
                    {t[lang]}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-1">
              <label htmlFor="talk-reach" className="text-[14px] font-semibold text-ink">
                {needReach ? (
                  <>
                    {w.reach} <span className="text-orange">*</span>
                  </>
                ) : (
                  w.reachOptional
                )}
              </label>
              <input
                id="talk-reach"
                name="reach"
                inputMode="email"
                autoComplete="email"
                value={reach}
                onChange={(e) => {
                  setReach(e.target.value);
                  if (reachErr) setReachErr(false);
                }}
                placeholder="yourname@gmail.com  /  98XXXXXXXX"
                aria-invalid={reachErr}
                aria-describedby="talk-reach-help"
                className={`${field} ${reachErr ? "!border-orange" : ""}`}
              />
              <p id="talk-reach-help" className={`text-[13px] ${reachErr ? "font-medium text-orange" : "text-ink-soft"}`}>
                {reachErr ? w.reachBad : needReach ? w.reachNeed : ""}
              </p>
            </div>

            <input name="name" autoComplete="name" placeholder={w.name} aria-label={w.name} className={field} />
            <textarea name="message" required minLength={3} rows={4} placeholder={w.msgPh} aria-label={w.msg} className={`${field} resize-y`} />

            <fieldset>
              <legend className="label mb-2">{w.found}</legend>
              <div className="flex flex-wrap gap-2">
                {FOUND.map((x) => (
                  <button
                    key={x.key}
                    type="button"
                    aria-pressed={found === x.key}
                    onClick={() => setFound(found === x.key ? "" : x.key)}
                    className={`rounded-full border-2 px-3 py-1 text-[13px] font-medium transition-all ${
                      found === x.key ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink hover:border-ink/50"
                    }`}
                  >
                    {x[lang]}
                  </button>
                ))}
              </div>
            </fieldset>

            <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={state === "sending"} className="btn-blue disabled:opacity-60">
                {state === "sending" ? w.sending : `${w.send} →`}
              </button>
              {state === "fail" && (
                <p className="text-[14px] text-orange">
                  {w.fail}{" "}
                  <a href={`mailto:${email}`} className="underline">
                    {email}
                  </a>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
