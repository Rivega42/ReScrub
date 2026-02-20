import { useEffect, useRef } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = "0px 0px -40px 0px", once = true } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove("revealed");
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

/** Apply scroll-reveal with stagger delay to a list of elements */
export function useScrollRevealList<T extends HTMLElement = HTMLElement>(
  count: number,
  staggerMs = 100,
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px 0px -40px 0px", once = true } = options;
  const refs = Array.from({ length: count }, () => useRef<T>(null));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;

      el.style.transitionDelay = `${i * staggerMs}ms`;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("revealed");
            if (once) observer.unobserve(el);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, staggerMs, threshold, rootMargin, once]);

  return refs;
}
