import { useEffect, useRef, useState } from "react";
import "./Header.css";

const navItems = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Works" },
  { id: "keyword", label: "Keyword" },
  { id: "qna", label: "Q&A" },
  { id: "contact", label: "Contact" },
];

export default function Header() {
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY || 0;
    let ticking = false;

    const onScroll = () => {
      const currentY = window.scrollY || 0;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const delta = currentY - lastScrollY.current;
          if (Math.abs(delta) > 6) {
            if (delta > 0 && currentY > 80) {
              setIsHidden(true);
            } else {
              setIsHidden(false);
            }
            lastScrollY.current = currentY;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsHidden(false);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`site-header${isHidden ? " is-hidden" : ""}`}>
      <div className="site-header__brand">HYEWONKIM</div>
      <button
        className="site-header__toggle"
        type="button"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        aria-controls="site-header-nav"
        onClick={handleToggleMenu}
      >
        <span className="site-header__toggle-line" aria-hidden="true" />
        <span className="site-header__toggle-line" aria-hidden="true" />
        <span className="site-header__toggle-line" aria-hidden="true" />
      </button>
      <nav
        id="site-header-nav"
        className={`site-header__nav${isMenuOpen ? " is-open" : ""}`}
        aria-label="Primary"
      >
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="site-header__link"
            onClick={handleNavClick}
          >
            <span className="nav-text" aria-hidden="true">
              {Array.from(item.label).map((char, index) => (
                <span
                  className={`nav-char${char === " " ? " is-space" : ""}`}
                  style={{ "--char-index": index }}
                  key={`${item.id}-${char}-${index}`}
                >
                  <span className="nav-char-track">
                    <span className="nav-char-face nav-char-light">
                      {char === " " ? "\u00A0" : char}
                    </span>
                    <span className="nav-char-face nav-char-bold">
                      {char === " " ? "\u00A0" : char}
                    </span>
                  </span>
                </span>
              ))}
            </span>
            <span className="nav-sr">{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="site-header__meta">UXUI DESIGN</div>
    </header>
  );
}
