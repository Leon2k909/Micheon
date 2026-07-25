import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, History, MessageSquare, MessageSquareOff, X } from "lucide-react";

import { CodexPetHistoryPanel } from "@/components/codexPets/CodexPetHistoryPanel";
import {
  CodexPetSprite,
  type CodexPetVisibleBounds,
} from "@/components/codexPets/CodexPetSprite";
import { useCodexPets } from "@/components/codexPets/CodexPetProvider";
import { codexPetKey, type CodexPet } from "@/lib/codexPets";
import {
  CODEX_PET_MESSAGES_MUTED_EVENT,
  CODEX_PET_MESSAGES_MUTED_KEY,
  getCodexPetMessagesMuted,
  setCodexPetMessagesMuted,
} from "@/lib/codexPetMessages";
import { learningEnglish } from "@/lib/direction";
import { ui } from "@/lib/i18n";

const PET_POSITION_KEY = "gl-codex-pet-position-v1";
const DESKTOP_PET_POSITION_KEY = "gl-codex-pet-desktop-position-v2";
const PET_SIZE_KEY = "gl-codex-pet-size-v1";
const PET_MARGIN = 8;
const PET_SIZE_MIN = 64;
const PET_SIZE_MAX = 192;
const PET_SIZE_STEP = 4;
const PET_SIZE_DEFAULT = 96;
const PET_HEIGHT_RATIO = 104 / 96;
const PET_GROUP_GAP = 8;
const PET_MENU_WIDTH = 224;
const PET_MENU_ESTIMATED_HEIGHT = 280;
const PET_BUBBLE_WIDTH = 240;
const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;
const isDesktopPetOverlay = typeof window !== "undefined"
  && new URLSearchParams(window.location.search).get("pet-overlay") === "1";
const PET_POSITION_STORAGE_KEY = isDesktopPetOverlay
  ? DESKTOP_PET_POSITION_KEY
  : PET_POSITION_KEY;

const PET_GREETINGS = [
  "Ready when you are.",
  "Let's practise some German.",
  "Los geht's! Let's go.",
];

const GERMAN_PET_TIPS = [
  "German tip: learn every noun with der, die, or das — the article is part of the word.",
  "German tip: in a main clause, the conjugated verb stays in position two.",
  "German tip: after weil or dass, the conjugated verb moves to the end.",
  "German tip: all German nouns begin with a capital letter, even in the middle of a sentence.",
  "German tip: separable prefixes move to the end in a main clause — ich stehe um sieben auf.",
];

const ENGLISH_PET_TIPS = [
  "English tip: a normal statement usually follows subject–verb–object order.",
  "English tip: after can, must, should, or will, use the base verb without “to”.",
  "English tip: in the present simple, he, she, and it usually add -s to the verb.",
  "English tip: adjectives normally come before the noun and do not change for gender.",
  "English tip: use “a” before a consonant sound and “an” before a vowel sound.",
];

type PetPosition = {
  x: number;
  y: number;
};

type PetBounds = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

