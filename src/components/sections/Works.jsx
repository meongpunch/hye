import { useEffect, useRef } from "react";
import "./Works.css";

export default function Works() {
  const worksRef = useRef(null);
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

      ScrollTrigger.refresh(true);
    };

    init();

    const refresh = () => ScrollTrigger.refresh(true);
    window.addEventListener("resize", refresh);
    window.addEventListener("pageshow", refresh);

    return () => {
      disposed = true;
      window.removeEventListener("resize", refresh);
      window.removeEventListener("pageshow", refresh);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <div className="works" ref={worksRef}>
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
        <h3 className="works-section-title">Clone Coding</h3>
      </section>

      <section className="works-block works-skill">
        <h3 className="works-section-title">My Skill</h3>
      </section>
    </div>
  );
}
