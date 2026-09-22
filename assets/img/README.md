# Photography brief — homepage

Every image slot on the homepage is already built. Each one is a `<figure>` containing a
commented-out `<img>`. Drop the file into this folder, uncomment the tag, and the photo
takes over the slot — no CSS changes needed.

Until then, slots behave in one of two ways:

- **Product plates** (`.plate` — care areas, Humming Bee) show a grid-paper panel with the
  product name set large, so the page is presentable without photography. Adding a plain
  `<img>` covers the plate and hides its caption.
- **Studio shots** (`<img class="plate__shot">` inside a plate) are for product photos on a
  pure-white ground. The image is contained rather than cropped, and `mix-blend-mode:
  multiply` drops the white out so the product stands on the plate's tint. The caption
  stays, with the index read-out above and the name below. The grid is switched off behind a
  shot, because it would print through the product's own whites. The four care areas use
  this.
- **Optional slots** (`.media--optional` — partnership) stay collapsed and take no space.
  They appear only once an `<img>` is inside.

The hero pairs the headline with a Humming Bee cut-out standing on the live trace. The AMTZ
signing photograph (`1.jpeg`) is used as the lead news story, which is what it depicts.

## Hero cut-out

`humming-bee-cutout.webp` (with `humming-bee-cutout.png` as the fallback) is a transparent
cut-out lifted from `shreyash-banner.jpg`: the navy ground was keyed out and the photo's own
floor shadow kept as soft black, so it sits on any light ground. It is only 353 × 830, the
size the machine appears in the banner, so it is slightly soft on high-density screens.

To replace it with a proper studio cut-out, export a transparent PNG/WebP of the same
three-quarter view at about 700 × 1650, keep the tight crop (casters at the bottom edge,
shadow included), and update `width`/`height` and the `aspect-ratio` on `.hero-device`.
It sits on the hero's grid-paper field, centred and standing on the trace, so the crop
must end at the casters.

## Humming Bee feature close-up

`humming-bee-panel.webp` is the control head keyed off its white studio ground, so it sits
on the dark plate. The source photo is cut straight across the bottom and at the gooseneck,
so the image keeps those cuts on its bottom and left edges and `.feature-device` anchors it
to the plate's bottom-left corner — both cuts land on the frame. A replacement needs the
same framing, or the anchor changes. The pins (`--x`/`--y` on each `.pin`) mark the
amplitude setting knob, the delivered CPAP / frequency / ΔP read-outs and the FiO₂
blender; nudge them if the photo changes.

## Shot list

| File | Slot | Ratio | Export at | Subject |
|---|---|---|---|---|
| `logo-web.webp` | Header and footer | 322:150 | 3× the 44–48 px display height | The logo, trimmed and resized from `logo.png` (2111 × 1026, 687 KB); `.png` is the fallback. |
| `humming-bee-cutout.webp` | Hero plate | 353:830 | 700 × 1650 | Humming Bee, transparent cut-out, three-quarter view (in place, from the banner). |
| `care-respiratory.jpg` | Care area 1 | Any (see note) | ~800 px tall min. | Humming Bee on pure white (in place, 330 × 756, from `HummingBEE_1.jpg`). |
| `care-thermal.jpg` | Care area 2 | Any (see note) | ~800 px tall min. | Care Plus radiant warmer on pure white (in place, 490 × 784, from the Care Plus product page). |
| `care-jaundice.jpg` | Care area 3 | Any (see note) | ~800 px tall min. | Bilicare Focus with the phototherapy light on (in place, 514 × 800, from the Bilicare Focus product page). |
| `care-milk.jpg` | Care area 4 | Any (see note) | ~800 px tall min. | Kimie 3000 ml pasteuriser on pure white (in place, 502 × 796, from `kimie-main1.jpg`). |
| `humming-bee-panel.webp` | Humming Bee feature | 1132:690 | ~2000 px wide | Control-panel close-up, transparent cut-out (in place, keyed from `HummingBEE_2.jpg` on the product page; `.png` is the fallback). |
| `service-engineer.jpg` | Partnership 1 | 16:10 | 1600 × 1000 | Service engineer at a NICU installation. |
| `training.jpg` | Partnership 2 | 16:10 | 1600 × 1000 | Nurse training session, hands-on with a device. |
| `facility.jpg` | Partnership 3 | 16:10 | 1600 × 1000 | Pune manufacturing facility, wide, clean assembly floor. |
| `1.jpeg` | Lead news story | 3:2 | 1600 × 1066 | AMTZ partnership signing (in place). |
| `og-cover.jpg` | Social share card | 1.91:1 | 1200 × 630 | Product or clinical frame, cropped, with clear space. |

**Care area note.** On desktop the four care photos share one stage beside the list, and
the stage runs the full height of the list — roughly 3:5, a little taller or shorter
depending on screen width. They are studio shots, so they are fitted whole, never cropped:
crop each file tight to the product (a few % of margin), keep the ground pure white
(RGB 255 — anything greyer shows as a box), and the product will stand on the stage's
baseline at the largest size that fits. Below 1180px each photo appears in-line above its
row, at 16:10 on tablets and square on phones, with the name dropped because the row
below carries it.

The files were made by trimming the white margins off the 1400 × 800 product-page images
and lifting near-white JPEG noise to pure white. The other photos in this folder
(`kimie-main.jpg` is the Kimie 500 ml; `neonantal-care-unit*.jpg` is the SW 21 neonatal
ventilator) are not used yet.

## Treatment

Keep it consistent or the page loses its calm:

- **Product shots** — pure white or near-white seamless, single soft key from upper left,
  no hard shadows, no reflective floor. Keep the ground near-white so products read as
  one family on the stage.
- **Environment shots** — desaturated slightly, cool-neutral white balance. Avoid strong
  colour casts that fight the green.
- **People** — real clinical staff where possible, correct PPE, no stock-photo eye contact
  with the camera.
- **No newborn faces** without written consent. Hands, equipment and context carry the
  story without the consent burden.

## Export

- JPEG quality 78–82, or WebP at 80. Target **under 300 KB** per image.
- Strip EXIF.
- Keep the `width`/`height` attributes on each `<img>` — they reserve layout space and
  prevent the page from shifting as images load.

## Adding a responsive source set

The slots are plain `<img>` for simplicity. If you add a build step, swap to:

```html
<img src="assets/img/humming-bee.jpg"
     srcset="assets/img/humming-bee-800.jpg 800w,
             assets/img/humming-bee-1200.jpg 1200w"
     sizes="(max-width: 1000px) 100vw, 40vw"
     alt="Humming Bee bubble CPAP, three-quarter view"
     width="1200" height="1500"
     loading="lazy" decoding="async">
```

The hero cut-out is the one image above the fold, so it loads eagerly with
`fetchpriority="high"`. Every other slot sits below the fold and keeps
`loading="lazy" decoding="async"`.

## Alt text

Alt text is already written on each commented-out tag. It describes what the image shows
in context, not the filename. If you change the subject of a shot, change the alt with it.
Decorative-only images would take `alt=""` — none of these are decorative.
