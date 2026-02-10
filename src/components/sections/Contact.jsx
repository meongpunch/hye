import { useEffect, useRef, useState } from "react";
import "./Contact.css";

export default function Contact() {
  const contactRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const contact = contactRef.current;
    if (!contact) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.35 },
    );

    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  const titleLetters = [
    { ch: "c", rot: "-7deg", shift: "16px", xshift: "-2px" },
    { ch: "o", rot: "-8deg", shift: "38px", xshift: "1px" },
    { ch: "n", rot: "8deg", shift: "37px", xshift: "-20px" },
    { ch: "t", rot: "-10deg", shift: "33px", xshift: "5px" },
    { ch: "a", rot: "0deg", shift: "48px", xshift: "-2px" },
    { ch: "c", rot: "11deg", shift: "33px", xshift: "-21px" },
    { ch: "t", rot: "13deg", shift: "32px", xshift: "-31px" },
    { ch: " ", isSpace: true },
    { ch: "m", rot: "-6deg", shift: "-2px", xshift: "2px" },
    { ch: "e", rot: "0deg", shift: "50px", xshift: "-5px" },
  ];

  return (
    <section
      className={`contact${isInView ? " is-inview" : ""}`}
      ref={contactRef}
    >
      <div className="contact-frame">
        <div className="contact-top">
          <div className="contact-card">
            <span className="contact-chip">looking for designer?</span>
            <h3>경험을 디자인하는 김혜원입니다.</h3>
          </div>
          <div className="contact-card">
            <span className="contact-chip">Figma</span>
            <h3>You can see more..</h3>
            <p>포트폴리오 디자인은 피그마에서도 확인하실 수 있습니다.</p>
          </div>
          <div className="contact-card">
            <span className="contact-chip">please contact me!</span>
            <h3>010-2824-1223</h3>
            <p>meongpunch@gmail.com</p>
            <small>빠른 회신 드리겠습니다.</small>
          </div>
        </div>

        <div className="contact-bottom">
          <h2 className="contact-title" aria-label="Ccontact me">
            {titleLetters.map((item, index) =>
              item.isSpace ? (
                <span
                  key={`space-${index}`}
                  className="contact-title-space"
                  aria-hidden="true"
                />
              ) : (
                <span
                  key={`${item.ch}-${index}`}
                  className="contact-title-letter"
                  style={{
                    "--rot": item.rot,
                    "--shift": item.shift,
                    "--xshift": item.xshift,
                  }}
                  aria-hidden="true"
                >
                  {item.ch}
                </span>
              ),
            )}
          </h2>
        </div>
        <img
          className="contact-sticker contact-sticker--c"
          src="/img/sticker-iloverec.svg"
          alt=""
          aria-hidden="true"
        />
        <img
          className="contact-sticker contact-sticker--m"
          src="/img/keyword-sticker-lovethis.svg"
          alt=""
          aria-hidden="true"
        />
        <img
          className="contact-sticker contact-sticker--e"
          src="/img/sticker-newyellow.png"
          alt=""
          aria-hidden="true"
        />
        <svg className="contact-line" viewBox="0 0 145 261" aria-hidden="true">
          <path
            className="contact-line-path"
            d="M1.5 259.5C26.9493 258.503 82.8072 243.474 102.645 191.331C106.995 176.381 109.301 138.829 83.7207 108.212C77.8478 102.033 63.3613 93.7412 52.3985 110.006C48.7008 116.983 47.0477 133.806 70.0173 145.287C81.1105 149.473 100.687 155.079 116.348 145.287C133.203 134.748 158.95 93.4878 131.357 49.2376C120.046 31.099 92.3425 4.05212 90.8987 2.37091C86.9835 -2.18818 86.3309 12.3372 83.7207 18.5162C83.0682 19.712 83.7207 21.0272 91.5513 16.7217L105.255 9.54603C111.78 6.35722 118.567 0.45785 93.5089 2.37091"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            pathLength="1"
          />
        </svg>
      </div>
    </section>
  );
}
