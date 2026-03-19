import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Ministries } from "@/components/Ministries";
import { SermonBanner } from "@/components/SermonBanner";
import { Events } from "@/components/Events";
import { VisitCTA } from "@/components/VisitCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Ministries />
        <SermonBanner />
        <Events />
        <VisitCTA />
      </main>
      <Footer />
    </>
  );
}
