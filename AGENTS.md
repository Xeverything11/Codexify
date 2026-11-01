# Codexify

An open-source design system based on Wikimedia Codex.

## Target browsers
```
last 2 major versions
not dead
unreleased versions
Chrome >= 142
Edge >= 142
Firefox >= 115
iOS >= 17.6
Safari >= 17.6
not and_uc > 0
not and_qq > 0
not kaios > 0
not op_mini all
```

## Project structure

- `codexify.css` is the shared stylesheet and source of truth for design tokens, resets, components, utilities, typography, and icons.
- Root-level HTML files are documentation pages and examples. Keep them consistent with the classes and behavior implemented in `codexify.css`.
- `icons/` contains the SVG assets referenced by the stylesheet; `fonts/` contains the local font files.
- This project is under development. Prefer extending its existing patterns over introducing a new framework, build system, or dependency.

## CSS and design-system conventions

- Reuse custom properties defined in `:root` for colors, semantic states, typography, and breakpoints. Prefer semantic color tokens for component states over hard-coded colors.
- Preserve the existing palette scales and OKLCH color definitions when adding or adjusting palette tokens.
- Follow the established class naming and composition patterns. Extend existing component classes and utilities before creating overlapping alternatives.
- Use the existing breakpoint custom properties for responsive behavior, and check that changes work at mobile, tablet, and desktop widths.
- Keep shared styles in `codexify.css`; avoid page-specific overrides that silently change the design system for other examples.
- Keep font and icon URLs relative to the stylesheet location so the root-level `fonts/` and `icons/` assets continue to resolve.

## Icons
For icons, use `<i class="icon icon-[name]"></i>` to generate the icon with color currentColor.

- Use an existing SVG from `icons/` whenever possible. Its corresponding `.icon-*` class in `codexify.css` determines the asset mapping and uses `currentColor` for the icon color.
- When adding an icon, keep the SVG filename, CSS mask URL, and kebab-case class name in sync. Preserve the upstream source and license attribution for third-party artwork.

### Available icon classes

Use the class names below with the shared `icon` class, for example `<i class="icon icon-add"></i>`. This list mirrors the icon selectors in `codexify.css`.

