// 애니메이션 복구 패치: 슬라이드 전환 후 효과 재실행, 선택 도장/결론 도장 CSS 충돌 분리
(function(){
  const VERSION = '2026-05-27-animation-bugfix-v2';
  if (window.__ANIMATION_BUGFIX__ === VERSION) return;
  window.__ANIMATION_BUGFIX__ = VERSION;

  let refreshQueued = false;

  function addStyles(){
    const old = document.getElementById('animationBugfixStyles');
    if(old && old.dataset.version === VERSION) return;
    if(old) old.remove();

    const style = document.createElement('style');
    style.id = 'animationBugfixStyles';
    style.dataset.version = VERSION;
    style.textContent = `
      /* 태블릿/모바일 Safari에서 도장 직후 전체 화면이 흐려지는 현상 방지 */
      @media (pointer:coarse){
        body.shake-once{animation:none!important;transform:none!important;filter:none!important}
      }

      /* 원본 선택 판결 도장 복구
         cinematic-effects.js의 전역 .verdict-stamp 스타일이 선택 도장까지 덮어써서
         화면 오른쪽에 큰 흐린 도장처럼 보이던 문제를 여기서 되돌린다. */
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

      /* 결론 클라이맥스 도장은 별도 클래스로만 보정한다. */
      .cinematic-verdict-stamp,
      .cinematic-verdict-stamp *{
        -webkit-font-smoothing:antialiased;
        text-rendering:geometricPrecision;
        backface-visibility:hidden;
        -webkit-backface-visibility:hidden;
      }

      .cinematic-verdict-stamp{
        transform-origin:center center;
        will-change:transform,opacity;
      }

      .cinematic-verdict-stamp.stamp-settled,
      .cinematic-verdict-stamp.drop.stamp-settled{
        opacity:1!important;
        filter:none!important;
        transform:translate3d(0,0,0) rotate(-7deg) scale(1)!important;
        animation:stampSettleSharp 1.2s ease-out forwards!important;
      }

      .cinematic-verdict-stamp.stamp-settled span{
        filter:none!important;
        transform:translateZ(0);
      }

      @keyframes stampSettle{
        0%{box-shadow:inset 0 0 0 .15rem rgba(141,47,39,.46),0 0 0 rgba(141,47,39,0);filter:none;opacity:1}
        100%{box-shadow:inset 0 0 0 .15rem rgba(141,47,39,.68),0 0 22px rgba(141,47,39,.28);filter:none;opacity:1}
      }

      @keyframes stampSettleSharp{
        from{box-shadow:inset 0 0 0 .15rem rgba(141,47,39,.56),0 0 18px rgba(141,47,39,.22)}
        to{box-shadow:inset 0 0 0 .15rem rgba(141,47,39,.68),0 0 22px rgba(141,47,39,.28)}
      }

      .slide.active.fx-replay .diary-card,
      .slide.active.fx-replay .source-doc,
      .slide.active.fx-replay .source-summary article{
        animation-play-state:running;
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

  function splitIntroTitle(activeSlide){
    if(!activeSlide) return;
    const h1 = activeSlide.querySelector('h1');
    if(!h1 || h1.dataset.animationBugfixSplit) return;
    if(activeSlide.querySelector('.kicker')) return;

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

  function isLikelyConclusion(activeSlide){
    if(!activeSlide || !activeSlide.querySelector('.qmain')) return false;
    const idx = currentIndex();
    const count = slideCount();
    if(count > 0 && idx >= count - 2) return true;
    const text = activeSlide.textContent || '';
    return /결론|판결|判|현재|흑백이 아니다|역사는/.test(text);
  }

  function prepareVerdictLines(activeSlide){
    const qmain = activeSlide.querySelector('.qmain');
    if(!qmain || qmain.dataset.animationBugfixQuote) return 0;

    if(qmain.querySelector('.qline')){
      qmain.dataset.animationBugfixQuote = '1';
      return qmain.querySelectorAll('.qline').length;
    }

    const html = qmain.innerHTML.trim();
    const parts = html.split(/<br\s*\/?>/i).map(p => p.trim()).filter(Boolean);
    qmain.innerHTML = (parts.length ? parts : [html]).map((p, i) => {
      const delay = (1.35 + i * 0.5).toFixed(2);
      return `<span class="qline" style="animation-delay:${delay}s">${p}</span>`;
    }).join('');
    qmain.dataset.animationBugfixQuote = '1';
    return qmain.querySelectorAll('.qline').length;
  }

  function directCinematicStamp(activeSlide){
    if(!activeSlide) return null;
    const direct = Array.from(activeSlide.children).find(el =>
      el.classList && el.classList.contains('verdict-stamp') && !el.closest('.feedback')
    );
    if(direct) direct.classList.add('cinematic-verdict-stamp');
    return direct || null;
  }

  function settleStamp(stamp){
    if(!stamp || !stamp.classList.contains('cinematic-verdict-stamp')) return;
    stamp.classList.add('stamp-settled');
    stamp.style.filter = 'none';
  }

  function attachStampSharpener(stamp){
    if(!stamp || !stamp.classList.contains('cinematic-verdict-stamp') || stamp.dataset.animationBugfixSharpener) return;
    stamp.dataset.animationBugfixSharpener = '1';
    stamp.addEventListener('animationend', event => {
      if(event.animationName === 'stampDrop' || event.animationName === 'stampSettle'){
        settleStamp(stamp);
      }
    });
  }

  function dropVerdictStamp(activeSlide){
    if(!activeSlide) return;
    let stamp = directCinematicStamp(activeSlide);
    if(!stamp){
      stamp = document.createElement('div');
      stamp.className = 'verdict-stamp cinematic-verdict-stamp';
      stamp.innerHTML = '<span>判</span>';
      activeSlide.appendChild(stamp);
    }

    attachStampSharpener(stamp);
    stamp.classList.remove('drop','stamp-settled');
    stamp.style.filter = '';
    void stamp.offsetWidth;
    stamp.classList.add('drop');

    // 낙하가 끝난 직후 선명한 고정 상태로 전환한다.
    setTimeout(() => settleStamp(stamp), 690);
    setTimeout(() => {
      try{ if(window.soundManager) window.soundManager.play('choice-complete'); }catch(e){}
    }, 360);
  }

  function enhanceConclusion(activeSlide){
    if(!isLikelyConclusion(activeSlide)) return;
    activeSlide.classList.add('verdict-stage');

    const lineCount = prepareVerdictLines(activeSlide);
    const existingStamp = directCinematicStamp(activeSlide);
    if(existingStamp){
      attachStampSharpener(existingStamp);
      setTimeout(() => settleStamp(existingStamp), 720);
    }

    if(activeSlide.dataset.animationBugfixStampQueued) return;
    activeSlide.dataset.animationBugfixStampQueued = '1';
    const delay = Math.max(1200, (1.35 + Math.max(lineCount, 1) * 0.5 + 0.65) * 1000);
    setTimeout(() => dropVerdictStamp(activeSlide), delay);
  }

  function replayEntranceAnimations(activeSlide){
    if(!activeSlide) return;
    activeSlide.classList.remove('fx-replay');
    void activeSlide.offsetWidth;
    activeSlide.classList.add('fx-replay');
  }

  function refreshEffects(){
    refreshQueued = false;
    addStyles();
    const activeSlide = getActiveSlide();
    if(!activeSlide) return;
    replayEntranceAnimations(activeSlide);
    splitIntroTitle(activeSlide);
    enhanceConclusion(activeSlide);
    activeSlide.querySelectorAll(':scope > .cinematic-verdict-stamp').forEach(stamp => {
      attachStampSharpener(stamp);
      if(stamp.classList.contains('drop')) setTimeout(() => settleStamp(stamp), 720);
    });
  }

  function afterSlideChange(){
    if(refreshQueued) return;
    refreshQueued = true;
    setTimeout(refreshEffects, 40);
    setTimeout(refreshEffects, 210);
  }

  function wrapFunction(name){
    const original = window[name];
    if(typeof original !== 'function' || original.__animationBugfixWrapped) return;
    function wrapped(){
      const result = original.apply(this, arguments);
      afterSlideChange();
      return result;
    }
    wrapped.__animationBugfixWrapped = true;
    window[name] = wrapped;
  }

  function hookRenderAndNavigation(){
    wrapFunction('render');
    wrapFunction('goTo');
    wrapFunction('linkedGo');
    wrapFunction('nextSlide');
  }

  function boot(attempts){
    addStyles();
    hookRenderAndNavigation();
    refreshEffects();
    if(attempts > 0){
      setTimeout(() => boot(attempts - 1), 160);
    }
  }

  document.addEventListener('click', event => {
    if(event.target.closest('button,a,.choice,[data-choice]')) afterSlideChange();
  }, true);

  const observer = new MutationObserver(() => afterSlideChange());
  observer.observe(document.body, {subtree:true, childList:true});

  boot(20);
  console.debug('Animation bugfix loaded:', VERSION);
})();
