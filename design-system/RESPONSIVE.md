# Responsive Behavior

## Breakpoints

```text
sm: 480px
md: 768px
lg: 1024px
xl: 1440px
2xl: 1920px
```

Breakpoint는 layout 전환 조건이고, 아래 Grid Preset은 Figma 검수 viewport의 정확한 결과값입니다. 둘을 같은 개념으로 취급하지 않습니다.

## Grid Presets

| Preset | Viewport | Outer | Default | Focused | Columns O/D/F | Column | Margin | Gutter |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| PC 1920 | 1920px | 1824px | 1516px | 1208px | 12 / 10 / 8 | 130px | 48px | 24px |
| TB 1024 | 1024px | 928px | 928px | 690px | 8 / 8 / 6 | 95px | 48px | 24px |
| TB 768 | 768px | 704px | 704px | 524px | 8 / 8 / 6 | 74px | 32px | 16px |
| MO 390 | 390px | 350px | 350px | 350px | 4 / 4 / 4 | 75.5px | 20px | 16px |
| MO 360 | 360px | 320px | 320px | 320px | 4 / 4 / 4 | 71px | 20px | 12px |

레이아웃 폭은 반드시 `Outer Grid → Default Content → Focused Content` 계층에서 선택합니다. 승인된 viewport에서 임의의 `max-width`로 수치를 대체하지 않습니다.

중간 viewport는 인접 preset 사이에서 overflow 없이 fluid하게 동작시킵니다. 단, 360 / 390 / 768 / 1024 / 1920px에서는 위 값이 정확히 일치해야 합니다.

권장 컨테이너 패턴:

```css
.page-grid {
  width: min(calc(100% - (2 * var(--as-page-gutter))), var(--as-grid-outer-width));
  margin-inline: auto;
}

.content-default {
  width: min(100%, var(--as-grid-default-width));
  margin-inline: auto;
}

.content-focused {
  width: min(100%, var(--as-grid-focused-width));
  margin-inline: auto;
}
```

## Type

- display는 `clamp()`로 fluid하게 조정
- body는 기본 16px 이하로 축소하지 않음
- mobile에서 긴 uppercase tracking을 줄일 수 있음
- line break를 유지해야 하는 brand phrase는 별도 mobile composition을 검토

## Layout Transformation

### Split → Stack

Desktop의 image/text split은 mobile에서 단순히 DOM 순서대로 stack하지 않습니다. 의미와 action priority에 따라 순서를 명시합니다.

### Full Bleed

Mobile full bleed media는 page gutter를 넘어갈 수 있습니다. text와 controls는 안전 gutter 안에 둡니다.

### Sticky

Desktop sticky summary는 tablet/mobile에서 해제할 수 있습니다. footer 또는 긴 gallery와 충돌하면 사용하지 않습니다.

### Navigation

- desktop: visible primary navigation
- mobile: concise header + menu drawer
- cart state는 항상 접근 가능
- open drawer는 focus trap과 scroll lock 사용

### Product Grid

- mobile: 2 columns 또는 intentional 1-column feature
- tablet: 2–3 columns
- desktop: 2–4 columns

제품 수가 적으면 column 수보다 image scale을 우선합니다.

## Media Art Direction

- product object를 mobile에서 과도하게 crop하지 않음
- editorial crop은 focal point와 별도 mobile asset을 검토
- video autoplay는 muted, inline, reduced-motion behavior를 포함

## Minimum Test Viewports

- 360 × 800
- 390 × 844
- 768 × 1024
- 1024 × 768
- 1440 × 900
- 1920 × 1080

360 / 390 / 768 / 1024 / 1920에서는 grid 폭, column 수, margin, gutter를 token 값과 함께 검수합니다. 그 외 viewport에서는 overflow, hierarchy, target size, crop을 확인합니다.
