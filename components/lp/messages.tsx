"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Check } from "@/components/lp/icons";
import { LANGUAGE_INFO } from "@/lib/site";

type Who = "student" | "parent";
type Kind = "reminder" | "result" | "missed";
type Gender = "m" | "f";
type ReaderLang = "ar" | "en" | "tr";

const KINDS: Record<Who, Kind[]> = { student: ["reminder", "result"], parent: ["result", "missed"] };

// Sample automatic messages as a reader gets them, in the reader's own language (sample content, not the app's
// built-in texts, which each organization edits).
const MESSAGES: Record<ReaderLang, {
  from: string; org: string; now: string; dir: "rtl" | "ltr";
  title: Record<Kind, string>;
  student: Record<"reminder" | "result", Record<Gender, string>>;
  parent: Record<"result" | "missed", Record<Gender, string>>;
}> = {
  ar: {
    from: "حافظ", org: "مدرسة النور", now: "الآن", dir: "rtl",
    title: { reminder: "تذكير بالتسميع", result: "نتيجة التسميع", missed: "غياب عن التسميع" },
    student: {
      reminder: { m: "السلام عليكم يا يوسف، موعد تسميعك غدًا إن شاء الله. الحفظ: النبأ 1–16، والمراجعة: سورة الملك.", f: "السلام عليكم يا مريم، موعد تسميعكِ غدًا إن شاء الله. الحفظ: النبأ 1–16، والمراجعة: سورة الملك." },
      result: { m: "أحسنت يا يوسف! نتيجة تسميعك اليوم 94 من 100. الحفظ: النبأ 1–16، والمراجعة: سورة الملك.", f: "أحسنتِ يا مريم! نتيجة تسميعكِ اليوم 94 من 100. الحفظ: النبأ 1–16، والمراجعة: سورة الملك." },
    },
    parent: {
      result: { m: "ابنك يوسف سمّع اليوم وحصل على 94 من 100. الحفظ: النبأ 1–16، والمراجعة: سورة الملك.", f: "ابنتك مريم سمّعت اليوم وحصلت على 94 من 100. الحفظ: النبأ 1–16، والمراجعة: سورة الملك." },
      missed: { m: "ابنك يوسف لم يسمّع في جلسة اليوم. يمكنك متابعة تسميعه من حسابك في حافظ.", f: "ابنتك مريم لم تسمّع في جلسة اليوم. يمكنك متابعة تسميعها من حسابك في حافظ." },
    },
  },
  en: {
    from: "Hafiz", org: "Al-Noor School", now: "now", dir: "ltr",
    title: { reminder: "Recitation reminder", result: "Recitation result", missed: "Missed recitation" },
    student: {
      reminder: { m: "Assalamu alaikum Yusuf, your recitation is tomorrow, in sha Allah. Memorization: An-Naba 1–16. Revision: Al-Mulk.", f: "Assalamu alaikum Maryam, your recitation is tomorrow, in sha Allah. Memorization: An-Naba 1–16. Revision: Al-Mulk." },
      result: { m: "Well done, Yusuf! Your recitation today: 94 out of 100. Memorization: An-Naba 1–16. Revision: Al-Mulk.", f: "Well done, Maryam! Your recitation today: 94 out of 100. Memorization: An-Naba 1–16. Revision: Al-Mulk." },
    },
    parent: {
      result: { m: "Your son Yusuf recited today and scored 94 out of 100. Memorization: An-Naba 1–16. Revision: Al-Mulk.", f: "Your daughter Maryam recited today and scored 94 out of 100. Memorization: An-Naba 1–16. Revision: Al-Mulk." },
      missed: { m: "Your son Yusuf did not recite in today's session. You can follow his recitations in your Hafiz account.", f: "Your daughter Maryam did not recite in today's session. You can follow her recitations in your Hafiz account." },
    },
  },
  tr: {
    from: "Hafız", org: "Nur Kur'an Kursu", now: "şimdi", dir: "ltr",
    title: { reminder: "Tilavet hatırlatması", result: "Tilavet sonucu", missed: "Kaçırılan tilavet" },
    student: {
      reminder: { m: "Esselâmu aleyküm Yusuf, tilavetin yarın inşallah. Hıfz: Nebe 1–16. Tekrar: Mülk.", f: "Esselâmu aleyküm Meryem, tilavetin yarın inşallah. Hıfz: Nebe 1–16. Tekrar: Mülk." },
      result: { m: "Aferin Yusuf! Bugünkü tilavetin: 100 üzerinden 94. Hıfz: Nebe 1–16. Tekrar: Mülk.", f: "Aferin Meryem! Bugünkü tilavetin: 100 üzerinden 94. Hıfz: Nebe 1–16. Tekrar: Mülk." },
    },
    parent: {
      result: { m: "Oğlunuz Yusuf bugün tilavet etti ve 100 üzerinden 94 aldı. Hıfz: Nebe 1–16. Tekrar: Mülk.", f: "Kızınız Meryem bugün tilavet etti ve 100 üzerinden 94 aldı. Hıfz: Nebe 1–16. Tekrar: Mülk." },
      missed: { m: "Oğlunuz Yusuf bugünkü derste tilavet etmedi. Tilavetlerini Hafız hesabınızdan takip edebilirsiniz.", f: "Kızınız Meryem bugünkü derste tilavet etmedi. Tilavetlerini Hafız hesabınızdan takip edebilirsiniz." },
    },
  },
};

