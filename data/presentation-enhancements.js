// 발표 보조 레이어
// index.html 본문은 직접 편집하고, 이 파일은 애니메이션/전환과 이식 중 빠진 윤치호 일기 세부 문구 복원을 담당한다.
(function(){
  'use strict';

  const VERSION = '2026-05-29-enhancement-v6-yunchiho-restore';
  if(window.__PRESENTATION_ENHANCEMENTS__ === VERSION) return;
  window.__PRESENTATION_ENHANCEMENTS__ = VERSION;

  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const slideCount = () => $$('.slide').length;
  const activeSlide = () => $('.slide.active');

  let baseGoTo = null;
  let returning = false;
  let inkPlaying = false;

  const diaryDetails = {
    '절차로 움직인 반외세 운동': {
      question: '독립협회의 반외세 운동은 감정적 저항이었을까, 절차를 갖춘 정치 운동이었을까?',
      tags: ['절차적 반외세','사실 확인','여론 정치','외세 견제']
    },
    '헌의 6조를 밀어붙인 정치적 기대': {
      question: '황제권을 활용한 개혁 추진은 현실적 전략이었을까, 독립협회의 한계였을까?',
      tags: ['황제권','헌의 6조','개혁 전략','제도화']
    },
    '대한의 마지막 희망이라는 절박함': {
      question: '독립협회를 마지막 희망으로 본 절박함은 자주독립 의식인가, 시대적 불안의 표현인가?',
      tags: ['희망과 불안','자주독립','외세 개입','정치 위기']
    },
    '민권운동 지도자가 느낀 대중과의 거리': {
      question: '윤치호의 대중 비판은 엘리트주의인가, 개혁 운동의 고립감에서 나온 실망인가?',
      tags: ['대중과의 거리','엘리트주의','민권 운동','사회적 지지']
    },
    '만민공동회 실패를 복합적으로 본 시선': {
      question: '만민공동회의 실패는 탄압 때문이었을까, 운동 내부의 전략과 여론 변화도 함께 작용했을까?',
      tags: ['실패의 복합 요인','전략','여론 변화','황제권']
    },
    '독립협회 와해 이후의 씁쓸한 총결산': {
      question: '윤치호의 사후 평가는 실패에 대한 냉정한 진단인가, 좌절감이 만든 책임 전가인가?',
      tags: ['좌절과 냉소','공공정신','사후 평가','책임 인식']
    }
  };

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
      .feedback .verdict-stamp.stamp-impact{animation:choiceStampImpact .54s cubic-bezier(.16,1.14,.28,1) both}
      @keyframes choiceStampImpact{0%{opacity:0;transform:translateY(-28px) rotate(-15deg) scale(2.15);filter:blur(2px)}54%{opacity:1;transform:translateY(0) rotate(-5deg) scale(.9);filter:none;box-shadow:inset 0 0 0 2px rgba(141,47,39,.34),0 0 0 10px rgba(141,47,39,.16),0 12px 24px rgba(141,47,39,.18)}76%{transform:rotate(-5deg) scale(1.04)}100%{opacity:1;transform:rotate(-5deg) scale(1);filter:none}}

      .diary-card .pq{margin-top:auto;padding:.8rem;border-radius:.9rem;background:rgba(141,47,39,.1);font-weight:850;color:#3b291c}
      .diary-tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.45rem}.diary-tags .tag{margin-bottom:0;font-size:.72rem}
      .source-summary{display:grid;gap:.55rem;margin:.4rem 0 .8rem}.source-summary article{padding:.78rem .85rem;border-radius:1rem;background:rgba(245,234,210,.075);border:1px solid rgba(245,234,210,.13)}.source-summary strong{display:block;color:var(--paper);margin-bottom:.18rem}.source-summary p{margin:0;color:rgba(255,248,232,.72);font-size:.91rem;line-height:1.52}.source-balance{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-top:.75rem}.balance-box{padding:.8rem;border-radius:1rem;background:rgba(245,234,210,.075);border:1px solid rgba(245,234,210,.13)}.balance-box h3{font-size:1.08rem}.balance-box ul{margin:0;padding-left:1.05rem;color:rgba(255,248,232,.76);font-size:.9rem;line-height:1.5}
      .hwangguk-judgement,.hwangguk-summary{padding:.9rem 1rem;border-radius:1.1rem;background:rgba(201,154,58,.13);border:1px solid rgba(201,154,58,.25);color:rgba(255,248,232,.8);margin-bottom:.85rem}.hwangguk-judgement{background:rgba(141,47,39,.18);border-color:rgba(141,47,39,.34)}.hwangguk-judgement strong,.hwangguk-summary strong{display:block;color:var(--paper);font-family:"Noto Serif KR",serif;font-size:1.12rem;margin-bottom:.35rem}.hwangguk-judgement p,.hwangguk-summary p{margin:0;line-height:1.6}.critical{border:2px solid rgba(141,47,39,.38)!important}

      .slide.verdict-stage{position:relative;overflow:hidden}.final-completion-stamp{position:absolute;right:clamp(1.2rem,7vw,5rem);bottom:clamp(7.5rem,22vh,13rem);z-index:50;min-width:8.4rem;padding:.55rem .9rem .62rem;border:.28rem solid #8d2f27;border-radius:.55rem;display:grid;place-items:center;color:#8d2f27;background:rgba(255,248,232,.10);font-family:"Noto Serif KR",serif;font-weight:950;font-size:clamp(1.25rem,2.6vmin,2rem);letter-spacing:-.08em;transform:rotate(-7deg) scale(1);box-shadow:inset 0 0 0 .12rem rgba(141,47,39,.42),0 0 24px rgba(141,47,39,.24);pointer-events:none}.final-completion-stamp.final-stamp-impact{animation:finalStampImpact .62s cubic-bezier(.16,1.12,.28,1) both}@keyframes finalStampImpact{0%{opacity:0;transform:translate3d(0,-160px,0) rotate(-17deg) scale(1.8);filter:blur(2px)}58%{opacity:1;transform:translate3d(0,0,0) rotate(-7deg) scale(.93);filter:none}78%{transform:rotate(-7deg) scale(1.04)}100%{opacity:1;transform:rotate(-7deg) scale(1)}}
      #inkLiteSweep{position:fixed;inset:0;z-index:10020;pointer-events:none;opacity:0;overflow:hidden;contain:layout paint}#inkLiteSweep.active{opacity:1}#inkLiteSweep .ink-lite-brush{position:absolute;top:-22vh;bottom:-22vh;left:-44vw;width:48vw;transform:translateX(-76vw) rotate(-8deg) skewX(-7deg);opacity:0;border-radius:48% 52% 58% 42% / 38% 62% 45% 55%;clip-path:polygon(10% 0,92% 6%,82% 20%,100% 38%,78% 56%,92% 74%,68% 100%,0 92%,14% 72%,4% 52%,18% 30%,0 11%);background:linear-gradient(90deg,rgba(7,6,4,0),rgba(7,6,4,.62) 13%,rgba(3,3,2,.94) 43%,rgba(4,3,2,.9) 58%,rgba(20,14,9,.72) 77%,rgba(201,154,58,.18) 89%,rgba(7,6,4,0));filter:drop-shadow(0 0 13px rgba(0,0,0,.62))}#inkLiteSweep .ink-lite-edge{position:absolute;top:-16vh;bottom:-16vh;left:-22vw;width:9vw;opacity:0;border-radius:50%;transform:translateX(-48vw) rotate(-8deg);background:linear-gradient(90deg,transparent,rgba(245,234,210,.32),rgba(201,154,58,.27),transparent);filter:blur(5px)}#inkLiteSweep.active .ink-lite-brush{animation:inkLiteBrush .92s cubic-bezier(.42,0,.18,1) both}#inkLiteSweep.active .ink-lite-edge{animation:inkLiteEdge .92s cubic-bezier(.42,0,.18,1) both}@keyframes inkLiteBrush{0%{transform:translateX(-76vw) rotate(-8deg) skewX(-7deg) scaleX(.9);opacity:0}14%{opacity:.88}44%{transform:translateX(35vw) rotate(-5deg) skewX(-4deg) scaleX(1.24);opacity:.92}68%{transform:translateX(75vw) rotate(-6deg) skewX(-5deg) scaleX(1.08);opacity:.78}100%{transform:translateX(142vw) rotate(-8deg) skewX(-7deg) scaleX(.9);opacity:0}}@keyframes inkLiteEdge{0%{transform:translateX(-52vw) rotate(-8deg);opacity:0}26%{opacity:.82}62%{opacity:.54}100%{transform:translateX(128vw) rotate(-8deg);opacity:0}}
      #returnPresentEffect{position:fixed;inset:0;z-index:10030;display:none;place-items:center;overflow:hidden;background:radial-gradient(circle at center,rgba(245,234,210,.18),transparent 18rem),radial-gradient(circle at 80% 20%,rgba(201,154,58,.22),transparent 30rem),radial-gradient(circle at 20% 80%,rgba(141,47,39,.18),transparent 26rem),#070604;color:var(--paper,#f5ead2);pointer-events:none}#returnPresentEffect.active{display:grid;animation:returnFade 3.15s ease both}#returnPresentEffect .return-tunnel{position:absolute;inset:-32vmax;background:repeating-conic-gradient(from 0deg,rgba(245,234,210,.09) 0deg 6deg,transparent 6deg 14deg),repeating-radial-gradient(circle at center,transparent 0 5.2rem,rgba(201,154,58,.11) 5.35rem 5.58rem,transparent 5.72rem 10rem);mix-blend-mode:screen;animation:returnTunnel 2.85s cubic-bezier(.22,.78,.2,1) both;opacity:.9}#returnPresentEffect .return-rings:before,#returnPresentEffect .return-rings:after{content:"";position:absolute;left:50%;top:50%;width:max(34rem,72vmax);height:max(34rem,72vmax);border:3px solid rgba(245,234,210,.24);border-radius:50%;transform:translate(-50%,-50%);animation:returnRing 2.1s ease-out infinite}#returnPresentEffect .return-rings:after{width:max(52rem,106vmax);height:max(52rem,106vmax);animation-delay:.22s;border-color:rgba(201,154,58,.3)}#returnPresentEffect .return-years{position:absolute;inset:0;z-index:3;font-weight:950;font-size:clamp(2rem,7vw,6rem);letter-spacing:-.08em;color:rgba(245,234,210,.2)}#returnPresentEffect .return-years span{position:absolute;left:50%;top:50%;opacity:0;animation:returnYear .72s ease-in-out both}#returnPresentEffect .return-years span:nth-child(1){animation-delay:0s}#returnPresentEffect .return-years span:nth-child(2){animation-delay:.34s}#returnPresentEffect .return-years span:nth-child(3){animation-delay:.68s}#returnPresentEffect .return-years span:nth-child(4){animation-delay:1.02s}#returnPresentEffect .return-years span:nth-child(5){animation-delay:1.36s;color:rgba(245,234,210,.52)}#returnPresentEffect .return-msg{position:absolute;left:50%;bottom:10vh;width:min(92vw,620px);z-index:4;text-align:center;padding:1.15rem 1.45rem;border:1px solid rgba(245,234,210,.22);border-radius:1.4rem;background:rgba(16,14,11,.6);backdrop-filter:blur(10px);box-shadow:0 24px 70px rgba(0,0,0,.3);animation:returnMsg 3.05s ease both}#returnPresentEffect .return-msg strong{display:block;font-family:"Noto Serif KR",serif;font-size:clamp(1.45rem,4vw,2.8rem);letter-spacing:-.06em;line-height:1.12}#returnPresentEffect .return-msg p{margin:.45rem 0 0;color:rgba(255,248,232,.72);line-height:1.55}@keyframes returnFade{0%{opacity:0}12%,80%{opacity:1}100%{opacity:0}}@keyframes returnRing{from{transform:translate(-50%,-50%) scale(1.85);opacity:0}28%{opacity:.55}to{transform:translate(-50%,-50%) scale(.42);opacity:0}}@keyframes returnTunnel{from{transform:scale(1.6) rotate(-170deg);opacity:.15}45%{opacity:.92}to{transform:scale(.76) rotate(0deg);opacity:.25}}@keyframes returnYear{0%{opacity:0;transform:translate(-50%,-50%) scale(.62);filter:blur(2px)}18%,68%{opacity:.95;transform:translate(-50%,-50%) scale(1);filter:blur(0)}100%{opacity:0;transform:translate(-50%,-50%) scale(2.05);filter:blur(8px)}}@keyframes returnMsg{0%,42%{opacity:0;transform:translateX(-50%) translateY(10px) scale(.98)}55%,84%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}100%{opacity:0;transform:translateX(-50%) translateY(-8px) scale(.98)}}
      @media(max-width:980px){.source-balance{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function addAfter(el, html){ if(el) el.insertAdjacentHTML('afterend', html); }
  function addBefore(el, html){ if(el) el.insertAdjacentHTML('beforebegin', html); }

  function restoreYunchihoDiary(){
    const diarySlides = $$('.slide').filter(slide => /윤치호|만민공동회|기대는 왜 균열|오늘 사용한 윤치호/.test(slide.dataset.title || slide.textContent));
    diarySlides.forEach(slide => {
      const h2 = $('h2', slide);
      if(h2 && h2.textContent.includes('속살')) h2.textContent = '윤치호 일기로 보는 독립협회의 희망과 균열';
      if(h2 && h2.textContent.includes('만민공동회는 왜 실패')) h2.textContent = '기대는 왜 균열로 바뀌었나?';
      const lead = $('.lead', slide);
      if(lead && h2 && h2.textContent.includes('윤치호 일기로 보는')){
        lead.textContent = '앞에서 독립협회의 밝은 면, 제도적 한계, 그리고 인물들의 복잡한 행적을 살펴봤다면, 이제 윤치호 일기로 그 운동의 내부 시선을 확인합니다. 윤치호 일기는 독립협회를 향한 기대, 절차적 개혁 의지, 대중과의 거리, 외세에 대한 불안, 실패 이후의 좌절을 함께 보여주는 자료입니다.';
      }
      if(lead && h2 && h2.textContent.includes('기대는 왜')){
        lead.textContent = '윤치호는 독립협회와 만민공동회에 큰 기대를 걸었지만, 시간이 갈수록 외세 개입, 내부 정치 세력의 충돌, 대중 여론의 이탈, 황제권과의 갈등을 함께 보게 됩니다. 이 흐름은 한 인물의 비난이 아니라 기대가 좌절로 바뀌는 과정을 보여줍니다.';
      }
      $$('.diary-card', slide).forEach(card => {
        const title = $('h3', card)?.textContent.trim();
        const detail = diaryDetails[title];
        if(!detail) return;
        if(!$('.pq', card)) card.insertAdjacentHTML('beforeend', '<p class="pq">'+detail.question+'</p>');
        if(!$('.diary-tags', card)) card.insertAdjacentHTML('beforeend', '<div class="diary-tags">'+detail.tags.map(t=>'<span class="tag">'+t+'</span>').join('')+'</div>');
      });
      const questionTitle = $('h3', slide);
      if(questionTitle && questionTitle.textContent.includes('발표에서 던질 최종 질문')) questionTitle.textContent = '이 섹션의 핵심 질문';
      $$('p', slide).forEach(p => {
        if(p.textContent.includes('민중과 함께한 운동이었을까')) p.textContent = '독립협회는 당시 개화 지식인에게 절박한 희망이었지만, 왜 대중과의 거리와 정치적 고립을 넘지 못했을까?';
        if(p.textContent.includes('이 질문은 앞에서 본')) p.textContent = '이 질문은 독립협회를 비판하기 위한 것이 아니라, 희망과 한계를 동시에 설명하기 위한 기준입니다.';
      });
      $$('li', slide).forEach(li => {
        if(li.textContent.includes('엘리트주의 확인')) li.textContent = '독립협회 지도부의 절차주의와 대중과의 거리 확인';
      });
      const route = $('.route', slide);
      if(route && route.textContent.includes('더 입체적으로 보기 위한 자료')) route.innerHTML = '<strong>핵심 결론</strong>윤치호 일기는 독립협회를 깎아내리기 위한 자료가 아니라, 독립협회가 왜 절박한 희망이었고 왜 균열을 겪었는지 함께 보여주는 자료입니다.';
    });
  }

  function restoreOtherFinalPatchCopy(){
    const bg = $$('.slide').find(s => (s.dataset.title || '').includes('혼란의 시대'));
    if(bg){
      const buttons = $('.era-buttons', bg);
      if(buttons && !buttons.textContent.includes('광무개혁')) buttons.insertAdjacentHTML('beforeend','<button class="era-btn" data-img="assets/images/광무개혁.webp" data-caption="광무개혁으로 만든 선박의 선원들"><span>1897~</span>광무개혁</button><button class="era-btn" data-img="assets/images/대한국국제.jpeg" data-caption="대한국 국제 사진"><span>1899</span>대한국 국제</button>');
    }
    const source = $$('.slide').find(s => (s.dataset.title || '').includes('신문, 회보'));
    if(source && !source.textContent.includes('토론회와 회보의 의미')){
      const left = $('.source-stage > div:first-child', source) || $('.wrap > div:first-child', source);
      addBefore($('.dark', left) || $('.next', left), '<div class="source-summary"><article><strong>독립신문의 의미</strong><p>한글과 영문을 활용해 국내 백성뿐 아니라 외국인에게도 조선의 상황을 알렸고, 자주독립·문명개화·정치 개혁의 필요성을 반복해서 제기했습니다.</p></article><article><strong>토론회와 회보의 의미</strong><p>독립관 토론회와 대조선독립협회회보는 독립협회의 문제의식을 조직화했습니다. 교육·상업·위생 같은 계몽 주제는 점차 토지, 의회, 국정 개혁 문제로 넓어졌습니다.</p></article><article><strong>상소문의 의미</strong><p>구국 운동 상소문은 언론·집회·출판·결사의 자유, 신체와 재산권 보장, 의회 설치 요구를 국가 권력에 직접 전달한 정치적 문서였습니다.</p></article></div>');
      const right = $('.source-stage > div:nth-child(2)', source) || $('.wrap > div:nth-child(2)', source);
      if(right) right.insertAdjacentHTML('beforeend','<div class="source-balance"><div class="balance-box"><h3>밝은 면</h3><ul><li>신문과 토론으로 여론 정치의 가능성을 열었다.</li><li>재정 공개, 법치, 의회적 요소를 요구했다.</li><li>외세 이권 침탈에 맞서는 자주성을 강조했다.</li></ul></div><div class="balance-box"><h3>한계</h3><ul><li>황제권 자체를 부정하지는 않았다.</li><li>지도부 중심의 엘리트 운동 성격이 강했다.</li><li>민중을 완전한 정치 주체로 보았는지는 논쟁적이다.</li></ul></div></div>');
    }
    const hwang = $$('.slide').find(s => (s.dataset.title || '').includes('황국협회'));
    if(hwang && !hwang.textContent.includes('핵심 판단')){
      const left = $('.grid > div:first-child', hwang) || $('.wrap > div:first-child', hwang);
      const right = $('.grid > div:nth-child(2)', hwang) || $('.wrap > div:nth-child(2)', hwang);
      addBefore($('.dark', left), '<div class="hwangguk-judgement"><strong>핵심 판단</strong><p>황국협회는 나쁜 결과를 만든 단체가 맞습니다. 다만 그 나쁨은 ‘그냥 악당이라서’가 아니라, 보부상의 폐단과 권력의 동원이 결합하면서 폭력적인 탄압 도구가 되었기 때문입니다.</p></div>');
      if(right){
        $$('.paper', right).forEach(card => { if(card.textContent.includes('보부상의 폐단') || card.textContent.includes('독립협회 탄압')) card.classList.add('critical'); });
        addBefore($('.choice-panel', right), '<div class="hwangguk-summary"><strong>정리</strong><p>황국협회는 비판받아야 할 단체입니다. 발표에서는 그 비판을 보부상의 폐단, 황제권의 정치적 동원, 독립협회 탄압이라는 구조 속에서 설명합니다.</p></div>');
      }
    }
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
    const lines = ['역사는','흑백이','아니다'];
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
        setTimeout(() => { playIntroSparkle(); ensureFinalStamp(); }, 140);
        return result;
      };
      window[name].__enhancementWrapped = true;
    });
  }

  function boot(attempts){
    addStyles();
    restoreYunchihoDiary();
    restoreOtherFinalPatchCopy();
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
