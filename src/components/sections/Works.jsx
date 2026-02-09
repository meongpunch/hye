import { useEffect, useRef, useState } from "react";
import "./Works.css";

export default function Works() {
  const worksRef = useRef(null);
  const [isWorksInView, setIsWorksInView] = useState(false);
  const cloneStackRef = useRef(null);
  const cloneStageRef = useRef(null);
  const scribblePathRef = useRef(null);
  const [activeClone, setActiveClone] = useState(0);
  const dragState = useRef({
    startX: 0,
    dragging: false,
    pointerId: null,
    wasDragged: false,
  });
  const cursorState = useRef({ visible: false, x: 0, y: 0 });
  const cursorPopTimeout = useRef(null);

  const cloneItems = [
    {
      title: "crew a la mode",
      img: "/img/clonecoding-crew.png",
      href: "https://crewalamode.com",
    },
    {
      title: "daebang",
      img: "/img/clonecoding-daebang.png",
      href: "https://daebang.co.kr",
    },
    {
      title: "musign",
      img: "/img/clonecoding-musign.png",
      href: "https://musign.com",
    },
    {
      title: "pho",
      img: "/img/clonecoding-pho.png",
      href: "https://phostudio.com",
    },
    {
      title: "y studio",
      img: "/img/clonecoding-ystudio.png",
      href: "https://ystudio.com",
    },
  ];
  const renderDots = (value) => {
    const filled = Math.round(value / 10);
    return Array.from({ length: 10 }).map((_, index) => (
      <span
        key={`dot-${index}`}
        className={`works-skill-dot${index < filled ? " is-filled" : ""}`}
        aria-hidden="true"
      />
    ));
  };

  useEffect(() => {
    const works = worksRef.current;
    if (!works) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger || gsap?.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    let tween = null;
    let scribbleTween = null;
    let disposed = false;

    const init = async () => {
      const imgs = Array.from(works.querySelectorAll("img"));
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) resolve();
              else img.addEventListener("load", resolve, { once: true });
            }),
        ),
      );

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      if (disposed) return;

      const aboutSection =
        document.querySelector("#about .about") ||
        document.querySelector("#about");
      const workSection = document.querySelector("#work");

      tween = gsap.to(aboutSection || document.body, {
        backgroundColor: "#050505",
        color: "#ffffff",
        "--about-fg": "#ffffff",
        "--about-muted": "rgba(255, 255, 255, 0.7)",
        "--about-muted-2": "rgba(255, 255, 255, 0.7)",
        ease: "none",
        scrollTrigger: {
          trigger: workSection || works,
          start: "top bottom",
          end: "+=300",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      if (scribblePathRef.current) {
        const path = scribblePathRef.current;
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.getBoundingClientRect();

        scribbleTween = gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: path,
            start: "top 80%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        });
      }

      ScrollTrigger.refresh(true);
    };

    init();

    const refresh = () => ScrollTrigger.refresh(true);
    window.addEventListener("resize", refresh);
    window.addEventListener("pageshow", refresh);

    return () => {
      disposed = true;
      if (cursorPopTimeout.current) {
        clearTimeout(cursorPopTimeout.current);
      }
      window.removeEventListener("resize", refresh);
      window.removeEventListener("pageshow", refresh);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      scribbleTween?.scrollTrigger?.kill();
      scribbleTween?.kill();
    };
  }, []);

  useEffect(() => {
    const works = worksRef.current;
    if (!works) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsWorksInView(entry.isIntersecting);
      },
      { threshold: 0.3, rootMargin: "0px 0px -18% 0px" },
    );

    observer.observe(works);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const works = worksRef.current;
    if (!works) return;

    const stickers = Array.from(works.querySelectorAll(".works-sticker"));
    if (!stickers.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-stuck");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
    );

    stickers.forEach((sticker) => observer.observe(sticker));
    return () => observer.disconnect();
  }, []);

  const totalClones = cloneItems.length;

  const clampIndex = (next) => {
    const mod = ((next % totalClones) + totalClones) % totalClones;
    return mod;
  };

  const handlePointerDown = (event) => {
    if (totalClones <= 1) return;
    const stack = cloneStackRef.current;
    if (stack && event.pointerType !== "touch") {
      stack.setAttribute("data-cursor-pop", "true");
      if (cursorPopTimeout.current) {
        clearTimeout(cursorPopTimeout.current);
      }
      cursorPopTimeout.current = setTimeout(() => {
        stack.setAttribute("data-cursor-pop", "false");
      }, 180);
    }
    dragState.current = {
      startX: event.clientX,
      dragging: true,
      pointerId: event.pointerId,
      wasDragged: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const stack = cloneStackRef.current;
    const stage = cloneStageRef.current;
    if (stack) {
      const rect = stack.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      cursorState.current = {
        visible: isInside && event.pointerType !== "touch",
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      stack.style.setProperty("--cursor-x", `${cursorState.current.x}px`);
      stack.style.setProperty("--cursor-y", `${cursorState.current.y}px`);
      stack.setAttribute(
        "data-cursor-visible",
        cursorState.current.visible ? "true" : "false",
      );
    }

    if (stage) {
      const rect = stage.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      const isOnCard = Boolean(event.target.closest(".works-clone-card"));
      const visible = isInside && !isOnCard && event.pointerType !== "touch";
      stage.style.setProperty("--drag-x", `${event.clientX - rect.left}px`);
      stage.style.setProperty("--drag-y", `${event.clientY - rect.top}px`);
      stage.setAttribute("data-drag-visible", visible ? "true" : "false");
    }

    if (!dragState.current.dragging) return;
    const deltaX = event.clientX - dragState.current.startX;
    if (Math.abs(deltaX) < 10) return;
    dragState.current.dragging = false;
    dragState.current.wasDragged = true;
    if (deltaX < 0) {
      setActiveClone((prev) => clampIndex(prev + 1));
    } else {
      setActiveClone((prev) => clampIndex(prev - 1));
    }
  };

  const handlePointerUp = (event) => {
    if (dragState.current.pointerId === event.pointerId) {
      dragState.current.dragging = false;
      dragState.current.pointerId = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerLeave = () => {
    const stack = cloneStackRef.current;
    const stage = cloneStageRef.current;
    if (stack) {
      stack.setAttribute("data-cursor-visible", "false");
    }
    if (stage) {
      stage.setAttribute("data-drag-visible", "false");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      setActiveClone((prev) => clampIndex(prev - 1));
    }
    if (event.key === "ArrowRight") {
      setActiveClone((prev) => clampIndex(prev + 1));
    }
  };

  return (
    <div className={`works${isWorksInView ? " is-inview" : ""}`} ref={worksRef}>
      <div className="works-spacer" aria-hidden="true" />
      <section className="works-block works-projects">
        <div className="works-header">
          <p className="works-eyebrow">
            <span className="works-eyebrow-main">What I</span>{" "}
            <span className="works-eyebrow-italic">create</span> :
          </p>
        </div>

        <article className="works-project works-project--dugout">
          <div className="works-row works-row--overview">
            <div className="works-media">
              <img
                className="works-mockup"
                src="/img/work-dugoutmokup.png"
                alt="Dugout mobile app mockup"
              />
            </div>
            <div className="works-info">
              <h3 className="works-title">Mobile Fandom App</h3>
              <p className="works-subtitle">DUGOUT</p>
              <p className="works-desc">
                DUGOUT은 야구 팬을 ‘관람자’가 아닌{" "}
                <strong className="works-desc-strong">‘10번째 선수’</strong>로
                정의한 팬 경험 중심의 모바일 서비스입니다. <br /> 경기 정보
                위주의 단편적인 앱 구조에서 벗어나, 응원·소통·기록으로 이어지는
                팬의 감정 흐름이 끊기지 않도록 UX를 재설계했습니다. <br />팀
                선택을 중심으로 콘텐츠를 개인화하고, 팬 커뮤니티·실시간
                정보·나만의 팬 히스토리를 하나의 흐름으로 연결해 야구 팬의{" "}
                <strong className="works-desc-strong">
                  정체성과 몰입도를 강화
                </strong>
                하는 구조로 새롭게 설계했습니다.
              </p>
              <div className="works-meta">
                <span>UX/UI</span>
                <span>App</span>
                <span>2026.01</span>
              </div>
              <a
                className="works-meta-link"
                href="https://dugout-ruby.vercel.app/"
                target="_blank"
                rel="noreferrer"
                aria-label="DUGOUT 작업물 열기"
              >
                <span className="works-meta-link-icon" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="works-row works-row--detail is-reverse">
            <div className="works-media">
              <img
                className="works-base"
                src="/img/work-dugout.png"
                alt="Dugout field scene"
              />
              <img
                className="works-effect works-effect-dugout"
                src="/img/work-dugouteffect.svg"
                alt=""
                aria-hidden="true"
              />
              <img
                className="works-sticker works-sticker-dugout"
                src="/img/work-sticker-dugout.svg"
                alt=""
                aria-hidden="true"
              />
            </div>
            <div className="works-info">
              <p className="works-role-chip">Team Leader</p>
              <ul className="works-skill-list">
                <li>
                  <span>기획</span>
                  <span className="works-skill-bar">{renderDots(70)}</span>
                  <span className="works-skill-value">70%</span>
                </li>
                <li>
                  <span>디자인</span>
                  <span className="works-skill-bar">{renderDots(90)}</span>
                  <span className="works-skill-value">90%</span>
                </li>
                <li>
                  <span>퍼블리싱</span>
                  <span className="works-skill-bar">{renderDots(80)}</span>
                  <span className="works-skill-value">80%</span>
                </li>
              </ul>
            </div>
          </div>
        </article>

        <article className="works-project works-project--monami">
          <div className="works-row works-row--overview is-reverse">
            <div className="works-media">
              <img
                className="works-mockup"
                src="/img/work-monamimokup.png"
                alt="Monami web redesign mockup"
              />
            </div>
            <div className="works-info">
              <h3 className="works-title">Web Re:design</h3>
              <p className="works-subtitle">MONAMI</p>
              <p className="works-desc">
                기존 웹사이트가 제품 정보를 나열하는 데 그쳤다면, 이번
                리디자인은 프리미엄 라인을 중심으로{" "}
                <strong className="works-desc-strong">
                  모나미의 철학과 방향성을 설득력 있는 스토리
                </strong>
                로 풀어내는 데 초점을 맞췄습니다. 개인에게는 취향을 발견하는
                경험을, 파트너에게는 브랜드의 성장 비전을 직관적으로 전달하기
                위해 브랜드 스토리와 프로세스를 하나의 흐름으로 설계한
                웹사이트입니다.
              </p>
              <div className="works-meta">
                <span>UX/UI</span>
                <span>Web</span>
                <span>2024</span>
              </div>
              <a
                className="works-meta-link"
                href="https://meongpunch.github.io/monamifinal/"
                target="_blank"
                rel="noreferrer"
                aria-label="MONAMI 작업물 열기"
              >
                <span className="works-meta-link-icon" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="works-row works-row--detail">
            <div className="works-media">
              <img
                className="works-base"
                src="/img/work-monami.png"
                alt="Monami product visual"
              />
              <img
                className="works-effect works-effect-monami"
                src="/img/work-monamieffect.svg"
                alt=""
                aria-hidden="true"
              />
              <img
                className="works-sticker works-sticker-monami"
                src="/img/work-sticker-mnm.svg"
                alt=""
                aria-hidden="true"
              />
            </div>
            <div className="works-info">
              <p className="works-role-chip">TEAM LEADER</p>
              <ul className="works-skill-list">
                <li>
                  <span>기획</span>
                  <span className="works-skill-bar">{renderDots(90)}</span>
                  <span className="works-skill-value">90%</span>
                </li>
                <li>
                  <span>디자인</span>
                  <span className="works-skill-bar">{renderDots(70)}</span>
                  <span className="works-skill-value">70%</span>
                </li>
                <li>
                  <span>퍼블리싱</span>
                  <span className="works-skill-bar">{renderDots(80)}</span>
                  <span className="works-skill-value">80%</span>
                </li>
              </ul>
            </div>
          </div>
        </article>

        <article className="works-project works-project--tippi">
          <div className="works-row works-row--overview">
            <div className="works-media">
              <img
                className="works-mockup"
                src="/img/work-tippimokup.png"
                alt="Tippi mobile nail app mockup"
              />
            </div>
            <div className="works-info">
              <h3 className="works-title">Mobile Nail App</h3>
              <p className="works-subtitle">TiPPi</p>
              <p className="works-desc">
                티피는 네일을 단순한 ‘시술’이 아닌,{" "}
                <strong className="works-desc-strong">
                  개인의 취향과 성향이 드러나는 하나의 표현 과정
                </strong>
                으로 정의한 네일 경험 중심의 모바일 서비스입니다. 기존 네일 앱이
                예약 기능에 머무르며 디자인 선택, 취향 관리, 시술 이후의 경험을
                <strong className="works-desc-strong">
                  단절적으로 제공하던 구조에서 벗어나
                </strong>
                , 네일의 시작부터 끝까지 이어지는 사용자의 고민과 선택 흐름을
                UX로 재설계했습니다. 티피는 개인의 취향과 네일 고민을 기반으로
                경험을 개인화하고, 디자인 탐색·소통·기록을 하나의 흐름으로
                연결해 나만의 맞춤형 네일 경험을 완성하는 구조로 설계되었습니다.
              </p>
              <div className="works-meta">
                <span>UX/UI</span>
                <span>App</span>
                <span>2024</span>
              </div>
              <a
                className="works-meta-link"
                href="/img/work-tippi.png"
                target="_blank"
                rel="noreferrer"
                aria-label="TiPPi 작업물 열기"
              >
                <span className="works-meta-link-icon" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="works-row works-row--detail is-reverse">
            <div className="works-media">
              <img
                className="works-base"
                src="/img/work-tippi.png"
                alt="Tippi nail app scene"
              />
              <img
                className="works-effect works-effect-tippi"
                src="/img/work-tippieffect.svg"
                alt=""
                aria-hidden="true"
              />
              <img
                className="works-sticker works-sticker-tippi"
                src="/img/work-sticker-tippi.svg"
                alt=""
                aria-hidden="true"
              />
            </div>
            <div className="works-info">
              <p className="works-role-chip">PERSONAL PROJECT</p>
              <ul className="works-skill-list">
                <li>
                  <span>기획</span>
                  <span className="works-skill-bar">{renderDots(100)}</span>
                  <span className="works-skill-value">100%</span>
                </li>
                <li>
                  <span>디자인</span>
                  <span className="works-skill-bar">{renderDots(100)}</span>
                  <span className="works-skill-value">100%</span>
                </li>
                <li>
                  <span>퍼블리싱</span>
                  <span className="works-skill-bar">{renderDots(100)}</span>
                  <span className="works-skill-value">100%</span>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </section>

      <section className="works-block works-clone">
        <div className="works-clone-header">
          <h3 className="works-section-title">Clone Coding :</h3>
        </div>
        <div
          className="works-clone-stage"
          ref={cloneStageRef}
          role="region"
          aria-label="Clone coding projects"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onKeyDown={handleKeyDown}
        >
          <span className="works-clone-drag" aria-hidden="true">
            drag
          </span>
          <div className="works-clone-stack" ref={cloneStackRef}>
            <span className="works-clone-cursor" aria-hidden="true">
              click
            </span>
            <svg
              className="works-clone-scribble"
              viewBox="0 0 136 166"
              aria-hidden="true"
              focusable="false"
            >
              <path
                ref={scribblePathRef}
                d="M1.49982 164.24C21.1514 148.478 52.1025 111.795 1.49983 64.1398C25.8594 73.9655 67.7005 71.6319 57.3834 10.7122C74.988 24.632 114.864 42.2775 133.533 1.50053"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <img
              className="works-clone-effect"
              src="/img/clonecoding-effect.svg"
              alt=""
              aria-hidden="true"
            />
            {cloneItems.map((item, index) => {
              const offset = index - activeClone;
              const normalized =
                ((offset % totalClones) + totalClones) % totalClones;
              const orderIndex =
                normalized <= totalClones / 2
                  ? normalized
                  : normalized - totalClones;
              const absIndex = Math.abs(orderIndex);
              const isActive = orderIndex === 0;
              const spreadX = 70;
              const spreadY = 24;
              const sideBoost = absIndex === 1 ? 18 : 0;
              const spreadRot = 7;
              const baseScale = 0.9;
              const scaleStep = 0.05;
              const scale = Math.max(
                0.78,
                baseScale + (1 - absIndex) * scaleStep,
              );
              return (
                <a
                  key={item.title}
                  className={`works-clone-card${isActive ? " is-active" : ""}`}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onDragStart={(event) => event.preventDefault()}
                  style={{
                    "--stack-index": orderIndex,
                    "--stack-abs": absIndex,
                    "--stack-tx": `${orderIndex * (spreadX + sideBoost)}px`,
                    "--stack-ty": `${absIndex * (spreadY + (sideBoost ? 2 : 0))}px`,
                    "--stack-rot": `${orderIndex * spreadRot}deg`,
                    "--stack-scale": scale,
                  }}
                  aria-label={`${item.title} clone coding`}
                  onClick={(event) => {
                    if (dragState.current.wasDragged) {
                      event.preventDefault();
                      dragState.current.wasDragged = false;
                    }
                  }}
                >
                  <img src={item.img} alt={item.title} draggable="false" />
                </a>
              );
            })}
          </div>
          <div className="works-clone-caption">
            <p className="works-clone-title">{cloneItems[activeClone].title}</p>
          </div>
        </div>
      </section>

      <section className="works-block works-skill">
        <div className="works-skill-header">
          <h3 className="works-skill-title">
            <span className="works-skill-title-main">My working</span> <br />
            <span className="works-skill-title-italic">tools</span> :
          </h3>
        </div>
        <div className="works-skill-marquee" aria-label="Working tools">
          <div className="works-skill-track">
            <div className="works-skill-grid">
              <img src="/img/skill-ps.svg" alt="Photoshop" />
              <img src="/img/skill-ai.svg" alt="Illustrator" />
              <img src="/img/skill-figma.svg" alt="Figma" />
              <img src="/img/skill-cad.svg" alt="CAD" />
              <img src="/img/skill-html.svg" alt="HTML" />
              <img src="/img/skill-css.svg" alt="CSS" />
              <img src="/img/skill-vscode.svg" alt="VS Code" />
              <img src="/img/skill-git.svg" alt="Git" />
              <img src="/img/skill-github.svg" alt="GitHub" />
              <img src="/img/skill-vscode.svg" alt="VS Code" />
              <img src="/img/skill-react.svg" alt="React" />
              <img src="/img/skill-chatgpt.svg" alt="ChatGPT" />
              <img src="/img/skill-midjourney.svg" alt="Midjourney" />
              <img src="/img/skill-gemini.svg" alt="Gemini" />
              <img src="/img/skill-notion.svg" alt="Notion" />
              <img src="/img/skill-word.svg" alt="Word" />
              <img src="/img/skill-powerpoint.svg" alt="PowerPoint" />
              <img src="/img/skill-excel.svg" alt="Excel" />
            </div>
            <div className="works-skill-grid" aria-hidden="true">
              <img src="/img/skill-ps.svg" alt="" />
              <img src="/img/skill-ai.svg" alt="" />
              <img src="/img/skill-figma.svg" alt="" />
              <img src="/img/skill-cad.svg" alt="" />
              <img src="/img/skill-html.svg" alt="" />
              <img src="/img/skill-css.svg" alt="" />
              <img src="/img/skill-vscode.svg" alt="" />
              <img src="/img/skill-git.svg" alt="" />
              <img src="/img/skill-github.svg" alt="" />
              <img src="/img/skill-vscode.svg" alt="" />
              <img src="/img/skill-react.svg" alt="" />
              <img src="/img/skill-chatgpt.svg" alt="" />
              <img src="/img/skill-midjourney.svg" alt="" />
              <img src="/img/skill-gemini.svg" alt="" />
              <img src="/img/skill-notion.svg" alt="" />
              <img src="/img/skill-word.svg" alt="" />
              <img src="/img/skill-powerpoint.svg" alt="" />
              <img src="/img/skill-excel.svg" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
