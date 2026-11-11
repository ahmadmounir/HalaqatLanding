"use client";

import { useLanguage } from "@/lib/i18n";
import { PhoneRow, type PhoneShot } from "@/components/lp/phone-row";

// Real screens of the app as a teacher and an administrator see them on a phone (made-up names and numbers),
// in the order of the captions. Made with scripts/app-screens (a fake API, never real data).
const SCREENS: PhoneShot[] = [
  { src: "/lp/staff-grading.webp", w: 540, h: 1000 },
  { src: "/lp/staff-assign.webp", w: 540, h: 1000 },
  { src: "/lp/staff-record.webp", w: 540, h: 1000 },
  { src: "/lp/staff-dashboard.webp", w: 540, h: 1000 },
  { src: "/lp/staff-leaderboard.webp", w: 540, h: 1000 },
  { src: "/lp/staff-join.webp", w: 540, h: 1000 },
  { src: "/lp/staff-messages.webp", w: 540, h: 1000 },
];

/** The organization's own staff: teachers and administrators. */
export function Staff() {
  const { t } = useLanguage();
  return <PhoneRow id="staff" className="apps-staff" texts={t.lp.staff} shots={SCREENS} />;
}
