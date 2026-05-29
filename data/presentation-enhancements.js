// 발표 보조 효과 레이어
// 이 파일은 발표 내용을 수정하지 않고, 애니메이션·전환·보조 UI만 담당한다.
(function(){
  'use strict';
  const VERSION = '2026-05-29-enhancement-layer-v2-return-present';
  if(window.__PRESENTATION_ENHANCEMENTS__ === VERSION) return;
  window.__PRESENTATION_ENHANCEMENTS__ = VERSION;

  let inkPlaying = false;
  let returning = false;

  function addStyles(){
    if(document.getElementById('presentationEnhancementStyles')) return;
    const style = document.createElement('style');
    style.id = 'presentationEnhancementStyles';
    style.textContent = `
      .slide.active .wrap{animation:pageSettle .34s ease both}
      @keyframes pageSettle{from{opacity:.72;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

      .intro-spark-title .intro-spark-letter{display:inline-block;will-change:filter,text-shadow,transform}
      .intro-spark-title.sparkle-playing .intro-spark-letter{animation:introSoftSparkle .86s ease-out both}
      @keyframes introSoftSparkle{
        0%{filter:none;text-shadow:none;transform:translateY(0)}
        28%{filter:brightness(1.35);text-shadow:0 0 7px rgba(245,234,210,.62),0 0 18px rgba(201,154,58,.38);transform:translateY(-1px)}
        100%{filter:none;text-shadow:none;transform:translateY(0)}
      }

      .verdict-stamp,.final-completion-stamp{backface-visibility:hidden;-webkit-font-smoothing:antialiased}
      .feedback .verdict-stamp{display:block;width:max-content;max-width:100%;margin:.9rem 0 0 auto;padding:.38rem .7rem .42rem;border:3px double rgba(141,47,39,.86);border-radius:.35rem;color:var(--red,#8d2f27);background:rgba(255,255,255,.28);font-family:"Noto Serif KR",serif;font-weight:950;letter-spacing:-.05em;transform:rotate(-5deg) scale(1);box-shadow:0 6px 14px rgba(141,47,39,.12);pointer-events:none}
      .feedback .verdict-stamp span{display:block;line-height:1;font-size:1.05rem}.feedback .verdict-stamp small{display:block;margin-top:.14rem;font-family:"Noto Sans KR",sans-serif;font-size:.72rem;letter-spacing:-.03em}
      .feedback .verdict-stamp.stamp-impact{animation:choiceStampImpact .54s cubic-bezier(.16,1.14,.28,1) both}
      @keyframes choiceStampImpact{0%{opacity:0;transform:translateY(-28px) rotate(-15deg) scale(2.15);filter:blur(2px)}54%{opacity:1;transform:translateY(0) rotate(-5deg) scale(.9);filter:none;box-shadow:inset 0 0 0 2px rgba(141,47,39,.34),0 0 0 10px rgba(141,47,39,.16),0 12px 24px rgba(141,47,39,.18)}76%{transform:rotate(-5deg) scale(1.04)}100%{opacity:1;transform:rotate(-5deg) scale(1);filter:none}}

      .slide.verdict-stage{position:relative;overflow:hidden}
      .final-completion-stamp{position:absolute;right:clamp(1.2rem,7vw,5rem);bottom:clamp(7.5rem,22vh,13rem);z-index:50;min-width:8.4rem;padding:.55rem .9rem .62rem;border:.28rem solid #8d2f27;border-radius:.55rem;display:grid;place-items:center;color:#8d2f27;background:rgba(255,248,232,.10);font-family:"Noto Serif KR",serif;font-weight:950;font-size:clamp(1.25rem,2.6vmin,2rem);letter-spacing:-.08em;transform:rotate(-7deg) scale(1);box-shadow:inset 0 0 0 .12rem rgba(141,47,39,.42),0 0 24px rgba(141,47,39,.24);pointer-events:none}
      .final-completion-stamp.final-stamp-impact{animation:finalStampImpact .62s cubic-bezier(.16,1.12,.28,1) both}
      @keyframes finalStampImpact{0%{opacity:0;transform:translate3d(0,-160px,0) rotate(-17deg) scale(1.8);filter:blur(2px)}58%{opacity:1;transform:translate3d(0,0,0) rotate(-7deg) scale(.93);filter:none}78%{transform:rotate(-7deg) scale(1.04)}100%{opacity:1;transform:rotate(-7deg) scale(1)}}

      #inkLiteSweep{position:fixed;inset:0;z-index:10020;pointer-events:none;opacity:0;overflow:hidden;contain:layout paint}
      #inkLiteSweep.active{opacity:1}
      #inkLiteSweep .ink-lite-brush{position:absolute;top:-22vh;bottom:-22vh;left:-44vw;width:48vw;transform:translateX(-76vw) rotate(-8deg) skewX(-7deg);opacity:0;border-radius:48% 52% 58% 42% / 38% 62% 45% 55%;clip-path:polygon(10% 0,92% 6%,82% 20%,100% 38%,78% 56%,92% 74%,68% 100%,0 92%,14% 72%,4% 52%,18% 30%,0 11%);background:linear-gradient(90deg,rgba(7,6,4,0),rgba(7,6,4,.62) 13%,rgba(3,3,2,.94) 43%,rgba(4,3,2,.9) 58%,rgba(20,14,9,.72) 77%,rgba(201,154,58,.18) 89%,rgba(7,6,4,0));filter:drop-shadow(0 0 13px rgba(0,0,0,.62));will-change:transform,opacity}
      #inkLiteSweep .ink-lite-edge{position:absolute;top:-16vh;bottom:-16vh;left:-22vw;width:9vw;opacity:0;border-radius:50%;transform:translateX(-48vw) rotate(-8deg);background:linear-gradient(90deg,transparent,rgba(245,234,210,.32),rgba(201,154,58,.27),transparent);filter:blur(5px)}
      #inkLiteSweep.active .ink-lite-brush{animation:inkLiteBrush .92s cubic-bezier(.42,0,.18,1) both}
      #inkLiteSweep.active .ink-lite-edge{animation:inkLiteEdge .92s cubic-bezier(.42,0,.18,1) both}
      @keyframes inkLiteBrush{0%{transform:translateX(-76vw) rotate(-8deg) skewX(-7deg) scaleX(.9);opacity:0}14%{opacity:.88}44%{transform:translateX(35vw) rotate(-5deg) skewX(-4deg) scaleX(1.24);opacity:.92}68%{transform:translateX(75vw) rotate(-6deg) skewX(-5deg) scaleX(1.08);opacity:.78}100%{transform:translateX(142vw) rotate(-8deg) skewX(-7deg) scaleX(.9);opacity:0}}
      @keyframes inkLiteEdge{0%{transform:translateX(-52vw) rotate(-8deg);opacity:0}26%{opacity:.82}62%{opacity:.54}100%{transform:translateX(128vw) rotate(-8deg);opacity:0}}

      #returnPresentEffect{position:fixed;inset:0;z-index:10030;display:none;place-items:center;overflow:hidden;background:radial-gradient(circle at center,rgba(245,234,210,.18),transparent 18rem),radial-gradient(circle at 80% 20%,rgba(201,154,58,.22),transparent 30rem),radial-gradient(circle at 20% 80%,rgba(141,47,39,.18),transparent 26rem),#070604;color:var(--paper,#f5ead2);pointer-events:none}
      #returnPresentEffect.active{display:grid;animation:returnFade 3.15s ease both}
      #returnPresentEffect .return-tunnel{position:absolute;inset:-32vmax;background:repeating-conic-gradient(from 0deg,rgba(245,234,210,.09) 0deg 6deg,transparent 6deg 14deg),repeating-radial-gradient(circle at center,transparent 0 5.2rem,rgba(201,154,58,.11) 5.35rem 5.58rem,transparent 5.72rem 10rem);mix-blend-mode:screen;animation:returnTunnel 2.85s cubic-bezier(.22,.78,.2,1) both;opacity:.9}
      #returnPresentEffect .return-rings:before,#returnPresentEffect .return-rings:after{content:"";position:absolute;left:50%;top:50%;width:max(34rem,72vmax);height:max(34rem,72vmax);border:3px solid rgba(245,234,210,.24);border-radius:50%;transform:translate(-50%,-50%);animation:returnRing 2.1s ease-out infinite}
      #returnPresentEffect .return-rings:after{width:max(52rem,106vmax);height:max(52rem,106vmax);animation-delay:.22s;border-color:rgba(201,154,58,.3)}
      #returnPresentEffect .return-years{position:absolute;inset:0;z-index:3;font-weight:950;font-size:clamp(2rem,7vw,6rem);letter-spacing:-.08em;color:rgba(245,234,210,.2)}
      #returnPresentEffect .return-years span{position:absolute;left:50%;top:50%;opacity:0;animation:returnYear .72s ease-in-out both}
      #returnPresentEffect .return-years span:nth-child(1){animation-delay:0s}#returnPresentEffect .return-years span:nth-child(2){animation-delay:.34s}#returnPresentEffect .return-years span:nth-child(3){animation-delay:.68s}#returnPresentEffect .return-years span:nth-child(4){animation-delay:1.02s}#returnPresentEffect .return-years span:nth-child(5){animation-delay:1.36s;color:rgba(245,234,210,.52)}
      #returnPresentEffect .return-msg{position:absolute;left:50%;bottom:10vh;width:min(92vw,620px);z-index:4;text-align:center;padding:1.15rem 1.45rem;border:1px solid rgba(245,234,210,.22);border-radius:1.4rem;background:rgba(16,14,11,.6);backdrop-filter:blur(10px);box-shadow:0 24px 70px rgba(0,0,0,.3);animation:returnMsg 3.05s ease both}
      #returnPresentEffect .return-msg strong{display:block;font-family:"Noto Serif KR",serif;font-size:clamp(1.45rem,4vw,2.8rem);letter-spacing:-.06em;line-height:1.12}
      #returnPresentEffect .return-msg p{margin:.45rem 0 0;color:rgba(255,248,232,.72);line-height:1.55}
      @keyframes returnFade{0%{opacity:0}12%,80%{opacity:1}100%{opacity:0}}
      @keyframes returnRing{from{transform:translate(-50%,-50%) scale(1.85);opacity:0}28%{opacity:.55}to{transform:translate(-50%,-50%) scale(.42);opacity:0}}
      @keyframes returnTunnel{from{transform:scale(1.6) rotate(-170deg);opacity:.15}45%{opacity:.92}to{transform:scale(.76) rotate(0deg);opacity:.25}}
      @keyframes returnYear{0%{opacity:0;transform:translate(-50%,-50%) scale(.62);filter:blur(2px)}18%,68%{opacity:.95;transform:translate(-50%,-50%) scale(1);filter:blur(0)}100%{opacity:0;transform:translate(-50%,-50%) scale(2.05);filter:blur(8px)}}
      @keyframes returnMsg{0%,42%{opacity:0;transform:translateX(-50%) translateY(10px) scale(.98)}55%,84%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}100%{opacity:0;transform:translateX(-50%) translateY(-8px) scale(.98)}}
    `;
    document.head.appendChild(style);
  }

  function slideCount(){ return document.querySelectorAll('.slide').length; }

  function ensureInk(){
    let overlay = document.getElementById('inkLiteSweep');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'inkLiteSweep';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML = '<div class="ink-lite-edge"></div><div class="ink-lite-brush"></div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function ensureReturnOverlay(){
    let overlay = document.getElementById('returnPresentEffect');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'returnPresentEffect';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML = '<div class="return-rings"></div><div class="return-tunnel"></div><div class="return-years"><span>1894</span><span>1898</span><span>1904</span><span>대한제국</span><span>현재</span></div><div class="return-msg"><strong>현재로 돌아옵니다</strong><p>조선 말기의 선택을 오늘의 질문으로 가져옵니다</p></div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function playInk(){
    if(inkPlaying || returning || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    inkPlaying = true;
    const overlay = ensureInk();
    overlay.classList.remove('active');
    void overlay.offsetWidth;
    overlay.classList.add('active');
    setTimeout(() => { overlay.classList.remove('active'); inkPlaying = false; }, 1000);
  }

  function isReturnTarget(target){
    const count = slideCount();
    return count > 1 && target === count - 1 && window.current === count - 2;
  }

  function playReturnAndGo(target){
    if(returning) return;
    returning = true;
    const overlay = ensureReturnOverlay();
    overlay.classList.remove('active');
    void overlay.offsetWidth;
    overlay.classList.add('active');
    setTimeout(() => {
      if(typeof window.goTo === 'function') window.goTo(target);
    }, 980);
    setTimeout(() => {
      overlay.classList.remove('active');
      returning = false;
      ensureFinalStamp();
    }, 3200);
  }

  function enhanceIntro(){
    const slide = document.querySelector('.slide.active');
    if(!slide || typeof window.current !== 'number' || window.current !== 0) return;
    const h1 = slide.querySelector('h1');
    if(!h1 || h1.dataset.sparkleReady === '1') return;
    const lines = (h1.textContent || '').replace(/\s+/g,'').includes('역사는흑백이아니다') ? ['역사는','흑백이','아니다'] : (h1.textContent || '').split(/\n+/).map(s=>s.trim()).filter(Boolean);
    h1.innerHTML = '';
    h1.classList.add('intro-spark-title');
    h1.dataset.sparkleReady = '1';
    let n = 0;
    lines.forEach((line, lineIndex) => {
      Array.from(line).forEach(ch => {
        const span = document.createElement('span');
        span.className = 'intro-spark-letter';
        span.textContent = ch;
        span.style.animationDelay = (n * 0.06) + 's';
        h1.appendChild(span);
        n++;
      });
      if(lineIndex < lines.length - 1) h1.appendChild(document.createElement('br'));
    });
  }

  function playIntroSparkle(){
    enhanceIntro();
    const h1 = document.querySelector('.slide.active h1.intro-spark-title');
    if(!h1) return;
    h1.classList.remove('sparkle-playing');
    void h1.offsetWidth;
    h1.classList.add('sparkle-playing');
    setTimeout(() => h1.classList.remove('sparkle-playing'), 1700);
  }

  function triggerChoiceStamp(){
    const stamp = document.querySelector('.slide.active .feedback.visible .verdict-stamp');
    if(!stamp) return;
    stamp.classList.remove('stamp-impact');
    void stamp.offsetWidth;
    stamp.classList.add('stamp-impact');
  }

  function ensureFinalStamp(){
    const slides = Array.from(document.querySelectorAll('.slide'));
    const slide = document.querySelector('.slide.active');
    if(!slide || typeof window.current !== 'number') return;
    const isFinal = window.current === slides.length - 1;
    slide.classList.toggle('verdict-stage', isFinal);
    if(!isFinal) return;
    let stamp = slide.querySelector(':scope > .final-completion-stamp');
    if(!stamp){
      stamp = document.createElement('div');
      stamp.className = 'final-completion-stamp';
      stamp.innerHTML = '<span>판결 완료</span>';
      slide.appendChild(stamp);
    }
    if(stamp.dataset.played === '1') return;
    stamp.dataset.played = '1';
    stamp.classList.add('final-stamp-impact');
    stamp.addEventListener('animationend', () => stamp.classList.remove('final-stamp-impact'), {once:true});
  }

  function wrapNavigation(){
    ['goTo','nextSlide','prevSlide','resetPresentation','startTimeTravel'].forEach(name => {
      const original = window[name];
      if(typeof original !== 'function' || original.__enhancementWrapped) return;
      window[name] = function(){
        const before = typeof window.current === 'number' ? window.current : -1;
        const target = name === 'goTo' ? Math.max(0, Math.min(Number(arguments[0]) || 0, slideCount() - 1)) : name === 'nextSlide' ? Math.min(before + 1, slideCount() - 1) : NaN;
        if((name === 'goTo' || name === 'nextSlide') && isReturnTarget(target)){
          playReturnAndGo(target);
          return;
        }
        const result = original.apply(this, arguments);
        const shouldSkipInk = name === 'startTimeTravel' || name === 'resetPresentation' || target === 0 || before === 0;
        if(!shouldSkipInk) playInk();
        setTimeout(() => { playIntroSparkle(); ensureFinalStamp(); }, 140);
        return result;
      };
      window[name].__enhancementWrapped = true;
    });
  }

  function boot(attempts){
    addStyles();
    ensureInk();
    ensureReturnOverlay();
    wrapNavigation();
    enhanceIntro();
    ensureFinalStamp();
    if(attempts > 0) setTimeout(() => boot(attempts - 1), 160);
  }

  document.addEventListener('click', event => {
    if(event.target.closest('.choice,[data-choice]')) setTimeout(triggerChoiceStamp, 160);
  }, true);

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => boot(10));
  else boot(10);
})();
