"use client";

import { useLanguage } from "@/lib/i18n";
import { PhoneRow, type PhoneShot } from "@/components/lp/phone-row";

// Real screens of the student and parent app (sample data), in the order of the captions.
const SCREENS: PhoneShot[] = [
  { src: "/lp/student-home.webp", w: 540, h: 1960 },
  { src: "/lp/student-mistakes.webp", w: 540, h: 1169 },
  { src: "/lp/student-goals.webp", w: 540, h: 1433 },
  { src: "/lp/student-certificate.webp", w: 540, h: 1169 },
  { src: "/lp/parent-child.webp", w: 540, h: 1169 },
  { src: "/lp/reciters.webp", w: 540, h: 1169 },
  { src: "/lp/ayah-share.webp", w: 540, h: 1169 },
];

/** The student and parent apps. */
export function Apps() {
  const { t } = useLanguage();
  return <PhoneRow id="apps" texts={t.lp.apps} shots={SCREENS} />;
}
