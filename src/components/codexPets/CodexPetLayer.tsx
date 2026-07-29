import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, EyeOff, History, Link2, MessageSquare, MessageSquareOff, Unlink2, Volume2, VolumeX, X } from "lucide-react";

import { CodexPetHistoryPanel } from "@/components/codexPets/CodexPetHistoryPanel";
import { useCodexPetCoaching } from "@/components/codexPets/useCodexPetCoaching";
import {
  CodexPetSprite,
  type CodexPetVisibleBounds,
} from "@/components/codexPets/CodexPetSprite";
import { useCodexPets } from "@/components/codexPets/CodexPetProvider";
import { codexPetKey, type CodexPet } from "@/lib/codexPets";
import { PET_NAMES_EVENT, PET_NAMES_KEY, petDisplayName } from "@/lib/petNames";
import { petGreetingLines } from "@/lib/petGreetings";
import {
  CODEX_PET_MESSAGES_MUTED_EVENT,
  CODEX_PET_MESSAGES_MUTED_KEY,
  getCodexPetMessagesMuted,
  setCodexPetMessagesMuted,
} from "@/lib/codexPetMessages";
import {
  CODEX_PET_VOICE_ENABLED_EVENT,
  CODEX_PET_VOICE_ENABLED_KEY,
  getCodexPetVoiceEnabled,
  setCodexPetVoiceEnabled,
} from "@/lib/codexPetVoice";
import {
  PET_LAYOUT_EVENT,
  PET_LAYOUT_KEY,
  getPetLayoutMode,
  petPositionKey,
  setPetLayoutMode,
  type PetLayoutMode,
} from "@/lib/petLayout";
import { learningEnglish } from "@/lib/direction";
import { ui, uiIsGerman } from "@/lib/i18n";
import { getCodexPetCadence } from "@/lib/codexPetCoaching";
import { stopTts, tts } from "@/lib/voice";

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
const PET_MENU_ESTIMATED_HEIGHT = 328;
const PET_BUBBLE_WIDTH = 240;
// A click opens history, but only after the browser has had time to tell us it
// was actually the first half of a double-click. Opening immediately unmounts
// the desktop pet, so the second click must cancel the queued independent
// history window before it can be mistaken for a completed single click.
const PET_SINGLE_CLICK_DELAY_MS = 400;
const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;
const isDesktopPetOverlay = typeof window !== "undefined"
  && new URLSearchParams(window.location.search).get("pet-overlay") === "1";
const PET_POSITION_STORAGE_KEY = isDesktopPetOverlay
  ? DESKTOP_PET_POSITION_KEY
  : PET_POSITION_KEY;

type PetOverlayGeometry = {
  height: number;
  originX: number;
  originY: number;
  revision: number;
  viewportHeight: number;
  viewportWidth: number;
  width: number;
};

function readPetOverlayGeometry(value: any = desktop?.getPetOverlayGeometry?.()): PetOverlayGeometry {
  const fallbackWidth = typeof window === "undefined" ? 1280 : window.innerWidth;
  const fallbackHeight = typeof window === "undefined" ? 720 : window.innerHeight;
  return {
    height: Number.isFinite(Number(value?.height)) ? Number(value.height) : fallbackHeight,
    originX: Number.isFinite(Number(value?.originX)) ? Number(value.originX) : 0,
    originY: Number.isFinite(Number(value?.originY)) ? Number(value.originY) : 0,
    revision: Number.isInteger(Number(value?.revision)) ? Number(value.revision) : 0,
    viewportHeight: Number.isFinite(Number(value?.viewportHeight))
      ? Number(value.viewportHeight)
      : fallbackHeight,
    viewportWidth: Number.isFinite(Number(value?.viewportWidth))
      ? Number(value.viewportWidth)
      : fallbackWidth,
    width: Number.isFinite(Number(value?.width)) ? Number(value.width) : fallbackWidth,
  };
}

const PET_GREETINGS = [
  "Ready when you are.",
  "Let's practise some German.",
  "Los geht's! Let's go.",
];

const GERMAN_PET_TIPS = [
  "German tip: when a word uses der, die, or das, learn them together — say “der Tisch”, not just “Tisch”.",
  "German tip: in a normal German sentence, the verb comes second — “Heute gehe ich nach Hause.”",
  "German tip: after weil or dass, put the verb at the end — “weil ich müde bin”.",
  "German tip: German words for people, places, things, or ideas always start with a capital letter.",
  "German tip: some verbs split in two — “aufstehen” becomes “Ich stehe um sieben auf.”",
];

const ENGLISH_PET_TIPS = [
  "English tip: normal sentences usually put who or what first, then the action, then the rest — “I read the book.”",
  "English tip: after can, must, should, or will, use the verb without “to” — “can go”, not “can to go”.",
  "English tip: for habits or facts, verbs with he, she, or it usually end in -s — “she works”, “he knows”.",
  "English tip: describing words normally come before the thing — “a red car”. They stay the same — “a nice man”, “a nice woman”.",
  "English tip: choose “a” or “an” by sound, not spelling — “a university”, but “an hour”.",
  // Die Kurzformen, die man täglich braucht — die Grammatik-Karten erklären sie
  // ausführlich, der Pet erinnert im Vorbeigehen daran.
  "English tip: after “didn't”, use go, see, or do — not went, saw, or did: “I didn't go.”",
  "English tip: “cannot” is one word. Its short form is “can't”.",
  "English tip: “will not” becomes “won't”, never “willn't”.",
  "English tip: German “es gibt” becomes “there is” for one thing and “there are” for several — never “it gives”.",
  "English tip: when talking about the past, use “there was” for one thing and “there were” for several.",
  "English tip: do not use two negatives together — “I didn't see anything”, not “I didn't see nothing”.",
  "English tip: “should not” becomes “shouldn't”. The same shortening gives “wouldn't”, “couldn't”, and “mustn't”.",
  "English tip: use “haven't” with I, you, we, or they, and “hasn't” with he, she, or it — “I haven't seen it yet”.",
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
  /** Set when this drag moves a single companion rather than the whole group. */
  companionKey?: string;
  cursorFrame?: number;
  lastDomPointerAt?: number;
  moved: boolean;
  /** Desktop drag IPC is deliberately deferred until the pointer moves. */
  nativeStarted: boolean;
  originX: number;
  originY: number;
  pendingPointer?: { x: number; y: number };
  pointerId: number;
  pressClientX: number;
  pressClientY: number;
  /** Null until the first movement sample when begin-drag returned no cursor
   *  reading — initialised lazily so start and samples share one space. */
  startX: number | null;
  startY: number | null;
  unsubscribeCursor?: () => void;
  unsubscribeEnd?: () => void;
  /** Removes the window-level end-of-drag listeners the overlay drag installs. */
  cleanupGlobal?: () => void;
};