function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string, string?][]; onChange: (v: T) => void }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map(([v, text, lang]) => (
        <button key={v} type="button" lang={lang} aria-pressed={v === value} onClick={() => onChange(v)}>
          {text}
        </button>
      ))}
    </div>
  );
}

/** One automatic message the visitor configures: who gets it, which one, in which language, through which channels. */
export function Messages() {
  const { t, language } = useLanguage();
  const m = t.lp.messages;
  const [who, setWho] = useState<Who>("student");
  const [kind, setKind] = useState<Kind>("reminder");
  const [gender, setGender] = useState<Gender>("m");
  const [reader, setReader] = useState<ReaderLang>(language);
  const [telegram, setTelegram] = useState(true);
  const [browser, setBrowser] = useState(false);

  const kinds = KINDS[who];
  const shownKind = kinds.includes(kind) ? kind : kinds[0];
  const msg = MESSAGES[reader];
  const text = who === "student"
    ? msg.student[shownKind as "reminder" | "result"][gender]
    : msg.parent[shownKind as "result" | "missed"][gender];

  return (
    <section className="messages" id="messages" aria-labelledby="msg-title">
      <div className="msg-head">
        <h2 id="msg-title" data-rise>{m.title}</h2>
        <p className="msg-intro" data-rise style={{ ["--d" as string]: "80ms" }}>{m.intro}</p>
      </div>
      <div className="msg-read">
        <div className="msg-block" data-rise>
          <h3>{m.who}</h3>
          <Seg label={m.who} value={who} options={[["student", m.student], ["parent", m.parent]]} onChange={setWho} />
          <Seg
            label={m.who}
            value={gender}
            options={[["m", who === "parent" ? m.aboutBoy : m.boy], ["f", who === "parent" ? m.aboutGirl : m.girl]]}
            onChange={setGender}
          />
        </div>
        <div className="msg-block" data-rise>
          <h3>{m.kind}</h3>
          <Seg label={m.kind} value={shownKind} options={kinds.map((k) => [k, m[k]] as [Kind, string])} onChange={setKind} />
        </div>
        <div className="msg-block" data-rise>
          <h3>{m.lang}</h3>
          <Seg label={m.lang} value={reader} options={[["ar", "العربية", "ar"], ["en", "English", "en"], ["tr", "Türkçe", "tr"]]} onChange={setReader} />
        </div>
        <div className="msg-block" data-rise>
          <h3>{m.channels}</h3>
          <div className="toggles">
            <label className="toggle"><input type="checkbox" checked disabled readOnly />{m.inApp}<small>{m.always}</small></label>
            <label className="toggle"><input type="checkbox" checked={telegram} onChange={(e) => setTelegram(e.target.checked)} />{m.telegram}</label>
            <label className="toggle"><input type="checkbox" checked={browser} onChange={(e) => setBrowser(e.target.checked)} />{m.browser}</label>
          </div>
        </div>
      </div>

      <div className="msg-out" aria-live="polite">
        <div className="inbox" data-ui>
          <article className="inbox-card" key={`${who}-${shownKind}-${gender}-${reader}`} dir={msg.dir} lang={reader}>
            <div className="inbox-top">
              <span className="av"><img src="/lp/icon-dark.svg" alt="" width={26} height={26} /></span>
              <span><b>{msg.from}</b><span>{msg.org}</span></span>
              <time>{msg.now}</time>
            </div>
            <p className="inbox-title">{msg.title[shownKind]}</p>
            <p className="inbox-text">{text}</p>
            <div className="inbox-ch" dir={LANGUAGE_INFO[language].dir} lang={language}>
              <span className="chip"><Check />{m.inApp}</span>
              {telegram && <span className="chip"><Check />{m.telegram}</span>}
              {browser && <span className="chip"><Check />{m.browserChip}</span>}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
