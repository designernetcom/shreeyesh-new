# Photography brief — homepage

Every image slot on the homepage is already built. Each one is a `<figure class="media">`
containing a commented-out `<img>`. Drop the file into this folder, uncomment the tag,
and it covers the gradient plate automatically — no CSS changes needed.

Until then the plates render as a designed studio-gradient with fine grain, so the page
is presentable for review without photography.

## Shot list

| File | Slot | Ratio | Export at | Subject |
|---|---|---|---|---|
| `hero-nicu.jpg` | Hero, right half | ~4:3 (fills) | 2400 × 1800 | Humming Bee at a NICU bedside. Clinician in soft focus behind the device. Low-key lighting, warm practicals, plenty of clean space on the left where the plate meets the copy. |
| `care-respiratory.jpg` | Care card 1 | 4:5 | 1200 × 1500 | Humming Bee, studio cut-out on white. |
| `care-thermal.jpg` | Care card 2 | 4:5 | 1200 × 1500 | Care Plus radiant warmer, studio. |
| `care-jaundice.jpg` | Care card 3 | 4:5 | 1200 × 1500 | Bilicare Focus phototherapy unit, studio. |
| `care-milk.jpg` | Care card 4 | 4:5 | 1200 × 1500 | Kimie 3000 ml pasteuriser, studio. |
| `humming-bee.jpg` | Feature band | 4:3.1 | 1800 × 1400 | Humming Bee, three-quarter hero view, studio lighting, shallow depth of field. |
| `service-engineer.jpg` | Partnership 1 | 16:10 | 1600 × 1000 | Service engineer at a NICU installation. |
| `training.jpg` | Partnership 2 | 16:10 | 1600 × 1000 | Nurse training session, hands-on with a device. |
| `facility.jpg` | Partnership 3 | 16:10 | 1600 × 1000 | Pune manufacturing facility, wide, clean assembly floor. |
| `og-cover.jpg` | Social share card | 1.91:1 | 1200 × 630 | Hero frame, cropped, with clear space. |

## Treatment

Keep it consistent or the page loses its calm:

- **Product shots** — pure white or near-white seamless, single soft key from upper left,
  no hard shadows, no reflective floor. They sit on white cards, so the background must
  read as continuous with the card.
- **Environment shots** — desaturated slightly, cool-neutral white balance. Avoid strong
  colour casts that fight the green.
- **People** — real clinical staff where possible, correct PPE, no stock-photo eye contact
  with the camera.
- **No newborn faces** without written consent. Hands, equipment and context carry the
  story without the consent burden.

## Export

- JPEG quality 78–82, or WebP at 80. Target **under 300 KB** for card images and
  **under 500 KB** for the hero.
- Strip EXIF.
- Keep the `width`/`height` attributes on each `<img>` — they reserve layout space and
  prevent the page from shifting as images load.

## Adding a responsive source set

The slots are plain `<img>` for simplicity. If you add a build step, swap to:

```html
<img src="assets/img/hero-nicu.jpg"
     srcset="assets/img/hero-nicu-900.jpg 900w,
             assets/img/hero-nicu-1600.jpg 1600w,
             assets/img/hero-nicu-2400.jpg 2400w"
     sizes="(max-width: 1180px) 100vw, 53vw"
     alt="A Humming Bee bubble CPAP unit in use at a NICU bedside"
     width="2400" height="1800">
```

Add `loading="lazy" decoding="async"` to every image **except** the hero — that one
should stay eager so it is not deferred behind the fold calculation.

## Alt text

Alt text is already written on each commented-out tag. It describes what the image shows
in context, not the filename. If you change the subject of a shot, change the alt with it.
Decorative-only images would take `alt=""` — none of these are decorative.
