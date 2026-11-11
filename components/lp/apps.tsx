"use client";

import { useLanguage } from "@/lib/i18n";
import { PhoneRow, type PhoneShot } from "@/components/lp/phone-row";

// Real screens of the student and parent app (sample data), in the order of the captions.
const SCREENS: PhoneShot[] = [
  { src: "/lp/student-home.jpg", w: 540, h: 1960 },
  { src: "/lp/student-mistakes.jpg", w: 540, h: 1169 },
  { src: "/lp/student-goals.jpg", w: 540, h: 1433 },
  { src: "/lp/student-certificate.jpg", w: 540, h: 1169 },
  { src: "/lp/parent-child.jpg", w: 540, h: 1169 },
  { src: "/lp/reciters.jpg", w: 540, h: 1169 },
  { src: "/lp/ayah-share.jpg", w: 540, h: 1169 },
];

/** The student and parent apps. */
export function Apps() {
  const { t } = useLanguage();
  return <PhoneRow id="apps" texts={t.lp.apps} shots={SCREENS} />;
}
