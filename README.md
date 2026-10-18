# PIP.OS — Pip's Dream Workshop

A playful, handmade portfolio for **Pip, the Skull Baby and Junior Dream Engineer**, built for haX.baby's **Baby's First Website** challenge (Track 1). PIP.OS is designed as a tiny world to explore rather than a conventional portfolio: visitors meet Pip, read a short origin story, play with a music box and nightlights, follow a dream delivery, and try a tiny star-catching game.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ recommended for current Vite releases, and npm.

### Windows / PowerShell

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL Vite prints in the terminal.

### Production checks

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd run preview
```

The build and lint commands should both pass before submission. The project ZIP was updated in an environment where npm dependency installation timed out; therefore a successful build, lint run, and Lighthouse audit have **not** been verified yet. Run the checks locally and fix any errors before submitting.

## Experience map

- **Welcome / character intro:** Pip is introduced as the Skull Baby and Junior Dream Engineer, using the provided artwork as a scrapbook-style character illustration.
- **Character profile:** species, personality, favourite hour, and special skill.
- **Origin story:** three short, scroll-revealed scenes explain how Pip found a lost dream, invented a tiny lullaby, and made the first delivery.
- **Visitor memory (Tier 3-style feature):** optionally saves a nickname in this browser and shows a returning-visitor greeting. The nickname can be cleared.
- **Lullaby Lab (Tier 2):** synthesized browser audio, five playable notes, play/pause, and a global sound mute.
- **Nightlight Collection:** four colour choices, an on/off switch, and a live status message.
- **Dream Delivery Route (Tier 2):** hand-drawn SVG path reveals during scrolling; the parcel follows the route as progress changes.
- **Pocket Toy:** a 20-second mini-game. Catch five stars to win the Star Collector message.
- **Day/night mood:** the Dream Mode toggle changes the atmosphere and colour treatment.
- **Chaos Mode:** an opt-in early-web styling mode with more playful card angles and visual accents.
- **Easter egg:** the small star near Pip reveals a hidden message.
- **Sparkle cursor and click sounds:** lightweight pointer sparkles and short synthesized UI sounds; the global sound control mutes audio.
- **Responsive and reduced motion:** responsive layouts, keyboard focus states, and reduced-motion accommodations are included in the code.

## Tech stack

- React 19
- Vite
- GSAP + ScrollTrigger
- CSS animations and responsive layout
- Web Audio API (no external audio files)
- SVG route animation
- `localStorage` for optional browser-local preferences

No backend, login, external audio service, or new runtime dependency is required for the features above.

## Privacy notes

The optional nickname, selected nightlight colour, and day/night preference are stored in the visitor's own browser using `localStorage`. They are not synced across devices and are not sent to a server. Visitors can clear the saved nickname using the button in the memory panel or clear site data in their browser.

## Customization

- Main React content and interactions: `src/App.jsx`
- Styling and responsive breakpoints: `src/App.css`
- Base CSS: `src/index.css`
- Page title and social metadata: `index.html`
- Pip artwork: `public/assets/pip.jpg`

## Submission checklist

- [ ] `npm.cmd install` completes without errors.
- [ ] `npm.cmd run build` passes.
- [ ] `npm.cmd run lint` passes.
- [ ] Lullaby notes, play/pause, and global mute work in a browser.
- [ ] Nightlight swatches and power switch work.
- [ ] Day/night mode and Chaos Mode both toggle and remain readable.
- [ ] Visitor memory can be saved and cleared.
- [ ] Easter egg works with mouse and keyboard.
- [ ] Dream route draws on scroll and parcel position changes.
- [ ] Star-catching game can be won and restarted; timeout works.
- [ ] Test at phone, tablet, and desktop widths; no horizontal overflow.
- [ ] Test with reduced motion enabled and sound muted.
- [ ] Run Lighthouse and record actual results; do not claim a score that has not been measured.
- [ ] Deploy the site and test the deployed URL in a fresh browser session.

See [`HACKATHON_EVALUATION.md`](./HACKATHON_EVALUATION.md) for an honest rubric-based review and remaining risks.

## Final polish update

This final iteration adds three more portfolio exhibits to complete Pip's six-project showcase:

- **Bedtime Storybook:** three short pages with previous/next controls.
- **Rattle & Block Toys:** a small block-stacking interaction with a five-block goal and reset.
- **Pip's Growth Chart:** a playful visual skills chart.

The hero CTA now wakes Pip with a short 2D motion cue and scrolls into the story. These additions use React state and CSS rather than adding new dependencies or 3D rendering.

### Final verification status

Run these checks in your local environment before submission:

```powershell
npm.cmd install
npm.cmd run build
npm.cmd run lint
npm.cmd run dev
```

Dependency installation did not complete in the editing environment, so a production build, lint run, browser QA, and Lighthouse score have **not** been verified here. Do not treat the presence of a feature in this README as proof of successful browser testing.
