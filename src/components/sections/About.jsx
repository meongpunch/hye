import { useEffect, useRef } from "react";
import "./About.css";

export default function About() {
  const panelRef = useRef(null);
  const quoteRef = useRef(null);
  const wrapRef = useRef(null);
  const newStickerRef = useRef(null);
  const recStickerRef = useRef(null);
  const watchStickerRef = useRef(null);
  const copyRef = useRef(null);
  const underlineRef = useRef(null);
  const copyStickerRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    const quote = quoteRef.current;
    const wrap = wrapRef.current;
    const newSticker = newStickerRef.current;
    const recSticker = recStickerRef.current;
    const watchSticker = watchStickerRef.current;
    const copy = copyRef.current;
    const underline = underlineRef.current;
    const copySticker = copyStickerRef.current;
    if (
      !panel ||
      !quote ||
      !wrap ||
      !newSticker ||
      !recSticker ||
      !watchSticker
    )
      return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger || gsap?.ScrollTrigger;
    const SplitText = window.SplitText;
    if (!gsap || !ScrollTrigger || !SplitText) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    let split = null;

    const setup = () => {
      // 1. type을 "chars"로만 설정해야 chars 배열에 공백이 포함됩니다.
      split = new SplitText(quote, { type: "chars" });
      const chars = split.chars;

      chars.forEach((char) => {
        // 2. 공백 문자인지 확인 (유니코드 공백까지 체크)
        if (char.textContent === " " || char.textContent === "\u00A0") {
          char.classList.add("is-space");
          // 3. JS에서 직접 너비를 주거나 CSS에서 처리하도록 클래스 부여
          char.style.minWidth = "0.3em";
          char.innerHTML = "&nbsp;";
        }
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top top",
          end: () => "+=2000",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onEnter: () => panel.classList.add("is-active"),
          onEnterBack: () => panel.classList.add("is-active"),
          onLeaveBack: () => panel.classList.remove("is-active"),
        },
      });

      const travel = () => (quote.scrollWidth + window.innerWidth) * 0.3; //splitting 스플리팅 속도 조절 0.5 (더 느리게) 0.8 (더 빠르게)
      gsap.set(quote, { x: () => window.innerWidth });
      const spread = 0.85;
      const charOffsets = chars.map(() => ({
        x: gsap.utils.random(80, 220) * spread,
        y: gsap.utils.random(-140, 140) * spread,
        r: gsap.utils.random(-24, 24) * spread,
      }));
      gsap.set(chars, (i) => ({
        x: charOffsets[i].x,
        y: charOffsets[i].y,
        rotate: charOffsets[i].r,
        opacity: 1,
      }));

      timeline.to(quote, { x: () => -travel(), ease: "none", duration: 1 }, 0);

      const setX = chars.map((char) => gsap.quickSetter(char, "x", "px"));
      const setY = chars.map((char) => gsap.quickSetter(char, "y", "px"));
      const setR = chars.map((char) =>
        gsap.quickSetter(char, "rotation", "deg"),
      );

      const smooth = (v) => 1 - Math.pow(1 - v, 3); // easeOutCubic for softer join
      const setNewLeft = gsap.quickSetter(newSticker, "left", "px");
      const setNewTop = gsap.quickSetter(newSticker, "top", "px");
      const setRecLeft = gsap.quickSetter(recSticker, "left", "px");
      const setRecTop = gsap.quickSetter(recSticker, "top", "px");
      const setWatchLeft = gsap.quickSetter(watchSticker, "left", "px");
      const setWatchTop = gsap.quickSetter(watchSticker, "top", "px");
      let newLocked = false;
      let recLocked = false;
      let watchLocked = false;
      const setNewOpacity = gsap.quickSetter(newSticker, "opacity");
      const setRecOpacity = gsap.quickSetter(recSticker, "opacity");
      const setWatchOpacity = gsap.quickSetter(watchSticker, "opacity");

      setNewOpacity(0);
      setRecOpacity(0);
      setWatchOpacity(0);

      const findCharIndex = (text, word, charIndexInWord) => {
        const start = text.indexOf(word);
        if (start === -1) return -1;
        return start + charIndexInWord;
      };

      const charsText = chars
        .map((char) =>
          char.textContent === "\u00A0" ? " " : char.textContent || "",
        )
        .join("");
      const wannaAIndex = findCharIndex(charsText, "wanna", 1);
      const closeOIndex = findCharIndex(charsText, "close", 2);
      const noticeOIndex = findCharIndex(charsText, "notice", 1);
      const wannaChar = chars[wannaAIndex] || null;
      const closeChar = chars[closeOIndex] || null;
      const noticeChar = chars[noticeOIndex] || null;

      const lockThreshold = 200;
      timeline.eventCallback("onUpdate", () => {
        const centerX = window.innerWidth * 0.7;
        const threshold = 80;
        chars.forEach((char, i) => {
          const rect = char.getBoundingClientRect();
          const charCenter = rect.left + rect.width * 0.5;
          const t = gsap.utils.clamp(
            0,
            1,
            (centerX + threshold - charCenter) / (threshold * 2),
          );
          const eased = smooth(t);
          const offset = charOffsets[i];
          setX[i](offset.x * (1 - eased));
          setY[i](offset.y * (1 - eased));
          setR[i](offset.r * (1 - eased));
        });

        const wrapRect = wrap.getBoundingClientRect();
        if (wannaChar) {
          const rect = wannaChar.getBoundingClientRect();
          const charCenter = rect.left + rect.width * 0.5;
          const distance = Math.abs(centerX - charCenter);
          const left = rect.left - wrapRect.left + rect.width * 0.5;
          const top = rect.top - wrapRect.top + rect.height * 0.2;
          setNewLeft(left);
          setNewTop(top);
          if (!newLocked && distance < lockThreshold) {
            newLocked = true;
            setNewOpacity(1);
          }
          if (!newLocked) setNewOpacity(0);
        }

        if (closeChar) {
          const rect = closeChar.getBoundingClientRect();
          const charCenter = rect.left + rect.width * 0.5;
          const distance = Math.abs(centerX - charCenter);
          const left = rect.left - wrapRect.left + rect.width * 0.5;
          const top = rect.top - wrapRect.top + rect.height * 0.8;
          setRecLeft(left);
          setRecTop(top);
          if (!recLocked && distance < lockThreshold) {
            recLocked = true;
            setRecOpacity(1);
          }
          if (!recLocked) setRecOpacity(0);
        }

        if (noticeChar) {
          const rect = noticeChar.getBoundingClientRect();
          const charCenter = rect.left + rect.width * 0.5;
          const distance = Math.abs(centerX - charCenter);
          const left = rect.left - wrapRect.left + rect.width * 0.5;
          const top = rect.top - wrapRect.top + rect.height * 0.2;
          setWatchLeft(left);
          setWatchTop(top);
          if (!watchLocked && distance < lockThreshold) {
            watchLocked = true;
            setWatchOpacity(1);
          }
          if (!watchLocked) setWatchOpacity(0);
        }
      });

      ScrollTrigger.refresh();

      return () => {
        timeline.kill();
      };
    };

    const fontsReady = document.fonts?.ready;
    let teardown = null;
    if (fontsReady && typeof fontsReady.then === "function") {
      fontsReady.then(() => {
        teardown = setup();
      });
    } else {
      teardown = setup();
    }

    return () => {
      if (teardown) teardown();
      if (split) split.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  useEffect(() => {
    const copy = copyRef.current;
    const underline = underlineRef.current;
    const copySticker = copyStickerRef.current;
    if (!copy || !underline || !copySticker) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger || gsap?.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // 핵심 수정: 브라우저가 SVG 길이를 계산할 시간을 줍니다.
    const setupUnderline = () => {
      const path = underline;
      const length = path.getTotalLength();

      // 만약 length가 0이라면 아직 로드가 안 된 것이므로 다시 시도하거나 리턴
      if (length === 0) return;

      // 1. 초기 상태: 선을 완전히 숨깁니다.
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });

      // 스티커 초기 상태
      gsap.set(copySticker, { opacity: 0, scale: 0.6, rotate: -18, y: 8 });

      // 2. 애니메이션 타임라인
      const draw = gsap.timeline({ paused: true });
      draw.to(
        path,
        {
          strokeDashoffset: 0,
          duration: 2.5,
          ease: "power2.out",
        },
        0,
      );
      draw.to(
        copySticker,
        {
          opacity: 1,
          scale: 1,
          rotate: 18,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        0.4,
      ); // 선이 중간쯤 그려졌을 때 스티커 짠!

      // 3. 스크롤 트리거 생성
      const trigger = ScrollTrigger.create({
        trigger: copy,
        start: "top 85%", // 98%는 너무 밑이라 이미 보일 수 있어요. 85%로 조정!
        onEnter: () => draw.play(),
        onLeaveBack: () => {
          draw.pause(0); // 다시 위로 올라가면 초기화
          gsap.set(path, { strokeDashoffset: length });
        },
      });

      ScrollTrigger.refresh();
    };

    // 폰트나 레이아웃이 확정된 후 실행되도록 약간의 지연을 줍니다.
    const timeoutId = setTimeout(setupUnderline, 100);

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="about">
      <section
        className="about-panel about-panel-one"
        aria-labelledby="about-quote"
        ref={panelRef}
      >
        <div className="about-panel-inner">
          <div className="about-quote-wrap" ref={wrapRef}>
            <div className="about-scroll-viewport">
              <h2 id="about-quote" className="about-quote" ref={quoteRef}>
                I wanna stay close to what I notice.
              </h2>
            </div>
            <img
              className="about-sticker about-sticker-new"
              src="/img/sticker-newyellow.png"
              alt="New sticker"
              ref={newStickerRef}
            />
            <img
              className="about-sticker about-sticker-rec"
              src="/img/sticker-iloverec.svg"
              alt="I love REC sticker"
              ref={recStickerRef}
            />
            <img
              className="about-sticker about-sticker-watch"
              src="/img/sticker-watch.svg"
              alt="Watch sticker"
              ref={watchStickerRef}
            />
          </div>

          <p className="about-body">
            저는 일상에서 시선이 멈춘 순간을 놓치지 않으려 합니다. <br />
            이 포트폴리오에서는 그 순간들을 스티커로 표현했고, <br />
            세상을 바라보는 제 시선을 디자인으로 담았습니다.
          </p>
        </div>
      </section>

      <section className="about-panel about-panel-copy" ref={copyRef}>
        <div className="about-panel-inner">
          <div className="about-intro">
            <h3 className="about-intro-title">
              I’m hyewon,
              <br />
              a designer shaped
              <br />
              by observation.
            </h3>
            <img
              className="about-copy-sticker"
              src="/img/sticker-aboutisee.svg"
              alt=""
              aria-hidden="true"
              ref={copyStickerRef}
            />
            <p className="about-intro-sub">
              <span className="t-italic">from</span>{" "}
              <span className="t-roman">moments</span>{" "}
              <span className="t-italic">to</span>{" "}
              <span className="t-roman">structure.</span>
            </p>
            <svg
              className="about-underline"
              viewBox="0 0 902 30"
              aria-hidden="true"
            >
              <path
                ref={underlineRef}
                d="M2 20.0708C55.1667 15.4041 242.5 4.5708 278.5 4.5708C293 2.83509 423.4 0.83524 435 2.83524C444.167 3.16855 451.2 5.23516 406 10.8352C382.5 13.7467 356.1 25.3352 412.5 27.3352C436.5 27.1685 492.9 26.1352 526.5 23.3352C563 20.3352 663.3 12.3708 692.5 13.5708C779 13.5708 886.3 18.8352 899.5 20.8352"
                stroke="black"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="about-panel about-panel-two">
        <div className="about-panel-inner">
          <div className="about-cards">
            <img
              className="about-flower"
              src="/img/about-svg.svg"
              alt=""
              aria-hidden="true"
            />
            <div className="about-card about-card-1">
              <img src="/img/about-me.png" alt="Portrait selfie" />
              <span className="about-tag about-tag-1">it's me, hyewon!</span>
            </div>
            <div className="about-card about-card-2">
              <img src="/img/about-me2.png" alt="Night street scene" />
              <span className="about-tag about-tag-2">
                I like to record and organize my thoughts.
              </span>
            </div>
            <div className="about-card about-card-3">
              <img src="/img/about-me3.png" alt="Gallery interior" />
            </div>
            <div className="about-card about-card-4">
              <img src="/img/about-me4.png" alt="Sunset moment" />
              <span className="about-tag about-tag-3">
                girls just wanna have fun!
              </span>
            </div>
          </div>

          <p className="about-memo">
            이 사진들은 제가 보고, 기록하고, 정리하는 시간의 흔적입니다.
            <br />
            순간을 사진으로 포착하고 글로 남기며 생각을 구조화하는 과정 속에서
            <br />
            저만의 기준을 만들고 작업의 방향을 그려갑니다.
          </p>
        </div>
      </section>
    </div>
  );
}