function viewportSize() {
  if (isDesktopPetOverlay) {
    const geometry = readPetOverlayGeometry();
    return { height: geometry.viewportHeight, width: geometry.viewportWidth };
  }
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
  // Measured on the pet's visible pixels, not its frame: sprite frames carry
  // transparent padding, and clamping on the frame stopped a pet well short of
  // an edge it looked nowhere near.
  // Clamp the visible artwork, not the transparent sprite frame. The artwork
  // can touch every screen edge, but no visible pixels are deliberately left
  // outside the desktop where they become cut off or impossible to grab.
  const minX = -visibleBounds.left;
  const maxX = width - visibleBounds.right;
  const minY = -visibleBounds.top;
  const maxY = height - visibleBounds.bottom;
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
    togglePetVisibility,
    selectedKey,
    selectedPet,
    speak,
    speech,
    visibleKeys,
  } = useCodexPets();
  const { frequencies: petCoachingFrequencies } = useCodexPetCoaching();
  const petEnabled = Boolean(selectedPet && selectedKey !== "off");
  const [layoutMode, setLayoutMode] = useState<PetLayoutMode>(getPetLayoutMode);
  const allVisiblePets = selectedPet
    ? [
        selectedPet,
        ...pets.filter((pet) => {
          const key = codexPetKey(pet);
          return key !== codexPetKey(selectedPet) && visibleKeys.includes(key);
        }),
      ]
    : [];
  // Apart: the talking pet keeps the group slot (it owns the speech bubble and
  // the menu) and every other pet becomes its own draggable thing. Together:
  // one row, exactly as before.
  const companionPets = layoutMode === "apart" ? allVisiblePets.slice(1) : [];
  const visiblePets = layoutMode === "apart" ? allVisiblePets.slice(0, 1) : allVisiblePets;
  const [animation, setAnimation] = useState("idle");
  const [dragging, setDragging] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /** Which pet the open menu acts on. null = the talking pet. */
  const [menuPetKey, setMenuPetKey] = useState<string | null>(null);
  // Renames live on this side rather than in the pet's own manifest, which
  // is shared by everyone who installs it.
  const [nameRevision, setNameRevision] = useState(0);
  const petName = (pet: CodexPet) => petDisplayName(codexPetKey(pet), pet.displayName);
  useEffect(() => {
    const sync = () => setNameRevision((value) => value + 1);
    const onStorage = (event: StorageEvent) => {
      if (event.key === PET_NAMES_KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(PET_NAMES_EVENT, sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(PET_NAMES_EVENT, sync);
    };
  }, []);
  void nameRevision;   // read so the re-render is not optimised away
  const menuPet = menuPetKey
    ? allVisiblePets.find((pet) => codexPetKey(pet) === menuPetKey) ?? null
    : selectedPet;
  const menuPetIsSpeaker = Boolean(
    menuPet && selectedPet && codexPetKey(menuPet) === codexPetKey(selectedPet)
  );
  const [messagesMuted, setMessagesMuted] = useState(getCodexPetMessagesMuted);
  const [petVoiceEnabled, setPetVoiceEnabled] = useState(getCodexPetVoiceEnabled);
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
  // What the menu and the speech bubble ACTUALLY measure, not what the layout
  // guessed. The guesses were made against English on a normal screen; German
  // wraps every line, and a 3440x1440 display at 225% scale is only 640 points
  // tall, so a menu "about 328 tall" was over half the screen and ran off the
  // bottom. Positioning from the real size is the only thing that holds for
  // both languages at any scale.
  const [menuSize, setMenuSize] = useState({ height: PET_MENU_ESTIMATED_HEIGHT, width: PET_MENU_WIDTH });
  const [bubbleSize, setBubbleSize] = useState({ height: 112, width: PET_BUBBLE_WIDTH });
  const [playbackKey, setPlaybackKey] = useState(0);
  const [position, setPosition] = useState<PetPosition>(
    () => storedPosition(petGroupWidth, petHeight, PET_POSITION_STORAGE_KEY)
  );
  const [viewport, setViewport] = useState(viewportSize);
  const [overlayGeometry, setOverlayGeometry] = useState(readPetOverlayGeometry);
  const overlayGeometryRef = useRef(overlayGeometry);
  const overlayGeometryAckFrame = useRef<number | null>(null);
  const desktopPlaneRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<DragState | null>(null);
  const menuMotionRef = useRef<HTMLDivElement | null>(null);
  const petMotionRef = useRef<HTMLDivElement | null>(null);
  const speechMotionRef = useRef<HTMLDivElement | null>(null);
  const resetTimer = useRef<number | null>(null);
  const greetedPet = useRef("");
  const greetingIndex = useRef(0);
  const overlayInteractive = useRef<boolean | null>(null);
  /** Set by the hit-region effect so state changes can request a re-sync. */
  const hitRegionSyncRef = useRef<(() => void) | null>(null);
  const positionRef = useRef(position);
  const speechRef = useRef(speech);
  const activePetTtsId = useRef("");
  const spokenSpeechId = useRef("");
  const suppressClick = useRef(false);
  const pendingPetClick = useRef<number | null>(null);
  const tipIndex = useRef(0);
  /** Where each companion sits when the pets are arranged apart. */
  const [companionPositions, setCompanionPositions] = useState<Record<string, PetPosition>>({});
  const companionPositionsRef = useRef(companionPositions);
  const companionElements = useRef<Record<string, HTMLDivElement | null>>({});

  speechRef.current = speech;
  companionPositionsRef.current = companionPositions;

  const cancelPendingPetClick = useCallback(() => {
    if (pendingPetClick.current === null) return;
    window.clearTimeout(pendingPetClick.current);
    pendingPetClick.current = null;
  }, []);

  const currentPetHistoryAnchor = useCallback(() => ({
    height: Math.max(1, petGroupVisibleBounds.bottom - petGroupVisibleBounds.top),
    width: Math.max(1, petGroupVisibleBounds.right - petGroupVisibleBounds.left),
    x: positionRef.current.x + petGroupVisibleBounds.left,
    y: positionRef.current.y + petGroupVisibleBounds.top,
  }), [
    petGroupVisibleBounds.bottom,
    petGroupVisibleBounds.left,
    petGroupVisibleBounds.right,
    petGroupVisibleBounds.top,
  ]);

  const openHistory = useCallback(() => {
    if (isDesktopPetOverlay) {
      // History owns a second compact native surface. Never render it inside
      // the mascot overlay: doing so either hides the pet or stretches one
      // transparent compositor surface between two distant pieces of UI. Keep
      // the current bubble too: clearing it would reshape this native window
      // and make the mascot appear to blink out while history is opening.
      desktop?.openPetHistory?.(currentPetHistoryAnchor());
      return;
    }
    clearSpeech();
    setHistoryOpen(true);
  }, [clearSpeech, currentPetHistoryAnchor]);

  // Position changes are committed only when a drag finishes, so this is one
  // cheap IPC update per drop (or resize/clamp), never one native-window move
  // per cursor frame. Main ignores it after the history panel is detached.
  useEffect(() => {
    if (!isDesktopPetOverlay) return;
    desktop?.setPetHistoryAnchor?.(currentPetHistoryAnchor());
  }, [currentPetHistoryAnchor, position.x, position.y]);

  // A preference change during the short click gate must not leave history
  // queued to open the next time this (or another) pet becomes visible.
  useEffect(() => {
    cancelPendingPetClick();
  }, [cancelPendingPetClick, selectedKey]);

  // The layout choice is made in one window and has to reach the other, so
  // both the cross-window storage event and the same-window custom event are
  // observed — a storage event never fires in the window that wrote it.
  useEffect(() => {
    const sync = () => setLayoutMode(getPetLayoutMode());
    const onStorage = (event: StorageEvent) => {
      if (event.key === PET_LAYOUT_KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(PET_LAYOUT_EVENT, sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(PET_LAYOUT_EVENT, sync);
    };
  }, []);

  // Give every companion a stored place, and a sensible first one: stepped out
  // from the group rather than stacked on top of it, so switching to "apart"
  // visibly separates them instead of looking like nothing happened.
  useEffect(() => {
    if (layoutMode !== "apart" || !companionPets.length) return;
    setCompanionPositions((current) => {
      let changed = false;
      const next = { ...current };
      companionPets.forEach((pet, index) => {
        const key = codexPetKey(pet);
        if (next[key]) return;
        const stored = storedPosition(
          petWidth,
          petHeight,
          petPositionKey(PET_POSITION_STORAGE_KEY, key)
        );
        const hasStored = typeof window !== "undefined"
          && window.localStorage.getItem(petPositionKey(PET_POSITION_STORAGE_KEY, key)) !== null;
        next[key] = hasStored
          ? stored
          : clampPosition(
              {
                x: positionRef.current.x - (index + 1) * (petWidth + PET_GROUP_GAP * 4),
                y: positionRef.current.y,
              },
              viewport.width,
              viewport.height,
              petWidth,
              petHeight
            );
        changed = true;
      });
      return changed ? next : current;
    });
  }, [layoutMode, companionPets.map((pet) => codexPetKey(pet)).join("|"), petWidth, petHeight]);

  useLayoutEffect(() => {
    if (dragState.current) return;
    positionRef.current = position;
    menuMotionRef.current?.style.removeProperty("translate");
    petMotionRef.current?.style.removeProperty("translate");
    speechMotionRef.current?.style.removeProperty("translate");
    // Companions move by translate during a drag and by left/top once it ends.
    // Leaving the translate behind would add the drag distance a second time.
    for (const element of Object.values(companionElements.current)) {
      element?.style.removeProperty("translate");
    }
  }, [companionPositions, dragging, position]);

  const updateOverlayGeometry = useCallback((value: any) => {
    const next = readPetOverlayGeometry(value);
    setOverlayGeometry((current) => (
      current.height === next.height
      && current.originX === next.originX
      && current.originY === next.originY
      && current.revision === next.revision
      && current.viewportHeight === next.viewportHeight
      && current.viewportWidth === next.viewportWidth
      && current.width === next.width
        ? current
        : next
    ));
    setViewport((current) => (
      current.height === next.viewportHeight && current.width === next.viewportWidth
        ? current
        : { height: next.viewportHeight, width: next.viewportWidth }
    ));
  }, []);

  // Pair each measured DOM layout with the native-window origin that produced
  // it. Main keeps the native window transparent during an origin transition;
  // acknowledge only after React has committed the new plane and a paint frame
  // has passed, so no stale-origin pet can flash at the desktop's left edge.
  useLayoutEffect(() => {
    overlayGeometryRef.current = overlayGeometry;
    hitRegionSyncRef.current?.();
    if (!isDesktopPetOverlay || overlayGeometry.revision <= 0) return undefined;
    if (overlayGeometryAckFrame.current !== null) {
      window.cancelAnimationFrame(overlayGeometryAckFrame.current);
    }
    overlayGeometryAckFrame.current = window.requestAnimationFrame(() => {
      overlayGeometryAckFrame.current = window.requestAnimationFrame(() => {
        overlayGeometryAckFrame.current = null;
        desktop?.acknowledgePetOverlayGeometry?.(overlayGeometry.revision);
      });
    });
    return () => {
      if (overlayGeometryAckFrame.current !== null) {
        window.cancelAnimationFrame(overlayGeometryAckFrame.current);
        overlayGeometryAckFrame.current = null;
      }
    };
  }, [overlayGeometry]);

  useEffect(() => {
    if (!isDesktopPetOverlay || !desktop?.onPetOverlayGeometry) return undefined;
    updateOverlayGeometry(desktop.getPetOverlayGeometry?.());
    return desktop.onPetOverlayGeometry(updateOverlayGeometry);
  }, [updateOverlayGeometry]);

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
  const requestHitRegionSync = useCallback(() => hitRegionSyncRef.current?.(), []);

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
    let fallbackTimer = 0;
    let retryTimer = 0;
    let lastRegions = "";
    // Until this is true the overlay window has NO shape, which on Windows
    // means it is entirely click-through: the pet is there but nothing can
    // touch it. Reaching that state once is what actually matters, so the sync
    // keeps retrying until it does.
    let deliveredOnce = false;
    const syncHitRegions = () => {
      animationFrame = 0;
      if (fallbackTimer) { window.clearTimeout(fallbackTimer); fallbackTimer = 0; }
      // Main uses one stable full-window collar while dragging. Measuring and
      // sending a shape on every translated frame only creates IPC/style work;
      // the final release explicitly requests one fresh compact measurement.
      if (dragState.current) return;
      const padding = 18;
      const regions = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-pet-interactive="true"], [role="dialog"]'
        )
      )
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.width > 0 && rect.height > 0)
        .map((rect) => {
          const x = isDesktopPetOverlay
            ? Math.floor(rect.left - padding)
            : Math.max(0, Math.floor(rect.left - padding));
          const y = isDesktopPetOverlay
            ? Math.floor(rect.top - padding)
            : Math.max(0, Math.floor(rect.top - padding));
          const right = isDesktopPetOverlay
            ? Math.ceil(rect.right + padding)
            : Math.min(window.innerWidth, Math.ceil(rect.right + padding));
          const bottom = isDesktopPetOverlay
            ? Math.ceil(rect.bottom + padding)
            : Math.min(window.innerHeight, Math.ceil(rect.bottom + padding));
          return { height: bottom - y, width: right - x, x, y };
        })
        .filter((region) => region.width > 0 && region.height > 0)
        .sort((left, right) => left.y - right.y || left.x - right.x);
      // Nothing measurable yet — the pet has not rendered, or its sprite has
      // not loaded. Keep the retry running rather than giving up silently.
      if (regions.length === 0) return;
      const serialized = JSON.stringify(regions);
      if (serialized === lastRegions) return;
      lastRegions = serialized;
      deliveredOnce = true;
      const geometry = overlayGeometryRef.current;
      desktop.setPetOverlayHitRegions(regions, { x: geometry.originX, y: geometry.originY });
    };
    const scheduleHitRegionSync = () => {
      if (animationFrame || fallbackTimer) return;
      animationFrame = window.requestAnimationFrame(syncHitRegions);
      // requestAnimationFrame never fires while the overlay window is hidden,
      // so a sync scheduled just before a hide would otherwise be stranded and
      // block every later one via the animationFrame guard.
      fallbackTimer = window.setTimeout(() => {
        if (animationFrame) { window.cancelAnimationFrame(animationFrame); animationFrame = 0; }
        fallbackTimer = 0;
        syncHitRegions();
      }, 120);
    };
    // Poll until the first successful delivery. This is the only thing standing
    // between "pet enabled" and "pet actually usable", so it retries rather than
    // failing silently — but it gives up after ~10s so a deliberately disabled
    // pet does not leave a timer running forever. Showing the overlay restarts it.
    // The budget deliberately lives OUTSIDE startRetry and is only refilled by
    // an actual window show. Refilling it on every call — or even just letting a
    // fresh call restart a poller that had run itself down — meant the ordinary
    // geometry sync, which fires on every position change and so ~60 times a
    // second during a drag, could keep this polling forever.
    let retriesLeft = 40;
    const startRetry = () => {
      if (retryTimer || retriesLeft <= 0) return;
      retryTimer = window.setInterval(() => {
        if (deliveredOnce || retriesLeft-- <= 0) {
          window.clearInterval(retryTimer);
          retryTimer = 0;
          return;
        }
        lastRegions = "";
        scheduleHitRegionSync();
      }, 250);
    };
    const resync = () => {
      // A fresh show may land on identical geometry, which the de-dupe would
      // drop — but the window's shape was reset, so it must be sent again.
      lastRegions = "";
      deliveredOnce = false;
      retriesLeft = 40;   // a real show is the only thing that earns a fresh budget
      scheduleHitRegionSync();
      startRetry();
    };
    const observer = new MutationObserver(scheduleHitRegionSync);

    // Watch only for elements appearing and disappearing (menus, dialogs, the
    // speech bubble). Attributes are deliberately NOT observed: the sprite
    // animates by rewriting its inline style.backgroundPosition on every frame,
    // so an attribute observer here fired at the animation frame rate and made
    // each frame pay for a querySelectorAll, a forced layout via
    // getBoundingClientRect, a JSON.stringify and — whenever the pet was moving —
    // a native setShape call on the overlay window. That is what made the pet
    // lag the whole app and made drags stutter.
    //
    // Everything that genuinely changes the interactive geometry is React state,
    // so the effect below re-syncs from that instead.
    observer.observe(document.body, {
      attributes: false,
      childList: true,
      subtree: true,
    });
    window.addEventListener("resize", scheduleHitRegionSync);
    // The main process fires this every time the overlay window is shown.
    const stopResyncListener = desktop?.onPetOverlayResync?.(resync);
    // Belt and braces for a show that arrives without the IPC (an older main
    // process, or the window being restored by the compositor).
    const onVisible = () => {
      if (document.visibilityState === "visible") resync();
    };
    document.addEventListener("visibilitychange", onVisible);
    scheduleHitRegionSync();
    startRetry();
    // Ordinary geometry changes just sync. But if nothing has ever reached the
    // main process — the case where a pet has only now appeared — restart the
    // retry, because that first delivery is what makes the overlay clickable.
    hitRegionSyncRef.current = () => {
      scheduleHitRegionSync();
      if (!deliveredOnce) startRetry();
    };
    return () => {
      hitRegionSyncRef.current = null;
      observer.disconnect();
      stopResyncListener?.();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("resize", scheduleHitRegionSync);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      if (retryTimer) window.clearInterval(retryTimer);
    };
  }, []);

  // The geometry that matters changes with these, not with sprite frames.
  useEffect(() => {
    hitRegionSyncRef.current?.();
    // Companions are separate hit regions, so their arrangement changing has to
    // re-sync the native shape too or a moved pet stops being clickable.
  }, [position, petSize, visiblePets.length, menuOpen, historyOpen, dragging, speech,
      layoutMode, companionPositions]);

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
    const syncVoiceState = () => setPetVoiceEnabled(getCodexPetVoiceEnabled());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CODEX_PET_VOICE_ENABLED_KEY) syncVoiceState();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(CODEX_PET_VOICE_ENABLED_EVENT, syncVoiceState);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CODEX_PET_VOICE_ENABLED_EVENT, syncVoiceState);
    };
  }, []);

  // The Layer is the only pet renderer in each environment: the website owns
  // it directly and Electron owns it in the lightweight overlay window. That
  // makes this the one safe playback point without doubling every message.
  // Keep the id guard across StrictMode's effect replay and do not return a TTS
  // cleanup here, because the immediate development cleanup would silence the
  // first utterance and the guard would then suppress its retry.
  useEffect(() => {
    if (!petVoiceEnabled || messagesMuted || !speech) {
      spokenSpeechId.current = "";
      if (activePetTtsId.current) {
        activePetTtsId.current = "";
        stopTts();
      }
      return;
    }
    if (spokenSpeechId.current === speech.id) return;
    spokenSpeechId.current = speech.id;
    activePetTtsId.current = speech.id;
    void tts(
      speech.text,
      0.9,
      speech.voiceLang ?? (uiIsGerman() ? "de-DE" : "en-US")
    ).finally(() => {
      if (activePetTtsId.current === speech.id) activePetTtsId.current = "";
    });
  }, [messagesMuted, petVoiceEnabled, speech?.id, speech?.text, speech?.voiceLang]);

  // Measured while it is open, and again whenever its contents change — a
  // question adds answer buttons, and a long message wraps.
  useEffect(() => {
    const targets: [HTMLDivElement | null, (size: { height: number; width: number }) => void][] = [
      [menuMotionRef.current, setMenuSize],
      [speechMotionRef.current, setBubbleSize],
    ];
    const observers = targets.map(([element, apply]) => {
      if (!element || typeof ResizeObserver === "undefined") return null;
      const observer = new ResizeObserver(() => {
        // offsetWidth/Height, not the client rect: the open animation scales the
        // element, and a rect measured mid-animation reads several per cent
        // small — which is exactly how a menu ends up positioned to overflow.
        const next = { height: element.offsetHeight, width: element.offsetWidth };
        if (next.height > 0 && next.width > 0) {
          apply((current) => (current.height === next.height && current.width === next.width ? current : next));
        }
      });
      observer.observe(element);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, [menuOpen, speech?.id, historyOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (dragState.current) return;
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
    handleResize();
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
    dragging,
  ]);

  useEffect(() => {
    if (dragState.current) return;
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
    dragging,
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
      // A pet's own hellos replace the stock ones entirely. Custom lines are
      // sent verbatim — ui() would look them up as translation keys and a
      // learner's own words are not in the table.
      const custom = petGreetingLines(key);
      const line = custom
        ? custom[greetingIndex.current++ % custom.length]
        : ui(PET_GREETINGS[greetingIndex.current++ % PET_GREETINGS.length]);
      speak(line, { durationMs: 3000, mood: "greeting" });
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
    const cadence = getCodexPetCadence("tips", petCoachingFrequencies.tips);
    if (!petEnabled || messagesMuted || !cadence) return;
    let tipTimer = 0;
    let active = true;
    const languageTips = learningEnglish() ? ENGLISH_PET_TIPS : GERMAN_PET_TIPS;

    const scheduleTip = (delay: number) => {
      if (!active) return;
      tipTimer = window.setTimeout(() => {
        if (!active) return;
        if (document.visibilityState === "visible" && !speechRef.current && !dragState.current) {
          speak(ui(languageTips[tipIndex.current++ % languageTips.length]), {
            durationMs: 4800,
            mood: "greeting",
          });
        }
        scheduleTip(cadence.intervalMs);
      }, delay);
    };

    scheduleTip(cadence.initialDelayMs);
    return () => {
      active = false;
      window.clearTimeout(tipTimer);
    };
  }, [messagesMuted, petCoachingFrequencies.tips, petEnabled, speak]);

  useEffect(() => () => {
    cancelPendingPetClick();
    const drag = dragState.current;
    if (drag?.cursorFrame !== undefined) {
      window.cancelAnimationFrame(drag.cursorFrame);
    }
    drag?.unsubscribeCursor?.();
    drag?.unsubscribeEnd?.();
    drag?.cleanupGlobal?.();
    dragState.current = null;
    if (isDesktopPetOverlay && drag?.nativeStarted) desktop?.endPetOverlayDrag?.();
  }, [cancelPendingPetClick]);

  if (!selectedPet) return null;

  const movePetDuringDrag = (drag: DragState, nextPosition: PetPosition) => {
    // A companion moves alone and is exactly one pet wide, so it clamps against
    // its own box rather than the group's — otherwise a single pet would be
    // fenced in by the width of pets it is no longer attached to.
    if (drag.companionKey) {
      const key = drag.companionKey;
      const current = companionPositionsRef.current[key];
      if (!current) return;
      // Its own visible pixels, like the lead pet. Clamping a companion on its
      // whole frame fenced it further from the edge than the pet beside it, for
      // no reason a person could see.
      const companionBounds = visibleBoundsByPet[key];
      const next = clampPosition(
        nextPosition,
        viewport.width,
        viewport.height,
        petWidth,
        petHeight,
        companionBounds
          ? {
            bottom: companionBounds.bottom * petHeight,
            left: companionBounds.left * petWidth,
            right: companionBounds.right * petWidth,
            top: companionBounds.top * petHeight,
          }
          : undefined
      );
      if (next.x === current.x && next.y === current.y) return;
      companionPositionsRef.current = { ...companionPositionsRef.current, [key]: next };
      const element = companionElements.current[key];
      if (element) {
        element.style.translate = `${next.x - drag.originX}px ${next.y - drag.originY}px`;
      }
      requestHitRegionSync();
      return;
    }
    const next = clampPosition(
      nextPosition,
      viewport.width,
      viewport.height,
      petGroupWidth,
      petHeight,
      petGroupVisibleBounds
    );
    if (next.x === positionRef.current.x && next.y === positionRef.current.y) return;
    positionRef.current = next;
    const deltaX = next.x - drag.originX;
    const deltaY = next.y - drag.originY;
    for (const element of [
      menuMotionRef.current,
      petMotionRef.current,
      speechMotionRef.current,
    ]) {
      if (element) element.style.translate = `${deltaX}px ${deltaY}px`;
    }
    requestHitRegionSync();
  };

  const moveDragFromPointer = (drag: DragState, pointerX: number, pointerY: number) => {
    // First sample with no recorded start: this sample IS the start. The pet
    // stays put (zero delta) instead of leaping by the difference between two
    // unrelated coordinate spaces.
    if (drag.startX === null || drag.startY === null) {
      drag.startX = pointerX;
      drag.startY = pointerY;
      return;
    }
    const deltaX = pointerX - drag.startX;
    const deltaY = pointerY - drag.startY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) drag.moved = true;
    movePetDuringDrag(drag, { x: drag.originX + deltaX, y: drag.originY + deltaY });
  };

  const flushDragPointer = (drag: DragState) => {
    if (drag.cursorFrame !== undefined) {
      window.cancelAnimationFrame(drag.cursorFrame);
      drag.cursorFrame = undefined;
    }
    const pending = drag.pendingPointer;
    drag.pendingPointer = undefined;
    if (pending) moveDragFromPointer(drag, pending.x, pending.y);
  };

  const scheduleDragFromPointer = (drag: DragState, pointerX: number, pointerY: number) => {
    drag.pendingPointer = { x: pointerX, y: pointerY };
    if (drag.cursorFrame !== undefined) return;
    drag.cursorFrame = window.requestAnimationFrame(() => {
      drag.cursorFrame = undefined;
      if (dragState.current !== drag) return;
      const pending = drag.pendingPointer;
      drag.pendingPointer = undefined;
      if (pending) moveDragFromPointer(drag, pending.x, pending.y);
    });
  };

  const scheduleDomDragFromPointer = (drag: DragState, pointerX: number, pointerY: number) => {
    drag.lastDomPointerAt = performance.now();
    scheduleDragFromPointer(drag, pointerX, pointerY);
  };

  /** Tear down whatever drag is active, however we learned it ended. */
  const finishActiveDrag = (notifyMain = true) => {
    const drag = dragState.current;
    if (!drag) return;
    flushDragPointer(drag);
    suppressClick.current = drag.moved;
    drag.unsubscribeCursor?.();
    drag.unsubscribeEnd?.();
    drag.cleanupGlobal?.();
    dragState.current = null;
    // A desktop click creates a pending gesture only. If it never crossed the
    // movement threshold, no native window transition happened and there is
    // nothing to save or restore. Leaving this path quiet keeps the mascot
    // visible while the click opens message history.
    if (isDesktopPetOverlay && !drag.nativeStarted) {
      setDragging(false);
      return;
    }
    if (drag.companionKey) {
      const key = drag.companionKey;
      const next = companionPositionsRef.current[key];
      if (next) {
        setCompanionPositions((current) => ({ ...current, [key]: next }));
        savePosition(next, petPositionKey(PET_POSITION_STORAGE_KEY, key));
      }
    } else {
      setPosition({ ...positionRef.current });
      savePosition(positionRef.current, PET_POSITION_STORAGE_KEY);
    }
    setDragging(false);
    requestHitRegionSync();
    if (isDesktopPetOverlay && drag.nativeStarted && notifyMain) {
      // Let the final translated rectangles reach main before it restores the
      // compact native hit shape for the released pet.
      window.requestAnimationFrame(() => {
        // A new pending click must not strand the old desktop-sized drag
        // surface. Skip restoration only when another native drag genuinely
        // started before this frame ran.
        if (!dragState.current?.nativeStarted) desktop?.endPetOverlayDrag?.();
      });
    }
  };

  const startNativeDrag = (drag: DragState) => {
    if (!isDesktopPetOverlay || drag.nativeStarted) return true;
    const nativeDrag = desktop?.beginPetOverlayDrag?.();
    if (!nativeDrag || nativeDrag === false || nativeDrag.started === false) {
      finishActiveDrag(false);
      return false;
    }
    drag.nativeStarted = true;
    if (nativeDrag.geometry) updateOverlayGeometry(nativeDrag.geometry);
    // From here on, movement comes from one coordinate system: Electron's
    // native cursor poll. The few DOM pixels that crossed the threshold are
    // intentionally discarded so mixed-DPI displays cannot make the pet jump.
    drag.startX = Number.isFinite(nativeDrag.screenX) ? nativeDrag.screenX : null;
    drag.startY = Number.isFinite(nativeDrag.screenY) ? nativeDrag.screenY : null;
    if (desktop?.onPetOverlayDragCursor) {
      drag.unsubscribeCursor = desktop.onPetOverlayDragCursor((point: {
        screenX?: number;
        screenY?: number;
      }) => {
        const activeDrag = dragState.current;
        const pointerX = Number(point?.screenX);
        const pointerY = Number(point?.screenY);
        if (activeDrag !== drag || !Number.isFinite(pointerX) || !Number.isFinite(pointerY)) return;
        scheduleDragFromPointer(activeDrag, pointerX, pointerY);
      });
    }
    if (desktop?.onPetOverlayDragEnd) {
      drag.unsubscribeEnd = desktop.onPetOverlayDragEnd(() => {
        if (dragState.current === drag) finishActiveDrag(false);
      });
    }
    setDragging(true);
    return true;
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    companionKey?: string
  ) => {
    if (dragState.current) return;
    // Any new press cancels the pending single-click action. A genuine second
    // click should leave the mascot where it is, not open history halfway
    // through the gesture and remove the button from under the pointer.
    const repeatedPress = pendingPetClick.current !== null;
    cancelPendingPetClick();
    // Right-press also cancels the pending history action, then continues via
    // onContextMenu. Otherwise a held right-click can let the timer unmount the
    // pet before its menu event arrives.
    if (event.button !== 0) return;
    // PointerEvent.detail is zero for pointerdown, so the pending timer—not
    // click count—is the reliable sign that a second press followed the first.
    // Stop before pointer capture/native resizing to avoid a needless overlay
    // expand-and-contract flash on the second half of a double-click.
    if (repeatedPress) return;
    // A companion that has not been given a place yet cannot be dragged; its
    // position effect runs first, so this only guards the very first frame.
    if (companionKey && !companionPositionsRef.current[companionKey]) return;
    // Capture the press, but do not resize or fade the native overlay yet. A
    // click must remain a click; native drag begins only after real movement.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      if (!isDesktopPetOverlay) return;
    }
    // Desktop uses the DOM only to distinguish a click from a drag. Once the
    // threshold is crossed, native cursor samples own movement end-to-end.
    const origin = companionKey
      ? companionPositionsRef.current[companionKey]
      : positionRef.current;
    const drag: DragState = {
      companionKey,
      lastDomPointerAt: performance.now(),
      moved: false,
      nativeStarted: false,
      originX: origin.x,
      originY: origin.y,
      pointerId: event.pointerId,
      pressClientX: event.clientX,
      pressClientY: event.clientY,
      startX: isDesktopPetOverlay ? null : event.clientX,
      startY: isDesktopPetOverlay ? null : event.clientY,
    };
    dragState.current = drag;
    if (isDesktopPetOverlay) {
      // Without capture the button may never see the pointerup, so the end of
      // the drag has independent signals: any pointerup in the window, or a
      // pointermove reporting no buttons held — the recovery for a release
      // that happened while the cursor was outside the window's shaped area.
      const onWindowPointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId === drag.pointerId) finishActiveDrag();
      };
      const onWindowPointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== drag.pointerId) return;
        // End-of-drag detection only. Feeding moveEvent.screenX into the drag
        // here is what mixed coordinate spaces on scaled displays — movement
        // belongs to the cursor poll alone.
        if ((moveEvent.buttons & 1) === 0) finishActiveDrag();
      };
      window.addEventListener("pointerup", onWindowPointerUp, true);
      window.addEventListener("pointercancel", onWindowPointerUp, true);
      window.addEventListener("pointermove", onWindowPointerMove, true);
      drag.cleanupGlobal = () => {
        window.removeEventListener("pointerup", onWindowPointerUp, true);
        window.removeEventListener("pointercancel", onWindowPointerUp, true);
        window.removeEventListener("pointermove", onWindowPointerMove, true);
      };
    }
    if (!isDesktopPetOverlay) setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (isDesktopPetOverlay) {
      if (drag.nativeStarted) return;
      const deltaX = event.clientX - drag.pressClientX;
      const deltaY = event.clientY - drag.pressClientY;
      if (Math.abs(deltaX) <= 3 && Math.abs(deltaY) <= 3) return;
      drag.moved = true;
      startNativeDrag(drag);
      return;
    }
    scheduleDomDragFromPointer(drag, event.clientX, event.clientY);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    finishActiveDrag();
  };

  /**
   * The desktop overlay keeps native polling alive if Windows revokes capture;
   * the in-page pet has no native fallback and therefore ends its drag.
   */
  const handleLostCapture = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (isDesktopPetOverlay) return;
    finishDrag(event);
  };

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (event.detail > 1) {
      cancelPendingPetClick();
      return;
    }
    cancelPendingPetClick();
    pendingPetClick.current = window.setTimeout(() => {
      pendingPetClick.current = null;
      openHistory();
    }, PET_SINGLE_CLICK_DELAY_MS);
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

  // Right-clicking a pet opens the menu for THAT pet. Without the key the menu
  // always acted on the talking pet, so with several out there was no way to
  // hide or promote the one you actually clicked.
  const showContextMenu = (event: ReactMouseEvent<HTMLButtonElement>, petKey?: string) => {
    event.preventDefault();
    event.stopPropagation();
    cancelPendingPetClick();
    const target = petKey ?? null;
    const reopeningSame = menuOpen && menuPetKey === target;
    if (!reopeningSame) clearSpeech();
    setMenuPetKey(target);
    setMenuOpen(reopeningSame ? false : true);
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
  // Never wider than the screen it has to fit on. On a 225%-scaled display the
  // usable width in points is less than half the panel's pixels, so a bubble
  // sized by a constant could be wider than the whole desktop.
  const bubbleWidth = Math.min(PET_BUBBLE_WIDTH, Math.max(160, viewport.width - PET_MARGIN * 2));
  const bubbleLeft = Math.min(
    Math.max(
      PET_MARGIN,
      bubbleOnRight ? petVisualLeft : petVisualRight - bubbleWidth
    ),
    Math.max(PET_MARGIN, viewport.width - bubbleWidth - PET_MARGIN)
  );
  // Whichever is smaller: the gap above the pet, or the screen itself. The
  // second term is what was missing — on a short desktop a bubble could be told
  // it had more room than the display has.
  const bubbleMaxHeight = Math.max(
    112,
    Math.min(petVisualTop - PET_MARGIN * 2, viewport.height - PET_MARGIN * 2)
  );
  // Sat on the pet's head if there is no room above it, rather than being
  // pushed off the top of the screen.
  const bubbleBottom = Math.min(
    viewport.height - petVisualTop + PET_MARGIN,
    Math.max(PET_MARGIN, viewport.height - bubbleSize.height - PET_MARGIN)
  );
  const menuHeight = Math.min(menuSize.height, Math.max(120, viewport.height - PET_MARGIN * 2));
  const menuWidth = Math.min(menuSize.width, Math.max(160, viewport.width - PET_MARGIN * 2));
  const menuBelow = petVisualTop < menuHeight + PET_MARGIN * 2;
  const preferredMenuTop = menuBelow
    ? petVisualBottom + PET_MARGIN
    : petVisualTop - menuHeight - PET_MARGIN;
  const menuTop = Math.min(
    Math.max(PET_MARGIN, preferredMenuTop),
    Math.max(PET_MARGIN, viewport.height - menuHeight - PET_MARGIN)
  );
  const menuLeft = Math.min(
    Math.max(
      PET_MARGIN,
      bubbleOnRight ? petVisualLeft : petVisualRight - menuWidth
    ),
    Math.max(PET_MARGIN, viewport.width - menuWidth - PET_MARGIN)
  );
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[700] overflow-visible"
      >
      <div
        ref={desktopPlaneRef}
        className="pointer-events-none absolute overflow-visible"
        style={{
          height: viewport.height,
          left: isDesktopPetOverlay ? -overlayGeometry.originX : 0,
          top: isDesktopPetOverlay ? -overlayGeometry.originY : 0,
          width: viewport.width,
        }}
      >
      {historyOpen && !isDesktopPetOverlay && (
        <CodexPetHistoryPanel
          history={history}
          onAnswer={answerQuestion}
          onClose={() => setHistoryOpen(false)}
          onDismiss={dismissMessage}
          onGeometryChange={requestHitRegionSync}
          viewportHeight={viewport.height}
          viewportWidth={viewport.width}
        />
      )}
      <AnimatePresence>
        {menuOpen && (
          <>
            {!isDesktopPetOverlay && (
              <button
                aria-label={ui("Close pet menu")}
                className="pointer-events-auto absolute inset-0 cursor-default bg-transparent"
                onClick={() => setMenuOpen(false)}
                type="button"
              />
            )}
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="pointer-events-auto absolute z-10 w-56 overflow-y-auto rounded-lg border border-[var(--border-2)] bg-[var(--surface)] p-2 text-[var(--text-1)] shadow-[0_16px_44px_rgba(0,0,0,0.28)]"
              data-pet-motion-part="menu"
              exit={{ opacity: 0, scale: 0.96, y: 4 }}
              initial={{ opacity: 0, scale: 0.96, y: 4 }}
              data-pet-interactive="true"
              onContextMenu={(event) => event.preventDefault()}
              onPointerDown={(event) => event.stopPropagation()}
              ref={menuMotionRef}
              role="menu"
              style={{
                left: menuLeft,
                // Against the screen, not against wherever the menu was put:
                // the old form could hand it a height taller than the display.
                maxHeight: Math.max(120, viewport.height - menuTop - PET_MARGIN),
                maxWidth: menuWidth,
                top: menuTop,
                willChange: dragging ? "translate" : undefined,
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
              {/* Actions for the pet that was actually right-clicked. Only one
                  pet speaks at a time, so "let this one talk" IS the speaker
                  switch — and hiding acts on this pet rather than the group. */}
              {menuPet && (
                <>
                  <div className="my-2 h-px bg-[var(--border-1)]" />
                  <p className="px-2.5 pb-1 text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
                    {petName(menuPet)}
                  </p>
                  {!menuPetIsSpeaker && (
                    <button
                      className="flex h-10 w-full items-center gap-2 rounded-md px-2.5 text-left text-sm font-bold text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                      onClick={() => {
                        setMenuOpen(false);
                        selectPet(codexPetKey(menuPet));
                      }}
                      role="menuitem"
                      type="button"
                    >
                      <MessageSquare aria-hidden="true" className="h-4 w-4" />
                      {ui("Let this one do the talking")}
                    </button>
                  )}
                  {menuPetIsSpeaker && (
                    <p className="px-2.5 pb-2 text-xs font-semibold text-[var(--text-3)]">
                      {ui("This is your talking pet.")}
                    </p>
                  )}
                  <button
                    className="flex h-10 w-full items-center gap-2 rounded-md px-2.5 text-left text-sm font-bold text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                    onClick={() => {
                      setMenuOpen(false);
                      // The speaker cannot simply be hidden — that would leave
                      // nobody talking — so hiding it turns the mascot off.
                      if (menuPetIsSpeaker) selectPet("off");
                      else togglePetVisibility(codexPetKey(menuPet));
                    }}
                    role="menuitem"
                    type="button"
                  >
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                    {ui("Hide this pet")}
                  </button>
                </>
              )}
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
                aria-checked={petVoiceEnabled}
                className="flex h-10 w-full items-center gap-2 rounded-md px-2.5 text-left text-sm font-bold text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                onClick={() => setCodexPetVoiceEnabled(!petVoiceEnabled)}
                role="menuitemcheckbox"
                type="button"
              >
                {petVoiceEnabled ? (
                  <VolumeX aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Volume2 aria-hidden="true" className="h-4 w-4" />
                )}
                {ui(petVoiceEnabled ? "Mute pet voice" : "Turn on pet voice")}
              </button>
              <button
                className="flex h-10 w-full items-center gap-2 rounded-md px-2.5 text-left text-sm font-bold text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                onClick={() => {
                  setMenuOpen(false);
                  openHistory();
                }}
                role="menuitem"
                type="button"
              >
                <History aria-hidden="true" className="h-4 w-4" />
                {ui("Message history")}
              </button>
              {/* Only worth offering once there is more than one pet on screen. */}
              {allVisiblePets.length > 1 && (
                <button
                  className="flex h-10 w-full items-center gap-2 rounded-md px-2.5 text-left text-sm font-bold text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                  onClick={() => {
                    setMenuOpen(false);
                    const next = layoutMode === "apart" ? "together" : "apart";
                    setLayoutMode(next);
                    setPetLayoutMode(next);
                  }}
                  role="menuitem"
                  type="button"
                >
                  {layoutMode === "apart"
                    ? <Link2 aria-hidden="true" className="h-4 w-4" />
                    : <Unlink2 aria-hidden="true" className="h-4 w-4" />}
                  {ui(layoutMode === "apart" ? "Keep pets together" : "Move pets separately")}
                </button>
              )}
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
            // Width comes from the style below, against the DESKTOP size. A vw
            // unit here measured the compact overlay window instead, which is
            // only as wide as the pet plus its margin.
            className="pointer-events-auto absolute z-10 flex flex-col overflow-visible rounded-xl border border-[var(--border-2)] bg-[var(--surface)] px-3.5 py-3 text-left text-sm font-bold leading-snug text-[var(--text-1)] shadow-[0_12px_36px_rgba(0,0,0,0.18)]"
            exit={{ opacity: 0, scale: 0.94, y: 5 }}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            data-pet-interactive="true"
            data-pet-motion-part="speech"
            onPointerDown={(event) => event.stopPropagation()}
            ref={speechMotionRef}
            role={speech.question ? "group" : "status"}
            style={{
              bottom: bubbleBottom,
              left: bubbleLeft,
              maxHeight: bubbleMaxHeight,
              width: bubbleWidth,
              willChange: dragging ? "translate" : undefined,
            }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex min-h-0 flex-auto items-start gap-2">
              <p className="min-w-0 flex-1 overflow-y-auto break-words pr-1">{speech.text}</p>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  aria-label={ui("Open message history")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                  onClick={openHistory}
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
      <div
          className="pointer-events-none absolute"
          data-pet-motion-layer="true"
          ref={petMotionRef}
          style={{
            height: petHeight,
            left: position.x,
            top: position.y,
            width: petGroupWidth,
            willChange: dragging ? "translate" : undefined,
          }}
        >
        <button
        aria-label={`Talk to ${petName(selectedPet)}`}
        className={`pointer-events-auto flex items-end gap-2 touch-none select-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${dragging ? "cursor-grabbing" : "cursor-grab transition-transform duration-200 hover:scale-[1.04] active:scale-95"}`}
        draggable={false}
        data-pet-interactive="true"
        onClick={handleClick}
        onContextMenu={showContextMenu}
        onLostPointerCapture={handleLostCapture}
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

      {/* Companions, when the pets are arranged apart. Each one is its own
          positioned element with its own hit region, so the overlay's native
          shape picks them up without any extra plumbing. They do not carry the
          speech bubble or the menu — only the talking pet does — so a click
          here opens the same menu rather than a second, emptier one. */}
      {layoutMode === "apart" && companionPets.map((pet) => {
        const key = codexPetKey(pet);
        const spot = companionPositions[key];
        if (!spot) return null;
        return (
          <div
            className="pointer-events-none absolute"
            key={key}
            ref={(element) => { companionElements.current[key] = element; }}
            style={{
              height: petHeight,
              left: spot.x,
              top: spot.y,
              width: petWidth,
              willChange: dragging ? "translate" : undefined,
            }}
          >
            <button
              aria-label={`${ui("Move")} ${petName(pet)}`}
              className={`pointer-events-auto flex items-end touch-none select-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${dragging ? "cursor-grabbing" : "cursor-grab transition-transform duration-200 hover:scale-[1.04] active:scale-95"}`}
              data-pet-interactive="true"
              draggable={false}
              onContextMenu={(event) => showContextMenu(event, key)}
              onLostPointerCapture={handleLostCapture}
              onPointerCancel={finishDrag}
              onPointerDown={(event) => handlePointerDown(event, key)}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              title={`${ui("Drag")} ${petName(pet)} ${ui("to move it on its own.")}`}
              type="button"
            >
              <CodexPetSprite
                animation="idle"
                className="origin-bottom-right drop-shadow-[0_12px_18px_rgba(0,0,0,0.24)]"
                onVisibleBounds={(bounds) => updatePetVisibleBounds(key, bounds)}
                pet={pet}
                playbackKey={0}
                size={petWidth}
              />
            </button>
          </div>
        );
      })}
      </div>
      </div>
    </>
  );
}