```text
.icon-add .icon-alert .icon-align-center .icon-align-left .icon-align-right .icon-appearance .icon-arrow-down .icon-arrow-next .icon-arrow-previous .icon-arrow-up .icon-article .icon-article-add .icon-article-check .icon-article-disambiguation .icon-article-not-found .icon-article-redirect .icon-article-search .icon-articles .icon-articles-search-ltr .icon-articles-search-rtl .icon-asterisk .icon-attachment .icon-bell .icon-bell-outline .icon-bigger .icon-block .icon-block-outline .icon-bold-a .icon-bold-arab-ain .icon-bold-arab-dad .icon-bold-arab-jeem .icon-bold-armn-to .icon-bold-b .icon-bold-cyrl-be .icon-bold-cyrl-palochka .icon-bold-cyrl-te .icon-bold-cyrl-zhe .icon-bold-f .icon-bold-g .icon-bold-geor-man .icon-bold-l .icon-bold-n .icon-bold-q .icon-bold-v .icon-book .icon-bookmark .icon-bookmark-list .icon-bookmark-outline .icon-bright .icon-browser .icon-calendar .icon-camera .icon-cancel .icon-chart .icon-chart-bar .icon-chart-line .icon-chart-pie .icon-chart-scatter .icon-check .icon-check-all .icon-clear .icon-clock .icon-close .icon-code .icon-collapse .icon-configure .icon-copy .icon-cut
.icon-database .icon-die .icon-diffs-ltr .icon-diffs-rtl .icon-double-chevron-end .icon-double-chevron-start .icon-down-triangle .icon-download .icon-draggable-horizontal .icon-draggable-vertical .icon-draggable-xy .icon-edit .icon-edit-lock .icon-edit-undo-ltr .icon-edit-undo-rtl .icon-ellipsis .icon-error .icon-exit-fullscreen .icon-expand .icon-eye .icon-eye-closed .icon-feedback .icon-filter .icon-flag .icon-folder-placeholder .icon-fullscreen .icon-function .icon-function-argument .icon-funnel .icon-funnel-match .icon-globe .icon-half-bright .icon-half-star .icon-hand .icon-heart .icon-heart-outline .icon-help .icon-help-notice .icon-help-notice-filled .icon-hieroglyph .icon-highlight .icon-history .icon-home .icon-image .icon-image-add-ltr .icon-image-add-rtl .icon-image-broken .icon-image-gallery-ltr .icon-image-gallery-rtl .icon-image-layout-basic .icon-image-layout-frame .icon-image-layout-frameless .icon-image-layout-thumbnail .icon-image-lock-ltr .icon-image-lock-rtl
.icon-indent .icon-info .icon-info-filled .icon-instance .icon-italic-a .icon-italic-arab-keheh-jeem .icon-italic-arab-meem .icon-italic-arab-teh .icon-italic-armn-sha .icon-italic-c .icon-italic-d .icon-italic-e .icon-italic-geor-kan .icon-italic-i .icon-italic-k .icon-italic-s .icon-journal .icon-key .icon-keyboard .icon-lab-flask .icon-language .icon-larger-text .icon-layout .icon-level-none .icon-level-one .icon-level-three .icon-level-two .icon-lightbulb .icon-lightbulb-dashed .icon-lightbulb-outline .icon-link .icon-link-external .icon-link-secure .icon-list-bullet .icon-list-numbered-ltr .icon-list-numbered-rtl .icon-literal .icon-live .icon-lock .icon-log-in .icon-log-out .icon-logo-cc .icon-logo-codex .icon-logo-media-wiki .icon-logo-meta-wiki .icon-logo-wikibooks .icon-logo-wikidata .icon-logo-wikifunctions .icon-logo-wikimedia-commons .icon-logo-wikimedia-discovery .icon-logo-wikimedia .icon-logo-wikinews .icon-logo-wikipedia .icon-logo-wikiquote .icon-logo-wikisource .icon-logo-wikispecies .icon-logo-wikiversity .icon-logo-wikivoyage .icon-logo-wiktionary
.icon-magic-wand .icon-map .icon-map-pin .icon-map-pin-add .icon-map-trail .icon-markup .icon-mathematics .icon-mathematics-display-block .icon-mathematics-display-default .icon-mathematics-display-inline .icon-menu .icon-merge .icon-message .icon-microphone .icon-moon .icon-move .icon-move-first .icon-move-last .icon-musical-score .icon-network .icon-network-off .icon-new-window .icon-newline .icon-newspaper .icon-next .icon-no-wikitext .icon-not-bright .icon-notice .icon-ocr .icon-ongoing-conversation .icon-outdent .icon-outline .icon-page-settings .icon-palette .icon-paste .icon-pause .icon-picture-in-picture .icon-play .icon-power .icon-previous .icon-printer .icon-push-pin .icon-puzzle .icon-qr-code .icon-quotes .icon-recent-changes-ltr .icon-recent-changes-rtl .icon-redo .icon-reference .icon-reference-existing .icon-references .icon-reload .icon-restart .icon-restore .icon-robot .icon-rotate
.icon-sandbox .icon-search .icon-search-case-sensitive .icon-search-diacritics .icon-search-regular-expression .icon-settings .icon-share .icon-share-android .icon-share-ios .icon-signature .icon-smaller .icon-smaller-text .icon-sort-vertical .icon-special-character .icon-special-pages .icon-speech-bubble .icon-speech-bubble-add .icon-speech-bubble-alert .icon-speech-bubbles .icon-star .icon-sticker .icon-stop .icon-strikethrough-a .icon-strikethrough-s .icon-strikethrough-y .icon-subscript .icon-subtitle .icon-subtract .icon-success .icon-suggested-investigations .icon-superscript .icon-table .icon-table-add-column-after .icon-table-add-column-before .icon-table-add-row-after .icon-table-add-row-before .icon-table-caption .icon-table-merge-cells .icon-table-move-column-after .icon-table-move-column-before .icon-table-move-row-after .icon-table-move-row-before .icon-tabs .icon-tag .icon-template-add .icon-text-dir-ltr .icon-text-dir-rtl .icon-text-flow .icon-text-style .icon-text-summary .icon-three-dimensional .icon-trash .icon-tray
.icon-un-block .icon-un-flag-ltr .icon-un-flag-rtl .icon-un-link .icon-un-lock .icon-un-star .icon-underline-a .icon-underline-u .icon-undo .icon-universal-design .icon-up-triangle .icon-update .icon-upload .icon-user-active .icon-user-add .icon-user-anonymous .icon-user-avatar .icon-user-avatar-outline .icon-user-blocked .icon-user-chat .icon-user-contributions .icon-user-group .icon-user-mentor .icon-user-pages .icon-user-rights .icon-user-talk .icon-user-temporary .icon-user-temporary-location .icon-vertical-ellipsis .icon-view-compact .icon-view-details .icon-vision-simulator .icon-volume-down .icon-volume-off-ltr .icon-volume-off-rtl .icon-volume-up .icon-watchlist .icon-wikitext .icon-window .icon-zoom-in .icon-zoom-out
```


