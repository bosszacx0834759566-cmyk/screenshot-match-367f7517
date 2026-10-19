import { useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}=+*^?#";

/** Text that scrambles on hover of its parent element, then resolves left to right. */
export function Scramble({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const target = el?.parentElement;
    if (!el || !target) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const perChar = 40; // ms before each next letter locks in
      const lead = 250; // ms of pure shuffling first
      const tick = (now: number) => {
        const t = now - start;
        const locked = Math.floor(Math.max(0, t - lead) / perChar);
        el.textContent = text
          .split("")
          .map((c, i) => (i < locked || c === " " ? c : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join("");
        if (locked < text.length) raf = requestAnimationFrame(tick);
        else el.textContent = text;
      };
      raf = requestAnimationFrame(tick);
    };
    target.addEventListener("mouseenter", run);
    return () => {
      target.removeEventListener("mouseenter", run);
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text]);

  return (
    <span ref={ref} aria-label={text}>
      {text}
    </span>
  );
}
