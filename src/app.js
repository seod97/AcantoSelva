const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Coalesce scroll work to one update per display frame.
const scrollUpdates = new Set();
let scrollFrame = 0;
function scheduleScrollUpdate() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    scrollUpdates.forEach((update) => update());
  });
}
window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
window.addEventListener("resize", scheduleScrollUpdate);
function registerScrollUpdate(update) {
  scrollUpdates.add(update);
  update();
}

const scrollCue = document.querySelector(".index__scroll");
const heroMedia = document.querySelector(".hero__media");

if (scrollCue && heroMedia) {
  scrollCue.setAttribute("role", "button");
  scrollCue.setAttribute("tabindex", "0");

  const goToHero = () => {
    heroMedia.scrollIntoView({ behavior: "auto", block: "start" });
  };

  scrollCue.addEventListener("click", goToHero);
  scrollCue.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToHero();
    }
  });
}

const indexSection = document.querySelector(".index");
const indexStage = document.querySelector(".index__stage");

if (indexSection && indexStage && !reducedMotion.matches) {
  const clamp01 = (value) => Math.min(1, Math.max(0, value));
  registerScrollUpdate(() => {
    const rect = indexSection.getBoundingClientRect();
    const distance = indexSection.offsetHeight - window.innerHeight;
    const progress = clamp01(distance > 0 ? -rect.top / distance : 0);
    indexStage.style.setProperty("--index-flight", progress.toFixed(3));
  });
}


function setupScrollFade(container) {
  const frames = [...container.querySelectorAll("[data-fade-frame]")];
  if (frames.length < 2) return;

  if (reducedMotion.matches) {
    frames.forEach((frame) => {
      frame.style.opacity = "1";
    });
    return;
  }

  const exitLast = container.hasAttribute("data-exit-last");
  const clamp01 = (value) => Math.min(1, Math.max(0, value));
  const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
  const lastIndex = frames.length - 1;
  const segments = exitLast ? frames.length : lastIndex;

  const update = () => {
    const rect = container.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const progress = clamp01(total > 0 ? -rect.top / total : 0) * segments;

    frames.forEach((frame, index) => {
      const exitable = exitLast || index < lastIndex;
      let opacity;
      let lift = 0;

      if (progress < index) {
        opacity = index === 0 ? 1 : easeInOutCubic(clamp01((progress - (index - 1) - 0.3) / 0.7));
      } else if (progress < index + 1) {
        if (!exitable) {
          opacity = 1;
        } else {
          const holdDuration = Number(frame.dataset.fadeHoldDuration) || 0;
          const exitDuration = Number(frame.dataset.fadeExitDuration) || 0.4;
          const localProgress = progress - index;
          if (localProgress < holdDuration) {
            opacity = 1;
          } else {
            const exitProgress = clamp01((localProgress - holdDuration) / exitDuration);
            opacity = 1 - easeOutQuad(exitProgress);
            if (frame.hasAttribute("data-fade-slide")) lift = exitProgress * -60;
          }
        }
      } else {
        opacity = exitable ? 0 : 1;
      }

      frame.style.opacity = String(clamp01(opacity));
      frame.style.transform = lift ? `translateY(${lift}px)` : "";
      frame.style.pointerEvents = opacity < 0.05 ? "none" : "auto";
    });
  };

  registerScrollUpdate(update);
}

document.querySelectorAll("[data-scroll-fade]").forEach(setupScrollFade);

// Anchor the navigation to flow wrappers, never to sticky/transformed frames.
const sectionNav = document.querySelector(".section-nav");
if (sectionNav) {
  const links = [...sectionNav.querySelectorAll("a")];
  const majorLinks = links.filter((link) => !link.classList.contains("section-nav__sub"));
  const sections = majorLinks.map((link) => document.querySelector(link.hash));
  function targetTop(link) {
    const target = document.querySelector(link.hash);
    const container = target.matches("[data-scroll-fade]") ? target : target.querySelector("[data-scroll-fade]");
    if (link.hasAttribute("data-frame-index") && container && !reducedMotion.matches) {
      const count = container.querySelectorAll("[data-fade-frame]").length;
      return window.scrollY + container.getBoundingClientRect().top +
        Number(link.dataset.frameIndex) * (container.offsetHeight - innerHeight) / count;
    }
    if (link.hash.startsWith("#symbol-")) return window.scrollY + document.querySelector("#symbols").getBoundingClientRect().top;
    return window.scrollY + target.getBoundingClientRect().top;
  }
  let selectedSub = null;
  links.forEach((link) => link.addEventListener("click", (event) => {
    selectedSub = link.classList.contains("section-nav__sub") ? link : null;
    if (link.hasAttribute("data-frame-index")) {
      event.preventDefault();
      window.scrollTo({ top: targetTop(link), behavior: "auto" });
      history.replaceState(null, "", link.hash);
      scheduleScrollUpdate();
    }
  }));
  registerScrollUpdate(() => {
    const rects = sections.map((section) => section.getBoundingClientRect());
    const marker = window.innerHeight * 0.35;
    const visible = rects[0].top <= marker && rects.at(-1).bottom > marker;
    sectionNav.hidden = !visible;
    let active = 0;
    rects.forEach((rect, index) => { if (rect.top <= marker) active = index; });
    const parent = majorLinks[active];
    const start = links.indexOf(parent);
    const end = active + 1 < majorLinks.length ? links.indexOf(majorLinks[active + 1]) : links.length;
    const children = links.slice(start + 1, end);
    const currentSub = selectedSub && children.includes(selectedSub) && parent.hash === "#symbols"
      ? selectedSub
      : children.filter((link) => targetTop(link) <= window.scrollY + 2).at(-1);
    links.forEach((link) => {
      if (visible && (link === parent || link === currentSub)) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  });
}
