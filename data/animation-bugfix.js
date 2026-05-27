// 안정화 패치: 선택 도장 쾅 애니메이션, 첫 슬라이드 자연스러운 글자별 샤라랑, 결론 도장 정리
(function(){
  const VERSION = '2026-05-27-animation-bugfix-v9-stamp-sparkle-stable';
  if (window.__ANIMATION_BUGFIX__ === VERSION) return;
  window.__ANIMATION_BUGFIX__ = VERSION;

  let refreshTimer = null;
  let lastIntroIndex = null;

  function addStyles(){
    const old = document.getElementById('animationBugfixStyles');
    if(old && old.dataset.version === VERSION) return;
    if(old) old.remove();

    const style = document.createElement('style');
    style.id = 'animationBugfixStyles';
    style.dataset.version = VERSION;
    style.textContent = `
      @media (pointer:coarse){
        body.shake-once{animation:none!important;transform:none!important;filter:none!important}
      }

      /* 선택지 피드백 도장: 원본 크기 복구 + 쾅 찍히는 애니메이션 */
      .feedback .verdict-stamp{
        position:static!important;
        inset:auto!important;
        right:auto!important;
        bottom:auto!important;
        width:max-content!important;
        height:auto!important;
        max-width:100%!important;
        margin:.9rem 0 0 auto!important;
        padding:.38rem .7rem .42rem!important;
        border:3px double rgba(141,47,39,.86)!important;
        border-radius:.35rem!important;
        display:block!important;
        place-items:normal!important;
        color:var(--red)!important;
        background:rgba(255,255,255,.30)!important;
        font-family:"Noto Serif KR",serif!important;
        font-weight:900!important;
        font-size:inherit!important;
        letter-spacing:-.04em!important;
        opacity:0;
        transform:rotate(-5deg) scale(.92)!important;
        transform-origin:center center!important;
        filter:none!important;
        box-shadow:0 6px 14px rgba(141,47,39,.12)!important;
        pointer-events:none!important;
        z-index:auto!important;
        backface-visibility:hidden;
        -webkit-backface-visibility:hidden;
        -webkit-font-smoothing:antialiased;
        text-rendering:geometricPrecision;
        will-change:transform,opacity,box-shadow;
      }
      .feedback .verdict-stamp span{
        display:block!important;
        font-size:1.12rem!important;
        line-height:1!important;
        filter:none!important;
        transform:none!important;
      }
      .feedback .verdict-stamp small{
        display:block!important;
        margin-top:.18rem!important;
        font-family:"Noto Sans KR",sans-serif!important;
        font-size:.74rem!important;
        letter-spacing:-.03em!important;
        white-space:normal!important;
      }
      .feedback.visible .verdict-stamp{
        opacity:1!important;
        transform:rotate(-5deg) scale(1)!important;
        animation:none!important;
      }
      .feedback.visible .verdict-stamp.stamp-hit{
        animation:choiceStampImpact .66s cubic-bezier(.15,1.55,.22,1) both!important;
      }
      @keyframes choiceStampImpact{
        0%{
          opacity:0;
          transform:translateY(-18px) rotate(-16deg) scale(2.25);
          filter:blur(2px);
          box-shadow:0 0 0 rgba(141,47,39,0);
        }
        38%{
          opacity:1;
          transform:translateY(2px) rotate(-5deg) scale(.76);
          filter:none;
          box-shadow:inset 0 0 0 2px rgba(141,47,39,.34),0 0 0 8px rgba(141,47,39,.16),0 10px 22px rgba(141,47,39,.18);
        }
        55%{
          transform:translateY(0) rotate(-5deg) scale(1.12);
          box-shadow:inset 0 0 0 1px rgba(141,47,39,.3),0 0 0 2px rgba(141,47,39,.08),0 7px 16px rgba(141,47,39,.14);
        }
        74%{
          transform:translateY(0) rotate(-5deg) scale(.96);
        }
        100%{
          opacity:1;
          transform:translateY(0) rotate(-5deg) scale(1);
          filter:none;
          box-shadow:0 6px 14px rgba(141,47,39,.12);
        }
      }

      /* 첫 슬라이드: 글자는 고정, 빛만 한 글자씩 스쳐 지나감 */
      .intro-spark-title{
        text-shadow:none!important;
        filter:none!important;
      }
      .intro-spark-title .intro-spark-letter{
        display:inline-block;
        opacity:1;
        transform:none;
        filter:none;
        text-shadow:none;
        will-change:filter,text-shadow;
      }
      .intro-spark-title.sparkle-playing .intro-spark-letter{
        animation:introSoftSparkle .82s ease-out both;
      }
      @keyframes introSoftSparkle{
        0%{
          filter:none;
          text-shadow:none;
        }
        26%{
          filter:brightness(1.28);
          text-shadow:
            0 0 7px rgba(245,234,210,.60),
            0 0 15px rgba(201,154,58,.42),
            0 0 24px rgba(201,154,58,.14);
        }
        46%{
          filter:brightness(1.08);
          text-shadow:0 0 6px rgba(201,154,58,.20);
        }
        100%{
          filter:none;
          text-shadow:none;
        }
      }

      /* 마지막 결론 도장 */
      .cinematic-verdict-stamp{
        min-width:8.4rem!important;
        width:auto!important;
        height:auto!important;
        padding:.55rem .85rem .62rem!important;
        border:.28rem solid #8d2f27!important;
        border-radius:.55rem!important;
        color:#8d2f27!important;
        background:rgba(255,248,232,.08)!important;
        font-family:"Noto Serif KR",serif!important;
        font-weight:950!important;
        font-size:clamp(1.25rem,2.6vmin,2rem)!important;
        line-height:1!important;
        letter-spacing:-.08em!important;
        filter:none!important;
        backface-visibility:hidden;
        -webkit-backface-visibility:hidden;
      }
      .cinematic-verdict-stamp span{
        display:block!important;
        white-space:nowrap!important;
        font-size:inherit!important;
        line-height:1!important;
        filter:none!important;
      }
      .cinematic-verdict-stamp.stamp-settled,
      .cinematic-verdict-stamp.drop.stamp-settled{
        opacity:1!important;
        filter:none!important;
        transform:translate3d(0,0,0) rotate(-7deg) scale(1)!important;
      }
      .cinematic-verdict-stamp.final-stamp-hit{
        animation:finalStampImpact .72s cubic-bezier(.15,1.45,.22,1) both!important;
      }
      @keyframes finalStampImpact{
        0%{opacity:0;transform:translate3d(0,-150px,0) rotate(-18deg) scale(1.8);filter:blur(2px)}
        44%{opacity:1;transform:translate3d(0,8px,0) rotate(-7deg) scale(.82);filter:none}
        66%{opacity:1;transform:translate3d(0,0,0) rotate(-7deg) scale(1.08);filter:none}
        100%{opacity:1;transform:translate3d(0,0,0) rotate(-7deg) scale(1);filter:none}
      }
    `;
    document.head.appendChild(style);
  }

  function getActiveSlide(){
    return document.querySelector('.slide.active') || document.querySelector('.slide');
  }

  function currentIndex(){
    try{ return typeof current === 'number' ? current : -1; }catch(e){ return -1; }
  }

  function slideCount(){
    try{ return Array.isArray(slides) ? slides.length : 0; }catch(e){ return 0; }
  }

  function isIntroSlide(slide){
    if(!slide) return false;
    const h1 = slide.querySelector('h1');
    const text = h1 ? h1.textContent.replace(/\s+/g,'') : '';
    return currentIndex() === 0 || /역사는흑백이아니다/.test(text);
  }

  function ensureIntroTitle(slide){
    if(!isIntroSlide(slide)) return null;
    const h1 = slide.querySelector('h1');
    if(!h1) return null;
    if(h1.dataset.sparkleVersion === 'v9') return h1;

    const compact = h1.textContent.replace(/\s+/g,'');
    const lines = /역사는흑백이아니다/.test(compact)
      ? ['역사는','흑백이','아니다']
      : (h1.textContent || '').split(/\n+/).map(s => s.trim()).filter(Boolean);

    h1.innerHTML = '';
    h1.classList.add('intro-spark-title');
    h1.dataset.sparkleVersion = 'v9';
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
    return h1;
  }

  function replayIntroSparkle(slide, force){
    const h1 = ensureIntroTitle(slide);
    if(!h1) return;
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

  function isConclusionSlide(slide){
    return !!(slide && slide.querySelector('.qmain') && slideCount() > 0 && currentIndex() === slideCount() - 1);
  }

  function removeWrongConclusionStamp(slide){
    if(!slide || isConclusionSlide(slide)) return;
    slide.classList.remove('verdict-stage');
    Array.from(slide.children).forEach(el => {
      if(el.classList && (el.classList.contains('cinematic-verdict-stamp') || el.classList.contains('verdict-stamp')) && !el.closest('.feedback')) el.remove();
    });
  }

  function normalizeConclusionStamp(slide){
    if(!isConclusionSlide(slide)) return;
    const stamp = Array.from(slide.children).find(el => el.classList && el.classList.contains('verdict-stamp') && !el.closest('.feedback'));
    if(!stamp) return;
    stamp.classList.add('cinematic-verdict-stamp');
    if(!stamp.querySelector('span')) stamp.innerHTML = '<span>판결 완료</span>';
    else stamp.querySelector('span').textContent = '판결 완료';
    stamp.style.filter = 'none';
    if(!stamp.dataset.finalStampPlayed){
      stamp.dataset.finalStampPlayed = '1';
      stamp.classList.remove('stamp-settled','final-stamp-hit');
      void stamp.offsetWidth;
      stamp.classList.add('final-stamp-hit');
      setTimeout(() => {
        stamp.classList.remove('final-stamp-hit');
        stamp.classList.add('stamp-settled');
      }, 780);
    }
  }

  function replayChoiceStamps(slide){
    if(!slide) return;
    slide.querySelectorAll('.feedback.visible .verdict-stamp').forEach(stamp => {
      stamp.classList.remove('stamp-hit');
      void stamp.offsetWidth;
      stamp.classList.add('stamp-hit');
    });
  }

  function refreshEffects(forceIntro){
    refreshTimer = null;
    addStyles();
    const slide = getActiveSlide();
    if(!slide) return;
    removeWrongConclusionStamp(slide);
    normalizeConclusionStamp(slide);

    const idx = currentIndex();
    if(isIntroSlide(slide)){
      const h1 = ensureIntroTitle(slide);
      const enteredIntro = lastIntroIndex !== 0 || !!forceIntro;
      if(forceIntro && h1) h1.dataset.sparklePlayed = '';
      replayIntroSparkle(slide, enteredIntro);
    }
    lastIntroIndex = idx;
  }

  function scheduleRefresh(delay, forceIntro){
    if(refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => refreshEffects(forceIntro), delay || 80);
  }

  function wrapFunction(name){
    const original = window[name];
    if(typeof original !== 'function' || original.__animationBugfixWrappedV9) return;
    function wrapped(){
      const before = currentIndex();
      const result = original.apply(this, arguments);
      let forceIntro = name === 'resetPresentation' || name === 'startTimeTravel';
      if(name === 'goTo' || name === 'linkedGo'){
        const target = typeof arguments[0] === 'number' ? arguments[0] : parseInt(arguments[0], 10);
        if(target === 0 || before !== 0) forceIntro = true;
      }
      scheduleRefresh(70, forceIntro);
      setTimeout(() => refreshEffects(forceIntro), 280);
      return result;
    }
    wrapped.__animationBugfixWrappedV9 = true;
    window[name] = wrapped;
  }

  function hook(){
    ['render','goTo','linkedGo','nextSlide','prevSlide','resetPresentation','startTimeTravel'].forEach(wrapFunction);
  }

  function boot(attempts){
    addStyles();
    hook();
    refreshEffects(attempts === 8);
    if(attempts > 0) setTimeout(() => boot(attempts - 1), 180);
  }

  document.addEventListener('click', event => {
    if(event.target.closest('.choice,[data-choice]')){
      setTimeout(() => replayChoiceStamps(getActiveSlide()), 45);
      setTimeout(() => replayChoiceStamps(getActiveSlide()), 150);
    }
    if(event.target.closest('button,a,.choice,[data-choice]')){
      const button = event.target.closest('button,a');
      const forceIntro = !!(button && /초기화|처음|1페이지|발표 시작/.test(button.textContent || ''));
      scheduleRefresh(90, forceIntro);
      setTimeout(() => refreshEffects(forceIntro), 320);
    }
  }, true);

  boot(8);
  console.debug('Animation bugfix loaded:', VERSION);
})();