## Accessibility and examples

- Preserve semantic HTML and native control behavior in documentation pages. Use native buttons, links, and form controls for their corresponding actions.
- Keep interactive states usable with keyboard and pointer input. Do not remove visible keyboard focus without providing an equally clear replacement.
- Include useful alternative text for meaningful images, and keep decorative images from being announced unnecessarily.
- When changing a component, update its relevant HTML example or documentation page so the demonstrated markup matches the stylesheet.

## Validation

- This repository currently consists primarily of static CSS, HTML, and assets; inspect the available project files before assuming a build or test command exists.
- For CSS changes, review the affected selectors and token references, check asset paths, and verify the relevant example page at narrow and wide viewport sizes.
- For icon changes, confirm that the referenced SVG exists and that the matching CSS class renders with inherited text color. Adjust icon color using bg-[hue]-[shade].

## Buttons

Use `.btn` on native `<button>` or `<a>` elements. Buttons support `.btn-large` and `.btn-small` size modifiers (the default is medium), `.btn-quiet` for a quiet appearance, and `.btn-icon` for an icon-only button.

- Add `.btn-progressive` for a progressive action or `.btn-destructive` for a destructive action. Combine with `.btn-primary` for the filled primary treatment, such as `.btn btn-primary btn-progressive`.
- For icon-only buttons, include an accessible name with `aria-label` and use an existing `.icon` class for the icon.
- Group adjacent buttons in a `.btn-group` container. Keep each child a native button or link with the `.btn` class.
- Use the `disabled` attribute on buttons to disable them. Preserve visible focus and the built-in hover, active, and disabled states.
- Keep the native element appropriate to the action: buttons perform actions; anchors navigate.

## Form controls

Use `.form-control` on native `<input>`, `<textarea>`, and `<select>` elements. Use `.form-label` on labels, and associate each label with its control using matching `for` and `id` attributes.

- Wrap related labels, controls, and optional help text in `.form-field` to stack them with consistent spacing. Use `.form-text` for supporting or help text.
- Preserve native input types and attributes, including `rows` for textarea height and `multiple` or `size` for selects.
- Keep native focus and disabled behavior; use the `disabled` attribute where appropriate. Controls without a visible label should have an accessible name, such as an `aria-label`.
- Color and file inputs use `.form-control` too. The stylesheet provides their specialized appearance; do not replace their native control behavior.

### Checkboxes

- Use `.check` on a native `<input type="checkbox">`.
- Put the input and its associated `<label>` in a `.form-field` to align them together. Match the label’s `for` to the input’s `id`.
- Use the native `checked` attribute for its initial state. For a mixed state, set the checkbox’s `indeterminate` property with JavaScript; this state is not set by an HTML attribute.
- Use the native `disabled` attribute to disable the checkbox.

### Radios

- Use `.radio` on a native `<input type="radio">` and give related options the same `name` so the browser treats them as one group.
- Put each input and its associated `<label>` in a `.form-field`. Give each radio a unique `id` and match the label’s `for` to it.
- Use native `checked` and `disabled` attributes to set the initial selection and disabled state.

### Switches

- Use `.switch` on a native `<input type="checkbox" role="switch" switch>` to provide switch styling and semantics.
- Put the input and its associated `<label>` in a `.form-field`; match the label’s `for` to the input’s `id`.
- Preserve checkbox behavior and native `checked` and `disabled` attributes. Do not replace the input with a custom non-semantic toggle.

## Accordions

Build accordions from a `.accordion` container with native `<details class="accordion-item">` elements. Each item contains a `<summary class="accordion-header">` and a `<div class="accordion-body">` for its content. Use the native `open` attribute when an item should start expanded.

