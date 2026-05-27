// 시네마틱 영화적 애니메이션: 먹 웨이브 전환, 인트로 글리치, 결론 도장, 황금 입자
(function(){
  const VERSION = '2026-05-26-cinematic-v6';
  if (window.__CINEMATIC_EFFECTS__ === VERSION) return;
  window.__CINEMATIC_EFFECTS__ = VERSION;

  // ============================================
  // 디바이스 감지 & 환경 설정
  // ============================================
  const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent);
  const isLowEnd = (() => {
    const mem = navigator.deviceMemory && navigator.deviceMemory < 4;
    const cores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    return isMobile || mem || cores;
  })();
  const prefersReducedMotion = !!(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // ============================================
  // 1. CSS 스타일 주입 (한 번만)
  // ============================================
  function addStyles(){
    if(document.getElementById('cinematicEffectsStyles')) return;
    const style = document.createElement('style');
    style.id = 'cinematicEffectsStyles';
    style.textContent = `
      /* ========== 먹 웨이브 오버레이 ========== */
      .ink-sweep{
        position:fixed; inset:0; z-index:9998;
        pointer-events:none; opacity:0;
        will-change:opacity;
      }
      .ink-sweep.active{opacity:1}
      .ink-sweep svg, .ink-sweep path, .ink-sweep .ink-splatter{pointer-events:none}
      .ink-sweep svg{width:100%; height:100%; display:block}
      .ink-sweep .ink-splatter{
        position:absolute; inset:0;
        background-image:
          radial-gradient(circle at 14% 28%, #0a0907 0 0.5vmin, transparent 0.7vmin),
          radial-gradient(circle at 82% 65%, #0a0907 0 0.7vmin, transparent 0.9vmin),
          radial-gradient(circle at 48% 18%, #0a0907 0 0.4vmin, transparent 0.6vmin),
          radial-gradient(circle at 22% 78%, #0a0907 0 0.6vmin, transparent 0.8vmin),
          radial-gradient(circle at 70% 38%, #0a0907 0 0.5vmin, transparent 0.7vmin);
        opacity:0;
        transition:opacity .28s ease;
      }
      .ink-sweep.splatting .ink-splatter{opacity:.85}

      /* ========== 인트로 글자 단위 먹번짐 ========== */
      @keyframes inkBleedIn{
        0%{
          opacity:0;
          filter:blur(14px) contrast(2.2);
          transform:translateY(10px) scale(.9);
          text-shadow:0 0 24px rgba(201,154,58,0);
        }
        35%{
          opacity:.65;
          filter:blur(5px) contrast(1.5);
          transform:translateY(0) scale(1) translateX(2px);
          text-shadow:-2px 0 rgba(141,47,39,.65), 2px 0 rgba(201,154,58,.65);
        }
        55%{
          opacity:.85;
          transform:translateY(0) scale(1) translateX(-1px);
          text-shadow:1px 0 rgba(141,47,39,.45), -1px 0 rgba(201,154,58,.55);
          filter:blur(2px) contrast(1.2);
        }
        100%{
          opacity:1;
          filter:blur(0) contrast(1);
          transform:translateY(0) scale(1) translateX(0);
          text-shadow:
            0 0 18px rgba(201,154,58,.45),
            0 0 36px rgba(201,154,58,.22);
        }
      }
      .ink-letter{
        display:inline-block;
        opacity:0;
        animation:inkBleedIn 1.15s cubic-bezier(.2,.7,.2,1) both;
        will-change:opacity, filter, transform;
      }

      /* ========== 결론 슬라이드 클라이맥스 ========== */
      .verdict-stage{position:relative; overflow:hidden}
      .verdict-stage::before{
        content:"";
        position:absolute; left:-10%; right:-10%; bottom:-30%;
        height:170%;
        background:radial-gradient(ellipse at 50% 100%,
          rgba(20,15,11,.96) 0%,
          rgba(40,31,23,.7) 26%,
          rgba(40,31,23,.3) 50%,
          transparent 75%);
        transform:translateY(100%);
        animation:inkRise 2.4s cubic-bezier(.2,.7,.2,1) .25s forwards;
        will-change:transform;
        z-index:0;
        pointer-events:none;
      }
      .verdict-stage > *{position:relative; z-index:1}
      @keyframes inkRise{
        to{transform:translateY(0)}
      }
      .verdict-stage .qmain .qline{
        display:block;
        opacity:0;
        animation:lineReveal 1.1s cubic-bezier(.2,.7,.2,1) both;
        will-change:opacity, transform, filter;
      }
      @keyframes lineReveal{
        0%  {opacity:0; transform:translateY(22px); filter:blur(6px)}
        60% {opacity:1; transform:translateY(-3px); filter:blur(0)}
        100%{opacity:1; transform:translateY(0);
             filter:drop-shadow(0 0 12px rgba(201,154,58,.4))}
      }

      /* ========== 잉크 도장 ========== */
      .verdict-stamp{
        position:absolute;
        right:8%; bottom:14%;
        width:clamp(5rem, 11vmin, 9rem);
        height:clamp(5rem, 11vmin, 9rem);
        border:.42rem solid #8d2f27;
        border-radius:14%;
        display:grid; place-items:center;
        color:#8d2f27;
        font-family:"Noto Serif KR", serif;
        font-weight:900;
        font-size:clamp(2.4rem, 6vmin, 4.4rem);
        opacity:0;
        transform:translate(0,-200px) rotate(-25deg) scale(2.4);
        filter:blur(6px);
        background:rgba(141,47,39,.04);
        box-shadow:inset 0 0 0 .15rem rgba(141,47,39,.4);
        pointer-events:none;
        z-index:5;
      }
      .verdict-stamp.drop{
        animation:stampDrop .55s cubic-bezier(.5,1.7,.4,1) forwards,
                  stampSettle 1.8s ease-out .55s forwards;
      }
      @keyframes stampDrop{
        0%  {opacity:0; transform:translate(0,-200px) rotate(-25deg) scale(2.4); filter:blur(6px)}
        60% {opacity:1; transform:translate(0,10px)    rotate(-9deg)  scale(.9);  filter:blur(0)}
        100%{opacity:1; transform:translate(0,0)       rotate(-7deg)  scale(1);   filter:blur(0)}
      }
      @keyframes stampSettle{
        0%  {box-shadow:inset 0 0 0 .15rem rgba(141,47,39,.4)}
        100%{box-shadow:inset 0 0 0 .15rem rgba(141,47,39,.6),
                        0 0 32px rgba(141,47,39,.4)}
      }
      @keyframes camShake{
        0%,100%{transform:translate(0,0)}
        20%{transform:translate(-4px,2px)}
        40%{transform:translate(3px,-2px)}
        60%{transform:translate(-2px,-2px)}
        80%{transform:translate(2px,1px)}
      }
      body.shake-once{animation:camShake .22s ease-out}

      /* ========== 황금 입자 캔버스 ========== */
      #goldDust{
        position:fixed; inset:0;
        pointer-events:none;
        z-index:9990;
        mix-blend-mode:screen;
      }

      /* ========== 진행도 바 글리치 펄스 ========== */
      .progress{position:relative; overflow:hidden}
      .progress::after{
        content:""; position:absolute; inset:0;
        background:linear-gradient(90deg,transparent,rgba(241,199,110,.55),transparent);
        transform:translateX(-100%);
        animation:progSweep 8s ease-in-out infinite;
        mix-blend-mode:overlay; pointer-events:none;
      }
      @keyframes progSweep{
        0%,80%,100%{transform:translateX(-100%); opacity:0}
        85%{transform:translateX(0); opacity:1}
        92%{transform:translateX(60%); opacity:.6}
        99%{transform:translateX(120%); opacity:0}
      }

      /* ========== 챕터 전환 글리치 ========== */
      @keyframes glitchSlice{
        0%,100%{ clip-path:inset(0 0 0 0); transform:translate(0,0); filter:none }
        12%{ clip-path:inset(18% 0 62% 0); transform:translate(-5px,0); filter:hue-rotate(20deg) }
        24%{ clip-path:inset(72% 0 10% 0); transform:translate(4px,0) }
        36%{ clip-path:inset(40% 0 42% 0); transform:translate(-2px,1px); filter:hue-rotate(-12deg) }
        50%{ clip-path:inset(0 0 82% 0); transform:translate(3px,-1px) }
        70%{ clip-path:inset(0 0 0 0); transform:translate(0,0) }
      }
      .glitching{animation:glitchSlice .36s steps(7,end) 1}

      /* ========== reduced-motion 처리 ========== */
      @media (prefers-reduced-motion: reduce){
        .ink-letter{animation:none; opacity:1}
        .verdict-stage::before{animation:none; transform:translateY(0); opacity:.6}
        .verdict-stage .qmain .qline{animation:none; opacity:1}
        .verdict-stamp.drop{animation:none; opacity:1;
          transform:translate(0,0) rotate(-7deg) scale(1); filter:none}
        body.shake-once{animation:none}
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================
  // 2. 먹 웨이브 SVG 오버레이 생성
  // ============================================
  function createInkOverlay(){
    let wrap = document.getElementById('inkSweep');
    if(wrap) return wrap;
    wrap = document.createElement('div');
    wrap.id = 'inkSweep';
    wrap.className = 'ink-sweep';
    wrap.setAttribute('aria-hidden','true');
    wrap.innerHTML = `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="inkTurb" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05"
                          numOctaves="2" seed="3"/>
            <feDisplacementMap in="SourceGraphic" scale="14"/>
          </filter>
        </defs>
        <path id="inkPath" fill="#0a0907"
              ${isMobile ? '' : 'filter="url(#inkTurb)"'}
              d="M-20,0 L-20,100 L-20,100 L-20,0 Z"/>
      </svg>
      <div class="ink-splatter"></div>
    `;
    document.body.appendChild(wrap);
    return wrap;
  }

  // ============================================
  // 3. 안전한 네비게이션 호출 (fallback 포함)
  // ============================================
  function safeNavigate(oldFn, target, label, safeTarget){
    let ok = false;

    // 1차: 훅 체인 호출
    try {
      oldFn.call(window, target, label);
      ok = true;
    } catch(e) {
      console.warn('[cinematic] navigation hook failed, trying fallback:', e);
    }

    if(ok) return;

    // 2차: goTo 직접 호출
    try {
      if(typeof window.goTo === 'function'){
        window.goTo(safeTarget);
        ok = true;
      }
    } catch(e) {
      console.warn('[cinematic] goTo fallback failed:', e);
    }

    if(ok) return;

    // 3차: current 직접 설정 + render
    try {
      window.current = safeTarget;
      if(typeof window.render === 'function') window.render();
    } catch(e) {
      console.warn('[cinematic] direct render fallback failed:', e);
    }
  }

  function safeNextSlide(oldFn){
    let ok = false;
    try {
      oldFn.call(window);
      ok = true;
    } catch(e) {
      console.warn('[cinematic] nextSlide hook failed, trying fallback:', e);
    }

    if(ok) return;

    try {
      const target = Math.min(
        (typeof window.current === 'number' ? window.current : 0) + 1,
        (Array.isArray(window.slides) ? window.slides.length : 1) - 1
      );
      if(typeof window.goTo === 'function') window.goTo(target);
      else {
        window.current = target;
        if(typeof window.render === 'function') window.render();
      }
    } catch(e) {
      console.warn('[cinematic] nextSlide fallback failed:', e);
    }
  }

  // ============================================
  // 4. 먹 웨이브 전환 재생
  // ============================================
  function playInkSweep(onMidpoint, duration){
    return new Promise((resolve, reject) => {
      if(prefersReducedMotion){
        try{ if(onMidpoint) onMidpoint(); }catch(e){}
        resolve();
        return;
      }

      const wrap = createInkOverlay();
      const DURATION = duration || (isMobile ? 500 : 900);
      const HALF = Math.round(DURATION / 2);

      wrap.classList.add('active');

      if(isMobile){
        // CSS clip-path 스윕 — 모바일에서 더 안정적
        wrap.style.clipPath = 'inset(0 100% 0 0)';
        wrap.style.transition = 'none';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            wrap.style.transition = `clip-path ${HALF}ms cubic-bezier(0.4,0,0.2,1)`;
            wrap.style.clipPath = 'inset(0 0% 0 0)';
          });
        });

        var midFired = false;
        setTimeout(() => {
          if(!midFired){
            midFired = true;
            try{ if(onMidpoint) onMidpoint(); }catch(e){ console.warn('[cinematic] onMidpoint error:', e); }
          }
          wrap.classList.add('splatting');
          wrap.style.transition = `clip-path ${HALF}ms cubic-bezier(0.2,0,0.8,1)`;
          wrap.style.clipPath = 'inset(0 0% 0 100%)';
          setTimeout(() => {
            wrap.classList.remove('active','splatting');
            wrap.style.clipPath = '';
            wrap.style.transition = '';
            resolve();
          }, HALF + 40);
        }, HALF);

      } else {
        // SVG path RAF 스윕 — 데스크탑
        const path = wrap.querySelector('#inkPath');
        if(!path){
          try{ if(onMidpoint) onMidpoint(); }catch(e){}
          wrap.classList.remove('active');
          resolve();
          return;
        }

        const start = performance.now();
        let midCalled = false;

        function frame(now){
          try{
            const t = Math.min(1, (now - start) / DURATION);
            const e = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;

            let leftEdge, rightEdge;
            if(t < 0.5){
              const p = e * 2;
              leftEdge  = -20 + p * 140;
              rightEdge = leftEdge - 45;
            } else {
              const p = (e - 0.5) * 2;
              leftEdge  = 120 + p * 30;
              rightEdge = -20 + p * 140;
            }
            path.setAttribute('d',
              `M${rightEdge - 30},0 L${leftEdge},0 L${leftEdge + 8},100 L${rightEdge - 25},100 Z`
            );

            if(t >= 0.5 && !midCalled){
              midCalled = true;
              try{ if(onMidpoint) onMidpoint(); }catch(e){ console.warn('[cinematic] onMidpoint error:', e); }
              wrap.classList.add('splatting');
            }

            if(t < 1) requestAnimationFrame(frame);
            else {
              wrap.classList.remove('active','splatting');
              resolve();
            }
          }catch(err){
            // 오류 시에도 네비게이션은 보장
            if(!midCalled){
              midCalled = true;
              try{ if(onMidpoint) onMidpoint(); }catch(e){}
            }
            wrap.classList.remove('active','splatting');
            resolve();
          }
        }
        requestAnimationFrame(frame);
      }
    });
  }

  // ============================================
  // 5. 인트로 슬라이드 강화 (글자 단위 등장)
  // ============================================
  function enhanceIntroSlide(){
    if(prefersReducedMotion) return;
    const activeSlide = document.querySelector('.slide.active') || document.querySelector('.slide');
    if(!activeSlide) return;
    const h1 = activeSlide.querySelector('h1');
    if(!h1 || h1.dataset.cinematicSplit) return;

    const originalHTML = h1.innerHTML;
    h1.innerHTML = '';

    const tmp = document.createElement('div');
    tmp.innerHTML = originalHTML;

    let charIndex = 0;
    function processNode(node, target){
      if(node.nodeType === Node.TEXT_NODE){
        const chars = (node.textContent || '').split('');
        chars.forEach(ch => {
          if(ch === ' '){
            target.appendChild(document.createTextNode(' '));
            return;
          }
          const span = document.createElement('span');
          span.className = 'ink-letter';
          span.textContent = ch;
          span.style.animationDelay = (charIndex * 0.07) + 's';
          target.appendChild(span);
          charIndex++;
        });
      } else if(node.nodeType === Node.ELEMENT_NODE){
        if(node.tagName === 'BR'){
          target.appendChild(document.createElement('br'));
        } else {
          const clone = node.cloneNode(false);
          Array.from(node.childNodes).forEach(child => processNode(child, clone));
          target.appendChild(clone);
        }
      }
    }
    Array.from(tmp.childNodes).forEach(child => processNode(child, h1));
    h1.dataset.cinematicSplit = '1';
  }

  // ============================================
  // 6. 결론 슬라이드 클라이맥스
  // ============================================
  function enhanceConclusionSlide(){
    const activeSlide = document.querySelector('.slide.active');
    if(!activeSlide || activeSlide.dataset.cinematicConclusion) return;

    activeSlide.classList.add('verdict-stage');
    activeSlide.dataset.cinematicConclusion = '1';

    const qmain = activeSlide.querySelector('.qmain');
    if(qmain && !qmain.dataset.cinematicQuote){
      const html = qmain.innerHTML;
      const parts = html.split(/<br\s*\/?>/i);
      qmain.innerHTML = parts
        .map((p, i) => {
          const delay = (1.6 + i * 0.55).toFixed(2);
          return `<span class="qline" style="animation-delay:${delay}s">${p}</span>`;
        })
        .join('');
      qmain.dataset.cinematicQuote = '1';
    }

    const lineCount = qmain ? qmain.querySelectorAll('.qline').length : 0;
    const stampDelay = (1.6 + lineCount * 0.55 + 0.8) * 1000;

    setTimeout(() => {
      dropVerdictStamp(activeSlide);
    }, stampDelay);
  }

  function dropVerdictStamp(parent){
    if(prefersReducedMotion) return;
    let stamp = parent.querySelector('.verdict-stamp');
    if(!stamp){
      stamp = document.createElement('div');
      stamp.className = 'verdict-stamp';
      stamp.innerHTML = '<span>判</span>';
      parent.appendChild(stamp);
    }
    stamp.classList.remove('drop');
    void stamp.offsetWidth;
    stamp.classList.add('drop');

    setTimeout(() => {
      if(!isLowEnd){
        document.body.classList.remove('shake-once');
        void document.body.offsetWidth;
        document.body.classList.add('shake-once');
        setTimeout(() => document.body.classList.remove('shake-once'), 250);
      }
      if(window.soundManager) window.soundManager.play('choice-complete');
    }, 380);
  }

  // ============================================
  // 7. 황금 입자 캔버스 (마우스 추적)
  // ============================================
  function initGoldDust(){
    if(isLowEnd || prefersReducedMotion) return;
    if(document.getElementById('goldDust')) return;

    const cvs = document.createElement('canvas');
    cvs.id = 'goldDust';
    document.body.appendChild(cvs);
    const ctx = cvs.getContext('2d');
    let W, H, mx = -999, my = -999;
    const particles = [];
    const MAX = 24;
    let lastFrame = 0;

    function resize(){
      W = cvs.width = window.innerWidth;
      H = cvs.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, {passive:true});

    window.addEventListener('pointermove', e => {
      mx = e.clientX;
      my = e.clientY;
    }, {passive:true});

    function spawn(){
      if(particles.length >= MAX) return;
      particles.push({
        x: mx + (Math.random()-.5)*36,
        y: my + (Math.random()-.5)*36,
        vx: (Math.random()-.5)*.5,
        vy: -Math.random()*.7 - .15,
        life: 1,
        size: 1 + Math.random()*1.8
      });
    }

    function loop(){
      if(document.hidden){
        requestAnimationFrame(loop);
        return;
      }
      lastFrame++;
      if(lastFrame % 3 === 0 && mx > 0) spawn();
      ctx.clearRect(0, 0, W, H);
      for(let i = particles.length - 1; i >= 0; i--){
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.014;
        if(p.life <= 0){
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(241,199,110,${p.life * .6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  // ============================================
  // 8. 챕터 전환 글리치
  // ============================================
  function playGlitchPulse(target){
    if(!target || isLowEnd || prefersReducedMotion) return;
    target.classList.remove('glitching');
    void target.offsetWidth;
    target.classList.add('glitching');
    setTimeout(() => target.classList.remove('glitching'), 380);
  }

  function getStageNumber(slideEl){
    if(!slideEl) return null;
    const kicker = slideEl.querySelector('.kicker');
    if(!kicker) return null;
    const text = kicker.textContent || '';
    const m = text.match(/^(\d+)단계/);
    return m ? parseInt(m[1], 10) : null;
  }

  // ============================================
  // 9. 네비게이션 훅킹 (linkedGo, nextSlide)
  // ============================================
  function isReturnOrTimewarpTarget(target){
    if(typeof slides === 'undefined' || !Array.isArray(slides)) return false;
    if(typeof current !== 'number') return false;
    if(target === slides.length - 1 && current === slides.length - 2) return true;
    return false;
  }

  // goTo를 직접 호출하는 공통 네비게이션 핸들러
  // 래퍼 체인(nextSlide→linkedGo→시네마틱 훅)을 완전히 건너뛰어 재진입 데드락을 방지
  function doNavigate(navTarget, isChapterChange){
    try {
      if(typeof window.goTo === 'function'){
        window.goTo(navTarget);
      } else {
        try { current = navTarget; } catch(e) {} // eslint-disable-line no-undef
        if(typeof window.render === 'function') window.render();
      }
    } catch(e){
      console.warn('[cinematic] doNavigate failed:', e);
    }
    try { const b = document.getElementById('routeBridge'); if(b) b.classList.remove('active'); } catch(e) {}
    try { moving = false; } catch(e) {} // eslint-disable-line no-undef
    // 선택지 버튼 상태 리셋: goTo()는 render()를 호출하지 않아
    // attachChoiceAnimations가 전 슬라이드에서 설정한 opacity/pointer-events가 남아있음
    try {
      document.querySelectorAll('.choice, [data-choice]').forEach(btn => {
        btn.style.animation = '';
        btn.style.pointerEvents = '';
        btn.classList.remove('selected');
      });
    } catch(e) {}
    if(isChapterChange && !isMobile){
      setTimeout(() => playGlitchPulse(document.querySelector('.slide.active')), 50);
    }
  }

  function hookNavigation(){
    if(window.__CINEMATIC_NAV_HOOKED__) return;
    window.__CINEMATIC_NAV_HOOKED__ = true;

    const oldLinkedGo = window.linkedGo;
    if(typeof oldLinkedGo === 'function'){
      window.linkedGo = function(target, label){
        if(typeof slides === 'undefined' || !Array.isArray(slides)){
          return oldLinkedGo.call(this, target, label);
        }
        const safeTarget = Math.max(0, Math.min(
          typeof target === 'number' ? target : parseInt(target, 10) || 0,
          slides.length - 1
        ));
        if(safeTarget === current) return oldLinkedGo.call(this, target, label);
        if(isReturnOrTimewarpTarget(safeTarget)) return oldLinkedGo.call(this, target, label);

        const indexDelta = Math.abs(safeTarget - current);
        doNavigate(safeTarget, indexDelta >= 2);
      };
    }

    const oldNextSlide = window.nextSlide;
    if(typeof oldNextSlide === 'function'){
      window.nextSlide = function(){
        if(typeof slides === 'undefined' || !Array.isArray(slides)){
          return oldNextSlide.call(this);
        }
        const target = Math.min(
          (typeof current === 'number' ? current : 0) + 1,
          slides.length - 1
        );
        if(isReturnOrTimewarpTarget(target)) return oldNextSlide.call(this);
        if(target === current) return oldNextSlide.call(this);
        doNavigate(target, false);
      };
    }
  }

  // ============================================
  // 10. render 훅 (인트로/결론 강화)
  // ============================================
  function hookRender(){
    if(window.__CINEMATIC_RENDER_HOOKED__) return;
    window.__CINEMATIC_RENDER_HOOKED__ = true;

    const oldRender = window.render;
    if(typeof oldRender !== 'function') return;

    window.render = function(){
      return oldRender.apply(this, arguments);
    };
  }

  // ============================================
  // 11. Boot
  // ============================================
  function boot(attempts, delay){
    const d = delay || (isMobile ? 200 : 140);
    addStyles();
    createInkOverlay();
    if(typeof slides !== 'undefined' && Array.isArray(slides) &&
       typeof linkedGo === 'function' && typeof nextSlide === 'function'){
      hookNavigation();
      hookRender();
      initGoldDust();
      setTimeout(enhanceIntroSlide, 120);
      console.debug('Cinematic effects loaded:', VERSION);
      return;
    }
    if(attempts > 0) setTimeout(() => boot(attempts - 1, d), d);
  }

  boot(isMobile ? 30 : 15);
})();
