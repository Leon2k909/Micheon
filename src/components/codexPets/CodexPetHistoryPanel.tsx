import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Check, Clock3, Copy, MessageCircle, Search, TextSelect, X } from "lucide-react";

import type {
  CodexPetAnswer,
  CodexPetSpeech,
} from "@/components/codexPets/CodexPetProvider";
import { cn } from "@/lib/utils";
import { ui, uiLocale } from "@/lib/i18n";

const HISTORY_POSITION_KEY = "gl-codex-pet-history-position-v1";
const PANEL_MARGIN = 8;
const PANEL_MAX_HEIGHT = 560;
const PANEL_MAX_WIDTH = 620;
const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;

type PanelPosition = {
  x: number;
  y: number;
};

type DragState = {
  cleanupGlobal?: () => void;
  cursorFrame?: number;
  element: HTMLElement;
  native: boolean;
  originX: number;
  originY: number;
  pendingPointer?: { x: number; y: number };
  pointerId: number;
  startX: number | null;
  startY: number | null;
  unsubscribeCursor?: () => void;
  unsubscribeEnd?: () => void;
};

type HistoryContextMenu = {
  copyValue: string;
  x: number;
  y: number;
};

function viewportSize() {
  return {
    height: typeof window === "undefined" ? 720 : window.innerHeight,
    width: typeof window === "undefined" ? 1280 : window.innerWidth,
  };
}

function panelSize(viewport = viewportSize()) {
  return {
    height: Math.max(1, Math.min(PANEL_MAX_HEIGHT, viewport.height - PANEL_MARGIN * 2)),
    width: Math.max(1, Math.min(PANEL_MAX_WIDTH, viewport.width - PANEL_MARGIN * 2)),
  };
}

function clampPanelPosition(position: PanelPosition, viewport = viewportSize()) {
  const size = panelSize(viewport);
  return {
    x: Math.min(
      Math.max(PANEL_MARGIN, position.x),
      Math.max(PANEL_MARGIN, viewport.width - size.width - PANEL_MARGIN)
    ),
    y: Math.min(
      Math.max(PANEL_MARGIN, position.y),
      Math.max(PANEL_MARGIN, viewport.height - size.height - PANEL_MARGIN)
    ),
  };
}

function initialPanelPosition(viewport = viewportSize()) {
  const size = panelSize(viewport);
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_POSITION_KEY) ?? "");
    if (Number.isFinite(stored?.x) && Number.isFinite(stored?.y)) {
      return clampPanelPosition(stored, viewport);
    }
  } catch {
    // Invalid stored coordinates fall back to the centre of the screen.
  }
  return clampPanelPosition({
    x: Math.round((viewport.width - size.width) / 2),
    y: Math.round((viewport.height - size.height) / 2),
  }, viewport);
}

function savePanelPosition(position: PanelPosition) {
  localStorage.setItem(HISTORY_POSITION_KEY, JSON.stringify(position));
}

