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
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" 
             style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">
          <g transform="rotate(${rotation} 50 50)">
            ${petals}
            <circle cx="50" cy="50" r="12" fill="hsl(${hue - 10}, ${sat}%, ${light - 20}%)"/>
          </g>
        </svg>
      `;
      
      field.appendChild(flower);
    }
    
    transition.appendChild(field);
  });

  // Make all flowers visible immediately
  const allFlowers = document.querySelectorAll('.flower');
  allFlowers.forEach((flower) => {
    flower.classList.add('visible');
  });

})();