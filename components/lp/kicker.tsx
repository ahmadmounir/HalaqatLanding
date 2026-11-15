/**
 * What a section is about, in plain words, as the small line above the heading's own (visual) line. It sits inside
 * the heading, so search engines and AI answers read the topic there (SEO audit 2026-11-15: the headings were slogans
 * only). The hidden colon makes the heading read as one sentence: "Automatic reminders…: Messages that send themselves".
 */
export function Kicker({ children }: { children: string }) {
  return (
    <span className="kicker">
      {children}
      <span className="sr-only">: </span>
    </span>
  );
}
