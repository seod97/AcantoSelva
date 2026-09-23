# Token Reference

## Naming

```text
category.role.variant
```

Examples:

```text
color.background.canvas
color.text.primary
space.6
grid.pc1920.focusedContentWidth
motion.duration.standard
```

Primitive value보다 semantic token을 component에서 사용합니다.

## Color

| Token | Value | Use |
|---|---|---|
| `color.background.canvas` | `#F5F4EF` | page canvas |
| `color.background.surface` | `#FFFFFF` | surface/drawer/form |
| `color.background.subtle` | `#ECE9E1` | restrained grouping |
| `color.background.inverse` | `#121212` | inverse section |
| `color.text.primary` | `#121212` | primary text |
| `color.text.secondary` | `#45443F` | supporting copy |
| `color.text.muted` | `#73716B` | metadata |
| `color.text.inverse` | `#F8F7F3` | inverse text |
| `color.border.subtle` | `#D8D5CD` | dividers |
| `color.border.strong` | `#B7B3AA` | controls/focus support |
| `color.action.primary` | `#121212` | primary action |
| `color.action.primaryText` | `#FFFFFF` | text on primary action |
| `color.state.success` | `#2E684F` | confirmed state |
| `color.state.warning` | `#856316` | warning |
| `color.state.error` | `#963B34` | error |

## Typography

| Token | Value |
|---|---|
| `font.family.sans` | Helvetica Neue / Pretendard / Noto Sans KR / Arial |
| `font.weight.regular` | 400 |
| `font.weight.medium` | 500 |
| `font.weight.semibold` | 600 |
| `font.size.1` | 12px |
| `font.size.2` | 13px |
| `font.size.3` | 14px |
| `font.size.4` | 16px |
| `font.size.5` | 18px |
| `font.size.6` | 20px |
| `font.size.7` | 24px |
| `font.size.8` | 32px |
| `font.size.9` | 48px |
| `font.size.10` | 72px |
| `font.size.11` | 96px |

Display sizes use fluid CSS clamps defined in `tokens.css`.

## Spacing

| Token | px |
|---|---:|
| `space.0` | 0 |
| `space.1` | 2 |
| `space.2` | 4 |
| `space.3` | 8 |
| `space.4` | 12 |
| `space.5` | 16 |
| `space.6` | 24 |
| `space.7` | 32 |
| `space.8` | 48 |
| `space.9` | 64 |
| `space.10` | 80 |
| `space.11` | 96 |
| `space.12` | 128 |
| `space.13` | 160 |
| `space.14` | 240 |
| `space.15` | 320 |

## Grid

각 preset은 `viewport`, `outerWidth`, `defaultContentWidth`, `focusedContentWidth`, `outerColumns`, `defaultContentColumns`, `focusedContentColumns`, `columnWidth`, `margin`, `gutter`를 가집니다.

| Token prefix | Viewport | Outer / Default / Focused | Columns O/D/F | Column | Margin | Gutter |
|---|---:|---:|---:|---:|---:|---:|
| `grid.pc1920` | 1920px | 1824 / 1516 / 1208px | 12 / 10 / 8 | 130px | 48px | 24px |
| `grid.tablet1024` | 1024px | 928 / 928 / 690px | 8 / 8 / 6 | 95px | 48px | 24px |
| `grid.tablet768` | 768px | 704 / 704 / 524px | 8 / 8 / 6 | 74px | 32px | 16px |
| `grid.mobile390` | 390px | 350 / 350 / 350px | 4 / 4 / 4 | 75.5px | 20px | 16px |
| `grid.mobile360` | 360px | 320 / 320 / 320px | 4 / 4 / 4 | 71px | 20px | 12px |

CSS는 각 preset을 `--as-grid-{preset}-*`로 제공하고, 현재 viewport용 alias를 `--as-grid-outer-width`, `--as-grid-default-width`, `--as-grid-focused-width`로 제공합니다.

## Layout

| Token | Value |
|---|---|
| `layout.content.textNarrow` | 480px |
| `layout.content.text` | 640px |
| `layout.hitTarget.min` | 44px |

페이지 폭에는 임의의 Standard / Product / Editorial max-width를 사용하지 않습니다. `grid.*`의 Outer / Default / Focused 폭을 사용합니다.

## Radius

- `radius.none`: 0
- `radius.subtle`: 2px
- `radius.pill`: 999px

## Motion

| Token | Value |
|---|---|
| `motion.duration.instant` | 80ms |
| `motion.duration.fast` | 160ms |
| `motion.duration.standard` | 240ms |
| `motion.duration.deliberate` | 400ms |
| `motion.duration.narrative` | 700ms |
| `motion.easing.standard` | cubic-bezier(0.4, 0, 0.2, 1) |
| `motion.easing.out` | cubic-bezier(0.22, 1, 0.36, 1) |

## Change Discipline

- Component code에서 primitive hex를 직접 사용하지 않습니다.
- 임의의 spacing을 추가하기 전에 가까운 token으로 해결 가능한지 확인합니다.
- token 추가는 재사용 근거가 있을 때만 합니다.
- Figma와 CSS token 이름은 가능한 한 같은 semantic path를 유지합니다.
- 승인된 다섯 viewport에서 grid 결과가 preset과 정확히 일치해야 합니다.
