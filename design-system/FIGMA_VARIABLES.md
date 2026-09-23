# Figma Variables and Styles

## Collections

### `AS / Primitive Color`

Raw neutral and state values. Components should not bind directly unless no semantic token exists.

### `AS / Semantic Color`

- `background/canvas`
- `background/surface`
- `background/subtle`
- `background/inverse`
- `text/primary`
- `text/secondary`
- `text/muted`
- `text/inverse`
- `border/subtle`
- `border/strong`
- `action/primary`
- `action/primary-text`
- `state/success`
- `state/warning`
- `state/error`

Mode: `Light` only for v0.1.

### `AS / Space`

`0` through `15`, matching `TOKENS.md`.

Suggested scopes:

- GAP
- WIDTH_HEIGHT where appropriate
- padding bindings

### `AS / Layout`

Grid variable names mirror `tokens.json`:

```text
grid/pc1920/viewport
grid/pc1920/outer-width
grid/pc1920/default-content-width
grid/pc1920/focused-content-width
grid/pc1920/outer-columns
grid/pc1920/default-content-columns
grid/pc1920/focused-content-columns
grid/pc1920/column-width
grid/pc1920/margin
grid/pc1920/gutter
```

같은 10개 field를 아래 preset마다 만듭니다.

- `pc1920`
- `tablet1024`
- `tablet768`
- `mobile390`
- `mobile360`

기타 layout variable:

- `content/text-narrow`
- `content/text`
- `hit-target/min`

기존 `content/standard`, `content/product`, `content/editorial`, `content/canvas`는 승인된 grid 폭과 충돌하므로 사용하지 않습니다.

### `AS / Radius`

- none
- subtle
- pill

### `AS / Motion`

Figma prototype duration reference. Code remains source for exact easing implementation.

## Text Styles

Text styles combine family, size, weight, line-height, and letter-spacing.

```text
AS/Display/L
AS/Display/M
AS/Title/L
AS/Heading/L
AS/Heading/M
AS/Heading/S
AS/Body/L
AS/Body/M
AS/Small
AS/Meta
AS/Nav
AS/Price
```

## Grid Styles

```text
AS/Grid/PC-1920-Outer-12
AS/Grid/PC-1920-Default-10
AS/Grid/PC-1920-Focused-8
AS/Grid/TB-1024-Outer-8
AS/Grid/TB-1024-Default-8
AS/Grid/TB-1024-Focused-6
AS/Grid/TB-768-Outer-8
AS/Grid/TB-768-Default-8
AS/Grid/TB-768-Focused-6
AS/Grid/MO-390-Outer-4
AS/Grid/MO-390-Default-4
AS/Grid/MO-390-Focused-4
AS/Grid/MO-360-Outer-4
AS/Grid/MO-360-Default-4
AS/Grid/MO-360-Focused-4
```

각 style의 count, margin, gutter, width는 `TOKENS.md`의 해당 preset과 정확히 일치시킵니다.

## Notes on `figma-variables.csv`

CSV는 생성 계획과 검토를 위한 reference sheet입니다. Figma native import contract가 아닙니다. 사용하는 plugin이나 script가 있다면 그 schema에 맞춰 변환합니다.

## Publish Rule

- Working components stay local.
- Approved component만 library publish.
- component description에 purpose, allowed variations, prohibited use를 기록.
- variant property names are semantic: `State=SoldOut`, not `Type=3`.
