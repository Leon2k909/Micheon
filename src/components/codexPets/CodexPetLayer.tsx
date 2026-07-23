import { useEffect, useRef, useState } from "react";

import { CodexPetSprite } from "@/components/codexPets/CodexPetSprite";
import { useCodexPets } from "@/components/codexPets/CodexPetProvider";

export function CodexPetLayer() {
  const { selectedPet } = useCodexPets();
  const [animation, setAnimation] = useState("idle");
  const [playbackKey, setPlaybackKey] = useState(0);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  if (!selectedPet) return null;

  const wave = () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    setAnimation("waving");
    setPlaybackKey((value) => value + 1);
    resetTimer.current = window.setTimeout(() => setAnimation("idle"), 1100);
  };

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-[700] sm:bottom-5 sm:right-6">
      <button
        aria-label={`Wave to ${selectedPet.displayName}`}
        className="pointer-events-auto block rounded-full outline-none transition-transform duration-200 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent active:scale-95"
        onClick={wave}
        title={selectedPet.displayName}
        type="button"
      >
        <CodexPetSprite
          animation={animation}
          className="origin-bottom-right scale-[0.72] drop-shadow-[0_12px_18px_rgba(0,0,0,0.24)] sm:scale-100"
          pet={selectedPet}
          playbackKey={playbackKey}
          size={96}
        />
      </button>
    </div>
  );
}
