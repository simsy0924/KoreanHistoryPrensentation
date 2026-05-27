// 안정화 패치: 선택 도장 CSS 충돌 수정, 첫 슬라이드 글자별 샤라랑 재실행, 잘못된 결론 도장 제거, 도장 애니메이션 재시작
(function(){
  const VERSION = '2026-05-27-animation-bugfix-v8-soft-sparkle';
  if (window.__ANIMATION_BUGFIX__ === VERSION) return;
  window.__ANIMATION_BUGFIX__ = VERSION;

  let refreshTimer = null;
  let lastIntroReplayAt = 0;

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

      /* 선택지 피드백 도장은 원본 스타일로 고정한다. */
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
        border:3px double rgba(141,47,39,.82)!important;
        border-radius:.35rem!important;
        display:block!important;
        place-items:normal!important;
        color:var(--red)!important;
        background:rgba(255,255,255,.28)!important;
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
        will-change:transform,opacity;
        backface-visibility:hidden;
        -webkit-backface-visibility:hidden;
        -webkit-font-smoothing:antialiased;
        text-rendering:geometricPrecision;
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
      .feedback.visible .verdict-stamp.stamp-replay{
        animation:choiceStampHitSharp .52s cubic-bezier(.18,1.45,.28,1) both!important;
      }
      @keyframes choiceStampHitSharp{
        0%{opacity:0;transform:rotate(-13deg) scale(1.72);filter:blur(1.2px)}
        44%{opacity:1;transform:rotate(-5deg) scale(.82);filter:none}
        68%{opacity:1;transform:rotate(-5deg) scale(1.09);filter:none}
        100%{opacity:1;transform:rotate(-5deg) scale(1);filter:none}
      }

      /* 첫 슬라이드 전용: 글자별로 빛이 스치고 지나가는 샤라랑 효과 */
      .intro-spark-title{
        text-shadow:none!important;
        filter:none!important;
      }
      .intro-spark-title .intro-spark-letter{
        display:inline-block;
        opacity:1;
        filter:none;
        transform:translateZ(0) scale(1);
        text-shadow:none;
        will-change:filter,text-shadow,transform;
      }
      .intro-spark-title.sparkle-playing .intro-spark-letter{
        animation:introLetterSparkle .92s cubic-bezier(.2,.7,.2,1) both;
      }
      @keyframes introLetterSparkle{
        0%{
          opacity:1;
          transform:translateZ(0) scale(1);
          filter:none;
          text-shadow:none;
        }
        28%{
          opacity:1;
          transform:translateY(-1px) scale(1.025);
          filter:brightness(1.35);
          text-shadow:
            0 0 8px rgba(245,234,210,.72),
            0 0 18px rgba(201,154,58,.48),
            0 0 30px rgba(201,154,58,.18);
        }
        52%{
          opacity:1;
          transform:translateY(0) scale(1.005);
          filter:brightness(1.08);
          text-shadow:0 0 7px rgba(201,154,58,.25);
        }
        100%{
          opacity:1;
          transform:translateZ(0) scale(1);
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
      .cinematic-verdict-stamp.stamp-replay-final{
        animation:finalStampHitSharp .7s cubic-bezier(.18,1.42,.28,1) both!important;
      }
      @keyframes finalStampHitSharp{
        0%{opacity:0;transform:translate3d(0,-130px,0) rotate(-18deg) scale(1.75);filter:blur(2px)}
        50%{opacity:1;transform:translate3d(0,10px,0) rotate(-7deg) scale(.9);filter:none}
        72%{opacity:1;transform:translate3d(0,0,0) rotate(-7deg) scale(1.06);filter:none}
        100%{opacity:1;transform:translate3d(0,0,0) rotate(-7deg) scale(1);filter:none}
      }
    `;
    document.head.appendChild(style);
  }

  function getActiveSlide(){
    return document.querySelector('.slide.active') || document.querySelector('.slide');
  }

  function currentIndex(){
    try{ if(typeof current === 'number') return current; }catch(e){}
    return -1;
  }

  function slideCount(){
    try{ if(Array.isArray(slides)) return slides.length; }catch(e){}
    return 0;
  }

  function isIntroSlide(slide){
    if(!slide) return false;
    const idx = currentIndex();
    const h1 = slide.querySelector('h1');
    const text = h1 ? h1.textContent.replace(/\s+/g,'') : '';
    return idx === 0 || /역사는흑백이아니다/.test(text);
  }

  function buildIntroSparkTitle(slide){
    if(!isIntroSlide(slide)) return;
    const h1 = slide.querySelector('h1');
    if(!h1) return;

    const compact = h1.textContent.replace(/\s+/g,'');
    const lines = /역사는흑백이아니다/.test(compact)
      ? ['역사는','흑백이','아니다']
      : (h1.textContent || '').split(/\n+/).map(s => s.trim()).filter(Boolean);

    h1.innerHTML = '';
    h1.classList.add('intro-spark-title');
    h1.dataset.animationBugfixSplit = 'spark-v8';

    let charIndex = 0;
    lines.forEach((line, lineIndex) => {
      Array.from(line).forEach(ch => {
        const span = document.createElement('span');
        span.className = 'intro-spark-letter';
        span.textContent = ch;
        span.style.animationDelay = (charIndex * 0.052) + 's';
        h1.appendChild(span);
        charIndex++;
      });
      if(lineIndex < lines.length - 1) h1.appendChild(document.createElement('br'));
    });
  }

  function replayIntroSparkle(slide, force){
    if(!isIntroSlide(slide)) return;
    const h1 = slide.querySelector('h1');
    if(!h1) return;

    if(h1.dataset.animationBugfixSplit !== 'spark-v8' || !h1.querySelector('.intro-spark-letter')){
      buildIntroSparkTitle(slide);
    }

    if(!force && h1.dataset.sparklePlayedOnce === '1') return;

    const now = Date.now();
    if(!force && now - lastIntroReplayAt < 1600) return;
    lastIntroReplayAt = now;
    h1.dataset.sparklePlayedOnce = '1';

    h1.classList.remove('sparkle-playing');
    h1.querySelectorAll('.intro-spark-letter').forEach((span, i) => {
      span.style.animation = 'none';
      span.style.animationDelay = (i * 0.052) + 's';
      span.style.textShadow = 'none';
      span.style.filter = 'none';
      span.style.transform = 'translateZ(0) scale(1)';
    });
    void h1.offsetWidth;
    h1.querySelectorAll('.intro-spark-letter').forEach(span => {
      span.style.animation = '';
    });
    h1.classList.add('sparkle-playing');
    setTimeout(() => {
      h1.classList.remove('sparkle-playing');
      h1.querySelectorAll('.intro-spark-letter').forEach(span => {
        span.style.textShadow = 'none';
        span.style.filter = 'none';
        span.style.transform = 'translateZ(0) scale(1)';
      });
    }, 1700);
  }

  function isConclusionSlide(slide){
    if(!slide || !slide.querySelector('.qmain')) return false;
    const idx = currentIndex();
    const count = slideCount();
    return count > 0 && idx === count - 1;
  }

  function removeWrongConclusionStamp(slide){
    if(!slide) return;
    if(isConclusionSlide(slide)) return;
    slide.classList.remove('verdict-stage');
    Array.from(slide.children).forEach(el => {
      if(el.classList && (el.classList.contains('cinematic-verdict-stamp') || el.classList.contains('verdict-stamp')) && !el.closest('.feedback')){
        el.remove();
      }
    });
  }

  function normalizeConclusionStamp(slide){
    if(!isConclusionSlide(slide)) return;
    const stamp = Array.from(slide.children).find(el =>
      el.classList && el.classList.contains('verdict-stamp') && !el.closest('.feedback')
    );
    if(!stamp) return;
    stamp.classList.add('cinematic-verdict-stamp');
    if(!stamp.querySelector('span')) stamp.innerHTML = '<span>판결 완료</span>';
    else stamp.querySelector('span').textContent = '판결 완료';
    stamp.style.filter = 'none';

    if(!stamp.dataset.finalStampPlayed){
      stamp.dataset.finalStampPlayed = '1';
      replayFinalStamp(stamp);
    }
  }

  function replayChoiceStamps(slide){
    if(!slide) return;
    slide.querySelectorAll('.feedback.visible .verdict-stamp').forEach(stamp => {
      stamp.classList.remove('stamp-replay');
      void stamp.offsetWidth;
      stamp.classList.add('stamp-replay');
    });
  }

  function replayFinalStamp(stamp){
    if(!stamp) return;
    stamp.classList.remove('stamp-settled','stamp-replay-final');
    void stamp.offsetWidth;
    stamp.classList.add('stamp-replay-final');
    setTimeout(() => {
      stamp.classList.remove('stamp-replay-final');
      stamp.classList.add('stamp-settled');
    }, 760);
  }

  function refreshEffects(forceIntro){
    refreshTimer = null;
    addStyles();
    const slide = getActiveSlide();
    if(!slide) return;
    removeWrongConclusionStamp(slide);
    normalizeConclusionStamp(slide);
    if(isIntroSlide(slide)){
      buildIntroSparkTitle(slide);
      if(forceIntro){
        const h1 = slide.querySelector('h1');
        if(h1) h1.dataset.sparklePlayedOnce = '';
      }
      replayIntroSparkle(slide, !!forceIntro);
    }
    replayChoiceStamps(slide);
  }

  function scheduleRefresh(delay, forceIntro){
    if(refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => refreshEffects(forceIntro), delay || 80);
  }

  function wrapFunction(name){
    const original = window[name];
    if(typeof original !== 'function' || original.__animationBugfixWrappedStable) return;
    function wrapped(){
      const result = original.apply(this, arguments);
      const forceIntro = name === 'resetPresentation' || name === 'startTimeTravel' || name === 'goTo';
      scheduleRefresh(60, forceIntro);
      setTimeout(() => refreshEffects(forceIntro), 260);
      return result;
    }
    wrapped.__animationBugfixWrappedStable = true;
    window[name] = wrapped;
  }

  function hook(){
    ['render','goTo','linkedGo','nextSlide','prevSlide','resetPresentation','startTimeTravel'].forEach(wrapFunction);
  }

  function boot(attempts){
    addStyles();
    hook();
    refreshEffects(attempts === 10);
    if(attempts > 0) setTimeout(() => boot(attempts - 1), 180);
  }

  document.addEventListener('click', event => {
    if(event.target.closest('.choice,[data-choice]')){
      setTimeout(() => replayChoiceStamps(getActiveSlide()), 40);
      setTimeout(() => replayChoiceStamps(getActiveSlide()), 140);
    }
    if(event.target.closest('button,a,.choice,[data-choice]')){
      const maybeIntro = event.target.closest('button,a') && /초기화|처음|발표 시작/.test(event.target.closest('button,a').textContent || '');
      scheduleRefresh(90, maybeIntro);
      setTimeout(() => refreshEffects(maybeIntro), 320);
    }
  }, true);

  boot(10);
  console.debug('Animation bugfix stable loaded:', VERSION);
})();
