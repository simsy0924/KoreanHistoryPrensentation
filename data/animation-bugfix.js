// 애니메이션 복구 패치: 슬라이드 전환 후 효과 재실행, 결론 도장 선명도 고정
(function(){
  const VERSION = '2026-05-27-animation-bugfix-v1';
  if (window.__ANIMATION_BUGFIX__ === VERSION) return;
  window.__ANIMATION_BUGFIX__ = VERSION;

  function addStyles(){
    if(document.getElementById('animationBugfixStyles')) return;
    const style = document.createElement('style');
    style.id = 'animationBugfixStyles';
    style.textContent = `
      /* 태블릿/모바일 Safari에서 도장 직후 전체 화면이 흐려지는 현상 방지 */
      @media (pointer:coarse){
        body.shake-once{animation:none!important;transform:none!important;filter:none!important}
      }

      .verdict-stamp,
      .verdict-stamp *{
        -webkit-font-smoothing:antialiased;
        text-rendering:geometricPrecision;
        backface-visibility:hidden;
        -webkit-backface-visibility:hidden;
      }

      .verdict-stamp{
        transform-origin:center center;
        will-change:transform,opacity;
      }

      .verdict-stamp.stamp-settled,
      .verdict-stamp.drop.stamp-settled{
        opacity:1!important;
        filter:none!important;
        transform:translate3d(0,0,0) rotate(-7deg) scale(1)!important;
        animation:stampSettleSharp 1.2s ease-out forwards!important;
      }

      .verdict-stamp.stamp-settled span{
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

  function settleStamp(stamp){
    if(!stamp) return;
    stamp.classList.add('stamp-settled');
    stamp.style.filter = 'none';
  }

  function attachStampSharpener(stamp){
    if(!stamp || stamp.dataset.animationBugfixSharpener) return;
    stamp.dataset.animationBugfixSharpener = '1';
    stamp.addEventListener('animationend', event => {
      if(event.animationName === 'stampDrop' || event.animationName === 'stampSettle'){
        settleStamp(stamp);
      }
    });
  }

  function dropVerdictStamp(activeSlide){
    if(!activeSlide) return;
    let stamp = activeSlide.querySelector('.verdict-stamp');
    if(!stamp){
      stamp = document.createElement('div');
      stamp.className = 'verdict-stamp';
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
    const existingStamp = activeSlide.querySelector('.verdict-stamp');
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
    addStyles();
    const activeSlide = getActiveSlide();
    if(!activeSlide) return;
    replayEntranceAnimations(activeSlide);
    splitIntroTitle(activeSlide);
    enhanceConclusion(activeSlide);
    activeSlide.querySelectorAll('.verdict-stamp').forEach(stamp => {
      attachStampSharpener(stamp);
      if(stamp.classList.contains('drop')) setTimeout(() => settleStamp(stamp), 720);
    });
  }

  function afterSlideChange(){
    setTimeout(refreshEffects, 30);
    setTimeout(refreshEffects, 180);
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
  observer.observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['class','style']});

  boot(20);
  console.debug('Animation bugfix loaded:', VERSION);
})();
