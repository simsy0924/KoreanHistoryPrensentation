// 가벼운 먹물 전환: 일반 슬라이드 이동에만 재생, 타임머신 효과와 충돌하지 않음
(function(){
  const VERSION = '2026-05-27-ink-transition-lite-v3-return-safe';
  if(window.__INK_TRANSITION_LITE__ === VERSION) return;
  window.__INK_TRANSITION_LITE__ = VERSION;

  let playing = false;
  let lastPlay = 0;

  function addStyles(){
    const old = document.getElementById('inkTransitionLiteStyles');
    if(old && old.dataset.version === VERSION) return;
    if(old) old.remove();

    const style = document.createElement('style');
    style.id = 'inkTransitionLiteStyles';
    style.dataset.version = VERSION;
    style.textContent = `
      #inkLiteSweep{
        position:fixed;
        inset:0;
        z-index:10020;
        pointer-events:none;
        opacity:0;
        overflow:hidden;
        contain:layout paint;
      }
      #inkLiteSweep.active{opacity:1}
      #inkLiteSweep .ink-lite-brush{
        position:absolute;
        top:-22vh;
        bottom:-22vh;
        left:-44vw;
        width:48vw;
        transform:translateX(-76vw) rotate(-8deg) skewX(-7deg);
        opacity:0;
        border-radius:48% 52% 58% 42% / 38% 62% 45% 55%;
        clip-path:polygon(10% 0,92% 6%,82% 20%,100% 38%,78% 56%,92% 74%,68% 100%,0 92%,14% 72%,4% 52%,18% 30%,0 11%);
        background:
          radial-gradient(circle at 18% 18%,rgba(245,234,210,.20) 0 1.15vmin,transparent 1.75vmin),
          radial-gradient(circle at 72% 28%,rgba(245,234,210,.14) 0 .95vmin,transparent 1.55vmin),
          radial-gradient(circle at 50% 80%,rgba(245,234,210,.12) 0 1.15vmin,transparent 1.8vmin),
          linear-gradient(90deg,rgba(7,6,4,0),rgba(7,6,4,.62) 13%,rgba(3,3,2,.94) 43%,rgba(4,3,2,.9) 58%,rgba(20,14,9,.72) 77%,rgba(201,154,58,.18) 89%,rgba(7,6,4,0));
        filter:drop-shadow(0 0 13px rgba(0,0,0,.62)) drop-shadow(0 0 8px rgba(201,154,58,.12));
        will-change:transform,opacity;
      }
      #inkLiteSweep .ink-lite-edge{
        position:absolute;
        top:-16vh;
        bottom:-16vh;
        left:-22vw;
        width:9vw;
        opacity:0;
        border-radius:50%;
        transform:translateX(-48vw) rotate(-8deg);
        background:linear-gradient(90deg,transparent,rgba(245,234,210,.32),rgba(201,154,58,.27),transparent);
        filter:blur(5px);
        will-change:transform,opacity;
      }
      #inkLiteSweep.active .ink-lite-brush{
        animation:inkLiteBrush .92s cubic-bezier(.42,0,.18,1) both;
      }
      #inkLiteSweep.active .ink-lite-edge{
        animation:inkLiteEdge .92s cubic-bezier(.42,0,.18,1) both;
      }
      @keyframes inkLiteBrush{
        0%{transform:translateX(-76vw) rotate(-8deg) skewX(-7deg) scaleX(.9);opacity:0}
        14%{opacity:.88}
        44%{transform:translateX(35vw) rotate(-5deg) skewX(-4deg) scaleX(1.24);opacity:.92}
        68%{transform:translateX(75vw) rotate(-6deg) skewX(-5deg) scaleX(1.08);opacity:.78}
        100%{transform:translateX(142vw) rotate(-8deg) skewX(-7deg) scaleX(.9);opacity:0}
      }
      @keyframes inkLiteEdge{
        0%{transform:translateX(-52vw) rotate(-8deg);opacity:0}
        26%{opacity:.82}
        62%{opacity:.54}
        100%{transform:translateX(128vw) rotate(-8deg);opacity:0}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureOverlay(){
    let overlay = document.getElementById('inkLiteSweep');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'inkLiteSweep';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML = '<div class="ink-lite-edge"></div><div class="ink-lite-brush"></div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function isTimeMachineActive(){
    return !!document.querySelector('.timewarp.active,#timewarp.active,.return-present.active,#returnPresentEffect.active');
  }

  function getCurrent(){
    try{ return typeof current === 'number' ? current : -1; }catch(e){ return -1; }
  }

  function getSlideCount(){
    try{ return Array.isArray(slides) ? slides.length : 0; }catch(e){ return 0; }
  }

  function isReturnToPresentTarget(target){
    const count = getSlideCount();
    const idx = getCurrent();
    return count > 1 && idx === count - 2 && target === count - 1;
  }

  function isNextReturnToPresent(){
    const count = getSlideCount();
    const idx = getCurrent();
    return count > 1 && idx === count - 2;
  }

  function isTimeMachineTrigger(args, fnName){
    if(fnName === 'startTimeTravel') return true;
    if(fnName === 'nextSlide' && isNextReturnToPresent()) return true;
    const first = args && args.length ? args[0] : null;
    const target = typeof first === 'number' ? first : parseInt(first, 10);
    return Number.isFinite(target) && isReturnToPresentTarget(target);
  }

  function shouldSkipClick(button){
    const code = button.getAttribute('onclick') || '';
    const text = button.textContent || '';
    if(/startTimeTravel|발표 시작|현재로 돌아|timewarp|return/i.test(code + ' ' + text)) return true;
    if(/nextSlide/.test(code) && isNextReturnToPresent()) return true;
    if(/다음/.test(text) && isNextReturnToPresent()) return true;
    const goToMatch = code.match(/goTo\(([^)]+)\)|linkedGo\(([^),]+)/);
    if(goToMatch){
      const expr = (goToMatch[1] || goToMatch[2] || '').trim();
      let target = NaN;
      try{
        if(expr === 'slides.length-1' || expr === 'slides.length - 1') target = getSlideCount() - 1;
        else target = parseInt(expr, 10);
      }catch(e){}
      if(Number.isFinite(target) && isReturnToPresentTarget(target)) return true;
    }
    return false;
  }

  function playInk(){
    const now = Date.now();
    if(playing || now - lastPlay < 760 || isTimeMachineActive()) return;
    playing = true;
    lastPlay = now;
    addStyles();
    const overlay = ensureOverlay();
    overlay.classList.remove('active');
    void overlay.offsetWidth;
    overlay.classList.add('active');
    setTimeout(() => {
      overlay.classList.remove('active');
      playing = false;
    }, 1000);
  }

  function wrap(name){
    const original = window[name];
    if(typeof original !== 'function' || original.__inkTransitionLiteWrapped) return;
    function wrapped(){
      const args = arguments;
      if(!isTimeMachineTrigger(args, name)) playInk();
      return original.apply(this, args);
    }
    wrapped.__inkTransitionLiteWrapped = true;
    window[name] = wrapped;
  }

  function boot(attempts){
    addStyles();
    ensureOverlay();
    ['goTo','linkedGo','nextSlide','prevSlide'].forEach(wrap);
    if(attempts > 0) setTimeout(() => boot(attempts - 1), 180);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('button,a');
    if(!button) return;
    if(shouldSkipClick(button)) return;
    const code = button.getAttribute('onclick') || '';
    const text = button.textContent || '';
    if(/다음|이전|가기|이동/.test(text) || /goTo|linkedGo|nextSlide|prevSlide/.test(code)) playInk();
  }, true);

  boot(10);
  console.debug('Ink transition lite loaded:', VERSION);
})();