- Native `<details>` and `<summary>` provide built-in disclosure behavior; keep them so keyboard and browser behavior remain accessible.
- Optional item variants are `.accordion-progressive`, `.accordion-destructive`, `.accordion-error`, `.accordion-warning`, `.accordion-success`, and `.accordion-notice`. Apply a variant to the `.accordion-item`.
- The stylesheet supplies the disclosure indicator and open-state styling; do not replace the native disclosure control with a non-semantic clickable element.

## List groups

Use `.list-group` on a `<ul>` or `<div>` container and `.list-group-item` on each item. For a semantic list, use `<li class="list-group-item">`; for interactive items, use anchors or buttons with the same item class.

- Add `.active` to identify the current item and pair it with `aria-current="true"` where it represents the current page or selection.
- Disable button items with the native `disabled` attribute. Anchors do not support `disabled`; for a disabled link, use `.disabled` and `aria-disabled="true"` and ensure it does not navigate.
- Preserve the native element’s semantics and built-in focus, hover, active, and disabled behavior.

## Utility classes

- Utility classes are composable single-purpose classes defined in `codexify.css`. Reuse them in examples instead of adding one-off styles when they already cover the need.
- Prefer semantic color utilities such as `.text-progressive`, `.text-destructive`, `.text-success`, `.text-warning`, `.text-error`, and `.text-notice` over palette-specific utilities such as `.text-blue-700`. Use `bg-{hue}-{shade}`, `text-{hue}-{shade}`, and `border-{hue}-{shade}` for deliberate palette styling when no semantic role is appropriate.
- Typography utilities include `.text-xs` through `.text-6xl` for size, `.font-sans`/`.font-mono` for family, `.font-*` for weight or style, and `.text-start`/`.text-center`/`.text-end` for alignment.
- Spacing utilities use the numbered scale (`0`–`13`): `m-*` and `p-*` set margin and padding; `mx-*`/`my-*` and `px-*`/`py-*` set inline/block axes; `mt-*`, `mb-*`, `ms-*`, and `me-*` (and corresponding `p` forms) set logical sides. `gap-*`, `gap-x-*`, and `gap-y-*` set layout gaps.
- Layout utilities include `.d-*` display modes, `.w-*` sizing, `.container`, `.row`, grid column classes, alignment and justification classes, and overflow/float helpers.
- Border utilities include `.border` and logical side variants, `*-0` removal variants, and palette-based border color classes.
- Border radius utilities includes `rounded-*` sizing and logical side variants, and `*-0` removal variants.
- Responsive variants are provided only for selected utilities. Use the `tablet-*` and `desktop-*` classes where defined (for example, `tablet-text-center` or `desktop-grid-cols-12`); do not assume every base utility has a responsive counterpart.

### Spacing

Supports numbers up to 13 for margins, paddings, gaps and border radii, and up to 40 for widths

The spacing scale is:

| Number | rem | Number | rem | Number | rem | Number | rem | Number | rem |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 0 | 1 | 0.125 | 2 | 0.25 | 3 | 0.375 | 4 | 0.5 |
| 5 | 0.75 | 6 | 1 | 7 | 1.25 | 8 | 1.5 | 9 | 2 |
| 10 | 2.5 | 11 | 3 | 12 | 3.5 | 13 | 4 | 14 | 4.5 |
| 15 | 5 | 16 | 6 | 17 | 7 | 18 | 8 | 19 | 9 |
| 20 | 10 | 21 | 11 | 22 | 12 | 23 | 14 | 24 | 16 |
| 25 | 18 | 26 | 20 | 27 | 22 | 28 | 24 | 29 | 28 |
| 30 | 32 | 31 | 36 | 32 | 40 | 33 | 44 | 34 | 48 |
| 35 | 56 | 36 | 64 | 37 | 72 | 38 | 80 | 39 | 88 |
| 40 | 96 |  |  |  |  |  |  |  |  |

# Colors

There are 11 hues with 15 shades, plus black and white, totalling 167 colors.

## Hues

- Red
- Orange
- Yellow
- Lime
- Green
- Teal
- Blue
- Purple
- Pink
- Brown
- Gray

## Shades

- 10
- 20
- 50
- 100
- 200
- 300
- 400
- 500
- 600
- 700
- 800
- 900
- 950
- 980
- 990