async function writeClipboard(text: string) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // Use the legacy copy command when clipboard permissions are unavailable.
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function selectContents(element: HTMLElement | null) {
  if (!element) return;
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export function CodexPetHistoryPanel({
  history,
  nativeWindow = false,
  onAnswer,
  onClose,
  onDismiss,
  onGeometryChange,
  viewportHeight,
  viewportWidth,
}: {
  history: CodexPetSpeech[];
  nativeWindow?: boolean;
  onAnswer: (messageId: string, answer: CodexPetAnswer, announce?: boolean) => void;
  onClose: () => void;
  onDismiss: (messageId: string) => void;
  onGeometryChange?: () => void;
  viewportHeight?: number;
  viewportWidth?: number;
}) {
  const requestedViewport = {
    height: Number.isFinite(viewportHeight) ? Number(viewportHeight) : viewportSize().height,
    width: Number.isFinite(viewportWidth) ? Number(viewportWidth) : viewportSize().width,
  };
  const allMessages = [...history].reverse();
  // Most of what the pet says is encouragement. The things worth coming back
  // to — the questions, and specifically the ones you missed, which are the
  // ones that got queued for review — were buried in it.
  const [filter, setFilter] = useState<"all" | "questions" | "unanswered" | "missed">("all");
  const [query, setQuery] = useState("");
  const messages = allMessages.filter((message) => {
    if (filter === "questions" && !message.question) return false;
    if (filter === "unanswered" && (!message.question || message.answer)) return false;
    if (filter === "missed" && message.answer !== "no") return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return String(message.text ?? "").toLowerCase().includes(q);
  });
  const counts = {
    all: allMessages.length,
    questions: allMessages.filter((m) => m.question).length,
    unanswered: allMessages.filter((m) => m.question && !m.answer).length,
    missed: allMessages.filter((m) => m.answer === "no").length,
  };
  const [position, setPosition] = useState(() => nativeWindow
    ? { x: PANEL_MARGIN, y: PANEL_MARGIN }
    : initialPanelPosition(requestedViewport));
  const [viewport, setViewport] = useState(requestedViewport);
  const [contextMenu, setContextMenu] = useState<HistoryContextMenu | null>(null);
  const [dragging, setDragging] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<DragState | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const positionRef = useRef(position);
  const size = panelSize(viewport);

  useLayoutEffect(() => {
    if (dragState.current) return;
    positionRef.current = position;
    panelRef.current?.style.removeProperty("transform");
  }, [dragging, position]);

  useEffect(() => {
    if (nativeWindow) return undefined;
    if (!desktop?.setPetOverlayKeyboardInteractive) return undefined;
    desktop.setPetOverlayKeyboardInteractive(true);
    return () => desktop.setPetOverlayKeyboardInteractive(false);
  }, [nativeWindow]);

  useEffect(() => {
    const handleResize = () => {
      if (dragState.current) return;
      const nextViewport = Number.isFinite(viewportHeight) && Number.isFinite(viewportWidth)
        ? { height: Number(viewportHeight), width: Number(viewportWidth) }
        : viewportSize();
      const nextPosition = nativeWindow
        ? { x: PANEL_MARGIN, y: PANEL_MARGIN }
        : clampPanelPosition(positionRef.current, nextViewport);
      positionRef.current = nextPosition;
      setViewport(nextViewport);
      setPosition(nextPosition);
      if (!nativeWindow) savePanelPosition(nextPosition);
      setContextMenu(null);
    };
    const handlePointerDown = () => setContextMenu(null);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey)
        && event.key.toLowerCase() === "a"
        && !(event.target as Element | null)?.closest("input, textarea")
      ) {
        event.preventDefault();
        selectContents(contentRef.current);
        setContextMenu(null);
        return;
      }
      if (event.key !== "Escape") return;
      if (contextMenu) setContextMenu(null);
      else onClose();
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [contextMenu, nativeWindow, onClose, viewportHeight, viewportWidth]);

  useEffect(() => {
    if (dragState.current) return;
    const nextViewport = Number.isFinite(viewportHeight) && Number.isFinite(viewportWidth)
      ? { height: Number(viewportHeight), width: Number(viewportWidth) }
      : viewportSize();
    const nextPosition = nativeWindow
      ? { x: PANEL_MARGIN, y: PANEL_MARGIN }
      : clampPanelPosition(positionRef.current, nextViewport);
    positionRef.current = nextPosition;
    setViewport(nextViewport);
    setPosition(nextPosition);
    if (!nativeWindow) savePanelPosition(nextPosition);
  }, [dragging, nativeWindow, viewportHeight, viewportWidth]);

  useEffect(() => {
    if (nativeWindow) return;
    onGeometryChange?.();
  }, [nativeWindow, onGeometryChange, position.x, position.y, size.height, size.width]);

  const movePanelFromPoint = (drag: DragState, pointerX: number, pointerY: number) => {
    if (drag.startX === null || drag.startY === null) {
      drag.startX = pointerX;
      drag.startY = pointerY;
      return;
    }
    const next = clampPanelPosition({
      x: drag.originX + pointerX - drag.startX,
      y: drag.originY + pointerY - drag.startY,
    }, viewport);
    if (next.x === positionRef.current.x && next.y === positionRef.current.y) return;
    positionRef.current = next;
    if (panelRef.current) {
      panelRef.current.style.transform = `translate3d(${next.x - drag.originX}px, ${next.y - drag.originY}px, 0)`;
    }
    if (!drag.native) onGeometryChange?.();
  };

  const flushPanelPointer = (drag: DragState) => {
    if (drag.cursorFrame !== undefined) {
      window.cancelAnimationFrame(drag.cursorFrame);
      drag.cursorFrame = undefined;
    }
    const pending = drag.pendingPointer;
    drag.pendingPointer = undefined;
    if (pending) movePanelFromPoint(drag, pending.x, pending.y);
  };

  const schedulePanelFromPointer = (drag: DragState, pointerX: number, pointerY: number) => {
    drag.pendingPointer = { x: pointerX, y: pointerY };
    if (drag.cursorFrame !== undefined) return;
    drag.cursorFrame = window.requestAnimationFrame(() => {
      drag.cursorFrame = undefined;
      if (dragState.current !== drag) return;
      const pending = drag.pendingPointer;
      drag.pendingPointer = undefined;
      if (pending) movePanelFromPoint(drag, pending.x, pending.y);
    });
  };

  const finishActivePanelDrag = (notifyMain = true) => {
    const drag = dragState.current;
    if (!drag) return;
    flushPanelPointer(drag);
    try {
      if (drag.element.hasPointerCapture(drag.pointerId)) {
        drag.element.releasePointerCapture(drag.pointerId);
      }
    } catch {
      // The compact native window may have moved while capture was active.
    }
    drag.unsubscribeCursor?.();
    drag.unsubscribeEnd?.();
    drag.cleanupGlobal?.();
    dragState.current = null;
    setPosition({ ...positionRef.current });
    setDragging(false);
    savePanelPosition(positionRef.current);
    onGeometryChange?.();
    if (drag.native && notifyMain) {
      // The geometry request above queues the final transformed measurement.
      // Restore the compact native shape after that measurement, not before it.
      window.requestAnimationFrame(() => {
        if (!dragState.current) desktop?.endPetOverlayDrag?.();
      });
    }
  };

  useEffect(() => () => {
    const drag = dragState.current;
    if (!drag) return;
    flushPanelPointer(drag);
    drag.unsubscribeCursor?.();
    drag.unsubscribeEnd?.();
    drag.cleanupGlobal?.();
    savePanelPosition(positionRef.current);
    if (drag.native) desktop?.endPetOverlayDrag?.();
    dragState.current = null;
  }, []);

  const startDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      event.button !== 0
      || dragState.current
      || (event.target as Element).closest("button")
    ) return;
    let captured = false;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
      captured = true;
    } catch {
      // Native cursor polling can still finish a desktop drag without capture.
    }
    const nativeDrag = desktop?.beginPetOverlayDrag?.();
    if (nativeDrag === false || nativeDrag?.started === false) {
      try {
        if (captured) event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // The rejected native transition may already have released capture.
      }
      return;
    }
    const native = nativeDrag?.started === true;
    if (!native && !captured) return;
    const drag: DragState = {
      element: event.currentTarget,
      native,
      originX: positionRef.current.x,
      originY: positionRef.current.y,
      pointerId: event.pointerId,
      startX: native
        ? (Number.isFinite(nativeDrag?.screenX) ? nativeDrag.screenX : null)
        : event.screenX,
      startY: native
        ? (Number.isFinite(nativeDrag?.screenY) ? nativeDrag.screenY : null)
        : event.screenY,
    };
    dragState.current = drag;
    if (native && desktop?.onPetOverlayDragCursor) {
      drag.unsubscribeCursor = desktop.onPetOverlayDragCursor((point: {
        screenX?: number;
        screenY?: number;
      }) => {
        const activeDrag = dragState.current;
        const pointerX = Number(point?.screenX);
        const pointerY = Number(point?.screenY);
        if (activeDrag !== drag || !Number.isFinite(pointerX) || !Number.isFinite(pointerY)) return;
        schedulePanelFromPointer(drag, pointerX, pointerY);
      });
    }
    if (native && desktop?.onPetOverlayDragEnd) {
      drag.unsubscribeEnd = desktop.onPetOverlayDragEnd(() => {
        if (dragState.current === drag) finishActivePanelDrag(false);
      });
    }
    if (native) {
      const onWindowPointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId === drag.pointerId) finishActivePanelDrag();
      };
      const onWindowPointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== drag.pointerId) return;
        if ((moveEvent.buttons & 1) === 0) finishActivePanelDrag();
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
    setDragging(true);
  };

  const movePanel = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.native) schedulePanelFromPointer(drag, event.screenX, event.screenY);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    finishActivePanelDrag();
  };

  const handleLostPointerCapture = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragState.current;
    if (!drag || drag.native || drag.pointerId !== event.pointerId) return;
    finishActivePanelDrag();
  };

  const openContextMenu = (event: ReactMouseEvent<HTMLElement>) => {
    event.preventDefault();
    const selectedText = window.getSelection()?.toString().trim() ?? "";
    const messageText = (event.target as Element)
      .closest<HTMLElement>("[data-message-text]")
      ?.dataset.messageText
      ?.trim() ?? "";
    const panelRect = event.currentTarget.getBoundingClientRect();
    setContextMenu({
      copyValue: selectedText || messageText,
      x: Math.max(PANEL_MARGIN, Math.min(
        event.clientX - panelRect.left,
        size.width - 196 - PANEL_MARGIN
      )),
      y: Math.max(PANEL_MARGIN, Math.min(
        event.clientY - panelRect.top,
        size.height - 116 - PANEL_MARGIN
      )),
    });
  };

  const selectAllMessages = () => {
    selectContents(contentRef.current);
    setContextMenu(null);
  };

  return (
    <section
      aria-label={ui("Pet message history")}
      aria-modal="false"
      className="pointer-events-auto absolute z-[760] flex select-text flex-col overflow-hidden rounded-xl border border-[var(--border-2)] bg-[var(--surface)] text-[var(--text-1)] shadow-[0_20px_60px_rgba(0,0,0,0.34)]"
      data-pet-history-panel="true"
      onContextMenu={openContextMenu}
      ref={panelRef}
      role="dialog"
      style={{
        height: size.height,
        left: position.x,
        top: position.y,
        willChange: dragging ? "transform" : undefined,
        width: size.width,
      }}
    >
      <header
        className={cn(
          "flex shrink-0 cursor-move touch-none select-none items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3",
          nativeWindow && "pet-history-window-drag"
        )}
        onLostPointerCapture={nativeWindow ? undefined : handleLostPointerCapture}
        onPointerCancel={nativeWindow ? undefined : finishDrag}
        onPointerDown={nativeWindow ? undefined : startDrag}
        onPointerMove={nativeWindow ? undefined : movePanel}
        onPointerUp={nativeWindow ? undefined : finishDrag}
        title={ui("Drag")}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-[var(--accent)]">
            <MessageCircle className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-black">{ui("Pet messages")}</h2>
            <p className="text-[11px] font-semibold text-[var(--text-3)]">
              {ui(nativeWindow
                ? "Drag this header to detach and place it anywhere."
                : "You can change answers to earlier questions.")}
            </p>
          </div>
        </div>
        <button
          aria-label={ui("Close history")}
          className="pet-history-window-no-drag flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="pet-history-window-no-drag border-b border-[var(--border)] px-3 py-2.5">
        <label className="relative block">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-3)]" />
          <input
            aria-label={ui("Search pet messages")}
            className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] pl-9 pr-3 text-xs font-bold text-[var(--text-1)] outline-none placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={ui("Search what the pet said…")}
            type="search"
            value={query}
          />
        </label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {([
            ["all", "All"],
            ["questions", "Questions"],
            ["unanswered", "Unanswered"],
            ["missed", "Missed"],
          ] as const).map(([key, label]) => (
            <button
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-black transition-colors",
                filter === key
                  ? "bg-[var(--accent)] text-[var(--accent-text)]"
                  : "bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
              )}
              key={key}
              onClick={() => setFilter(key)}
              type="button"
            >
              {ui(label)} {counts[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3" ref={contentRef}>
        {messages.length > 0 ? (
          <div className="grid gap-2.5">
            {messages.map((message) => (
              <article
                className={cn(
                  "rounded-xl border p-3",
                  message.question
                    ? "border-[var(--accent)]/25 bg-[var(--accent-dim)]/55"
                    : "border-[var(--border)] bg-[var(--surface-2)]"
                )}
                data-message-text={message.text}
                key={message.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold leading-5 text-[var(--text-1)]">{message.text}</p>
                  <div className="flex shrink-0 items-center gap-1">
                    <time
                      className="flex items-center gap-1 text-[9px] font-bold text-[var(--text-3)]"
                      dateTime={new Date(message.createdAt).toISOString()}
                    >
                      <Clock3 className="h-2.5 w-2.5" />
                      {new Date(message.createdAt).toLocaleTimeString(uiLocale(), {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                    <button
                      aria-label={ui("Dismiss message")}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-3)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                      onClick={() => onDismiss(message.id)}
                      title={ui("Dismiss message")}
                      type="button"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {message.question && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {(["yes", "no"] as CodexPetAnswer[]).map((answer) => {
                      const selected = message.answer === answer;
                      return (
                        <button
                          aria-pressed={selected}
                          className={cn(
                            "flex h-9 items-center justify-center gap-1.5 rounded-lg border text-xs font-black transition-colors",
                            selected
                              ? answer === "yes"
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-rose-500 bg-rose-500 text-white"
                              : "border-[var(--border-2)] bg-[var(--surface)] text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--text-1)]"
                          )}
                          key={answer}
                          onClick={() => onAnswer(message.id, answer, false)}
                          type="button"
                        >
                          {selected && <Check className="h-3.5 w-3.5" />}
                          {ui(answer === "yes" ? "Yes" : "No")}
                        </button>
                      );
                    })}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-32 flex-col items-center justify-center px-6 text-center">
            <MessageCircle className="h-7 w-7 text-[var(--text-3)]" />
            {/* "Nothing here yet" and "nothing matched your filter" are different
                situations, and saying the first when the second is true reads as
                the panel being broken. */}
            <p className="mt-3 text-sm font-black text-[var(--text-1)]">
              {ui(allMessages.length === 0 ? "No pet messages yet" : "Nothing matches that")}
            </p>
            <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
              {ui(allMessages.length === 0
                ? "Tips and questions will appear here after the mascot speaks."
                : "Try another filter, or clear the search.")}
            </p>
          </div>
        )}
      </div>

      {contextMenu && (
        <div
          className="absolute z-[790] w-48 select-none rounded-lg border border-[var(--border-2)] bg-[var(--surface)] p-1.5 text-xs font-bold text-[var(--text-1)] shadow-[0_14px_38px_rgba(0,0,0,0.32)]"
          data-pet-interactive="true"
          onContextMenu={(event) => event.preventDefault()}
          onPointerDown={(event) => event.stopPropagation()}
          role="menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            className="flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-left transition-colors hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!contextMenu.copyValue}
            onClick={() => {
              void writeClipboard(contextMenu.copyValue);
              setContextMenu(null);
            }}
            role="menuitem"
            type="button"
          >
            <Copy className="h-3.5 w-3.5" />
            {ui("Copy")}
            <span className="ml-auto text-[10px] text-[var(--text-3)]">Ctrl+C</span>
          </button>
          <button
            className="flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-left transition-colors hover:bg-[var(--surface-2)]"
            onClick={selectAllMessages}
            role="menuitem"
            type="button"
          >
            <TextSelect className="h-3.5 w-3.5" />
            {ui("Select all")}
            <span className="ml-auto text-[10px] text-[var(--text-3)]">Ctrl+A</span>
          </button>
        </div>
      )}
    </section>
  );
}
