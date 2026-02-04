// src/pages/LandingPage.jsx
import Header from "../components/Header";
import Hero from "../components/sections/Hero";
import Works from "../components/sections/Works";
import About from "../components/sections/About";
import Keyword from "../components/sections/Keyword";
import Qna from "../components/sections/Qna";
import Contact from "../components/sections/Contact";

export default function LandingPage() {
  return (
    <>
      <Header />

      <section id="hero">
        <Hero />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="work">
        <Works />
      </section>

      <section id="keyword">
        <Keyword />
      </section>

      <section id="qna">
        <Qna />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </>
  );
}
