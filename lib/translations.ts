// The page texts per language. A plain module (not "use client") so server code — the metadata, the structured
// data — reads the same texts as the components.
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import tr from "@/locales/tr.json";
import type { Language } from "@/lib/site";

export type Translations = typeof en;

export const translations: Record<Language, Translations> = { en, ar, tr };
