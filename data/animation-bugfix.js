// 안정화 패치: 선택 도장 CSS 충돌 수정, 첫 슬라이드 반짝임 재실행, 잘못된 결론 도장 제거
(function(){
  const VERSION = '2026-05-27-animation-bugfix-v5-stable';
  if (window.__ANIMATION_BUGFIX__ === VERSION) return;
  window.__ANIMATION_BUGFIX__ = VERSION;

  let refreshTimer = null;

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
        animation:choiceStampHitSharp .42s cubic-bezier(.2,1.35,.3,1) both!important;
      }
      @keyframes choiceStampHitSharp{
        0%{opacity:0;transform:rotate(-12deg) scale(1.45);filter:none}
        55%{opacity:1;transform:rotate(-5deg) scale(.88);filter:none}
        72%{opacity:1;transform:rotate(-5deg) scale(1.04);filter:none}
        100%{opacity:1;transform:rotate(-5deg) scale(1);filter:none}
      }

      /* 첫 슬라이드 제목 반짝임 재생용 */
      .intro-title-replayed .ink-letter{
        animation:inkBleedIn 1.15s cubic-bezier(.2,.7,.2,1) both!important;
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

  function splitIntroTitle(slide){
    if(!isIntroSlide(slide)) return;
    const h1 = slide.querySelector('h1');
    if(!h1) return;

    if(!h1.dataset.animationBugfixSplit){
      const originalHTML = h1.innerHTML;
      const tmp = document.createElement('div');
      tmp.innerHTML = originalHTML;
      h1.innerHTML = '';

      let charIndex = 0;
      function processNode(node, target){
        if(node.nodeType === Node.TEXT_NODE){
          Array.from(node.textContent || '').forEach(ch => {
            if(ch === ' '){
              target.appendChild(document.createTextNode(' '));
              return;
            }
            const span = document.createElement('span');
            span.className = 'ink-letter';
            span.textContent = ch;
            span.style.animationDelay = (charIndex * 0.065) + 's';
            target.appendChild(span);
            charIndex++;
          });
        }else if(node.nodeType === Node.ELEMENT_NODE){
          if(node.tagName === 'BR'){
            target.appendChild(document.createElement('br'));
          }else{
            const clone = node.cloneNode(false);
            Array.from(node.childNodes).forEach(child => processNode(child, clone));
            target.appendChild(clone);
          }
        }
      }
      Array.from(tmp.childNodes).forEach(child => processNode(child, h1));
      h1.dataset.animationBugfixSplit = '1';
    }

    // 초기화 후 돌아왔을 때도 반짝임을 다시 재생한다.
    h1.classList.remove('intro-title-replayed');
    void h1.offsetWidth;
    h1.classList.add('intro-title-replayed');
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
  }

  function refreshEffects(){
    refreshTimer = null;
    addStyles();
    const slide = getActiveSlide();
    if(!slide) return;
    removeWrongConclusionStamp(slide);
    normalizeConclusionStamp(slide);
    splitIntroTitle(slide);
  }

  function scheduleRefresh(delay){
    if(refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshEffects, delay || 80);
  }

  function wrapFunction(name){
    const original = window[name];
    if(typeof original !== 'function' || original.__animationBugfixWrappedStable) return;
    function wrapped(){
      const result = original.apply(this, arguments);
      scheduleRefresh(60);
      setTimeout(refreshEffects, 260);
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
    refreshEffects();
    if(attempts > 0) setTimeout(() => boot(attempts - 1), 180);
  }

  document.addEventListener('click', event => {
    if(event.target.closest('button,a,.choice,[data-choice]')){
      scheduleRefresh(90);
      setTimeout(refreshEffects, 320);
    }
  }, true);

  boot(10);
  console.debug('Animation bugfix stable loaded:', VERSION);
})();
