import { useEffect, useRef } from "react";
import "./Keyword.css";

export default function Keyword() {
  const cardsRef = useRef(null);
  const cards = [
    {
      title: "Aesthetic\nSense",
      bullets: [
        "일상을 기록하며 쌓은 미적 감각",
        "시각적 균형을 갖춘 무드 설계",
      ],
      sticker: "/img/keyword-sticker-ilove.svg",
      stickerClass: "keyword-sticker-ilove",
      style: {
        "--x": "-550px",
        "--y": "30px",
        "--rot": "10deg",
        "--tilt": "6",
        "--bg": "#4757ff",
        "--fg": "#ffffff",
      },
    },
    {
      title: "Monetizable\nCreator",
      bullets: ["카카오톡 테마 수익화 경험", "사용자에게 선택받는 디자인"],
      sticker: "/img/keyword-sticker-isee.svg",
      stickerClass: "keyword-sticker-isee",
      style: {
        "--x": "-250px",
        "--y": "105px",
        "--rot": "-2deg",
        "--tilt": "4.5",
        "--bg": "#0f1455",
        "--fg": "#ffffff",
      },
    },
    {
      title: "Logical\nThinking",
      bullets: [
        "회계 전공 기반의 정보 구조화",
        "개발 구현을 고려한 논리적 설계",
      ],
      sticker: "/img/keyword-sticker-lovethis.svg",
      stickerClass: "keyword-sticker-lovethis",
      style: {
        "--x": "10px",
        "--y": "30px",
        "--rot": "4deg",
        "--tilt": "5.5",
        "--bg": "#ffa6dc",
        "--fg": "#161616",
      },
    },
    {
      title: "Flexible\nCommunicator",
      bullets: [
        "기획과 디자인을 잇는 소통 능력",
        "다양성을 포용하는 유연한 협업",
      ],
      sticker: "/img/keyword-sticker-watchit.svg",
      stickerClass: "keyword-sticker-watchit",
      style: {
        "--x": "280px",
        "--y": "125px",
        "--rot": "-7deg",
        "--tilt": "7",
        "--bg": "#f05aa3",
        "--fg": "#ffffff",
      },
    },
    {
      title: "Fast\nAdoptor",
      bullets: ["새로운 환경에 빠르게 적응", "작업 효율에 맞게 AI 적극 활용"],
      sticker: "/img/keyword-sticker-new.svg",
      stickerClass: "keyword-sticker-new",
      style: {
        "--x": "560px",
        "--y": "85px",
        "--rot": "-2deg",
        "--tilt": "5",
        "--bg": "#bcd6ff",
        "--fg": "#111111",
      },
    },
  ];

  useEffect(() => {
    const host = cardsRef.current;
    if (!host) return;

    const handleMove = (event) => {
      const rect = host.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      host.style.setProperty("--tilt-x", `${(ny * 2).toFixed(3)}`);
      host.style.setProperty("--tilt-y", `${(nx * 2).toFixed(3)}`);
    };

    const handleLeave = () => {
      host.style.setProperty("--tilt-x", "0");
      host.style.setProperty("--tilt-y", "0");
    };

    host.addEventListener("mousemove", handleMove);
    host.addEventListener("mouseleave", handleLeave);
    return () => {
      host.removeEventListener("mousemove", handleMove);
      host.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section className="keyword">
      <div className="keyword-inner">
        <header className="keyword-header">
          <h2 className="keyword-title">
            <span className="keyword-title-main">What</span>
            <span className="keyword-title-italic">defines</span>
            <span className="keyword-title-main">me</span>
          </h2>
        </header>

        <div
          className="keyword-cards"
          aria-label="What defines me"
          ref={cardsRef}
        >
          {cards.map((card) => (
            <article
              className="keyword-card"
              style={card.style}
              key={card.title}
            >
              <img
                className={`keyword-sticker ${card.stickerClass}`}
                src={card.sticker}
                alt=""
                aria-hidden="true"
              />
              <h3 className="keyword-card-title">{card.title}</h3>
              <ul className="keyword-card-list">
                {card.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
