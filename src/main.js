import { ScrollTrigger, registerScene } from './motion-runtime.js?v=42';
import { initSections } from './section-transitions.js?v=42';
import { initSymbol } from './symbol-scroll.js?v=42';
import { initNavUI } from './nav-ui.js?v=42';
import { initScrollReveal } from './scroll-reveal.js?v=42';

initSymbol();
initNavUI();
// The expensive 3D module does not delay section isolation or scroll handling.
const hero = document.querySelector('#hero-banner');
const pendingHero = import('./hero-b2.js?v=42').then(({ initHero }) => initHero()).catch(error => {
  hero.querySelector('.b2-stage').classList.add('is-fallback');
  hero.querySelector('.b2-status').textContent = '제품 이미지를 표시합니다.';
  console.warn('Hero fallback:', error);
});
registerScene(hero, { ready: pendingHero });
initSections();
// After initSections()'s initial place()/select(), so the first arm() reads
// the corrected scroll position rather than whatever it was pre-placement.
initScrollReveal();
document.fonts.ready.then(() => ScrollTrigger.refresh());
