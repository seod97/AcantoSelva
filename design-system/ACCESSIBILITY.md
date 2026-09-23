# Accessibility

Target: WCAG 2.2 AA 수준의 실용적 준수.

## Structure

- 한 page에 의미 있는 `h1` 하나
- heading level을 visual size로 선택하지 않음
- landmark: header, nav, main, footer
- product lists use list semantics when appropriate

## Keyboard

- 모든 action에 keyboard access
- logical tab order
- visible focus
- drawer/dialog focus trap
- Escape closes modal when appropriate
- carousel/gallery controls have labels

## Focus

- 2px visible outline
- background와 충분히 구분
- focus를 제거하지 않음
- hover-only information 금지

## Color

- text와 essential UI는 AA contrast 목표
- status를 색만으로 전달하지 않음
- muted text를 필수 구매정보에 사용하지 않음

## Forms

- persistent label
- instruction before error where possible
- error text associated with field
- size selection communicates selected/disabled state
- checkout errors preserve user input

## Images

- product image alt describes object and view
- decorative image uses empty alt
- text embedded in images is not the sole source of information
- zoom/detail controls are keyboard accessible

## Motion

- reduced motion respected
- no essential information only available through animation
- auto-advancing content can be paused
- parallax and scroll-linked movement used sparingly

## Commerce

- price, availability, delivery, return information readable by assistive technology
- cart update announced appropriately
- sold-out option disabled and labeled
- order confirmation has a clear heading and summary
