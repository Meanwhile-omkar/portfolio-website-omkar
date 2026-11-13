"use client";

import { useState } from "react";
import { Tape } from "@/components/sketch/Paper";
import type { Lang } from "./i18n";

// Messages go to Omkar's inbox through FormSubmit (formsubmit.co): no backend or API key needed.
// The very first message triggers a one-time "Activate" email from FormSubmit to the inbox.

const TOPICS = [
  { key: "thanks", en: "Say thank you 💛", mr: "धन्यवाद म्हणायचे 💛" },
  { key: "request", en: "Ask for a paper", mr: "प्रश्नपत्रिका हवी आहे" },
  { key: "mistake", en: "Report a mistake", mr: "चूक कळवायची आहे" },
  { key: "other", en: "Something else", mr: "दुसरे काही" },
] as const;

const W = {
  en: {
    title: "Talk to me",
    intro:
      "I'm Omkar. I put this together so nobody has to hunt for papers before the boards. Tell me what helped, what's missing, or what else you need. I read every message.",
    about: "What's it about?",
    name: "Your name (optional)",
    reach: "Email or phone, if you want a reply (optional)",
    msg: "Your message",
    msgPh: "e.g. Please add Marathi medium prelim papers for Science 2…",
    send: "Send message",
    sending: "Sending…",
    ok: "Got it, thank you! I'll read it soon. All the best for your boards 🎉",
    fail: "That didn't go through. Please email me instead:",
    orMail: "Or email me directly:",
  },
  mr: {
    title: "माझ्याशी बोला",
    intro:
      "मी ओंकार. बोर्ड परीक्षेपूर्वी कोणालाही प्रश्नपत्रिका शोधत बसावे लागू नये म्हणून हे बनवले आहे. काय उपयोगी पडले, काय नाही, किंवा अजून काय हवे आहे ते मला सांगा. मी प्रत्येक संदेश वाचतो.",
    about: "कशाबद्दल आहे?",
    name: "तुमचे नाव (ऐच्छिक)",
    reach: "उत्तर हवे असल्यास ईमेल किंवा फोन (ऐच्छिक)",
    msg: "तुमचा संदेश",
    msgPh: "उदा. विज्ञान भाग २ च्या मराठी माध्यमाच्या सराव प्रश्नपत्रिका टाका…",
    send: "संदेश पाठवा",
    sending: "पाठवत आहे…",
    ok: "संदेश मिळाला, धन्यवाद! लवकरच वाचेन. बोर्ड परीक्षेसाठी खूप शुभेच्छा 🎉",
    fail: "संदेश गेला नाही. कृपया थेट ईमेल करा:",
    orMail: "किंवा थेट ईमेल करा:",
  },
};

export default function TalkToMe({ lang, email }: { lang: Lang; email: string }) {
  const w = W[lang];
  const [topic, setTopic] = useState<(typeof TOPICS)[number]["key"]>("thanks");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "fail">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("_honey")) return; // bots fill the hidden field
    setState("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `SSC papers page: ${TOPICS.find((t) => t.key === topic)?.en}`,
          _template: "table",
          _captcha: "false",
          topic: TOPICS.find((t) => t.key === topic)?.en,
          name: f.get("name") || "(not given)",
          reply_to: f.get("reach") || "(not given)",
          message: f.get("message"),
          page: window.location.href,
        }),
      });
      const data = await res.json().catch(() => ({}));
      setState(res.ok && String(data.success) !== "false" ? "ok" : "fail");
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
            <p className="font-note text-[20px] text-ink">{w.ok}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-3">
            <fieldset>
              <legend className="label mb-2">{w.about}</legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    aria-pressed={topic === t.key}
                    onClick={() => setTopic(t.key)}
                    className={`rounded-full border-2 px-3.5 py-1.5 text-[14px] font-medium transition-all ${
                      topic === t.key ? "border-ink bg-ink text-white shadow-[2px_2px_0_#ee46d3]" : "border-ink/15 bg-white text-ink hover:border-ink/50"
                    }`}
                  >
                    {t[lang]}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="name" autoComplete="name" placeholder={w.name} aria-label={w.name} className={field} />
              <input name="reach" placeholder={w.reach} aria-label={w.reach} className={field} />
            </div>
            <textarea name="message" required minLength={3} rows={4} placeholder={w.msgPh} aria-label={w.msg} className={`${field} resize-y`} />
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
