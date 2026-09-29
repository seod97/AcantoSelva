// Left-edge section indicator, bottom-right "scroll to top" FAB, and a
// position-only hamburger button (no menu behavior — just placement, per
// request). Always visible, including mid-transition — contrast against
// whatever's behind it comes from mix-blend-mode in CSS, not JS toggling.
export function initNavUI() {
  const main = document.querySelector('main');

  const SECTIONS = [
    { id: 'index', label: 'Index' },
    { id: 'hero-banner', label: 'Hero' },
    { id: 'objects', label: 'Object' },
    { id: 'origin', label: 'Origin' },
    { id: 'symbol', label: 'Symbol' },
    { id: 'standard', label: 'Standard' },
  ];

  const nav = document.createElement('nav');
  nav.className = 'side-nav';
  nav.setAttribute('aria-label', '섹션 이동');
  nav.innerHTML = SECTIONS.map(s =>
    `<a href="#${s.id}" aria-label="${s.label}"><span></span></a>`
  ).join('');
  document.body.appendChild(nav);
  const links = [...nav.querySelectorAll('a')];

  // Never resize/shift content to make room for this indicator — instead
  // measure where content actually starts (the shared 2.5cqw section
  // padding) and float the dash entirely inside that existing gutter, with
  // a fixed clearance from content that wins over the screen-edge margin
  // if the two ever conflict on a very narrow window.
  // The active/hover state scales the dash 1.5x from its own center, so its
  // footprint grows by a quarter-width on each side — reserve clearance for
  // that grown width, not the resting 12px, so the gap never shrinks when a
  // dash is active.
  const DASH_WIDTH = 12, DASH_WIDTH_GROWN = 18, CONTENT_GAP = 17, MIN_SCREEN_EDGE = 16;
  function positionSideNav() {
    const shell = document.querySelector('.section-shell') || document.querySelector('.home2-symbol');
    if (!shell) return;
    const contentLeft = shell.getBoundingClientRect().left + parseFloat(getComputedStyle(shell).paddingLeft);
    const growthPad = (DASH_WIDTH_GROWN - DASH_WIDTH) / 2;
    const maxLeftForGap = contentLeft - CONTENT_GAP - DASH_WIDTH - growthPad;
    nav.style.left = `${Math.max(4, Math.min(MIN_SCREEN_EDGE, maxLeftForGap))}px`;
  }
  positionSideNav();
  new ResizeObserver(positionSideNav).observe(main);

  const fab = document.createElement('a');
  fab.href = '#index';
  fab.className = 'fab-top';
  fab.setAttribute('aria-label', '맨 위로');
  fab.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 15.5V8.5M8.25 12.25 12 8.5l3.75 3.75"/></svg>`;
  document.body.appendChild(fab);

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'gnb-toggle';
  hamburger.setAttribute('aria-label', '메뉴');
  hamburger.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;
  document.body.appendChild(hamburger);

  function updateActive() {
    const current = `#${main.dataset.activeSection}`;
    links.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === current));
    fab.classList.toggle('is-active', current === '#index');
  }
  new MutationObserver(updateActive).observe(main, { attributes: true, attributeFilter: ['data-active-section'] });
  updateActive();
}