type DragState = {
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

function clampPetSize(size: number) {
  return Math.min(PET_SIZE_MAX, Math.max(PET_SIZE_MIN, size));
}

function petDimensions(size: number, heightRatio = PET_HEIGHT_RATIO) {
  const width = clampPetSize(size);
  return { height: Math.round(width * heightRatio), width };
}

function clampPosition(
  position: PetPosition,
  width: number,
  height: number,
  petWidth: number,
  petHeight: number,
  visibleBounds: PetBounds = { bottom: petHeight, left: 0, right: petWidth, top: 0 }
): PetPosition {
  const minX = PET_MARGIN - visibleBounds.left;
  const maxX = width - PET_MARGIN - visibleBounds.right;
  const minY = PET_MARGIN - visibleBounds.top;
  const maxY = height - PET_MARGIN - visibleBounds.bottom;
  return {
    x: Math.min(Math.max(minX, position.x), Math.max(minX, maxX)),
    y: Math.min(Math.max(minY, position.y), Math.max(minY, maxY)),
  };
}

function visiblePetGroupBounds(
  pets: CodexPet[],
  petWidth: number,
  petHeight: number,
  visibleBoundsByPet: Record<string, CodexPetVisibleBounds>
): PetBounds {
  if (!pets.length) return { bottom: petHeight, left: 0, right: petWidth, top: 0 };

  return pets.reduce<PetBounds>((group, pet, index) => {
    const bounds = visibleBoundsByPet[codexPetKey(pet)]
      ?? { bottom: 1, left: 0, right: 1, top: 0 };
    const spriteHeight = Math.round(
      petWidth * (pet.frame.height / Math.max(1, pet.frame.width))
    );
    const offsetX = index * (petWidth + PET_GROUP_GAP);
    const offsetY = petHeight - spriteHeight;
    return {
      bottom: Math.max(group.bottom, offsetY + bounds.bottom * spriteHeight),
      left: Math.min(group.left, offsetX + bounds.left * petWidth),
      right: Math.max(group.right, offsetX + bounds.right * petWidth),
      top: Math.min(group.top, offsetY + bounds.top * spriteHeight),
    };
  }, {
    bottom: 0,
    left: Number.POSITIVE_INFINITY,
    right: 0,
    top: Number.POSITIVE_INFINITY,
  });
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

function storedPosition(petWidth: number, petHeight: number, storageKey = PET_POSITION_KEY) {
  if (typeof window === "undefined") return defaultPosition(petWidth, petHeight);
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) ?? "");
    if (Number.isFinite(parsed?.x) && Number.isFinite(parsed?.y)) {
      const viewport = viewportSize();
      return clampPosition(parsed, viewport.width, viewport.height, petWidth, petHeight);
    }
  } catch {
    // A corrupt position should never strand the mascot off-screen.
  }
  return defaultPosition(petWidth, petHeight);
}

function savePosition(position: PetPosition, storageKey = PET_POSITION_KEY) {
  localStorage.setItem(storageKey, JSON.stringify(position));
}

function storedPetSize() {
  if (typeof window === "undefined") return PET_SIZE_DEFAULT;
  const stored = localStorage.getItem(PET_SIZE_KEY);
  if (stored === "small") return 72;
  if (stored === "medium") return PET_SIZE_DEFAULT;
  if (stored === "large") return 128;
  if (stored === null) return PET_SIZE_DEFAULT;
  const parsed = Number(stored);
  return Number.isFinite(parsed) ? clampPetSize(parsed) : PET_SIZE_DEFAULT;
}

