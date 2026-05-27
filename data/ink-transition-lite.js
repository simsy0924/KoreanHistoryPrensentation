// 가벼운 먹물 전환: 일반 슬라이드 이동에만 짧게 재생, 타임머신 효과와 충돌하지 않음
(function(){
  const VERSION = '2026-05-27-ink-transition-lite-v1';
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
        top:-18vh;
        bottom:-18vh;
        left:-34vw;
        width:34vw;
        transform:translateX(-70vw) rotate(-8deg) skewX(-7deg);
        opacity:0;
        border-radius:48% 52% 58% 42% / 38% 62% 45% 55%;
        clip-path:polygon(10% 0,92% 6%,82% 20%,100% 38%,78% 56%,92% 74%,68% 100%,0 92%,14% 72%,4% 52%,18% 30%,0 11%);
        background:
          radial-gradient(circle at 18% 18%,rgba(245,234,210,.13) 0 .8vmin,transparent 1.2vmin),
          radial-gradient(circle at 72% 28%,rgba(245,234,210,.09) 0 .7vmin,transparent 1.1vmin),
          radial-gradient(circle at 50% 80%,rgba(245,234,210,.08) 0 .9vmin,transparent 1.35vmin),
          linear-gradient(90deg,rgba(7,6,4,0),rgba(7,6,4,.35) 15%,rgba(5,4,3,.74) 48%,rgba(20,14,9,.56) 74%,rgba(201,154,58,.12) 88%,rgba(7,6,4,0));
        filter:drop-shadow(0 0 8px rgba(0,0,0,.45));
        will-change:transform,opacity;
      }
      #inkLiteSweep .ink-lite-edge{
        position:absolute;
        top:-12vh;
        bottom:-12vh;
        left:-20vw;
        width:7vw;
        opacity:0;
        border-radius:50%;
        transform:translateX(-45vw) rotate(-8deg);
        background:linear-gradient(90deg,transparent,rgba(245,234,210,.22),rgba(201,154,58,.18),transparent);
        filter:blur(4px);
        will-change:transform,opacity;
      }
      #inkLiteSweep.active .ink-lite-brush{
        animation:inkLiteBrush .58s cubic-bezier(.42,0,.18,1) both;
      }
      #inkLiteSweep.active .ink-lite-edge{
        animation:inkLiteEdge .58s cubic-bezier(.42,0,.18,1) both;
      }
      @keyframes inkLiteBrush{
        0%{transform:translateX(-70vw) rotate(-8deg) skewX(-7deg) scaleX(.88);opacity:0}
        18%{opacity:.68}
        56%{transform:translateX(58vw) rotate(-5deg) skewX(-4deg) scaleX(1.08);opacity:.7}
        100%{transform:translateX(138vw) rotate(-8deg) skewX(-7deg) scaleX(.86);opacity:0}
      }
      @keyframes inkLiteEdge{
        0%{transform:translateX(-50vw) rotate(-8deg);opacity:0}
        30%{opacity:.65}
        60%{opacity:.3}
        100%{transform:translateX(126vw) rotate(-8deg);opacity:0}
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

  function isTimeMachineTrigger(args, fnName){
    if(fnName === 'startTimeTravel') return true;
    const first = args && args.length ? args[0] : null;
    try{
      if(Array.isArray(slides) && typeof current === 'number'){
        const target = typeof first === 'number' ? first : parseInt(first, 10);
        if(Number.isFinite(target) && target === slides.length - 1 && current === slides.length - 2) return true;
      }
    }catch(e){}
    return false;
  }

  function playInk(){
    const now = Date.now();
    if(playing || now - lastPlay < 420 || isTimeMachineActive()) return;
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
    }, 650);
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
    const code = button.getAttribute('onclick') || '';
    const text = button.textContent || '';
    if(/startTimeTravel|발표 시작|현재로 돌아|timewarp|return/i.test(code + ' ' + text)) return;
    if(/다음|이전|가기|이동/.test(text) || /goTo|linkedGo|nextSlide|prevSlide/.test(code)) playInk();
  }, true);

  boot(10);
  console.debug('Ink transition lite loaded:', VERSION);
})();
