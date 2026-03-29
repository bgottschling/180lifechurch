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
  fetchEvents,
  fetchMinistries,
  fetchServices,
  fetchSiteSettings,
} from "@/lib/data";

export default async function Home() {
  const [events, ministries, services, settings] = await Promise.all([
    fetchEvents(),
    fetchMinistries(),
    fetchServices(),
    fetchSiteSettings(),
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
