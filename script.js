// Navigation active state + mobile toggle
(function () {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const links = Array.from(document.querySelectorAll('.nav-link'));

  // Toggle menu on mobile
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // Close menu after click (mobile)
  links.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });

  // Scroll spy (simple)
  const navSections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function onScroll() {
    const y = window.scrollY + 120;
    let active = links[0];
    navSections.forEach((sec, i) => {
      if (sec.offsetTop <= y) active = links[i];
    });
    links.forEach((l) => l.classList.remove('active'));
    active && active.classList.add('active');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Bell curve function for flower density distribution
  function bellCurve(x, center, width) {
    // Gaussian bell curve function
    // x: position (0-1), center: peak position (0-1), width: curve width
    const exponent = -Math.pow((x - center) / width, 2) / 2;
    return Math.exp(exponent);
  }

  // Populate flower transitions with bell curve density
  const transitions = Array.from(document.querySelectorAll('.flower-transition'));
  
  transitions.forEach((transition) => {
    const field = document.createElement('div');
    field.className = 'flower-field';
    
    // Create flowers with bell curve distribution - moved up to avoid covering content
    const flowerCount = 1000;
    
    for (let i = 0; i < flowerCount; i++) {
      const flower = document.createElement('div');
      flower.className = 'flower';
      
      // Horizontal position (uniform distribution)
      const x = Math.random() * 100;
      
      // Vertical position using single bell curve centered at 50%
      const normalizedY = Math.random();
      let y;
      const bellValue = bellCurve(normalizedY, 0.5, 0.1);
      
      // Accept flower based on bell curve probability
      if (Math.random() < bellValue) {
        y = normalizedY * 100; // 0-100% range with bell curve density
      } else {
        continue; // Skip this flower
      }
      
      // Size variation
      const size = 25 + Math.random() * 35;
      
      flower.style.left = `${x}%`;
      flower.style.top = `${y}%`;
      flower.dataset.leftPct = String(x);
      flower.dataset.topPct = String(y);
      flower.style.width = `${size}px`;
      flower.style.height = `${size}px`;
      flower.style.setProperty('--rot', `${Math.random() * 360}deg`);
      flower.style.setProperty('--delay', `${Math.random() * 3}s`);
      
      // Create flower SVG
      const hue = 320 + Math.random() * 50 - 25;
      const sat = 70 + Math.random() * 20;
      const light = 75 + Math.random() * 10;
      const petalCount = 4 + Math.floor(Math.random() * 3);
      const rotation = Math.random() * 360;
      
      let petals = '';
      for (let p = 0; p < petalCount; p++) {
        const pAngle = (360 / petalCount) * p;
        const petalSize = 14 + Math.random() * 4;
        const distance = 28;
        const px = 50 + distance * Math.cos(pAngle * Math.PI / 180);
        const py = 50 + distance * Math.sin(pAngle * Math.PI / 180);
        petals += `<ellipse cx="${px}" cy="${py}" rx="${petalSize}" ry="${petalSize * 1.3}" 
                   fill="hsl(${hue}, ${sat}%, ${light}%)" opacity="0.9" 
                   transform="rotate(${pAngle} ${px} ${py})"/>`;
      }
      
      flower.innerHTML = `
        <div class="flower-inner">
          <svg width="${size}" height="${size}" viewBox="0 0 100 100" 
               style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">
            <g transform="rotate(${rotation} 50 50)">
              ${petals}
              <circle cx="50" cy="50" r="12" fill="hsl(${hue - 10}, ${sat}%, ${light - 20}%)"/>
            </g>
          </svg>
        </div>
      `;
      
      field.appendChild(flower);
    }
    
    transition.appendChild(field);
  });

  // Cursor proximity interactions
  const fields = Array.from(document.querySelectorAll('.flower-field'));
  const flowers = Array.from(document.querySelectorAll('.flower'));

  // Make all flowers visible immediately (kept for possible CSS hooks)
  flowers.forEach((flower) => {
    flower.classList.add('visible');
  });

  let mouseX = 0;
  let mouseY = 0;
  let rafScheduled = false;

  const EFFECT_RADIUS = 50; // px
  const MAX_PUSH = 50; // px
  const DWELL_MS = 1000; // ms the cursor must stay near before committing movement

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function updateFlowers() {
    rafScheduled = false;
    const now = performance.now();
    for (let f = 0; f < fields.length; f++) {
      const field = fields[f];
      const rect = field.getBoundingClientRect();
      const children = field.children;
      for (let i = 0; i < children.length; i++) {
        const fl = children[i];
        // Only handle .flower elements
        if (!fl || !fl.classList || !fl.classList.contains('flower')) continue;
        const leftPct = parseFloat(fl.dataset.leftPct || '0');
        const topPct = parseFloat(fl.dataset.topPct || '0');
        const cx = rect.left + (leftPct / 100) * rect.width;
        const cy = rect.top + (topPct / 100) * rect.height;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist > 0 && dist < EFFECT_RADIUS) {
          const strength = 1 - dist / EFFECT_RADIUS;
          const push = MAX_PUSH * strength;
          const nx = dx / dist;
          const ny = dy / dist;
          const tx = -nx * push; // px
          const ty = -ny * push; // px

          // Start dwell tracking
          if (!fl.dataset.proxStart) {
            fl.dataset.proxStart = String(now);
            fl.dataset.committed = '0';
          }

          const proxStart = parseFloat(fl.dataset.proxStart || '0');
          const elapsed = now - proxStart;
          const committed = fl.dataset.committed === '1';

          if (!committed && elapsed >= DWELL_MS) {
            // Commit the new base position without visual snap
            const deltaLeftPct = (tx / rect.width) * 100;
            const deltaTopPct = (ty / rect.height) * 100;
            const newLeftPct = clamp(leftPct + deltaLeftPct, 0, 100);
            const newTopPct = clamp(topPct + deltaTopPct, 0, 100);

            const prevTransition = fl.style.transition;
            fl.style.transition = 'none';

            fl.dataset.leftPct = String(newLeftPct);
            fl.dataset.topPct = String(newTopPct);
            fl.style.left = `${newLeftPct}%`;
            fl.style.top = `${newTopPct}%`;
            fl.style.transform = 'translate3d(0, 0, 0)';

            void fl.offsetWidth; // force reflow to apply instant change
            fl.style.transition = prevTransition;

            fl.dataset.committed = '1';
          } else {
            // Temporary push until dwell threshold reached
            fl.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
          }
        } else {
          // Cursor away: clear temp transform and dwell state
          fl.style.transform = 'translate3d(0, 0, 0)';
          delete fl.dataset.proxStart;
          delete fl.dataset.committed;
        }
      }
    }
  }

  function requestUpdate() {
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(updateFlowers);
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    requestUpdate();
  }, { passive: true });

  // On mouse leave: clear temporary transforms and dwell tracking, but keep any committed positions
  window.addEventListener('mouseleave', () => {
    for (let i = 0; i < flowers.length; i++) {
      const fl = flowers[i];
      fl.style.transform = 'translate3d(0, 0, 0)';
      delete fl.dataset.proxStart;
      delete fl.dataset.committed;
    }
  }, { passive: true });

})();