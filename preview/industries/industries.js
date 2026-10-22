const section = document.querySelector('#industrias');
if (section) {
  const tabs = [...section.querySelectorAll('[role="tab"]')];
  const panels = [...section.querySelectorAll('[role="tabpanel"]')];
  const tablist = section.querySelector('[role="tablist"]');
  const motionToggle = section.querySelector('.ind-motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const horizontal = matchMedia('(max-width: 960px)');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let userPaused = false, inview = false, entrance = null, pointerFrame = 0;

  function motion() {
    section.classList.toggle('ind-inview', inview && !document.hidden && !reduced.matches);
    section.classList.toggle('ind-paused', userPaused || reduced.matches);
    motionToggle.disabled = reduced.matches;
    motionToggle.setAttribute('aria-pressed', String(userPaused));
    motionToggle.textContent = reduced.matches ? 'Escena estática' : userPaused ? 'Reanudar escena ↻' : 'Pausar escena Ⅱ';
    if (reduced.matches || document.hidden || !inview || userPaused) entrance?.cancel();
  }
  function orientation() { tablist.setAttribute('aria-orientation', horizontal.matches ? 'horizontal' : 'vertical'); }
  function choose(index, focus = false) {
    entrance?.cancel();
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    const panel = panels[index];
    if (!reduced.matches && !userPaused && inview && !document.hidden) {
      entrance = panel.querySelector('.ind-panel-top').animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    if (focus) tabs[index].focus({ preventScroll: true });
    if (horizontal.matches) tablist.scrollTo({ left: tabs[index].offsetLeft - 10, behavior: reduced.matches ? 'instant' : 'smooth' });
    section.dataset.industry = tabs[index].id.replace('industry-tab-', '');
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => choose(index), options);
    tab.addEventListener('keydown', event => {
      let next;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % tabs.length;
      else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); choose(next, true);
    }, options);
  });
  section.querySelectorAll('.ind-scene').forEach(scene => {
    scene.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || reduced.matches || userPaused || !inview) return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const rect = scene.getBoundingClientRect();
        scene.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width - .5) * 14}px`);
        scene.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height - .5) * 10}px`);
      });
    }, { ...options, passive: true });
    scene.addEventListener('pointerleave', () => { cancelAnimationFrame(pointerFrame); scene.style.setProperty('--mx', '0px'); scene.style.setProperty('--my', '0px'); }, options);
  });
  motionToggle.addEventListener('click', () => { userPaused = !userPaused; motion(); }, options);
  document.addEventListener('visibilitychange', motion, options);
  reduced.addEventListener('change', motion, options);
  horizontal.addEventListener('change', orientation, options);
  const observer = new IntersectionObserver(entries => { inview = entries[0].isIntersecting; motion(); }, { threshold: .05 });
  observer.observe(section);
  orientation(); choose(0); motion(); section.dataset.industriesReady = 'true';
  window.addEventListener('pagehide', event => { if (!event.persisted) { observer.disconnect(); controller.abort(); entrance?.cancel(); cancelAnimationFrame(pointerFrame); } }, options);
}
