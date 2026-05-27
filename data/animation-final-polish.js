// 최종 애니메이션 보정: 먹물 스윕 정리, 타임머신 중 먹물 차단, 결론 도장 문구 수정
(function(){
  const VERSION = '2026-05-27-animation-final-polish-v1';
  if(window.__ANIMATION_FINAL_POLISH__ === VERSION) return;
  window.__ANIMATION_FINAL_POLISH__ = VERSION;

  function addStyles(){
    const old = document.getElementById('animationFinalPolishStyles');
    if(old && old.dataset.version === VERSION) return;
    if(old) old.remove();

    const style = document.createElement('style');
    style.id = 'animationFinalPolishStyles';
    style.dataset.version = VERSION;
    style.textContent = `
      /* 타임머신/현재 복귀 연출 중에는 먹물 보정 스윕을 완전히 숨긴다. */
      body.suppress-ink-patch #inkPatchSweep,
      body.timewarp-running #inkPatchSweep{
        opacity:0!important;
        display:none!important;
      }

      /* 기존 검은 커튼 느낌을 줄이고, 짧은 붓질처럼 지나가게 재정의 */
      #inkPatchSweep{
        position:fixed!important;
        inset:0!important;
        z-index:10050!important;
        pointer-events:none!important;
        opacity:0!important;
        overflow:hidden!important;
        contain:layout paint!important;
        mix-blend-mode:normal!important;
        background:transparent!important;
      }
      #inkPatchSweep.active{opacity:1!important}

      #inkPatchSweep .ink-patch-core{
        position:absolute!important;
        top:-18vh!important;
        bottom:-18vh!important;
        left:-42vw!important;
        width:44vw!important;
        opacity:.72!important;
        border-radius:54% 46% 52% 48% / 42% 58% 44% 56%!important;
        clip-path:polygon(8% 0,100% 7%,88% 22%,100% 39%,82% 54%,96% 74%,76% 100%,0 91%,18% 72%,5% 51%,20% 32%,0 13%)!important;
        background:
          radial-gradient(circle at 18% 20%,rgba(245,234,210,.18) 0 .9vmin,transparent 1.4vmin),
          radial-gradient(circle at 72% 28%,rgba(245,234,210,.12) 0 .75vmin,transparent 1.3vmin),
          radial-gradient(circle at 54% 78%,rgba(245,234,210,.10) 0 1.1vmin,transparent 1.7vmin),
          linear-gradient(90deg,rgba(7,6,4,0),rgba(7,6,4,.62) 18%,rgba(3,3,2,.92) 48%,rgba(14,10,7,.78) 76%,rgba(201,154,58,.13) 88%,rgba(7,6,4,0))!important;
        filter:drop-shadow(0 0 12px rgba(0,0,0,.5)) drop-shadow(0 0 8px rgba(201,154,58,.12))!important;
        transform:translateX(-58vw) rotate(-7deg) skewX(-7deg) scaleX(.9)!important;
      }
      #inkPatchSweep.active .ink-patch-core{
        animation:inkBrushPolish .68s cubic-bezier(.42,0,.18,1) both!important;
      }

      #inkPatchSweep .ink-patch-flash{
        position:absolute!important;
        top:-15vh!important;
        bottom:-15vh!important;
        left:-25vw!important;
        width:10vw!important;
        opacity:0!important;
        border-radius:50%!important;
        background:linear-gradient(90deg,transparent,rgba(245,234,210,.18),rgba(201,154,58,.22),transparent)!important;
        filter:blur(5px)!important;
        transform:translateX(-45vw) rotate(-7deg)!important;
      }
      #inkPatchSweep.active .ink-patch-flash{
        animation:inkEdgePolish .68s cubic-bezier(.42,0,.18,1) both!important;
      }

      @keyframes inkBrushPolish{
        0%{transform:translateX(-58vw) rotate(-7deg) skewX(-7deg) scaleX(.9);opacity:0}
        16%{opacity:.72}
        52%{transform:translateX(55vw) rotate(-5deg) skewX(-4deg) scaleX(1.22);opacity:.76}
        100%{transform:translateX(136vw) rotate(-7deg) skewX(-7deg) scaleX(.86);opacity:0}
      }
      @keyframes inkEdgePolish{
        0%{transform:translateX(-54vw) rotate(-7deg);opacity:0}
        30%{opacity:.7}
        64%{opacity:.34}
        100%{transform:translateX(122vw) rotate(-7deg);opacity:0}
      }

      /* 마지막 결론 도장: 한자 대신 한국어 문구 */
      .cinematic-verdict-stamp{
        position:absolute!important;
        right:7%!important;
        bottom:13%!important;
        width:auto!important;
        min-width:8.4rem!important;
        height:auto!important;
        padding:.55rem .85rem .62rem!important;
        border:.28rem solid #8d2f27!important;
        border-radius:.55rem!important;
        display:grid!important;
        place-items:center!important;
        color:#8d2f27!important;
        background:rgba(255,248,232,.08)!important;
        font-family:"Noto Serif KR",serif!important;
        font-weight:950!important;
        font-size:clamp(1.25rem,2.6vmin,2rem)!important;
        line-height:1!important;
        letter-spacing:-.08em!important;
        box-shadow:inset 0 0 0 .12rem rgba(141,47,39,.42),0 0 24px rgba(141,47,39,.25)!important;
        transform-origin:center center!important;
      }
      .cinematic-verdict-stamp span{
        display:block!important;
        white-space:nowrap!important;
        font-size:inherit!important;
        line-height:1!important;
        filter:none!important;
      }
      .cinematic-verdict-stamp.drop.stamp-settled,
      .cinematic-verdict-stamp.stamp-settled{
        transform:translate3d(0,0,0) rotate(-7deg) scale(1)!important;
        filter:none!important;
        opacity:1!important;
      }
    `;
    document.head.appendChild(style);
  }

  function hasActiveTimeMachine(){
    const timewarp = document.querySelector('.timewarp.active,#timewarp.active');
    const returning = document.querySelector('.return-present.active,#returnPresentEffect.active');
    return !!(timewarp || returning || document.body.classList.contains('timewarp-running'));
  }

  function setInkSuppressed(on){
    document.body.classList.toggle('suppress-ink-patch', !!on);
    const ink = document.getElementById('inkPatchSweep');
    if(on && ink) ink.classList.remove('active');
  }

  function isTimeMachineTrigger(el){
    const button = el && el.closest ? el.closest('button,a') : null;
    if(!button) return false;
    const code = button.getAttribute('onclick') || '';
    const text = (button.textContent || '').trim();
    return /startTimeTravel|timeTravel|timewarp|현재로 돌아|시간을|발표 시작/.test(code + ' ' + text);
  }

  function normalizeConclusionStamp(){
    const stamps = document.querySelectorAll('.cinematic-verdict-stamp, .slide.active > .verdict-stamp:not(.feedback .verdict-stamp)');
    stamps.forEach(stamp => {
      if(stamp.closest('.feedback')) return;
      stamp.classList.add('cinematic-verdict-stamp');
      if(!stamp.querySelector('span')){
        stamp.innerHTML = '<span>판결 완료</span>';
      }else{
        stamp.querySelector('span').textContent = '판결 완료';
      }
    });
  }

  function watchTimeMachine(){
    const active = hasActiveTimeMachine();
    document.body.classList.toggle('timewarp-running', active);
    if(active) setInkSuppressed(true);
    else setTimeout(() => setInkSuppressed(false), 220);
  }

  function boot(){
    addStyles();
    normalizeConclusionStamp();
    watchTimeMachine();
  }

  document.addEventListener('click', event => {
    if(isTimeMachineTrigger(event.target)){
      setInkSuppressed(true);
      setTimeout(() => setInkSuppressed(true), 0);
      setTimeout(watchTimeMachine, 80);
      setTimeout(watchTimeMachine, 360);
      setTimeout(watchTimeMachine, 1200);
    }
  }, true);

  const observer = new MutationObserver(() => {
    addStyles();
    normalizeConclusionStamp();
    watchTimeMachine();
  });
  observer.observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['class']});

  boot();
  setTimeout(boot, 250);
  setTimeout(boot, 900);
  console.debug('Animation final polish loaded:', VERSION);
})();
