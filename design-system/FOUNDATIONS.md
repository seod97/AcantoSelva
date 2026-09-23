# Foundations

## 1. Foundation Principles

- less, but more exact
- object first
- whitespace is structure, not decoration
- controlled asymmetry
- density through order
- quiet interaction
- commerce remains clear

## 2. Color

v0.1은 warm neutral light theme입니다. 강한 brand accent를 임의로 만들지 않습니다.

### Semantic Roles

- Canvas: 전체 페이지 배경
- Surface: 제품 정보, drawer, form 등의 필요 surface
- Text Primary: 핵심 텍스트
- Text Secondary: 보조 정보
- Text Muted: metadata
- Border Subtle / Strong
- Inverse
- State: success / warning / error

Interaction은 accent color보다 underline, opacity, border, movement를 우선합니다.

## 3. Typography

### Provisional Stack

```css
"Helvetica Neue", "Pretendard Variable", Pretendard, "Noto Sans KR", Arial, sans-serif
```

최종 서체와 라이선스 확정 후 family token만 교체할 수 있도록 합니다.

### Roles

- Display L / M
- Title L
- Heading L / M / S
- Body L / M
- Small
- Meta
- Navigation
- Price

### Rules

- 3개 이상의 weight를 한 화면에서 혼용하지 않습니다.
- body는 최소 16px을 기본으로 합니다.
- 대문자 meta는 짧은 label에만 사용합니다.
- long text width는 약 640px 이하를 권장합니다.
- 줄바꿈이 composition의 일부일 때 explicit max-width를 사용합니다.

## 4. Spacing

Micro spacing과 editorial spacing을 같은 scale에서 관리합니다.

```text
0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128, 160, 240, 320
```

- component 내부: 4–32
- section 내부: 24–96
- section 간: 96–240
- narrative pause: 최대 320

모든 section에 같은 간격을 적용하지 않습니다. 정보 밀도에 따라 rhythm을 만듭니다.

## 5. Grid

승인된 Figma viewport마다 `Outer Grid → Default Content → Focused Content`의 3단 폭 체계를 사용합니다.

| Preset | Viewport | Outer | Default | Focused | Columns O/D/F | Column | Margin | Gutter |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| PC 1920 | 1920px | 1824px | 1516px | 1208px | 12 / 10 / 8 | 130px | 48px | 24px |
| TB 1024 | 1024px | 928px | 928px | 690px | 8 / 8 / 6 | 95px | 48px | 24px |
| TB 768 | 768px | 704px | 704px | 524px | 8 / 8 / 6 | 74px | 32px | 16px |
| MO 390 | 390px | 350px | 350px | 350px | 4 / 4 / 4 | 75.5px | 20px | 16px |
| MO 360 | 360px | 320px | 320px | 320px | 4 / 4 / 4 | 71px | 20px | 12px |

이 수치는 디자인 검수 anchor입니다. 중간 viewport에서는 인접 anchor 사이를 반응형으로 연결하되, 위 다섯 viewport에서는 표의 결과가 정확히 일치해야 합니다.

Grid는 alignment 기준이지 모든 요소를 같은 폭으로 만드는 template이 아닙니다. 임의의 `max-width`를 새로 도입하지 않고, 콘텐츠 목적에 따라 Outer, Default, Focused 중 하나를 사용합니다.

## 6. Content Width

- Outer Grid: 페이지의 전체 정렬 영역
- Default Content: 일반 페이지와 주요 콘텐츠 영역
- Focused Content: 읽기·집중이 필요한 좁은 구성
- Text Narrow: 480px
- Text: 640px
- Full Bleed: 100vw

Outer, Default, Focused의 실제 폭은 viewport별 Grid 표와 `tokens.json`의 preset을 따릅니다. 기존의 추상적인 Standard / Product / Editorial / Canvas max-width는 사용하지 않습니다.

## 7. Media

### Ratios

- Product Square: 1:1
- Portrait: 4:5
- Tall Object: 2:3
- Landscape: 3:2
- Wide: 16:9
- Panorama: 21:9

### Behavior

- product object: `object-fit: contain`
- editorial image: composition에 따라 `cover`
- 중요한 제품 detail을 crop하지 않음
- responsive crop은 별도의 mobile art direction이 있으면 우선
- image loading 중 layout shift가 없어야 함

## 8. Border, Radius, Shadow

- Hairline: 1px
- Strong line: 1px with stronger semantic color
- Default radius: 0
- Subtle radius: 2px
- Pill: 999px, 기능적 selection/status에만 사용
- Shadow: 기본적으로 사용하지 않음

## 9. Motion

- Instant: 80ms
- Fast: 160ms
- Standard: 240ms
- Deliberate: 400ms
- Narrative: 700ms

Motion은 hierarchy와 state를 설명해야 합니다. 장식적인 scroll effect를 기본값으로 사용하지 않습니다.

`prefers-reduced-motion`에서는 transform/opacity animation을 최소화합니다.

## 10. Interaction States

- Default
- Hover
- Focus visible
- Active
- Selected
- Disabled
- Loading
- Error
- Sold out
- Made to order

모든 interactive control은 최소 44×44px hit area를 권장합니다.

## 11. Layering

- Base: 0
- Raised: 10
- Sticky: 100
- Overlay: 500
- Modal: 1000

z-index를 임의의 큰 수로 추가하지 않습니다.
