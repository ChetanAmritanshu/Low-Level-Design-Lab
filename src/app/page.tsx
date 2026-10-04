import Link from "next/link";
import { ObjectLab } from "@/components/diagrams/object-lab";
import { LearningMap } from "@/components/learning-map";
import { RefactorLoop } from "@/components/refactor-loop";
import { InterviewArena } from "@/components/interview-arena";
import { ArrowDown, ArrowRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export default function Home(){return <>
  <section className="home-hero page-shell"><div className="hero-copy"><p className="eyebrow"><span/>INTERACTIVE LOW-LEVEL DESIGN</p><h1>Low-Level Design<br/><em>From First Principles.</em></h1><p className="hero-deck">Don&apos;t memorize patterns. Learn why an object model <strong>bends, breaks, and gets refactored.</strong></p><div className="hero-actions"><Link className="primary-cta" href="/learn/oop-fundamentals">Start with Objects → Behavior <ArrowRight/></Link><a className="secondary-cta" href="#learning-map">Explore the map <ArrowDown/></a></div><div className="hero-proof"><span><b>50</b> deep dives</span><i/><span><b>15+</b> patterns & principles</span><i/><span><b>10</b> interview systems</span></div></div><ObjectLab/><div className="hero-scroll" aria-hidden="true"><span>SCROLL TO STRESS THE MODEL</span><i/></div></section>
  <section className="manifesto-strip"><div className="page-shell"><span>MODEL IT</span><ArrowRight/><span>STRESS IT</span><ArrowRight/><span>BREAK IT</span><ArrowRight/><span>REFACTOR IT</span><ArrowRight/><strong>DEFEND THE TRADE-OFF</strong></div></section>
  <section className="map-section page-shell" id="learning-map"><Reveal><SectionHeading eyebrow="THE LEARNING MAP" title="Fifty pressures. One design instinct." copy="Move from object thinking to maintainable boundaries, extensible patterns, concurrency, and complete machine-coding interviews. Chapters 01–38 are open now."/></Reveal><LearningMap/></section>
  <section className="pressure-section"><div className="page-shell"><Reveal><SectionHeading eyebrow="THE REFACTOR LOOP" title="Don&apos;t add a pattern. Discover the pressure." copy="Every abstraction must earn its place. Step through the moment a harmless conditional becomes a change hotspot."/></Reveal><Reveal delay={.08}><RefactorLoop/></Reveal></div></section>
  <section className="arena-section page-shell" id="arena"><Reveal><div className="case-heading"><SectionHeading eyebrow="INTERVIEW ARENA" title="Model a system. Then defend it." copy="Complete problems where requirements collide with state, behavior, extensibility, and concurrency."/><span className="case-status">10 SYSTEMS · PREVIEW</span></div></Reveal><Reveal delay={.08}><InterviewArena/></Reveal></section>
  <section className="home-cta page-shell"><Reveal className="home-cta-inner"><span className="cta-kicker">38 CHAPTERS ARE LIVE</span><h2>The training is complete. The machine-coding arena begins.</h2><p>Own resources, move values, understand dispatch, design thread-safe contracts, and turn vague interview prompts into working, testable code.</p><Link className="primary-cta" href="/learn/oop-fundamentals">Begin the learning path <ArrowRight/></Link></Reveal></section>
</>}
