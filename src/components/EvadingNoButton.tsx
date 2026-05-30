"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type EvadingNoButtonProps = {
  onGiveUp?: () => void;
};

export function EvadingNoButton({ onGiveUp }: EvadingNoButtonProps) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const moveButton = useCallback(() => {
    const arena = arenaRef.current;
    const button = buttonRef.current;
    if (!arena || !button) return;

    const arenaRect = arena.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const padding = 8;
    const maxX = arenaRect.width - buttonRect.width - padding * 2;
    const maxY = arenaRect.height - buttonRect.height - padding * 2;

    setPosition({
      x: padding + Math.random() * Math.max(maxX, 0),
      y: padding + Math.random() * Math.max(maxY, 0),
    });
    setAttempts((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!initialized && arenaRef.current && buttonRef.current) {
      const arena = arenaRef.current;
      const button = buttonRef.current;
      const arenaRect = arena.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setPosition({
        x: arenaRect.width / 2 - buttonRect.width / 2,
        y: arenaRect.height - buttonRect.height - 16,
      });
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    if (attempts >= 5) {
      onGiveUp?.();
    }
  }, [attempts, onGiveUp]);

  return (
    <div
      ref={arenaRef}
      className="relative mt-8 h-36 w-full overflow-hidden rounded-2xl bg-mist/60 ring-1 ring-rose/20 sm:h-40"
      aria-hidden={false}
    >
      {attempts > 0 && attempts < 5 && (
        <p className="absolute left-0 right-0 top-3 text-center text-xs text-plum/60">
          Nice try, Marina… but I think you mean yes 💕
        </p>
      )}
      {attempts >= 5 && (
        <p className="absolute left-0 right-0 top-3 text-center text-xs text-rose-deep">
          Okay okay — I knew you&apos;d say yes!
        </p>
      )}
      <button
        ref={buttonRef}
        type="button"
        className="absolute cursor-default select-none rounded-full border border-plum/20 bg-white/90 px-5 py-2.5 text-sm font-medium text-plum/70 shadow-sm transition-transform duration-150"
        style={{
          left: position.x,
          top: position.y,
          transition: "left 0.12s ease-out, top 0.12s ease-out",
        }}
        onMouseEnter={moveButton}
        onFocus={moveButton}
        onClick={(e) => {
          e.preventDefault();
          moveButton();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          moveButton();
        }}
        tabIndex={-1}
        aria-label="No — this button runs away"
      >
        No
      </button>
    </div>
  );
}
