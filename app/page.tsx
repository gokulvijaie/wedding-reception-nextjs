import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Families from "@/components/Families";
import Story from "@/components/Story";
import Gallery from "@/components/Gallery";
import Schedule from "@/components/Schedule";
import EventSection from "@/components/EventSection";
import RSVP from "@/components/RSVP";
import Footer from "@/components/Footer";
import Atmosphere from "@/components/Atmosphere";
import MusicToggle from "@/components/MusicToggle";
import RevealObserver from "@/components/RevealObserver";
import VisitTracker from "@/components/VisitTracker";
import { config } from "@/lib/config";

export default function Home() {
  return (
    <main className="relative">
      <Atmosphere />
      <MusicToggle />
      <RevealObserver />
      <VisitTracker />

      <Hero />
      <Countdown />
      <Families />
      <Story />
      <Gallery />
      <Schedule />

      <EventSection
        event={config.reception}
        bgMobile="/assets/reception-bg-Bhu2sMue.webp"
        bgDesktop="/assets/reception-bg-desktop-j3iMUPCn.webp"
        overlay="dark"
        flip
      />

      <RSVP />
      <Footer />
    </main>
  );
}