export function CodexPetLayer() {
  const {
    answerQuestion,
    clearSpeech,
    dismissMessage,
    history,
    pets,
    selectPet,
    selectedPet,
    speak,
    speech,
    visibleKeys,
  } = useCodexPets();
  const visiblePets = selectedPet
    ? [
        selectedPet,
        ...pets.filter((pet) => {
          const key = codexPetKey(pet);
          return key !== codexPetKey(selectedPet) && visibleKeys.includes(key);
        }),
      ]
    : [];
  const [animation, setAnimation] = useState("idle");
  const [dragging, setDragging] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messagesMuted, setMessagesMuted] = useState(getCodexPetMessagesMuted);
  const [petSize, setPetSize] = useState(storedPetSize);
  const petHeightRatio = visiblePets.length
    ? Math.max(
        ...visiblePets.map((pet) => pet.frame.height / Math.max(1, pet.frame.width)),
        PET_HEIGHT_RATIO
      )
    : PET_HEIGHT_RATIO;
  const { height: petHeight, width: petWidth } = petDimensions(petSize, petHeightRatio);
  const petGroupWidth = petWidth * Math.max(1, visiblePets.length)
    + PET_GROUP_GAP * Math.max(0, visiblePets.length - 1);
  const [visibleBoundsByPet, setVisibleBoundsByPet] = useState<
    Record<string, CodexPetVisibleBounds>
  >({});
  const petGroupVisibleBounds = visiblePetGroupBounds(
    visiblePets,
    petWidth,
    petHeight,
    visibleBoundsByPet
  );
  const [playbackKey, setPlaybackKey] = useState(0);
  const [position, setPosition] = useState<PetPosition>(
    () => storedPosition(petGroupWidth, petHeight, PET_POSITION_STORAGE_KEY)
  );
  const [viewport, setViewport] = useState(viewportSize);
  const dragState = useRef<DragState | null>(null);
  const resetTimer = useRef<number | null>(null);
  const greetedPet = useRef("");
  const greetingIndex = useRef(0);
  const overlayInteractive = useRef<boolean | null>(null);
  const positionRef = useRef(position);
  const speechRef = useRef(speech);
  const suppressClick = useRef(false);
  const tipIndex = useRef(0);

  positionRef.current = position;
  speechRef.current = speech;

  const updatePetVisibleBounds = useCallback((
    key: string,
    bounds: CodexPetVisibleBounds
  ) => {
    setVisibleBoundsByPet((current) => {
      const prior = current[key];
      if (
        prior
        && prior.bottom === bounds.bottom
        && prior.left === bounds.left
        && prior.right === bounds.right
        && prior.top === bounds.top
      ) return current;
      return { ...current, [key]: bounds };
    });
  }, []);

  useEffect(() => {
    if (!isDesktopPetOverlay || !desktop?.setPetOverlayInteractive) return undefined;
    if (desktop?.petOverlayHitRegionsSupported && desktop?.setPetOverlayHitRegions) {
      return undefined;
    }

    const updateHitTest = (event: globalThis.MouseEvent) => {
      if (dragState.current) return;
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const interactive = Boolean(
        target?.closest('[data-pet-interactive="true"], [role="dialog"]')
      );
      if (overlayInteractive.current === interactive) return;
      overlayInteractive.current = interactive;
      desktop.setPetOverlayInteractive(interactive);
    };

    overlayInteractive.current = false;
    desktop.setPetOverlayInteractive(false);
    window.addEventListener("mousemove", updateHitTest, true);
    return () => {
      window.removeEventListener("mousemove", updateHitTest, true);
      overlayInteractive.current = null;
      desktop.setPetOverlayInteractive(false);
    };
  }, []);

  useEffect(() => {
    if (
      !isDesktopPetOverlay
      || !desktop?.petOverlayHitRegionsSupported
      || !desktop?.setPetOverlayHitRegions
    ) return undefined;

    let animationFrame = 0;
    let lastRegions = "";
    const syncHitRegions = () => {
      animationFrame = 0;
      const padding = 18;
      const regions = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-pet-interactive="true"], [role="dialog"]'
        )
      )
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.width > 0 && rect.height > 0)
        .map((rect) => {
          const x = Math.max(0, Math.floor(rect.left - padding));
          const y = Math.max(0, Math.floor(rect.top - padding));
          const right = Math.min(window.innerWidth, Math.ceil(rect.right + padding));
          const bottom = Math.min(window.innerHeight, Math.ceil(rect.bottom + padding));
          return { height: bottom - y, width: right - x, x, y };
        })
        .filter((region) => region.width > 0 && region.height > 0)
        .sort((left, right) => left.y - right.y || left.x - right.x);
      if (regions.length === 0) return;
      const serialized = JSON.stringify(regions);
      if (serialized === lastRegions) return;
      lastRegions = serialized;
      desktop.setPetOverlayHitRegions(regions);
    };
    const scheduleHitRegionSync = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(syncHitRegions);
    };
    const observer = new MutationObserver(scheduleHitRegionSync);

    observer.observe(document.body, {
      attributeFilter: ["class", "style"],
      attributes: true,
      childList: true,
      subtree: true,
    });
    window.addEventListener("resize", scheduleHitRegionSync);
    scheduleHitRegionSync();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", scheduleHitRegionSync);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const syncMutedState = () => {
      const muted = getCodexPetMessagesMuted();
      setMessagesMuted(muted);
      if (muted) clearSpeech();
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CODEX_PET_MESSAGES_MUTED_KEY) syncMutedState();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(CODEX_PET_MESSAGES_MUTED_EVENT, syncMutedState);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CODEX_PET_MESSAGES_MUTED_EVENT, syncMutedState);
    };
  }, [clearSpeech]);

  useEffect(() => {
    const handleResize = () => {
      const nextViewport = viewportSize();
      const nextPosition = clampPosition(
        positionRef.current,
        nextViewport.width,
        nextViewport.height,
        petGroupWidth,
        petHeight,
        petGroupVisibleBounds
      );
      positionRef.current = nextPosition;
      setViewport(nextViewport);
      setPosition(nextPosition);
      savePosition(nextPosition, PET_POSITION_STORAGE_KEY);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    petGroupVisibleBounds.bottom,
    petGroupVisibleBounds.left,
    petGroupVisibleBounds.right,
    petGroupVisibleBounds.top,
    petGroupWidth,
    petHeight,
  ]);

  useEffect(() => {
    const nextPosition = clampPosition(
      positionRef.current,
      viewport.width,
      viewport.height,
      petGroupWidth,
      petHeight,
      petGroupVisibleBounds
    );
    if (
      nextPosition.x === positionRef.current.x
      && nextPosition.y === positionRef.current.y
    ) return;
    positionRef.current = nextPosition;
    setPosition(nextPosition);
    savePosition(nextPosition, PET_POSITION_STORAGE_KEY);
  }, [
    petGroupVisibleBounds.bottom,
    petGroupVisibleBounds.left,
    petGroupVisibleBounds.right,
    petGroupVisibleBounds.top,
    petGroupWidth,
    petHeight,
    viewport.height,
    viewport.width,
  ]);

  useEffect(() => {
    if (!selectedPet || !speech || messagesMuted) return;
    if (resetTimer.current) window.clearTimeout(resetTimer.current);

    const preferredAnimation = speech.mood === "encourage"
      ? "failed"
      : speech.mood === "greeting"
        ? "waving"
        : "jumping";
    setAnimation(selectedPet.animations[preferredAnimation] ? preferredAnimation : "idle");
    setPlaybackKey((value) => value + 1);
    resetTimer.current = window.setTimeout(() => setAnimation("idle"), 1100);
  }, [messagesMuted, selectedPet, speech]);

  useEffect(() => {
    if (!speech || messagesMuted) return;
    const requiredTopSpace = (speech.question ? 216 : 112) + PET_MARGIN * 2;
    if (positionRef.current.y + petGroupVisibleBounds.top >= requiredTopSpace) return;
    const next = clampPosition(
      {
        x: positionRef.current.x,
        y: requiredTopSpace - petGroupVisibleBounds.top,
      },
      viewport.width,
      viewport.height,
      petGroupWidth,
      petHeight,
      petGroupVisibleBounds
    );
    positionRef.current = next;
    setPosition(next);
    savePosition(next, PET_POSITION_STORAGE_KEY);
  }, [
    messagesMuted,
    petGroupVisibleBounds.bottom,
    petGroupVisibleBounds.left,
    petGroupVisibleBounds.right,
    petGroupVisibleBounds.top,
    petGroupWidth,
    petHeight,
    position.y,
    speech,
    viewport.height,
    viewport.width,
  ]);

  useEffect(() => {
    if (!selectedPet || messagesMuted) return;
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
  }, [messagesMuted, selectedPet, speak]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (!selectedPet || messagesMuted) return;
    let tipTimer = 0;
    const languageTips = learningEnglish() ? ENGLISH_PET_TIPS : GERMAN_PET_TIPS;

    const scheduleTip = (delay: number) => {
      tipTimer = window.setTimeout(() => {
        if (document.visibilityState === "visible" && !speechRef.current && !dragState.current) {
          speak(ui(languageTips[tipIndex.current++ % languageTips.length]), {
            durationMs: 4800,
            mood: "greeting",
          });
        }
        scheduleTip(60000);
      }, delay);
    };

    scheduleTip(45000);
    return () => window.clearTimeout(tipTimer);
  }, [messagesMuted, selectedPet, speak]);

  useEffect(() => () => {
    if (isDesktopPetOverlay) desktop?.endPetOverlayDrag?.();
  }, []);

  if (!selectedPet) return null;

  const movePet = (nextPosition: PetPosition) => {
    const next = clampPosition(
      nextPosition,
      viewport.width,
      viewport.height,
      petGroupWidth,
      petHeight,
      petGroupVisibleBounds
    );
    positionRef.current = next;
    setPosition(next);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    if (isDesktopPetOverlay && desktop?.beginPetOverlayDrag?.() === false) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      if (isDesktopPetOverlay) desktop?.endPetOverlayDrag?.();
      return;
    }
    dragState.current = {
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

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) drag.moved = true;
    movePet({ x: drag.originX + deltaX, y: drag.originY + deltaY });
  };

  const finishDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    suppressClick.current = drag.moved;
    dragState.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
    savePosition(positionRef.current, PET_POSITION_STORAGE_KEY);
    if (isDesktopPetOverlay) desktop?.endPetOverlayDrag?.();
  };

  const handleClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    clearSpeech();
    setHistoryOpen(true);
  };

  const applyPetSize = (requestedSize: number) => {
    const nextSize = clampPetSize(requestedSize);
    const nextDimensions = petDimensions(nextSize, petHeightRatio);
    const nextGroupWidth = nextDimensions.width * Math.max(1, visiblePets.length)
      + PET_GROUP_GAP * Math.max(0, visiblePets.length - 1);
    const nextVisibleBounds = visiblePetGroupBounds(
      visiblePets,
      nextDimensions.width,
      nextDimensions.height,
      visibleBoundsByPet
    );
    const nextPosition = clampPosition(
      positionRef.current,
      viewport.width,
      viewport.height,
      nextGroupWidth,
      nextDimensions.height,
      nextVisibleBounds
    );
    localStorage.setItem(PET_SIZE_KEY, String(nextSize));
    positionRef.current = nextPosition;
    setPetSize(nextSize);
    setPosition(nextPosition);
    savePosition(nextPosition, PET_POSITION_STORAGE_KEY);
  };

  const showContextMenu = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!menuOpen) clearSpeech();
    setMenuOpen((open) => !open);
  };

  const relayOverlayWheel = (event: ReactWheelEvent<HTMLButtonElement>) => {
    if (!isDesktopPetOverlay || !desktop?.relayPetOverlayWheel) return;
    event.preventDefault();
    desktop.relayPetOverlayWheel(event.deltaX, event.deltaY);
  };

  const petVisualLeft = position.x + petGroupVisibleBounds.left;
  const petVisualRight = position.x + petGroupVisibleBounds.right;
  const petVisualTop = position.y + petGroupVisibleBounds.top;
  const petVisualBottom = position.y + petGroupVisibleBounds.bottom;
  const bubbleOnRight = (petVisualLeft + petVisualRight) / 2 < viewport.width / 2;
  const tailHorizontalClass = bubbleOnRight ? "left-5" : "right-5";
  const bubbleLeft = Math.min(
    Math.max(
      PET_MARGIN,
      bubbleOnRight ? petVisualLeft : petVisualRight - PET_BUBBLE_WIDTH
    ),
    Math.max(PET_MARGIN, viewport.width - PET_BUBBLE_WIDTH - PET_MARGIN)
  );
  const bubbleMaxHeight = Math.max(112, petVisualTop - PET_MARGIN * 2);
  const bubbleBottom = viewport.height - petVisualTop + PET_MARGIN;
  const menuBelow = petVisualTop < PET_MENU_ESTIMATED_HEIGHT + PET_MARGIN * 2;
  const preferredMenuTop = menuBelow
    ? petVisualBottom + PET_MARGIN
    : petVisualTop - PET_MENU_ESTIMATED_HEIGHT - PET_MARGIN;
  const menuTop = Math.min(
    Math.max(PET_MARGIN, preferredMenuTop),
    Math.max(PET_MARGIN, viewport.height - PET_MENU_ESTIMATED_HEIGHT - PET_MARGIN)
  );
  const menuLeft = Math.min(
    Math.max(
      PET_MARGIN,
      bubbleOnRight ? petVisualLeft : petVisualRight - PET_MENU_WIDTH
    ),
    Math.max(PET_MARGIN, viewport.width - PET_MENU_WIDTH - PET_MARGIN)
  );

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
        style={{ height: petHeight, left: position.x, top: position.y, width: petGroupWidth }}
      >
      <AnimatePresence>
        {menuOpen && (
          <>
            {!isDesktopPetOverlay && (
              <button
                aria-label={ui("Close pet menu")}
                className="pointer-events-auto fixed inset-0 cursor-default bg-transparent"
                onClick={() => setMenuOpen(false)}
                type="button"
              />
            )}
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="pointer-events-auto fixed z-10 w-56 overflow-y-auto rounded-lg border border-[var(--border-2)] bg-[var(--surface)] p-2 text-[var(--text-1)] shadow-[0_16px_44px_rgba(0,0,0,0.28)]"
              exit={{ opacity: 0, scale: 0.96, y: 4 }}
              initial={{ opacity: 0, scale: 0.96, y: 4 }}
              data-pet-interactive="true"
              onContextMenu={(event) => event.preventDefault()}
              onPointerDown={(event) => event.stopPropagation()}
              role="menu"
              style={{
                left: menuLeft,
                maxHeight: viewport.height - menuTop - PET_MARGIN,
                top: menuTop,
              }}
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
              <div className="rounded-lg bg-[var(--surface-2)] px-3 py-2.5">
                <div className="mb-2 flex items-center justify-between text-xs font-bold">
                  <span className="text-[var(--text-2)]">{ui("Size")}</span>
                  <output
                    className="tabular-nums text-[var(--text-1)]"
                    htmlFor="codex-pet-size"
                  >
                    {petSize}px
                  </output>
                </div>
                <input
                  aria-label={ui("Pet size")}
                  className="h-5 w-full cursor-pointer accent-[var(--accent)]"
                  id="codex-pet-size"
                  max={PET_SIZE_MAX}
                  min={PET_SIZE_MIN}
                  onChange={(event) => applyPetSize(Number(event.currentTarget.value))}
                  step={PET_SIZE_STEP}
                  type="range"
                  value={petSize}
                />
                <div
                  aria-hidden="true"
                  className="mt-1 flex justify-between text-[10px] font-bold text-[var(--text-3)]"
                >
                  <span>{ui("Small")}</span>
                  <span>{ui("Large")}</span>
                </div>
              </div>
              <div className="my-2 h-px bg-[var(--border-1)]" />
              <button
                aria-checked={messagesMuted}
                className="flex h-10 w-full items-center gap-2 rounded-md px-2.5 text-left text-sm font-bold text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                onClick={() => setCodexPetMessagesMuted(!messagesMuted)}
                role="menuitemcheckbox"
                type="button"
              >
                {messagesMuted ? (
                  <MessageSquare aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <MessageSquareOff aria-hidden="true" className="h-4 w-4" />
                )}
                {ui(messagesMuted ? "Show messages & questions" : "Mute messages & questions")}
              </button>
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
        {speech && !messagesMuted && (
          <motion.div
            key={speech.id}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-atomic="true"
            aria-live="polite"
            className="pointer-events-auto fixed z-10 flex w-[min(15rem,calc(100vw-2rem))] flex-col overflow-visible rounded-xl border border-[var(--border-2)] bg-[var(--surface)] px-3.5 py-3 text-left text-sm font-bold leading-snug text-[var(--text-1)] shadow-[0_12px_36px_rgba(0,0,0,0.18)]"
            exit={{ opacity: 0, scale: 0.94, y: 5 }}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            data-pet-interactive="true"
            onPointerDown={(event) => event.stopPropagation()}
            role={speech.question ? "group" : "status"}
            style={{
              bottom: bubbleBottom,
              left: bubbleLeft,
              maxHeight: bubbleMaxHeight,
            }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex min-h-0 flex-auto items-start gap-2">
              <p className="min-w-0 flex-1 overflow-y-auto break-words pr-1">{speech.text}</p>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  aria-label={ui("Open message history")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-1)] bg-[var(--surface-2)] text-[var(--text-1)] transition-colors hover:border-[var(--border-2)] hover:bg-[var(--surface)]"
                  onClick={clearSpeech}
                  title={ui("Dismiss speech")}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {speech.question && (
              <div className="mt-3 grid shrink-0 grid-cols-2 gap-2">
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
              className={`absolute -bottom-2 ${tailHorizontalClass} h-4 w-4 rotate-45 border-b border-r border-[var(--border-2)] bg-[var(--surface)]`}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        aria-label={`Talk to ${selectedPet.displayName}`}
        className={`pointer-events-auto flex items-end gap-2 touch-none select-none rounded-full outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${dragging ? "cursor-grabbing scale-[1.04]" : "cursor-grab hover:scale-[1.04] active:scale-95"}`}
        draggable={false}
        data-pet-interactive="true"
        onClick={handleClick}
        onContextMenu={showContextMenu}
        onLostPointerCapture={finishDrag}
        onPointerCancel={finishDrag}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onWheel={relayOverlayWheel}
        title={`${ui("Drag")} the pet group ${ui("to move. Click for messages or right-click for options.")}`}
        type="button"
      >
        {visiblePets.map((pet, index) => (
          <CodexPetSprite
            animation={index === 0 ? animation : "idle"}
            className="origin-bottom-right drop-shadow-[0_12px_18px_rgba(0,0,0,0.24)]"
            key={codexPetKey(pet)}
            onVisibleBounds={(bounds) => updatePetVisibleBounds(codexPetKey(pet), bounds)}
            pet={pet}
            playbackKey={index === 0 ? playbackKey : 0}
            size={petWidth}
          />
        ))}
      </button>
      </div>
    </>
  );
}
