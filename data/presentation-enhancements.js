// 발표 보조 레이어
// 주의: 본문 문구를 자동으로 복구/변경하지 않는다. 디자인, 전환, 깨진 DOM 구조 보정만 담당한다.
(function(){
  'use strict';

  const VERSION = '2026-06-01-design-only-yunchiho-repair';
  if(window.__PRESENTATION_ENHANCEMENTS__ === VERSION) return;
  window.__PRESENTATION_ENHANCEMENTS__ = VERSION;

  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const slideCount = () => $$('.slide').length;
  const activeSlide = () => $('.slide.active');

  let baseGoTo = null;
  let returning = false;
  let inkPlaying = false;

  function addStyles(){
    if($('#presentationEnhancementStyles')) return;
    const style = document.createElement('style');
    style.id = 'presentationEnhancementStyles';
    style.textContent = `
      .slide.active .wrap{animation:pageSettle .34s ease both}
      @keyframes pageSettle{from{opacity:.72;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      .intro-spark-title .intro-spark-letter{display:inline-block;will-change:filter,text-shadow,transform}
      .intro-spark-title.sparkle-playing .intro-spark-letter{animation:introSoftSparkle .86s ease-out both}
      @keyframes introSoftSparkle{0%{filter:none;text-shadow:none;transform:translateY(0)}28%{filter:brightness(1.35);text-shadow:0 0 7px rgba(245,234,210,.62),0 0 18px rgba(201,154,58,.38);transform:translateY(-1px)}100%{filter:none;text-shadow:none;transform:translateY(0)}}

      .feedback .verdict-stamp{display:block;width:max-content;max-width:100%;margin:.9rem 0 0 auto;padding:.38rem .7rem .42rem;border:3px double rgba(141,47,39,.86);border-radius:.35rem;color:var(--red,#8d2f27);background:rgba(255,255,255,.28);font-family:"Noto Serif KR",serif;font-weight:950;letter-spacing:-.05em;transform:rotate(-5deg) scale(1);box-shadow:0 6px 14px rgba(141,47,39,.12);pointer-events:none}
      .feedback .verdict-stamp span{display:block;line-height:1;font-size:1.05rem}.feedback .verdict-stamp small{display:block;margin-top:.14rem;font-family:"Noto Sans KR",sans-serif;font-size:.72rem;letter-spacing:-.03em}
      .feedback .verdict-stamp.stamp-impact{animation:choiceStampImpact .5s both;transform-origin:center center}
      @keyframes choiceStampImpact{0%{opacity:0;transform:translateY(-58px) rotate(-9deg) scale(1.5);filter:blur(1.4px);animation-timing-function:cubic-bezier(.55,.02,.85,.06)}30%{opacity:1;transform:translateY(0) rotate(-5deg) scale(1.13,.82);filter:none;box-shadow:inset 0 0 0 2px rgba(141,47,39,.44),0 0 0 0 rgba(141,47,39,.36),0 9px 18px rgba(141,47,39,.2);animation-timing-function:cubic-bezier(.22,.86,.3,1)}48%{transform:translateY(-3px) rotate(-5deg) scale(.95,1.06);box-shadow:inset 0 0 0 2px rgba(141,47,39,.3),0 0 0 17px rgba(141,47,39,0),0 7px 15px rgba(141,47,39,.14)}68%{transform:translateY(0) rotate(-5deg) scale(1.03,.99)}84%{transform:translateY(0) rotate(-5deg) scale(.99,1.01)}100%{opacity:1;transform:translateY(0) rotate(-5deg) scale(1);filter:none;box-shadow:0 6px 14px rgba(141,47,39,.12)}}

      .diary-card{min-width:0}
      .diary-card .route{margin-top:auto}
      .diary-card .pq{margin-top:auto;padding:.8rem;border-radius:.9rem;background:rgba(141,47,39,.1);font-weight:850;color:#3b291c}
      .diary-tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.45rem}.diary-tags .tag{margin-bottom:0;font-size:.72rem}
      .slide[data-title*="윤치호 일기로 보는"] .cols3,.slide[data-title*="기대는 왜 균열"] .cols3{align-items:stretch}
      .slide[data-title*="윤치호 일기로 보는"] .diary-card .quote,.slide[data-title*="기대는 왜 균열"] .diary-card .quote{max-height:min(34vh,24rem);overflow:auto;padding-right:.95rem;scrollbar-width:thin}
      .slide[data-title*="윤치호 일기로 보는"] .diary-card .quote::-webkit-scrollbar,.slide[data-title*="기대는 왜 균열"] .diary-card .quote::-webkit-scrollbar{width:.45rem}
      .slide[data-title*="윤치호 일기로 보는"] .diary-card .quote::-webkit-scrollbar-thumb,.slide[data-title*="기대는 왜 균열"] .diary-card .quote::-webkit-scrollbar-thumb{background:rgba(141,47,39,.35);border-radius:999px}

      .slide.verdict-stage{position:relative;overflow:hidden}.final-completion-stamp{position:absolute;right:clamp(1.2rem,7vw,5rem);bottom:clamp(7.5rem,22vh,13rem);z-index:50;min-width:8.4rem;padding:.55rem .9rem .62rem;border:.28rem solid #8d2f27;border-radius:.55rem;display:grid;place-items:center;color:#8d2f27;background:rgba(255,248,232,.10);font-family:"Noto Serif KR",serif;font-weight:950;font-size:clamp(1.25rem,2.6vmin,2rem);letter-spacing:-.08em;transform:rotate(-7deg) scale(1);box-shadow:inset 0 0 0 .12rem rgba(141,47,39,.42),0 0 24px rgba(141,47,39,.24);pointer-events:none}.final-completion-stamp.final-stamp-impact{animation:finalStampImpact .56s both;transform-origin:center center}@keyframes finalStampImpact{0%{opacity:0;transform:translate3d(0,-150px,0) rotate(-12deg) scale(1.6);filter:blur(2px);animation-timing-function:cubic-bezier(.55,.02,.85,.05)}32%{opacity:1;transform:translate3d(0,0,0) rotate(-7deg) scale(1.11,.83);filter:none;box-shadow:inset 0 0 0 .12rem rgba(141,47,39,.5),0 0 0 0 rgba(141,47,39,.34),0 0 24px rgba(141,47,39,.24);animation-timing-function:cubic-bezier(.22,.86,.3,1)}50%{transform:translate3d(0,-4px,0) rotate(-7deg) scale(.94,1.07);box-shadow:inset 0 0 0 .12rem rgba(141,47,39,.42),0 0 0 24px rgba(141,47,39,0),0 0 24px rgba(141,47,39,.24)}70%{transform:translate3d(0,0,0) rotate(-7deg) scale(1.03,.99)}86%{transform:rotate(-7deg) scale(.99,1.01)}100%{opacity:1;transform:rotate(-7deg) scale(1);box-shadow:inset 0 0 0 .12rem rgba(141,47,39,.42),0 0 24px rgba(141,47,39,.24)}}

      #inkLiteSweep{position:fixed;inset:0;z-index:10020;pointer-events:none;opacity:0;overflow:hidden;contain:layout paint}#inkLiteSweep.active{opacity:1}#inkLiteSweep .ink-lite-brush{position:absolute;top:-22vh;bottom:-22vh;left:-44vw;width:48vw;transform:translateX(-76vw) rotate(-8deg) skewX(-7deg);opacity:0;border-radius:48% 52% 58% 42% / 38% 62% 45% 55%;clip-path:polygon(10% 0,92% 6%,82% 20%,100% 38%,78% 56%,92% 74%,68% 100%,0 92%,14% 72%,4% 52%,18% 30%,0 11%);background:linear-gradient(90deg,rgba(7,6,4,0),rgba(7,6,4,.62) 13%,rgba(3,3,2,.94) 43%,rgba(4,3,2,.9) 58%,rgba(20,14,9,.72) 77%,rgba(201,154,58,.18) 89%,rgba(7,6,4,0));filter:drop-shadow(0 0 13px rgba(0,0,0,.62))}#inkLiteSweep .ink-lite-edge{position:absolute;top:-16vh;bottom:-16vh;left:-22vw;width:9vw;opacity:0;border-radius:50%;transform:translateX(-48vw) rotate(-8deg);background:linear-gradient(90deg,transparent,rgba(245,234,210,.32),rgba(201,154,58,.27),transparent);filter:blur(5px)}#inkLiteSweep.active .ink-lite-brush{animation:inkLiteBrush .92s cubic-bezier(.42,0,.18,1) both}#inkLiteSweep.active .ink-lite-edge{animation:inkLiteEdge .92s cubic-bezier(.42,0,.18,1) both}@keyframes inkLiteBrush{0%{transform:translateX(-76vw) rotate(-8deg) skewX(-7deg) scaleX(.9);opacity:0}14%{opacity:.88}44%{transform:translateX(35vw) rotate(-5deg) skewX(-4deg) scaleX(1.24);opacity:.92}68%{transform:translateX(75vw) rotate(-6deg) skewX(-5deg) scaleX(1.08);opacity:.78}100%{transform:translateX(142vw) rotate(-8deg) skewX(-7deg) scaleX(.9);opacity:0}}@keyframes inkLiteEdge{0%{transform:translateX(-52vw) rotate(-8deg);opacity:0}26%{opacity:.82}62%{opacity:.54}100%{transform:translateX(128vw) rotate(-8deg);opacity:0}}
      #returnPresentEffect{position:fixed;inset:0;z-index:10030;display:none;place-items:center;overflow:hidden;background:radial-gradient(circle at center,rgba(245,234,210,.18),transparent 18rem),radial-gradient(circle at 80% 20%,rgba(201,154,58,.22),transparent 30rem),radial-gradient(circle at 20% 80%,rgba(141,47,39,.18),transparent 26rem),#070604;color:var(--paper,#f5ead2);pointer-events:none}#returnPresentEffect.active{display:grid;animation:returnFade 3.15s ease both}#returnPresentEffect .return-tunnel{position:absolute;inset:-32vmax;background:repeating-conic-gradient(from 0deg,rgba(245,234,210,.09) 0deg 6deg,transparent 6deg 14deg),repeating-radial-gradient(circle at center,transparent 0 5.2rem,rgba(201,154,58,.11) 5.35rem 5.58rem,transparent 5.72rem 10rem);mix-blend-mode:screen;animation:returnTunnel 2.85s cubic-bezier(.22,.78,.2,1) both;opacity:.9}#returnPresentEffect .return-rings:before,#returnPresentEffect .return-rings:after{content:"";position:absolute;left:50%;top:50%;width:max(34rem,72vmax);height:max(34rem,72vmax);border:3px solid rgba(245,234,210,.24);border-radius:50%;transform:translate(-50%,-50%);animation:returnRing 2.1s ease-out infinite}#returnPresentEffect .return-rings:after{width:max(52rem,106vmax);height:max(52rem,106vmax);animation-delay:.22s;border-color:rgba(201,154,58,.3)}#returnPresentEffect .return-years{position:absolute;inset:0;z-index:3;font-weight:950;font-size:clamp(2rem,7vw,6rem);letter-spacing:-.08em;color:rgba(245,234,210,.2)}#returnPresentEffect .return-years span{position:absolute;left:50%;top:50%;opacity:0;animation:returnYear .72s ease-in-out both}#returnPresentEffect .return-years span:nth-child(1){animation-delay:0s}#returnPresentEffect .return-years span:nth-child(2){animation-delay:.34s}#returnPresentEffect .return-years span:nth-child(3){animation-delay:.68s}#returnPresentEffect .return-years span:nth-child(4){animation-delay:1.02s}#returnPresentEffect .return-years span:nth-child(5){animation-delay:1.36s;color:rgba(245,234,210,.52)}#returnPresentEffect .return-msg{position:absolute;left:50%;bottom:10vh;width:min(92vw,620px);z-index:4;text-align:center;padding:1.15rem 1.45rem;border:1px solid rgba(245,234,210,.22);border-radius:1.4rem;background:rgba(16,14,11,.6);backdrop-filter:blur(10px);box-shadow:0 24px 70px rgba(0,0,0,.3);animation:returnMsg 3.05s ease both}#returnPresentEffect .return-msg strong{display:block;font-family:"Noto Serif KR",serif;font-size:clamp(1.45rem,4vw,2.8rem);letter-spacing:-.06em;line-height:1.12}#returnPresentEffect .return-msg p{margin:.45rem 0 0;color:rgba(255,248,232,.72);line-height:1.55}@keyframes returnFade{0%{opacity:0}12%,80%{opacity:1}100%{opacity:0}}@keyframes returnRing{from{transform:translate(-50%,-50%) scale(1.85);opacity:0}28%{opacity:.55}to{transform:translate(-50%,-50%) scale(.42);opacity:0}}@keyframes returnTunnel{from{transform:scale(1.6) rotate(-170deg);opacity:.15}45%{opacity:.92}to{transform:scale(.76) rotate(0deg);opacity:.25}}@keyframes returnYear{0%{opacity:0;transform:translate(-50%,-50%) scale(.62);filter:blur(2px)}18%,68%{opacity:.95;transform:translate(-50%,-50%) scale(1);filter:blur(0)}100%{opacity:0;transform:translate(-50%,-50%) scale(2.05);filter:blur(8px)}}@keyframes returnMsg{0%,42%{opacity:0;transform:translateX(-50%) translateY(10px) scale(.98)}55%,84%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}100%{opacity:0;transform:translateX(-50%) translateY(-8px) scale(.98)}}
    `;
    document.head.appendChild(style);
  }

  function repairYunchihoDiaryLayout(){
    const slide = $$('.slide').find(s => (s.dataset.title || '').includes('윤치호 일기로 보는') || ($('h2', s)?.textContent || '').includes('윤치호 일기로 보는'));
    if(!slide || slide.dataset.diaryLayoutFixed === '1') return;
    const wrap = $(':scope > .wrap', slide) || $('.wrap', slide);
    const grid = $('.cols3', wrap);
    if(!wrap || !grid) return;

    $$('*', grid).forEach(el => {
      if(el.tagName && el.tagName.toLowerCase() === 'div<') el.remove();
    });

    const firstCard = $('article.diary-card', grid);
    const interpretationOnlyCard = $$('article.diary-card', grid).find(card => card !== firstCard && card.textContent.trim() === '해석');
    if(interpretationOnlyCard){
      const existingText = interpretationOnlyCard.textContent.trim();
      interpretationOnlyCard.remove();
      if(existingText && firstCard && !$('.route', firstCard)){
        const route = document.createElement('div');
        route.className = 'route';
        const strong = document.createElement('strong');
        strong.textContent = existingText;
        route.appendChild(strong);
        firstCard.appendChild(route);
      }
    }

    if(!Array.from(grid.children).some(el => /2\.\s*1898-10-31/.test(el.textContent))){
      const directNodes = Array.from(slide.childNodes);
      const dateNode = directNodes.find(node => node.nodeType === Node.TEXT_NODE && /2\.\s*1898-10-31/.test(node.textContent || ''));
      const sourceSpan = Array.from(slide.children).find(el => el.tagName === 'SPAN' && el.textContent.includes('국역 윤치호'));
      const secondTitle = Array.from(slide.children).find(el => el.tagName === 'H3' && el.textContent.includes('헌의 6조'));

      if(dateNode && secondTitle){
        const secondCard = document.createElement('article');
        secondCard.className = 'paper diary-card';

        const meta = document.createElement('div');
        meta.className = 'diary-meta';
        const dateStrong = document.createElement('strong');
        dateStrong.textContent = dateNode.textContent.trim();
        dateNode.textContent = '';
        meta.appendChild(dateStrong);
        if(sourceSpan) meta.appendChild(sourceSpan);
        secondCard.appendChild(meta);

        let node = secondTitle;
        while(node){
          const next = node.nextSibling;
          secondCard.appendChild(node);
          if(node.nodeType === Node.ELEMENT_NODE && node.matches('.route')) break;
          node = next;
        }
        grid.appendChild(secondCard);
      }
    }

    const thirdCard = Array.from(slide.children).find(el => el.matches?.('article.diary-card') && /3\.\s*1898-11-05/.test(el.textContent));
    if(thirdCard) grid.appendChild(thirdCard);

    const nextBox = Array.from(slide.children).find(el => el.matches?.('.next'));
    if(nextBox) wrap.appendChild(nextBox);

    slide.dataset.diaryLayoutFixed = '1';
  }

  function ensureInk(){
    let overlay = $('#inkLiteSweep');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'inkLiteSweep';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML = '<div class="ink-lite-edge"></div><div class="ink-lite-brush"></div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function ensureReturnOverlay(){
    let overlay = $('#returnPresentEffect');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'returnPresentEffect';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML = '<div class="return-rings"></div><div class="return-tunnel"></div><div class="return-years"><span>1894</span><span>1898</span><span>1904</span><span>대한제국</span><span>현재</span></div><div class="return-msg"><strong>현재로 돌아옵니다</strong><p>조선 말기의 선택을 오늘의 질문으로 가져옵니다</p></div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function isReturnTarget(target, before){ return slideCount() > 1 && before === slideCount() - 2 && target === slideCount() - 1; }
  function goDirect(target){ return typeof baseGoTo === 'function' ? baseGoTo.call(window, target) : window.goTo && window.goTo(target); }

  function playInk(){
    if(inkPlaying || returning || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    inkPlaying = true;
    const overlay = ensureInk();
    overlay.classList.remove('active');
    void overlay.offsetWidth;
    overlay.classList.add('active');
    setTimeout(() => { overlay.classList.remove('active'); inkPlaying = false; }, 1000);
  }

  function playReturnAndGo(target){
    if(returning) return;
    returning = true;
    const overlay = ensureReturnOverlay();
    overlay.classList.remove('active');
    void overlay.offsetWidth;
    overlay.classList.add('active');
    setTimeout(() => { goDirect(target); setTimeout(ensureFinalStamp, 90); }, 980);
    setTimeout(() => { overlay.classList.remove('active'); returning = false; ensureFinalStamp(); }, 3200);
  }

  function enhanceIntro(){
    const slide = activeSlide();
    if(!slide || window.current !== 0) return;
    const h1 = $('h1', slide);
    if(!h1 || h1.dataset.sparkleReady === '1') return;
    const raw = h1.innerText || h1.textContent || '';
    const lines = raw.split(/\n+/).map(line => line.trim()).filter(Boolean);
    if(!lines.length) return;
    h1.innerHTML = '';
    h1.classList.add('intro-spark-title');
    h1.dataset.sparkleReady = '1';
    let n = 0;
    lines.forEach((line, i) => {
      Array.from(line).forEach(ch => {
        const span = document.createElement('span');
        span.className = 'intro-spark-letter';
        span.textContent = ch;
        span.style.animationDelay = (n++ * 0.06) + 's';
        h1.appendChild(span);
      });
      if(i < lines.length - 1) h1.appendChild(document.createElement('br'));
    });
  }

  function playIntroSparkle(){
    enhanceIntro();
    const h1 = $('.slide.active h1.intro-spark-title');
    if(!h1) return;
    h1.classList.remove('sparkle-playing');
    void h1.offsetWidth;
    h1.classList.add('sparkle-playing');
    setTimeout(() => h1.classList.remove('sparkle-playing'), 1700);
  }

  function triggerChoiceStamp(){
    const stamp = $('.slide.active .feedback.visible .verdict-stamp');
    if(!stamp) return;
    stamp.classList.remove('stamp-impact');
    void stamp.offsetWidth;
    stamp.classList.add('stamp-impact');
  }

  function ensureFinalStamp(){
    const slide = activeSlide();
    if(!slide || typeof window.current !== 'number') return;
    const isFinal = window.current === slideCount() - 1;
    slide.classList.toggle('verdict-stage', isFinal);
    if(!isFinal) return;
    let stamp = $(':scope > .final-completion-stamp', slide);
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
      if(name === 'goTo') baseGoTo = original;
      window[name] = function(){
        const before = typeof window.current === 'number' ? window.current : -1;
        const target = name === 'goTo' ? Math.max(0, Math.min(Number(arguments[0]) || 0, slideCount() - 1)) : name === 'nextSlide' ? Math.min(before + 1, slideCount() - 1) : NaN;
        if(!returning && (name === 'goTo' || name === 'nextSlide') && isReturnTarget(target, before)){
          playReturnAndGo(target);
          return;
        }
        const result = original.apply(this, arguments);
        const shouldSkipInk = returning || name === 'startTimeTravel' || name === 'resetPresentation' || target === 0 || before === 0;
        if(!shouldSkipInk) playInk();
        setTimeout(() => { playIntroSparkle(); ensureFinalStamp(); repairYunchihoDiaryLayout(); }, 140);
        return result;
      };
      window[name].__enhancementWrapped = true;
    });
  }

  function boot(attempts){
    addStyles();
    repairYunchihoDiaryLayout();
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
