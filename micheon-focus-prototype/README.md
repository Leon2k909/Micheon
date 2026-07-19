# Micheon Focus Lesson Prototype

A cleaner revision of the Micheon sentence-practice screen.

## What changed

- Removed the decorative environment and replaced it with a restrained dark background.
- Kept Micheon's violet gradient as an accent rather than a full-screen effect.
- Rebuilt the sentence as one continuous, clickable line instead of oversized word cards.
- Added automatic sentence fitting with `ResizeObserver`, so the full sentence remains inside the board on desktop widths.
- Preserved large clickable stages 1–8 and the yellow primary action.
- Increased supporting text and input sizes for readability.

## Files

- `index.html`, `focus.css`, `focus.js`: standalone interactive prototype.
- `src/MicheonFocusLesson.tsx`, `src/MicheonFocusLesson.css`: React/TypeScript version.
