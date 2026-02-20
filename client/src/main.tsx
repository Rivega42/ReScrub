import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Global scroll reveal observer
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    // Instantly reveal elements already in viewport (above the fold) — no animation
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('revealed');
        (el as HTMLElement).style.transition = 'none';
      }
    });

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    const observeScrollReveal = () => {
      document.querySelectorAll('.scroll-reveal:not(.revealed), .scroll-reveal-left:not(.revealed), .scroll-reveal-right:not(.revealed)').forEach((el) => {
        scrollObserver.observe(el);
      });
    };
    observeScrollReveal();
    new MutationObserver(observeScrollReveal).observe(document.body, { childList: true, subtree: true });
  });
}
