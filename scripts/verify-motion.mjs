// Controller regression checks (no browser emulation or external dependencies).
// Run with: node --experimental-vm-modules scripts/verify-motion.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const source = await fs.readFile(new URL('../src/section-transitions.js', import.meta.url), 'utf8');
for (const reduced of [false, true]) {
  const listeners = new Map(), refreshListeners = new Map();
  let y = 0, now = 1000;
  const animations = [];
  class Element {
    constructor(id, start = 0, height = 600) {
      this.id = id; this.start = start; this.offsetHeight = height;
      this.dataset = {}; this.style = {}; this.attributes = {};
      const classes = new Set();
      this.classList = {
        add: value => classes.add(value), remove: value => classes.delete(value),
        contains: value => classes.has(value), toggle: (value, enabled) => enabled ? classes.add(value) : classes.delete(value)
      };
    }
    getBoundingClientRect() { return { top: this.start - y }; }
    contains(node) { return node === this; }
    setAttribute(key, value) { this.attributes[key] = value; }
  }
  const sections = ['index', 'hero-banner', 'objects', 'symbol', 'arrival'].map((id, i) => new Element(id, i * 1400, 1200));
  const footer = new Element('footer', 6800, 800), main = new Element('main'), root = new Element('html');
  root.scrollHeight = 7600;
  main.querySelectorAll = () => sections;
  main.querySelector = () => footer;
  let veil;
  const document = {
    documentElement: root,
    querySelector: () => main,
    getElementById: id => sections.find(s => s.id === id),
    createElement: () => (veil = new Element('veil')),
    body: { appendChild() {} }
  };
  const gsap = {
    utils: { clamp: (a, b, value) => Math.min(b, Math.max(a, value)) },
    set: (element, values) => Object.assign(element.style, values),
    to: (object, values) => {
      if ('y' in values) object.y = values.y;
      values.onUpdate?.();
      return { kill() {}, isActive: () => false };
    }
  };
  const ScrollTrigger = { update() {}, clearScrollMemory() {},
    addEventListener: (name, fn) => refreshListeners.set(name, fn) };
  const context = vm.createContext({ document, history: {}, location: { hash: '' },
    performance: { now: () => now }, innerHeight: 600,
    get scrollY() { return y; }, scrollTo: options => { y = options.top; },
    requestAnimationFrame: fn => queueMicrotask(fn),
    addEventListener: (name, fn) => listeners.set(name, fn), console
  });
  const runtime = new vm.SyntheticModule(['gsap', 'ScrollTrigger', 'reducedMotion', 'scenes', 'tween'], function () {
    this.setExport('gsap', gsap); this.setExport('ScrollTrigger', ScrollTrigger);
    this.setExport('reducedMotion', { matches: reduced }); this.setExport('scenes', new Map());
    this.setExport('tween', async (element, values) => {
      animations.push({ opacity: values.opacity, duration: values.duration, section: main.dataset.activeSection });
      Object.assign(element.style, { opacity: values.opacity });
    });
  }, { context });
  const module = new vm.SourceTextModule(source, { context });
  await module.link(() => runtime); await module.evaluate(); module.namespace.initSections();
  const flush = () => new Promise(resolve => setImmediate(resolve));
  const key = async key => {
    now += 300;
    listeners.get('keydown')({ key, target: { closest: () => null }, preventDefault() {} });
    await flush();
  };
  const visible = () => [...sections, footer].filter(s => s.classList.contains('is-current')).map(s => s.id);
  assert.deepEqual(visible(), ['index']);
  await key('PageDown'); await key('PageDown'); // Reach the bottom, then extra intent.
  await key('PageDown'); await key('PageDown');
  assert.deepEqual(visible(), ['hero-banner']);
  assert.equal(y, sections[1].start);
  assert.equal(veil.style.opacity, 0);
  assert.equal(veil.classList.contains('is-active'), false);
  assert.deepEqual(animations.map(a => a.section), ['index', 'hero-banner']);
  assert.ok(sections.filter(s => s.id !== 'hero-banner').every(s => s.inert && s.attributes['aria-hidden'] === 'true'));
  if (reduced) assert.ok(animations.every(a => a.duration === 0));
  await key('PageUp'); await key('PageUp');
  assert.deepEqual(visible(), ['index']);
  await key('End');
  assert.deepEqual(visible(), ['arrival', 'footer']);
  assert.equal(y, root.scrollHeight - 600);
  await key('Home');
  assert.deepEqual(visible(), ['index']);
  assert.equal(y, 0);
  console.log(`PASS: ${reduced ? 'reduced' : 'normal'} motion — isolation, covered swap, reverse, End/Home, footer, unlock`);
}
