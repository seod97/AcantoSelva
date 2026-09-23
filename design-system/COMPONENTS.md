# Components

## Component Principles

- component는 실제 반복과 책임이 있을 때 만든다.
- editorial composition 전체를 작은 component로 과도하게 분해하지 않는다.
- visual variation보다 behavior/state를 variant 기준으로 삼는다.
- 모든 component는 keyboard, focus, loading/error 상태를 고려한다.

## P0 — Phase 01 Required

### Header

**Figma:** `Header/Desktop`, `Header/Mobile`  
**Responsibilities:** logo, primary navigation, cart entry, mobile menu.

States: default, scrolled/sticky, menu open.  
Avoid: oversized logo, multi-row utility navigation without need.

### NavigationLink / TextLink

Default, hover, focus, active, disabled. Underline 또는 text movement를 사용하며 과도한 color accent를 피한다.

### Button

- `Button/Primary` — transactional action
- `Button/Secondary` — lower priority action
- `Button/Text` — editorial/navigation action
- `IconButton`

Minimum hit area 44px. Loading and disabled states required.

### MediaFrame

Props/variants:

- ratio
- fit: contain / cover
- position/focal point
- caption
- loading state

Product object와 editorial media behavior를 분리한다.

### ProductCard

Content:

- image
- name
- price
- availability
- optional series/meta

Variants:

- default
- hover/focus
- sold out
- made to order
- coming soon

Product card에 긴 story를 넣지 않는다.

### ProductGrid

- mobile 2 columns를 기본 출발점으로 검토
- desktop은 제품 수와 이미지 scale에 따라 2–4 columns
- 모든 row를 같은 밀도로 만들지 않아도 됨
- editorial insert가 들어갈 수 있으나 구매 탐색을 방해하지 않음

### ProductGallery

- primary image
- wear image
- detail images
- thumbnail/sequence navigation
- zoom 또는 high-resolution detail

Mobile에서는 swipe와 vertical sequence 중 product 수에 맞는 방식을 선택한다.

### ProductSummary

- name
- subtitle/series
- price
- status
- size selector
- delivery estimate
- add-to-cart
- critical policy links

Desktop sticky는 content 길이와 footer overlap을 검증한 후 사용한다.

### SizeSelector

States: available, selected, disabled/sold-out, focus, error.  
Size guide link를 근처에 둔다. Color alone으로 상태를 구분하지 않는다.

### AddToCart

States: default, loading, added, error, disabled.  
size 미선택 시 명확한 message를 제공한다.

### Availability / DeliveryNotice

`Available`, `Made to order`, `Sold out`, estimated shipping date를 분명하게 구분한다.

### Accordion

Care, shipping, return, material information에 사용. Heading/button semantic structure, keyboard operation, visible state required.

### CartLineItem

- product image/name
- selected variant
- price
- quantity or fixed quantity
- remove/edit
- production/shipping status

### Drawer / Dialog

Mobile navigation, cart preview에 사용 가능. Focus trap, Escape close, scroll lock, label required.

### Footer

- Story / Support / Legal / Instagram
- business information
- no decorative overload

## P1 — Soon After Launch

- Breadcrumb
- Filter / Sort
- FormField / Select / Checkbox / Radio
- Toast / InlineNotice
- OrderLookupForm
- EmptyState
- ErrorState
- StoryIntro
- FounderProfile
- RelatedProducts

## P2 — Future

- MeaningConsultationForm
- PrivateOrderStatus
- EyewearFitGuide
- Membership forms
- Journal index/article

P2 component는 feature가 실제로 시작되기 전 만들지 않는다.

## Component Documentation Template

```text
Name
Purpose
Content
Anatomy
Variants
States
Responsive behavior
Accessibility
Figma name
Code name
Tokens used
Do / Don't
```
