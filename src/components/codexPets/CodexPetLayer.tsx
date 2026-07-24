import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, History, X } from "lucide-react";

import { CodexPetHistoryPanel } from "@/components/codexPets/CodexPetHistoryPanel";
import { CodexPetSprite } from "@/components/codexPets/CodexPetSprite";
import { useCodexPets } from "@/components/codexPets/CodexPetProvider";
import { ui } from "@/lib/i18n";

const PET_POSITION_KEY = "gl-codex-pet-position-v1";
const PET_SIZE_KEY = "gl-codex-pet-size-v1";
const PET_MARGIN = 8;
const PET_SIZE_PRESETS = {
  small: 72,
  medium: 96,
  large: 128,
} as const;
const PET_HEIGHT_RATIO = 104 / 96;
const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;
const isDesktopPetOverlay = typeof window !== "undefined"
  && new URLSearchParams(window.location.search).get("pet-overlay") === "1";

const PET_GREETINGS = [
  "Ready when you are.",
  "Let's practise some German.",
  "Los geht's! Let's go.",
];

const PET_TIPS = [
  "Tip: say each answer aloud before you check it.",
  "Short daily practice beats one long weekly session.",
  "If recall feels slow, mark the phrase as struggling.",
  "Listen once without reading to train your ear.",
  "Try using today's phrase in a sentence about your life.",
];

type PetPosition = {
  x: number;
  y: number;
};

type PetSize = keyof typeof PET_SIZE_PRESETS;

type DragState = {
  lastScreenX: number;
  lastScreenY: number;
  moved: boolean;
  originX: number;
  originY: number;
  pointerId: number;
  startX: number;
  startY: number;
};

function viewportSize() {
  return {
    height: typeof window === "undefined" ? 720 : window.innerHeight,
    width: typeof window === "undefined" ? 1280 : window.innerWidth,
  };
}

function petDimensions(size: PetSize) {
  const width = PET_SIZE_PRESETS[size];
  return { height: Math.round(width * PET_HEIGHT_RATIO), width };
}

function clampPosition(
  position: PetPosition,
  width: number,
  height: number,
  petWidth: number,
  petHeight: number
): PetPosition {
  return {
    x: Math.min(Math.max(PET_MARGIN, position.x), Math.max(PET_MARGIN, width - petWidth - PET_MARGIN)),
    y: Math.min(Math.max(PET_MARGIN, position.y), Math.max(PET_MARGIN, height - petHeight - PET_MARGIN)),
  };
}

function defaultPosition(petWidth: number, petHeight: number) {
  const viewport = viewportSize();
  return clampPosition(
    { x: viewport.width - petWidth - 24, y: viewport.height - petHeight - 20 },
    viewport.width,
    viewport.height,
    petWidth,
    petHeight
  );
}

function storedPosition(petWidth: number, petHeight: number) {
  if (typeof window === "undefined") return defaultPosition(petWidth, petHeight);
  try {
    const parsed = JSON.parse(localStorage.getItem(PET_POSITION_KEY) ?? "");
    if (Number.isFinite(parsed?.x) && Number.isFinite(parsed?.y)) {
      const viewport = viewportSize();
      return clampPosition(parsed, viewport.width, viewport.height, petWidth, petHeight);
    }
  } catch {
    // A corrupt position should never strand the mascot off-screen.
  }
  return defaultPosition(petWidth, petHeight);
}

function savePosition(position: PetPosition) {
  localStorage.setItem(PET_POSITION_KEY, JSON.stringify(position));
}

function storedPetSize(): PetSize {
  if (typeof window === "undefined") return "medium";
  const stored = localStorage.getItem(PET_SIZE_KEY);
  return stored === "small" || stored === "large" ? stored : "medium";
}

