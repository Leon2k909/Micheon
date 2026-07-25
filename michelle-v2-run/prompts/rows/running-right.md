Create one horizontal animation strip for Codex pet `michelle`, state `running-right`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 8 full-body frames in one left-to-right row on flat pure cyan #00FFFF. Treat the row as 8 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Upgrade the existing Michelle pet without redesigning her: preserve the exact same stylized young woman, long dark brown side-parted hair, large brown eyes, warm medium complexion, mauve-pink hoodie with white sleeve stripes and drawstrings, fitted black pants, pink-and-white high-top sneakers, proportions, palette, clothing details, and polished 3D avatar identity. Keep smooth antialiased non-pixel rendering; avoid pixel art, blockiness, jagged edges, dithering, or low-resolution texture.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact full-body mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `3d-toy`: Stylized 3D toy mascot with smooth rounded forms, simple materials, clear silhouette, and no photoreal complexity. User style notes: Exact identity-preserving continuation of the existing smooth polished 3D avatar. Do not redesign or reinterpret. Render cleanly at high resolution with smooth curves, fine hair strands, soft fabric shading, crisp facial features, and clean antialiased edges; no pixel-art aesthetic..
Animation continuity: keep apparent pet scale and baseline stable within the row unless the state itself intentionally changes vertical position, such as `jumping`. Move the pose within the slot instead of redrawing the pet larger or smaller frame to frame.

State action: Dragging-right loop: show directional movement to the right through body and limb poses only.

State requirements:
- Show directional drag movement to the right through body, limb, and prop movement only.
- The row must unmistakably face and travel right.
- The movement cadence must alternate visibly across the 8 frames instead of repeating one nearly static stride.
- Do not draw speed lines, dust clouds, floor shadows, motion trails, or detached motion effects.

Clean extraction: crisp opaque edges, safe padding, no scenery, text, guide marks, checkerboard, shadows, glows, motion blur, speed lines, dust, detached effects, stray pixels, or chroma-key colors inside the pet.
