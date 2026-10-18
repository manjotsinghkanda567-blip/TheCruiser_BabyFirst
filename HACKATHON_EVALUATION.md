# PIP.OS — Final Hackathon Evaluation

## Project concept

PIP.OS is a playful, handmade 2D portfolio for Pip, the Skull Baby and Junior Dream Engineer at Midnight Nursery. The design uses scrapbook-style panels, gentle animations, browser-generated sound, and small interactions instead of 3D/WebGL.

## Requirement coverage (source review, not runtime verification)

- Character introduction: present; profile identifies Pip as the Skull Baby and Junior Dream Engineer.
- Showcase projects: six are represented — Lullaby Lab, Nightlight Collection, Dream Delivery Routes, Bedtime Storybook, Rattle & Block Toys, and Pip's Growth Chart.
- Story/origin: three short scroll-story chapters, plus a wake-up CTA.
- Interaction: pointer reaction, click sound with mute, music-box notes and playback, nightlight controls, star-catching game, visitor nickname memory, and hidden Easter egg.
- Day/night mode: present in source.
- Responsive intent: responsive CSS breakpoints are present; device testing is still required.
- Tier 2: Web Audio music box and scroll-driven SVG dream route are present in source.
- Tier 3: browser-local visitor memory is present; this is not a 3D/WebGL character or shared backend feature.
- Bonus ideas: Chaos Mode, sparkle cursor, and click sounds are present in source.

## Rubric estimate

No official score can be predicted from source alone. A provisional estimate based on the intended design is:

| Category | Maximum | Estimated range | Why it is not a confirmed score |
|---|---:|---:|---|
| Functionality & polish | 35 | 20–29 | Build, browser interactions, and errors not verified in this environment. |
| Early-web soul | 30 | 25–29 | Strong scrapbook/early-web direction; subjective judging varies. |
| Creativity & surprises | 20 | 15–18 | Multiple original interactions, but judge experience must be tested. |
| Clean craft | 15 | 8–12 | Responsive CSS and accessibility intent exist; lint, mobile and Lighthouse are unverified. |
| **Total** | **100** | **68–88** | Broad estimate only; not an official or validated score. |

## Main risks before submission

1. `npm install` did not finish in the editing environment. Run a clean local install and production build.
2. Run `npm.cmd run lint` and fix all errors/warnings that affect maintainability.
3. Test every control in a real browser, including mute while the lullaby is playing, restarting the mini-game, storybook navigation, block reset, local memory clearing, and theme persistence.
4. Test at narrow mobile widths and on a touch device. Cursor sparkle should not interfere with usability.
5. Run Lighthouse on the deployed build; record actual results rather than claiming a score in advance.
6. Check the official character assets/canon and ensure the displayed character artwork matches the required Pip design.

## Recommended judge demo (60–90 seconds)

1. Press **Wake Pip up** and introduce Pip as Junior Dream Engineer.
2. Play a few notes in Lullaby Lab, then demonstrate the mute control.
3. Change the nightlight colour and toggle day/night mode.
4. Scroll through the dream route and show the moving parcel.
5. Turn to the storybook, stack a few blocks, and point out the growth chart.
6. Catch five stars and reveal the Easter egg.

## Honest submission status

This is a source-level feature review. The project ZIP was integrity-checked before this final iteration; after these edits, re-create and test the ZIP locally. Build, lint, browser QA, deployment, and Lighthouse are **not verified** here. Do not claim those checks passed until you have run them successfully.
