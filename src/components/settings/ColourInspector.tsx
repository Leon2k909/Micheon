import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ui } from "@/lib/i18n";
import {
  PAINTABLE_PARTS,
  partsPainting,
  toHexString,
  type PaintablePart,
  type PartMatch,
} from "@/lib/customColours";

/**
 * Point at a part of the app to recolour it.
 *
 * Leon: "you get like a mouse where it highlights what u wanna change". So
 * this is an inspector, not a list: the pointer moves, the thing under it is
 * outlined and named, and clicking it picks it.
 *
 * Naming the part matters as much as outlining it. An outline alone says
 * "this rectangle"; the label says "Card background", which is the promise
 * being made — every card in the app, not this one rectangle.
 */

interface Highlight {
  top: number;
  left: number;
  width: number;
  height: number;
  matches: PartMatch[];
}

export function ColourInspector({
  onCancel,
  onPick,
}: {
  onCancel: () => void;
  onPick: (part: PaintablePart, currentHex: string | null) => void;
}) {
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [choosing, setChoosing] = useState<Highlight | null>(null);
  const frame = useRef<number | null>(null);
  const surface = useRef<HTMLDivElement | null>(null);

  const inspect = useCallback((x: number, y: number) => {
    const layer = surface.current;
    // Our own capture layer is under the pointer, so it has to step aside for
    // the hit test or every reading would be the overlay itself.
    const previous = layer?.style.pointerEvents ?? "";
    if (layer) layer.style.pointerEvents = "none";
    const element = document.elementFromPoint(x, y);
    if (layer) layer.style.pointerEvents = previous;
    if (!element || element === document.body || element === document.documentElement) {
      setHighlight(null);
      return;
    }
    const matches = partsPainting(element);
    if (matches.length === 0) {
      setHighlight(null);
      return;
    }
    const box = element.getBoundingClientRect();
    setHighlight({
      top: box.top,
      left: box.left,
      width: box.width,
      height: box.height,
      matches,
    });
  }, []);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (choosing) return;
      if (frame.current != null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => inspect(event.clientX, event.clientY));
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (choosing) setChoosing(null);
        else onCancel();
      }
    };
    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("keydown", onKey, true);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [choosing, inspect, onCancel]);

  const take = (match: PartMatch) => {
    onPick(match.part, toHexString(match.current));
    setChoosing(null);
  };

  const showing = choosing ?? highlight;

  return createPortal(
    <div className="colour-inspector" role="presentation">
      <div
        className="colour-inspector-capture"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (choosing) return;
          if (!highlight) return;
          // One part under the pointer is the common case and clicking should
          // just take it. Several — a caption inside a card — is a real
          // choice, so it is asked rather than guessed.
          if (highlight.matches.length === 1) take(highlight.matches[0]);
          else setChoosing(highlight);
        }}
        ref={surface}
      />

      {showing && (
        <div
          aria-hidden="true"
          className="colour-inspector-outline"
          style={{
            top: showing.top,
            left: showing.left,
            width: showing.width,
            height: showing.height,
          }}
        />
      )}

      {showing && !choosing && (
        <div
          className="colour-inspector-label"
          style={{
            top: showing.top > 44 ? showing.top - 38 : showing.top + showing.height + 8,
            left: Math.max(8, Math.min(showing.left, window.innerWidth - 320)),
          }}
        >
          <span className="colour-inspector-name">{ui(showing.matches[0].part.name)}</span>
          {showing.matches.length > 1 && (
            <span className="colour-inspector-more">
              {ui("and {n} more — click to choose").replace("{n}", String(showing.matches.length - 1))}
            </span>
          )}
        </div>
      )}

      {choosing && (
        <div
          className="colour-inspector-choice"
          style={{
            top: Math.min(choosing.top + choosing.height + 10, window.innerHeight - 240),
            left: Math.max(8, Math.min(choosing.left, window.innerWidth - 320)),
          }}
        >
          <p className="colour-inspector-choice-title">{ui("Which part?")}</p>
          {choosing.matches.map((match) => (
            <button
              className="colour-inspector-choice-row"
              key={match.part.token}
              onClick={() => take(match)}
              type="button"
            >
              <span
                aria-hidden="true"
                className="colour-inspector-chip"
                style={{ background: match.current }}
              />
              <span>
                <span className="colour-inspector-choice-name">{ui(match.part.name)}</span>
                <span className="colour-inspector-choice-note">{ui(match.part.description)}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="colour-inspector-hint" role="status">
        <span>{ui("Point at any part of the app, then click it.")}</span>
        <button onClick={onCancel} type="button">{ui("Done")}</button>
      </div>
    </div>,
    document.body
  );
}

/** Everything the picker can reach, for the list beside it. */
export const INSPECTABLE_PARTS = PAINTABLE_PARTS;