export function CodexPetLayer() {
  const {
    answerQuestion,
    clearSpeech,
    dismissMessage,
    history,
    selectPet,
    selectedPet,
    speak,
    speech,
  } = useCodexPets();
  const [animation, setAnimation] = useState("idle");
  const [dragging, setDragging] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [petSize, setPetSize] = useState<PetSize>(storedPetSize);
  const { height: petHeight, width: petWidth } = petDimensions(petSize);
  const [playbackKey, setPlaybackKey] = useState(0);
  const [position, setPosition] = useState<PetPosition>(
    () => isDesktopPetOverlay
      ? defaultPosition(petWidth, petHeight)
      : storedPosition(petWidth, petHeight)
  );
  const [viewport, setViewport] = useState(viewportSize);
  const dragState = useRef<DragState | null>(null);
  const resetTimer = useRef<number | null>(null);
  const greetedPet = useRef("");
  const greetingIndex = useRef(0);
  const positionRef = useRef(position);
  const speechRef = useRef(speech);
  const suppressClick = useRef(false);
  const tipIndex = useRef(0);

  positionRef.current = position;
  speechRef.current = speech;

  useEffect(() => {
    const handleResize = () => {
      const nextViewport = viewportSize();
      const nextPosition = clampPosition(
        positionRef.current,
        nextViewport.width,
        nextViewport.height,
        petWidth,
        petHeight
      );
      positionRef.current = nextPosition;
      setViewport(nextViewport);
      setPosition(nextPosition);
      if (!isDesktopPetOverlay) savePosition(nextPosition);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [petHeight, petWidth]);

  useEffect(() => {
    if (!selectedPet || !speech) return;
    if (resetTimer.current) window.clearTimeout(resetTimer.current);

    const preferredAnimation = speech.mood === "encourage"
      ? "failed"
      : speech.mood === "greeting"
        ? "waving"
        : "jumping";
    setAnimation(selectedPet.animations[preferredAnimation] ? preferredAnimation : "idle");
    setPlaybackKey((value) => value + 1);
    resetTimer.current = window.setTimeout(() => setAnimation("idle"), 1100);
  }, [selectedPet, speech]);

  useEffect(() => {
    if (!selectedPet) return;
    const key = `${selectedPet.source}:${selectedPet.id}`;
    if (greetedPet.current === key) return;
    greetedPet.current = key;
    const timer = window.setTimeout(() => {
      speak(ui(PET_GREETINGS[greetingIndex.current++ % PET_GREETINGS.length]), {
        durationMs: 3000,
        mood: "greeting",
      });
    }, 650);
    return () => window.clearTimeout(timer);
  }, [selectedPet, speak]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (!selectedPet) return;
    let tipTimer = 0;

    const scheduleTip = (delay: number) => {
      tipTimer = window.setTimeout(() => {
        if (document.visibilityState === "visible" && !speechRef.current && !dragState.current) {
          speak(ui(PET_TIPS[tipIndex.current++ % PET_TIPS.length]), {
            durationMs: 4800,
            mood: "greeting",
          });
        }
        scheduleTip(60000);
      }, delay);
    };

    scheduleTip(45000);
    return () => window.clearTimeout(tipTimer);
  }, [selectedPet, speak]);

  if (!selectedPet) return null;

  const movePet = (nextPosition: PetPosition) => {
    const next = clampPosition(
      nextPosition,
      viewport.width,
      viewport.height,
      petWidth,
      petHeight
    );
    positionRef.current = next;
    setPosition(next);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      lastScreenX: event.screenX,
      lastScreenY: event.screenY,
      moved: false,
      originX: positionRef.current.x,
      originY: positionRef.current.y,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (isDesktopPetOverlay && desktop?.movePetOverlayBy) {
      const screenDeltaX = event.screenX - drag.lastScreenX;
      const screenDeltaY = event.screenY - drag.lastScreenY;
      if (Math.abs(screenDeltaX) > 0 || Math.abs(screenDeltaY) > 0) {
        drag.moved = true;
        drag.lastScreenX = event.screenX;
        drag.lastScreenY = event.screenY;
        desktop.movePetOverlayBy(screenDeltaX, screenDeltaY);
      }
      return;
    }

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) drag.moved = true;
    movePet({ x: drag.originX + deltaX, y: drag.originY + deltaY });
  };

  const finishDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    suppressClick.current = drag.moved;
    dragState.current = null;
    setDragging(false);
    if (!isDesktopPetOverlay) savePosition(positionRef.current);
  };

  const handleClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    clearSpeech();
    setHistoryOpen(true);
  };

  const applyPetSize = (nextSize: PetSize) => {
    const nextDimensions = petDimensions(nextSize);
    const nextPosition = clampPosition(
      positionRef.current,
      viewport.width,
      viewport.height,
      nextDimensions.width,
      nextDimensions.height
    );
    localStorage.setItem(PET_SIZE_KEY, nextSize);
    positionRef.current = nextPosition;
    setPetSize(nextSize);
    setPosition(nextPosition);
    setMenuOpen(false);
    if (!isDesktopPetOverlay) savePosition(nextPosition);
  };

  const showContextMenu = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!menuOpen) clearSpeech();
    setMenuOpen((open) => !open);
  };

  const bubbleBelow = position.y < petHeight + 16;
  const bubbleOnRight = position.x < viewport.width / 2;
  const bubbleVerticalClass = bubbleBelow
    ? "top-[calc(100%+0.5rem)]"
    : "bottom-[calc(100%+0.5rem)]";
  const bubbleHorizontalClass = bubbleOnRight ? "left-0" : "right-0";
  const tailVerticalClass = bubbleBelow
    ? "-top-2 border-l border-t"
    : "-bottom-2 border-b border-r";
  const tailHorizontalClass = bubbleOnRight ? "left-5" : "right-5";
  const menuVerticalClass = bubbleBelow
    ? "top-[calc(100%+0.5rem)]"
    : "bottom-[calc(100%+0.5rem)]";
  const menuHorizontalClass = bubbleOnRight ? "left-0" : "right-0";

  return (
    <>
      {historyOpen && (
        <CodexPetHistoryPanel
          history={history}
          onAnswer={answerQuestion}
          onClose={() => setHistoryOpen(false)}
          onDismiss={dismissMessage}
        />
      )}
      <div
        className="pointer-events-none fixed z-[700]"
        style={{ height: petHeight, left: position.x, top: position.y, width: petWidth }}
      >
      <AnimatePresence>
        {menuOpen && (
          <>
            <button
              aria-label={ui("Close pet menu")}
              className="pointer-events-auto fixed inset-0 cursor-default bg-transparent"
              onClick={() => setMenuOpen(false)}
              type="button"
            />
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`pointer-events-auto absolute ${menuVerticalClass} ${menuHorizontalClass} z-10 w-56 rounded-lg border border-[var(--border-2)] bg-[var(--surface)] p-2 text-[var(--text-1)] shadow-[0_16px_44px_rgba(0,0,0,0.28)]`}
              exit={{ opacity: 0, scale: 0.96, y: 4 }}
              initial={{ opacity: 0, scale: 0.96, y: 4 }}
              onContextMenu={(event) => event.preventDefault()}
              onPointerDown={(event) => event.stopPropagation()}
              role="menu"
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between gap-2 px-2 pb-2 pt-1">
                <p className="text-xs font-bold uppercase text-[var(--text-3)]">
                  {ui("Pet size")}
                </p>
                <button
                  aria-label={ui("Close menu")}
                  className="flex h-7 w-7 items-center justify-center rounded text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                  onClick={() => setMenuOpen(false)}
                  title={ui("Close menu")}
                  type="button"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
              <div
                aria-label={ui("Pet size")}
                className="grid grid-cols-3 gap-1.5 rounded-lg bg-[var(--surface-2)] p-1.5"
                role="group"
              >
                {(Object.keys(PET_SIZE_PRESETS) as PetSize[]).map((size) => (
                  <button
                    aria-checked={petSize === size}
                    className={`flex h-8 min-w-0 items-center justify-center rounded-md px-1 text-xs font-bold capitalize transition-colors ${
                      petSize === size
                        ? "bg-[var(--surface)] text-[var(--text-1)] shadow-[inset_0_0_0_1px_var(--border-2),0_1px_2px_rgb(0_0_0_/_0.16)]"
                        : "text-[var(--text-2)] hover:bg-[var(--surface)] hover:text-[var(--text-1)]"
                    }`}
                    key={size}
                    onClick={() => applyPetSize(size)}
                    role="menuitemradio"
                    type="button"
                  >
                    {ui(size[0].toUpperCase() + size.slice(1))}
                  </button>
                ))}
              </div>
              <div className="my-2 h-px bg-[var(--border-1)]" />
              <button
                className="flex h-10 w-full items-center gap-2 rounded-md px-2.5 text-left text-sm font-bold text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                onClick={() => {
                  setMenuOpen(false);
                  clearSpeech();
                  setHistoryOpen(true);
                }}
                role="menuitem"
                type="button"
              >
                <History aria-hidden="true" className="h-4 w-4" />
                {ui("Message history")}
              </button>
              <button
                className="flex h-10 w-full items-center gap-2 rounded-md px-2.5 text-left text-sm font-bold text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                onClick={() => {
                  setMenuOpen(false);
                  selectPet("off");
                }}
                role="menuitem"
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" />
                {ui("Close pet")}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {speech && (
          <motion.div
            key={speech.id}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-atomic="true"
            aria-live="polite"
            className={`pointer-events-auto absolute ${bubbleVerticalClass} ${bubbleHorizontalClass} w-max max-w-[min(15rem,calc(100vw-2rem))] rounded-xl border border-[var(--border-2)] bg-[var(--surface)] px-3.5 py-3 text-left text-sm font-bold leading-snug text-[var(--text-1)] shadow-[0_12px_36px_rgba(0,0,0,0.18)]`}
            exit={{ opacity: 0, scale: 0.94, y: 5 }}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            onPointerDown={(event) => event.stopPropagation()}
            role={speech.question ? "group" : "status"}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start gap-2">
              <p className="min-w-0 flex-1">{speech.text}</p>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  aria-label={ui("Open message history")}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                  onClick={() => {
                    clearSpeech();
                    setHistoryOpen(true);
                  }}
                  title={ui("Message history")}
                  type="button"
                >
                  <History className="h-3.5 w-3.5" />
                </button>
                <button
                  aria-label={ui("Dismiss speech")}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                  onClick={clearSpeech}
                  title={ui("Dismiss speech")}
                  type="button"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {speech.question && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["yes", "no"] as const).map((answer) => {
                  const selected = speech.answer === answer;
                  return (
                    <button
                      aria-pressed={selected}
                      className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border text-xs font-black transition-colors ${
                        selected
                          ? answer === "yes"
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-rose-500 bg-rose-500 text-white"
                          : "border-[var(--border-2)] bg-[var(--surface-2)] text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--text-1)]"
                      }`}
                      key={answer}
                      onClick={() => answerQuestion(speech.id, answer)}
                      type="button"
                    >
                      {selected && <Check className="h-3.5 w-3.5" />}
                      {ui(answer === "yes" ? "Yes" : "No")}
                    </button>
                  );
                })}
              </div>
            )}
            <span
              aria-hidden="true"
              className={`absolute ${tailVerticalClass} ${tailHorizontalClass} h-4 w-4 rotate-45 border-[var(--border-2)] bg-[var(--surface)]`}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        aria-label={`Talk to ${selectedPet.displayName}`}
        className={`pointer-events-auto block touch-none select-none rounded-full outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${dragging ? "cursor-grabbing scale-[1.04]" : "cursor-grab hover:scale-[1.04] active:scale-95"}`}
        draggable={false}
        onClick={handleClick}
        onContextMenu={showContextMenu}
        onPointerCancel={finishDrag}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        title={`${ui("Drag")} ${selectedPet.displayName} ${ui("to move. Click for messages or right-click for options.")}`}
        type="button"
      >
        <CodexPetSprite
          animation={animation}
          className="origin-bottom-right drop-shadow-[0_12px_18px_rgba(0,0,0,0.24)]"
          pet={selectedPet}
          playbackKey={playbackKey}
          size={petWidth}
        />
      </button>
      </div>
    </>
  );
}
