// 안정화 패치: 첫 제목 반짝임, 선택 도장 고정 표시, 마지막 결론 도장
(function(){
  const VERSION = '2026-05-27-animation-bugfix-v15-no-choice-stamp-animation';
  if(window.__ANIMATION_BUGFIX__ === VERSION) return;
  window.__ANIMATION_BUGFIX__ = VERSION;

  let refreshTimer = null;
  let observerStarted = false;

  function addStyles(){
    const old = document.getElementById('animationBugfixStyles');
    if(old && old.dataset.version === VERSION) return;
    if(old) old.remove();

    const style = document.createElement('style');
    style.id = 'animationBugfixStyles';
    style.dataset.version = VERSION;
    style.textContent = `
      @media (pointer:coarse){body.shake-once{animation:none!important;transform:none!important;filter:none!important}}

      .intro-spark-title{text-shadow:none!important;filter:none!important}
      .intro-spark-title .intro-spark-letter{display:inline-block;opacity:1;transform:none;filter:none;text-shadow:none;will-change:filter,text-shadow}
      .intro-spark-title.sparkle-playing .intro-spark-letter{animation:introSoftSparkle .82s ease-out both}
      @keyframes introSoftSparkle{0%{filter:none;text-shadow:none}26%{filter:brightness(1.28);text-shadow:0 0 7px rgba(245,234,210,.60),0 0 15px rgba(201,154,58,.42),0 0 24px rgba(201,154,58,.14)}46%{filter:brightness(1.08);text-shadow:0 0 6px rgba(201,154,58,.20)}100%{filter:none;text-shadow:none}}

      /* 선택지 도장은 애니메이션 없이 고정 표시만 한다. 여러 번 찍히는 문제를 막기 위한 안정화. */
      .feedback .verdict-stamp{position:static!important;inset:auto!important;right:auto!important;bottom:auto!important;width:max-content!important;height:auto!important;max-width:100%!important;margin:.9rem 0 0 auto!important;padding:.38rem .7rem .42rem!important;border:3px double rgba(141,47,39,.86)!important;border-radius:.35rem!important;display:block!important;place-items:normal!important;color:var(--red,#8d2f27)!important;background:rgba(255,255,255,.30)!important;font-family:"Noto Serif KR",serif!important;font-weight:900!important;font-size:inherit!important;letter-spacing:-.04em!important;opacity:1!important;transform:rotate(-5deg) scale(1)!important;transform-origin:center center!important;filter:none!important;box-shadow:0 6px 14px rgba(141,47,39,.12)!important;pointer-events:none!important;z-index:auto!important;backface-visibility:hidden;-webkit-backface-visibility:hidden;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;animation:none!important}
      .feedback .verdict-stamp span{display:block!important;font-size:1.12rem!important;line-height:1!important;filter:none!important;transform:none!important}
      .feedback .verdict-stamp small{display:block!important;margin-top:.18rem!important;font-family:"Noto Sans KR",sans-serif!important;font-size:.74rem!important;letter-spacing:-.03em!important;white-space:normal!important}
      .feedback .verdict-stamp.stamp-impact{animation:none!important}

      .slide.verdict-stage{position:relative!important;overflow:hidden}
      .final-completion-stamp{position:absolute!important;right:clamp(1.2rem,7vw,5rem)!important;bottom:clamp(7.5rem,22vh,13rem)!important;width:auto!important;height:auto!important;min-width:8.4rem!important;padding:.55rem .9rem .62rem!important;border:.28rem solid #8d2f27!important;border-radius:.55rem!important;display:grid!important;place-items:center!important;color:#8d2f27!important;background:rgba(255,248,232,.10)!important;font-family:"Noto Serif KR",serif!important;font-weight:950!important;font-size:clamp(1.25rem,2.6vmin,2rem)!important;line-height:1!important;letter-spacing:-.08em!important;opacity:1;transform:rotate(-7deg) scale(1);filter:none;box-shadow:inset 0 0 0 .12rem rgba(141,47,39,.42),0 0 24px rgba(141,47,39,.24)!important;z-index:50!important;pointer-events:none!important;transform-origin:center center!important;backface-visibility:hidden;-webkit-backface-visibility:hidden;will-change:transform,opacity,filter}
      .final-completion-stamp span{white-space:nowrap!important;filter:none!important}
      .final-completion-stamp.final-stamp-impact{animation:finalStampImpact .58s cubic-bezier(.16,1.08,.28,1) both!important}
      @keyframes finalStampImpact{0%{opacity:0;transform:translate3d(0,-160px,0) rotate(-17deg) scale(1.8);filter:blur(2px)}58%{opacity:1;transform:translate3d(0,0,0) rotate(-7deg) scale(1);filter:none}100%{opacity:1;transform:translate3d(0,0,0) rotate(-7deg) scale(1);filter:none}}
    `;
    document.head.appendChild(style);
  }

  function getCurrent(){try{return typeof current === 'number' ? current : -1}catch(e){return -1}}
  function getSlideCount(){try{return Array.isArray(slides) ? slides.length : 0}catch(e){return 0}}
  function getActiveSlide(){return document.querySelector('.slide.active') || document.querySelector('.slide')}

  function isIntroSlide(slide){
    if(!slide) return false;
    const h1 = slide.querySelector('h1');
    const compact = h1 ? h1.textContent.replace(/\s+/g,'') : '';
    return getCurrent() === 0 || /역사는흑백이아니다/.test(compact);
  }

  function isConclusionSlide(slide){return !!(slide && getSlideCount() > 0 && getCurrent() === getSlideCount() - 1)}

  function ensureIntroSparkle(slide, force){
    if(!isIntroSlide(slide)) return;
    const h1 = slide.querySelector('h1');
    if(!h1) return;
    if(h1.dataset.sparkleVersion !== 'v15'){
      const compact = h1.textContent.replace(/\s+/g,'');
      const lines = /역사는흑백이아니다/.test(compact) ? ['역사는','흑백이','아니다'] : (h1.textContent || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
      h1.innerHTML = '';
      h1.classList.add('intro-spark-title');
      h1.dataset.sparkleVersion = 'v15';
      h1.dataset.sparklePlayed = '';
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
    if(!force && h1.dataset.sparklePlayed === '1') return;
    h1.dataset.sparklePlayed = '1';
    h1.classList.remove('sparkle-playing');
    h1.querySelectorAll('.intro-spark-letter').forEach((span, i) => {
      span.style.animation = 'none';
      span.style.animationDelay = (i * 0.06) + 's';
      span.style.textShadow = 'none';
      span.style.filter = 'none';
    });
    void h1.offsetWidth;
    h1.querySelectorAll('.intro-spark-letter').forEach(span => span.style.animation = '');
    h1.classList.add('sparkle-playing');
    setTimeout(() => {
      h1.classList.remove('sparkle-playing');
      h1.querySelectorAll('.intro-spark-letter').forEach(span => {
        span.style.textShadow = 'none';
        span.style.filter = 'none';
      });
    }, 1600);
  }

  function visibleFeedbacks(slide){
    if(!slide) return [];
    return Array.from(slide.querySelectorAll('.feedback')).filter(feedback => {
      const text = feedback.textContent.replace(/\s+/g,'').trim();
      if(!text) return false;
      const style = window.getComputedStyle(feedback);
      if(style.display === 'none' || style.visibility === 'hidden') return false;
      return feedback.classList.contains('visible') || feedback.classList.contains('show') || feedback.classList.contains('active') || text.length > 8;
    });
  }

  function ensureChoiceStamp(slide){
    visibleFeedbacks(slide).forEach(feedback => {
      let stamp = feedback.querySelector('.verdict-stamp');
      if(!stamp){
        stamp = document.createElement('div');
        stamp.className = 'verdict-stamp';
        stamp.innerHTML = '<span>판정 완료</span><small>선택 반영</small>';
        feedback.appendChild(stamp);
      }
      stamp.classList.remove('stamp-impact');
      stamp.style.animation = 'none';
      stamp.style.opacity = '1';
      stamp.style.transform = 'rotate(-5deg) scale(1)';
      stamp.style.filter = 'none';
    });
  }

  function ensureFinalStamp(slide){
    if(!slide) return;
    if(!isConclusionSlide(slide)){
      slide.classList.remove('verdict-stage');
      Array.from(slide.children).forEach(el => {
        if(el.classList && (el.classList.contains('final-completion-stamp') || el.classList.contains('cinematic-verdict-stamp')) && !el.closest('.feedback')) el.remove();
      });
      return;
    }
    slide.classList.add('verdict-stage');
    let stamp = Array.from(slide.children).find(el => el.classList && (el.classList.contains('final-completion-stamp') || el.classList.contains('cinematic-verdict-stamp')));
    let created = false;
    if(!stamp){
      stamp = document.createElement('div');
      stamp.className = 'final-completion-stamp';
      stamp.innerHTML = '<span>판결 완료</span>';
      slide.appendChild(stamp);
      created = true;
    }else{
      stamp.classList.add('final-completion-stamp');
      stamp.innerHTML = '<span>판결 완료</span>';
    }
    if(created || stamp.dataset.impactPlayed !== '1'){
      stamp.dataset.impactPlayed = '1';
      stamp.classList.add('final-stamp-impact');
      stamp.addEventListener('animationend', () => stamp.classList.remove('final-stamp-impact'), {once:true});
    }
  }

  function refresh(forceIntro){
    refreshTimer = null;
    addStyles();
    const slide = getActiveSlide();
    if(!slide) return;
    ensureIntroSparkle(slide, !!forceIntro);
    ensureChoiceStamp(slide);
    ensureFinalStamp(slide);
  }

  function schedule(delay, forceIntro){
    if(refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => refresh(forceIntro), delay || 80);
  }

  function wrap(name){
    const original = window[name];
    if(typeof original !== 'function' || original.__animationBugfixWrappedV15) return;
    function wrapped(){
      const result = original.apply(this, arguments);
      const target = arguments.length ? parseInt(arguments[0], 10) : NaN;
      const forceIntro = name === 'resetPresentation' || name === 'startTimeTravel' || target === 0;
      schedule(120, forceIntro);
      return result;
    }
    wrapped.__animationBugfixWrappedV15 = true;
    window[name] = wrapped;
  }

  function hook(){['render','goTo','linkedGo','nextSlide','prevSlide','resetPresentation','startTimeTravel'].forEach(wrap)}

  function startObserver(){
    if(observerStarted) return;
    const app = document.getElementById('app');
    if(!app) return;
    observerStarted = true;
    new MutationObserver(() => schedule(80, false)).observe(app, {childList:true, subtree:false});
  }

  document.addEventListener('click', event => {
    if(event.target.closest('.choice,[data-choice],button,a')) setTimeout(() => refresh(false), 180);
  }, true);

  function boot(attempts){
    addStyles();
    hook();
    startObserver();
    refresh(attempts === 10);
    if(attempts > 0) setTimeout(() => boot(attempts - 1), 180);
  }

  boot(10);
  console.debug('Animation bugfix loaded:', VERSION);
})();
