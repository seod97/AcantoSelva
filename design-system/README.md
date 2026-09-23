# ACANTO SELVA Web Design System

Version: 0.1.0  
Status: Working baseline

## Purpose

이 시스템은 브랜드 문서를 웹 UI로 번역합니다. generic UI kit가 아니라 ACANTO SELVA의 오브젝트, 서사, commerce를 같은 언어로 연결하는 기준입니다.

## Layers

1. **Foundations** — color, type, spacing, grid, content width, media, border, motion, state
2. **Components** — 재사용되는 기능 단위
3. **Patterns** — editorial/commerce composition과 page behavior
4. **Responsive** — viewport 변화에 따른 구조 규칙
5. **Accessibility** — 사용성 최소 기준

Foundations만으로는 충분하지 않습니다. component와 pattern이 있어야 Codex가 임의의 generic layout으로 회귀하지 않습니다.

## Source Files

- Human-readable: `FOUNDATIONS.md`, `TOKENS.md`
- Machine-readable: `tokens.json`
- Web runtime: `tokens.css`
- Figma plan: `FIGMA_VARIABLES.md`, `figma-variables.csv`
- Visual check: `preview.html`

## Status Rules

- `Working`: 테스트 가능한 제안
- `Approved`: Figma와 code 양쪽에서 승인
- `Deprecated`: 새 사용 금지, migration 예정

현재 모든 값은 `Working`입니다. 최종 font, product photography, platform 선택 이후 v0.2에서 조정합니다.

## Change Rule

Token을 변경하면 반드시 다음을 함께 확인합니다.

1. `tokens.json`
2. `tokens.css`
3. `TOKENS.md`
4. Figma variables/styles
5. affected components
6. desktop/mobile visual regression
