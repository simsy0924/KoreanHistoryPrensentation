// 발표 시작 시간여행 이펙트의 태블릿 화면 보정과
// 발표 종료 시 현재로 돌아오는 이펙트를 추가한다.
(function(){
  const VERSION = '2026-05-26-nav-responsive-v2';
  if (window.__PRESENTATION_EFFECTS_REVISION__ === VERSION) return;
  window.__PRESENTATION_EFFECTS_REVISION__ = VERSION;

  function addStyles(){
    if(document.getElementById('presentationEffectsRevisionStyles')) return;
    const style = document.createElement('style');
    style.id = 'presentationEffectsRevisionStyles';
    style.textContent = `
      /* 태블릿·PC 화면에서 시작 시간여행 선이 끊겨 보이지 않도록 이펙트 범위를 확장 */
      .timewarp .rings:before{width:max(18rem,46vmax);height:max(18rem,46vmax);border-width:3px}
      .timewarp .rings:after{width:max(28rem,72vmax);height:max(28rem,72vmax);border-width:3px}
      .timewarp .tunnel{inset:-12vmax;background:repeating-conic-gradient(from 0deg,rgba(245,234,210,.09) 0deg 7deg,transparent 7deg 16deg),repeating-radial-gradient(circle at center,transparent 0 4.6rem,rgba(201,154,58,.10) 4.75rem 4.95rem,transparent 5.1rem 9rem);}
      @media(min-width:720px){
        .timewarp .rings:before{width:max(34rem,72vmax);height:max(34rem,72vmax)}
        .timewarp .rings:after{width:max(52rem,106vmax);height:max(52rem,106vmax)}
        .timewarp .tunnel{inset:-32vmax;background:repeating-conic-gradient(from 0deg,rgba(245,234,210,.09) 0deg 6deg,transparent 6deg 14deg),repeating-radial-gradient(circle at center,transparent 0 5.2rem,rgba(201,154,58,.11) 5.35rem 5.58rem,transparent 5.72rem 10rem);}
      }

      .return-present{
        position:fixed;
        inset:0;
        z-index:1002;
        display:none;
        place-items:center;
        overflow:hidden;
        background:
          radial-gradient(circle at center,rgba(245,234,210,.18),transparent 18rem),
          radial-gradient(circle at 80% 20%,rgba(201,154,58,.22),transparent 30rem),
          radial-gradient(circle at 20% 80%,rgba(141,47,39,.18),transparent 26rem),
          #070604;
        color:var(--paper);
        pointer-events:none;
      }
      .return-present.active{display:grid;animation:returnFade 3.15s ease both}
      .return-present .return-tunnel{position:absolute;inset:-32vmax;background:repeating-conic-gradient(from 0deg,rgba(245,234,210,.09) 0deg 6deg,transparent 6deg 14deg),repeating-radial-gradient(circle at center,transparent 0 5.2rem,rgba(201,154,58,.11) 5.35rem 5.58rem,transparent 5.72rem 10rem);mix-blend-mode:screen;animation:returnTunnel 2.85s cubic-bezier(.22,.78,.2,1) both;opacity:.9}
      .return-present .return-rings:before,.return-present .return-rings:after{content:"";position:absolute;left:50%;top:50%;width:max(34rem,72vmax);height:max(34rem,72vmax);border:3px solid rgba(245,234,210,.24);border-radius:50%;transform:translate(-50%,-50%);animation:returnRing 2.1s ease-out infinite}
      .return-present .return-rings:after{width:max(52rem,106vmax);height:max(52rem,106vmax);animation-delay:.22s;border-color:rgba(201,154,58,.3)}
      .return-present .return-years{position:absolute;inset:0;z-index:3;font-weight:950;font-size:clamp(2rem,7vw,6rem);letter-spacing:-.08em;color:rgba(245,234,210,.2)}
      .return-present .return-years span{position:absolute;left:50%;top:50%;opacity:0;animation:returnYear .72s ease-in-out both}
      .return-present .return-years span:nth-child(1){animation-delay:0s}
      .return-present .return-years span:nth-child(2){animation-delay:.34s}
      .return-present .return-years span:nth-child(3){animation-delay:.68s}
      .return-present .return-years span:nth-child(4){animation-delay:1.02s}
      .return-present .return-years span:nth-child(5){animation-delay:1.36s;color:rgba(245,234,210,.52)}
      .return-present .return-msg{position:absolute;left:50%;bottom:10vh;width:min(92vw,620px);z-index:4;text-align:center;padding:1.15rem 1.45rem;border:1px solid rgba(245,234,210,.22);border-radius:1.4rem;background:rgba(16,14,11,.6);backdrop-filter:blur(10px);box-shadow:0 24px 70px rgba(0,0,0,.3);animation:returnMsg 3.05s ease both}
      .return-present .return-msg strong{display:block;font-family:"Noto Serif KR",serif;font-size:clamp(1.45rem,4vw,2.8rem);letter-spacing:-.06em;line-height:1.12}
      .return-present .return-msg p{margin:.45rem 0 0;color:rgba(255,248,232,.72);line-height:1.55}
      @keyframes returnFade{0%{opacity:0}12%,80%{opacity:1}100%{opacity:0}}
      @keyframes returnRing{from{transform:translate(-50%,-50%) scale(1.85);opacity:0}28%{opacity:.55}to{transform:translate(-50%,-50%) scale(.42);opacity:0}}
      @keyframes returnTunnel{from{transform:scale(1.6) rotate(-170deg);opacity:.15}45%{opacity:.92}to{transform:scale(.76) rotate(0deg);opacity:.25}}
      @keyframes returnYear{0%{opacity:0;transform:translate(-50%,-50%) scale(.62);filter:blur(2px)}18%,68%{opacity:.95;transform:translate(-50%,-50%) scale(1);filter:blur(0)}100%{opacity:0;transform:translate(-50%,-50%) scale(2.05);filter:blur(8px)}}
      @keyframes returnMsg{0%,42%{opacity:0;transform:translateX(-50%) translateY(10px) scale(.98)}55%,84%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}100%{opacity:0;transform:translateX(-50%) translateY(-8px) scale(.98)}}

      /* 981-1200px 중간 화면(iPad 가로·작은 노트북)에서
         브랜드+내비게이션 액션을 1행, 상태 정보를 2행에 배치해
         상태 알약이 밀리거나 잘리지 않게 보정 */
      @media(max-width:1200px) and (min-width:981px){
        .nav{grid-template-columns:auto 1fr;grid-template-rows:auto auto}
        .brand{grid-column:1;grid-row:1}
        .nav-actions{grid-column:2;grid-row:1;justify-content:flex-end}
        .status{grid-column:1/-1;grid-row:2;justify-content:flex-start;padding-top:.25rem}
      }

      /* 애니메이션 강화: 카드/박스 등장 애니메이션 */
      @keyframes cardBounceIn{
        0%{opacity:0;transform:translateY(24px) scale(0.92) rotate(-0.5deg)}
        50%{transform:translateY(-3px) scale(1.02) rotate(0.2deg)}
        100%{opacity:1;transform:translateY(0) scale(1) rotate(0deg)}
      }
      @keyframes docScaleIn{
        0%{opacity:0;transform:scale(0.88) rotate(-1deg)}
        70%{transform:scale(1.04) rotate(0.5deg)}
        100%{opacity:1;transform:scale(1) rotate(0deg)}
      }
      @keyframes summarySlideIn{
        0%{opacity:0;transform:translateY(16px)}
        100%{opacity:1;transform:translateY(0)}
      }

      /* 버튼 인터랙션 애니메이션 */
      @keyframes buttonPress{
        0%{transform:scale(1.08)}
        50%{transform:scale(0.96)}
        100%{transform:scale(1.08)}
      }
      @keyframes buttonGlow{
        0%,100%{box-shadow:0 0 0 0 rgba(201,154,58,0.4)}
        50%{box-shadow:0 0 0 10px rgba(201,154,58,0)}
      }
      @keyframes clickBounce{
        0%{transform:scale(1)}
        50%{transform:scale(1.15)}
        100%{transform:scale(1)}
      }
      @keyframes fadeOut{
        to{opacity:0.3;pointer-events:none}
      }

      /* 카드 애니메이션 적용 */
      .diary-card{opacity:0;animation:cardBounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both;will-change:transform,opacity}
      .diary-card:nth-child(1){animation-delay:0s}
      .diary-card:nth-child(2){animation-delay:0.15s}
      .diary-card:nth-child(3){animation-delay:0.3s}
      .diary-card:nth-child(4){animation-delay:0.45s}
      .diary-card:nth-child(5){animation-delay:0.6s}
      .diary-card:nth-child(6){animation-delay:0.75s}

      .source-doc{opacity:0;animation:docScaleIn 0.65s cubic-bezier(0.34,1.56,0.64,1) both}
      .source-doc:nth-child(1){animation-delay:0.1s}
      .source-doc:nth-child(2){animation-delay:0.25s}
      .source-doc:nth-child(3){animation-delay:0.4s}

      .source-summary article{opacity:0;animation:summarySlideIn 0.5s ease-out both}
      .source-summary article:nth-child(1){animation-delay:0.2s}
      .source-summary article:nth-child(2){animation-delay:0.35s}
      .source-summary article:nth-child(3){animation-delay:0.5s}

      /* 버튼 인터랙션 */
      button.main,button.sub{transition:all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);position:relative}
      button.main:hover{transform:scale(1.08);box-shadow:0 8px 20px rgba(201,154,58,0.2);background:rgba(245,234,210,0.15)}
      button.main:active{animation:buttonPress 0.35s cubic-bezier(0.34,1.56,0.64,1)}
      button.sub:hover{transform:scale(1.05);background:rgba(245,234,210,0.12)}

      button.selected{animation:buttonGlow 0.8s infinite;background:rgba(201,154,58,0.25)}

      /* 모바일 반응형: 애니메이션 축소 */
      @media(max-width:768px){
        @keyframes cardBounceIn{
          0%{opacity:0;transform:translateY(15px) scale(0.98)}
          100%{opacity:1;transform:translateY(0) scale(1)}
        }
        .diary-card{animation-duration:0.5s}
        .source-doc{animation-duration:0.55s}
        .source-summary article{animation-duration:0.45s}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureOverlay(){
    let overlay = document.getElementById('returnPresentEffect');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'returnPresentEffect';
    overlay.className = 'return-present';
    overlay.innerHTML = `
      <div class="return-rings"></div>
      <div class="return-tunnel"></div>
      <div class="return-years"><span>1894</span><span>1898</span><span>1904</span><span>대한제국</span><span>현재</span></div>
      <div class="return-msg"><strong>현재로 돌아옵니다</strong><p>조선 말기의 선택을 오늘의 질문으로 가져옵니다</p></div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  let returning = false;

  function isReturnToPresentTarget(target){
    if(typeof slides === 'undefined' || !Array.isArray(slides)) return false;
    if(typeof current !== 'number') return false;
    return target === slides.length - 1 && current === slides.length - 2;
  }

  function playReturnAndGo(target){
    if(returning) return;
    returning = true;
    const overlay = ensureOverlay();
    overlay.classList.remove('active');
    void overlay.offsetWidth;
    overlay.classList.add('active');

    setTimeout(() => {
      if(typeof goTo === 'function') goTo(target);
    }, 980);

    setTimeout(() => {
      overlay.classList.remove('active');
      returning = false;
    }, 3200);
  }

  function hookNavigation(){
    if(window.__RETURN_PRESENT_NAV_HOOKED__) return;
    window.__RETURN_PRESENT_NAV_HOOKED__ = true;

    const oldLinkedGo = window.linkedGo;
    if(typeof oldLinkedGo === 'function'){
      window.linkedGo = function(target, label){
        const safeTarget = Math.max(0, Math.min(target, slides.length - 1));
        if(isReturnToPresentTarget(safeTarget)){
          playReturnAndGo(safeTarget);
          return;
        }
        return oldLinkedGo.call(this, target, label);
      };
    }

    const oldNextSlide = window.nextSlide;
    if(typeof oldNextSlide === 'function'){
      window.nextSlide = function(){
        const target = Math.min((typeof current === 'number' ? current : 0) + 1, slides.length - 1);
        if(isReturnToPresentTarget(target)){
          playReturnAndGo(target);
          return;
        }
        return oldNextSlide.call(this);
      };
    }
  }

  function boot(attempts){
    addStyles();
    ensureOverlay();
    if(typeof slides !== 'undefined' && Array.isArray(slides) && typeof nextSlide === 'function'){
      hookNavigation();
      return;
    }
    if(attempts > 0) setTimeout(() => boot(attempts - 1), 120);
  }

  boot(12);
})();