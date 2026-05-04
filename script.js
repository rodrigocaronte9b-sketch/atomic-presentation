(() => {
    const track = document.getElementById('carouselTrack');
    const viewport = document.getElementById('carouselViewport');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const progressBar = document.getElementById('progressBar');
    const hint = document.getElementById('keyboardHint');
    const slides = document.querySelectorAll('.slide');
    const activeSlides = Array.from(slides).filter(s => !s.dataset.archived).length;
    let current = 0;
    let isAnimating = false;

    // ── Go To Slide ──
    function goTo(index) {
        if (isAnimating || index < 0 || index >= activeSlides || index === current) return;
        isAnimating = true;
        current = index;
        track.style.transform = `translateX(-${current * 100}vw)`;
        indicators.forEach((ind, i) => ind.classList.toggle('active', i === current));
        progressBar.style.width = `${((current + 1) / activeSlides) * 100}%`;
        slides.forEach(s => s.classList.remove('active'));
        
        setTimeout(() => { 
            slides[current].classList.add('active'); 
        }, 200);
        
        setTimeout(() => { isAnimating = false; }, 900);
        
        if (hint && !hint.classList.contains('hidden')) {
            setTimeout(() => hint.classList.add('hidden'), 1500);
        }
    }

    // Init first slide
    slides[0].classList.add('active');

    // ── Controls ──
    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    indicators.forEach(ind => {
        ind.addEventListener('click', () => goTo(parseInt(ind.dataset.slide)));
    });

    // ── Keyboard ──
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(current - 1);
    });

    // ── Mouse Wheel ──
    let wheelTimeout;
    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (e.deltaX > 30 || e.deltaY > 30) goTo(current + 1);
            else if (e.deltaX < -30 || e.deltaY < -30) goTo(current - 1);
        }, 50);
    }, { passive: false });

    // ── Touch / Drag ──
    let startX = 0, startY = 0, isDragging = false;
    viewport.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 60) {
            dx < 0 ? goTo(current + 1) : goTo(current - 1);
        }
    });
    // Mouse drag
    viewport.addEventListener('mousedown', (e) => { startX = e.clientX; isDragging = true; });
    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 80) {
            dx < 0 ? goTo(current + 1) : goTo(current - 1);
        }
    });

    // ── FLOATING SPHERES ──
    const sphereContainer = document.getElementById('spheresContainer');
    const colors = [
        'rgba(156,81,224,0.6)',
        'rgba(0,194,203,0.5)',
        'rgba(249,168,37,0.4)',
        'rgba(156,81,224,0.3)',
        'rgba(0,194,203,0.3)',
    ];

    function spawnSphere() {
        const sphere = document.createElement('div');
        sphere.className = 'sphere';
        const size = Math.random() * 8 + 3;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const tx = (Math.random() - 0.5) * 400;
        const ty = -(Math.random() * 600 + 200);
        const dur = Math.random() * 8 + 6;
        const color = colors[Math.floor(Math.random() * colors.length)];

        sphere.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${x}px; top: ${y}px;
            background: ${color};
            box-shadow: 0 0 ${size * 2}px ${color};
            --tx: ${tx}px; --ty: ${ty}px;
            animation-duration: ${dur}s;
        `;
        sphereContainer.appendChild(sphere);
        setTimeout(() => sphere.remove(), dur * 1000);
    }

    // Spawn spheres periodically
    setInterval(spawnSphere, 400);
    // Initial burst
    for (let i = 0; i < 20; i++) setTimeout(spawnSphere, i * 100);

    // ── Auto-hide hint ──
    setTimeout(() => { if (hint) hint.classList.add('hidden'); }, 5000);
})();
