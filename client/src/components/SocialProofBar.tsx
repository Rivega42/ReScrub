import { useEffect, useState } from "react";

const STORAGE_KEY = "grandhub_user_count";
const INITIAL_COUNT = 150;

function getUserCount(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const count = parseInt(stored, 10);
      if (!isNaN(count) && count >= INITIAL_COUNT) {
        return count;
      }
    }
  } catch {}
  return INITIAL_COUNT;
}

function incrementUserCount(): number {
  const current = getUserCount();
  const increment = Math.floor(Math.random() * 3);
  const newCount = current + increment;
  try {
    localStorage.setItem(STORAGE_KEY, newCount.toString());
  } catch {}
  return newCount;
}

export default function SocialProofBar() {
  const [userCount, setUserCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    const count = incrementUserCount();
    setUserCount(count);
  }, []);

  return (
    <section className="py-6 border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scroll-reveal flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Уже{" "}
            <span className="font-semibold text-foreground">{userCount}+ пользователей</span>
            {" "}доверяют GrandHub
          </p>
        </div>
      </div>
    </section>
  );
}
