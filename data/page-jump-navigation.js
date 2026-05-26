// 특정 페이지로 바로 이동하는 점프 내비게이션을 추가한다.
(function(){
  const VERSION = '2026-05-26-page-jump';
  if (window.__PAGE_JUMP_NAVIGATION__ === VERSION) return;
  window.__PAGE_JUMP_NAVIGATION__ = VERSION;

  function addStyles(){
    if(document.getElementById('pageJumpNavigationStyles')) return;
    const style = document.createElement('style');
    style.id = 'pageJumpNavigationStyles';
    style.textContent = `
      .page-jump{position:fixed;right:1rem;top:4.9rem;z-index:96;display:flex;gap:.45rem;align-items:center;padding:.45rem .55rem;border:1px solid rgba(245,234,210,.18);border-radius:999px;background:rgba(16,14,11,.82);backdrop-filter:blur(14px);box-shadow:0 14px 36px rgba(0,0,0,.26)}
      .page-jump label{font-size:.78rem;color:rgba(245,234,210,.72);font-weight:850;white-space:nowrap}
      .page-jump input{width:4.2rem;border:1px solid rgba(245,234,210,.22);border-radius:999px;background:rgba(245,234,210,.08);color:var(--paper);padding:.38rem .55rem;font:inherit;font-weight:900;text-align:center;outline:none}
      .page-jump input:focus{border-color:rgba(201,154,58,.65);box-shadow:0 0 0 3px rgba(201,154,58,.12)}
      .page-jump button{border:1px solid rgba(245,234,210,.22);border-radius:999px;background:rgba(201,154,58,.18);color:var(--paper);padding:.38rem .62rem;font:inherit;font-weight:900;cursor:pointer}
      .page-jump button:hover{background:rgba(201,154,58,.28)}
      .page-jump select{max-width:12rem;border:1px solid rgba(245,234,210,.22);border-radius:999px;background:rgba(16,14,11,.92);color:var(--paper);padding:.38rem .55rem;font:inherit;font-weight:800;outline:none}
      @media(max-width:720px){.page-jump{left:.7rem;right:.7rem;top:auto;bottom:.7rem;justify-content:center;border-radius:1rem;flex-wrap:wrap}.page-jump select{max-width:100%;flex:1 1 12rem}}
    `;
    document.head.appendChild(style);
  }

  function strip(html){
    return String(html || '').replace(/<br\s*\/?>/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
  }

  function titleOf(slide, idx){
    const html = (slide && slide.html) || '';
    const h2 = html.match(/<h2>([\s\S]*?)<\/h2>/);
    const h1 = html.match(/<h1>([\s\S]*?)<\/h1>/);
    const title = strip((h2 && h2[1]) || (h1 && h1[1]) || '페이지 ' + (idx + 1));
    return title.length > 24 ? title.slice(0, 24) + '…' : title;
  }

  function createJumpBox(){
    let box = document.getElementById('pageJumpBox');
    if(box) return box;

    box = document.createElement('div');
    box.id = 'pageJumpBox';
    box.className = 'page-jump';
    box.innerHTML = `
      <label for="pageJumpInput">이동</label>
      <input id="pageJumpInput" type="number" min="1" inputmode="numeric" aria-label="이동할 페이지 번호">
      <button id="pageJumpButton" type="button">가기</button>
      <select id="pageJumpSelect" aria-label="페이지 선택"></select>
    `;
    document.body.appendChild(box);

    const input = box.querySelector('#pageJumpInput');
    const button = box.querySelector('#pageJumpButton');
    const select = box.querySelector('#pageJumpSelect');

    function jumpToNumber(){
      if(typeof slides === 'undefined' || !Array.isArray(slides)) return;
      const n = parseInt(input.value, 10);
      if(!Number.isFinite(n)) return;
      const target = Math.max(1, Math.min(n, slides.length)) - 1;
      if(typeof linkedGo === 'function') linkedGo(target, '페이지 이동');
      else if(typeof goTo === 'function') goTo(target);
    }

    button.addEventListener('click', jumpToNumber);
    input.addEventListener('keydown', e => {
      if(e.key === 'Enter') jumpToNumber();
    });
    select.addEventListener('change', () => {
      const target = parseInt(select.value, 10);
      if(Number.isFinite(target)){
        input.value = String(target + 1);
        if(typeof linkedGo === 'function') linkedGo(target, '페이지 이동');
        else if(typeof goTo === 'function') goTo(target);
      }
    });

    return box;
  }

  function refreshOptions(){
    if(typeof slides === 'undefined' || !Array.isArray(slides)) return false;
    const box = createJumpBox();
    const input = box.querySelector('#pageJumpInput');
    const select = box.querySelector('#pageJumpSelect');
    input.max = String(slides.length);
    input.placeholder = `1-${slides.length}`;

    const currentValue = select.value;
    select.innerHTML = slides.map((slide, idx) => `<option value="${idx}">${idx + 1}. ${titleOf(slide, idx)}</option>`).join('');
    if(currentValue && Number(currentValue) < slides.length) select.value = currentValue;
    return true;
  }

  function syncCurrent(){
    const box = document.getElementById('pageJumpBox');
    if(!box || typeof current === 'undefined') return;
    const input = box.querySelector('#pageJumpInput');
    const select = box.querySelector('#pageJumpSelect');
    input.value = String(current + 1);
    select.value = String(current);
  }

  function hookNavigation(){
    if(window.__PAGE_JUMP_NAV_HOOKED__) return;
    window.__PAGE_JUMP_NAV_HOOKED__ = true;
    const oldGoTo = window.goTo;
    if(typeof oldGoTo === 'function'){
      window.goTo = function(){
        const result = oldGoTo.apply(this, arguments);
        setTimeout(syncCurrent, 0);
        return result;
      };
    }
    const oldRender = window.render;
    if(typeof oldRender === 'function'){
      window.render = function(){
        const result = oldRender.apply(this, arguments);
        setTimeout(() => { refreshOptions(); syncCurrent(); }, 0);
        return result;
      };
    }
  }

  function boot(attempts){
    addStyles();
    if(refreshOptions()){
      hookNavigation();
      syncCurrent();
      return;
    }
    if(attempts > 0) setTimeout(() => boot(attempts - 1), 120);
  }

  boot(12);
})();