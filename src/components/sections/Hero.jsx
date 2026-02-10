import { useEffect, useRef, useState } from "react";
import "./Hero.css";

export default function Hero() {
  const heroRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.35 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent;
    const vendor = navigator.vendor || "";
    const isSafariBrowser =
      /Safari/i.test(ua) &&
      /Apple/i.test(vendor) &&
      !/Chrome|CriOS|FxiOS|Edg|OPR|SamsungBrowser/i.test(ua);
    setIsSafari(isSafariBrowser);
  }, []);

  return (
    <div
      className={`hero${isInView ? " is-inview" : ""}${
        isSafari ? " is-safari" : ""
      }`}
      ref={heroRef}
    >
      <div className="hero-stage">
        <img
          className="hero-sticker hero-sticker-rec"
          src="/img/sticker-iloverec.svg"
          alt="I love REC sticker"
        />
        <img
          className="hero-sticker hero-sticker-onair"
          src="/img/sticker-onair.svg"
          alt="On air sticker"
        />
        <img
          className="hero-sticker hero-sticker-isee"
          src="/img/sticker-iseeikeep.svg"
          alt="I see and I keep sticker"
        />
        <img
          className="hero-sticker hero-sticker-love"
          src="/img/sticker-hyelovethis.svg"
          alt="Hye love this mood sticker"
        />
        <img
          className="hero-sticker hero-sticker-scroll"
          src="/img/sticker-scrolldown.svg"
          alt="Scroll down sticker"
        />
        <div className="hero-mobile" aria-hidden="true">
          <div className="hero-mobile-media">
            <video
              className="hero-video hero-video--mobile"
              src="/img/hero-video.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <div className="hero-mobile-text">
            <span className="hero-mobile-line hero-mobile-line--design">
              Design
            </span>
            <span className="hero-mobile-line hero-mobile-line--shaped">
              shaped
            </span>
            <span className="hero-mobile-line hero-mobile-line--by">by my</span>
            <span className="hero-mobile-line hero-mobile-line--view">
              view
            </span>
          </div>
        </div>
        <svg
          className="hero-mask"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Design shaped by my view"
        >
          <defs>
            <mask id="hero-text-mask" maskUnits="userSpaceOnUse">
              <rect width="1600" height="900" fill="black" />
              <text className="hero-text hero-text-design" x="80" y="250">
                Design
              </text>
              <text className="hero-text hero-text-shaped" x="620" y="475">
                shaped
              </text>
              <text className="hero-text hero-text-by" x="80" y="690">
                by my
              </text>
              <text className="hero-text hero-text-view" x="840" y="700">
                view
              </text>
            </mask>
          </defs>

          <foreignObject width="1600" height="900" mask="url(#hero-text-mask)">
            <video
              className="hero-video"
              src="/img/hero-video.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </foreignObject>

          <text
            className="hero-text hero-text-design hero-text-solid"
            x="80"
            y="250"
          >
            Design
          </text>
          <text
            className="hero-text hero-text-view hero-text-solid"
            x="840"
            y="700"
          >
            view
          </text>
        </svg>
      </div>
      <span className="hero-sr">Design shaped by my view</span>
    </div>
  );
}
