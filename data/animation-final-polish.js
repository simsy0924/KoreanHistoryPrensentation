// 최종 안정화 보정: 무거운 감시 제거, 먹물 보정 비활성화, 결론 도장 문구만 보정
(function(){
  const VERSION = '2026-05-27-animation-final-polish-v2-stable';
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
      /* 이전 먹물 보정은 렉과 시야 방해가 있어 안정화 모드에서 완전히 비활성화 */
      #inkPatchSweep{display:none!important;opacity:0!important;animation:none!important}

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
      }
      .cinematic-verdict-stamp span{
        white-space:nowrap!important;
        font-size:inherit!important;
        line-height:1!important;
        filter:none!important;
      }
    `;
    document.head.appendChild(style);
  }

  function currentIndex(){
    try{ if(typeof current === 'number') return current; }catch(e){}
    return -1;
  }

  function slideCount(){
    try{ if(Array.isArray(slides)) return slides.length; }catch(e){}
    return 0;
  }

  function getActiveSlide(){
    return document.querySelector('.slide.active') || document.querySelector('.slide');
  }

  function normalizeConclusionStamp(){
    const slide = getActiveSlide();
    const count = slideCount();
    const idx = currentIndex();
    if(!slide) return;

    Array.from(slide.children).forEach(stamp => {
      if(!stamp.classList || !stamp.classList.contains('verdict-stamp') || stamp.closest('.feedback')) return;
      if(count > 0 && idx !== count - 1){
        stamp.remove();
        return;
      }
      stamp.classList.add('cinematic-verdict-stamp');
      if(!stamp.querySelector('span')) stamp.innerHTML = '<span>판결 완료</span>';
      else stamp.querySelector('span').textContent = '판결 완료';
      stamp.style.filter = 'none';
    });
  }

  function boot(){
    addStyles();
    const oldInk = document.getElementById('inkPatchSweep');
    if(oldInk) oldInk.remove();
    normalizeConclusionStamp();
  }

  document.addEventListener('click', () => {
    setTimeout(boot, 120);
    setTimeout(boot, 420);
  }, true);

  boot();
  setTimeout(boot, 400);
  console.debug('Animation final polish stable loaded:', VERSION);
})();
