import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/lp/site-header";
import { Hero } from "@/components/lp/hero";
import { Messages } from "@/components/lp/messages";
import { Admin } from "@/components/lp/admin";
import { Apps } from "@/components/lp/apps";
import { Pricing } from "@/components/lp/pricing";
import { Faq } from "@/components/lp/faq";
import { Finale } from "@/components/lp/finale";
import { SiteFooter } from "@/components/lp/site-footer";
import { Rise } from "@/components/lp/rise";
import { homeStructuredData, jsonLd, pageMetadata } from "@/lib/seo";
import { isLanguage } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata(lang, "");
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeStructuredData(lang)) }} />
      <SiteHeader />
      <main id="top">
        <Hero />
        <Messages />
        <Admin />
        <Apps />
        <Pricing />
        <Faq />
        <Finale />
      </main>
      <SiteFooter />
      <Rise />
    </>
  );
}
