import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Ministries } from "@/components/Ministries";
import { SermonBanner } from "@/components/SermonBanner";
import { Events } from "@/components/Events";
import { VisitCTA } from "@/components/VisitCTA";
import { Footer } from "@/components/Footer";
import {
  getEvents,
  getMinistries,
  getServices,
  getSiteSettings,
} from "@/lib/wordpress";
import {
  FALLBACK_EVENTS,
  FALLBACK_MINISTRIES,
  FALLBACK_SERVICES,
  FALLBACK_SETTINGS,
} from "@/lib/wordpress-fallbacks";

export default async function Home() {
  // Fetch all WordPress data in parallel, falling back to hardcoded defaults
  const [events, ministries, services, settings] = await Promise.all([
    getEvents().catch(() => FALLBACK_EVENTS),
    getMinistries().catch(() => FALLBACK_MINISTRIES),
    getServices().catch(() => FALLBACK_SERVICES),
    getSiteSettings().catch(() => FALLBACK_SETTINGS),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero hero={settings.hero} />
        <About about={settings.about} />
        <Services services={services} contact={settings.contact} />
        <Ministries ministries={ministries} />
        <SermonBanner />
        <Events events={events} />
        <VisitCTA cta={settings.cta} />
      </main>
      <Footer
        contact={settings.contact}
        missionStatement={settings.missionStatement}
        churchTagline={settings.churchTagline}
      />
    </>
  );
}
