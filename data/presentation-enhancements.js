// 발표 보조 레이어
// 윤치호 일기 카드 보정 + 발표용 시네마틱 효과 강화
(function(){
  'use strict';

  const VERSION = '2026-06-10-big-cinematic-v2';
  if(window.__PRESENTATION_ENHANCEMENTS__ === VERSION) return;
  window.__PRESENTATION_ENHANCEMENTS__ = VERSION;

  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const textOf = node => (node && node.textContent || '').trim();
  const esc = value => String(value || '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));

  const diaryDetails = {
    '절차로 움직인 반외세 운동': ['독립협회의 반외세 운동은 감정적 저항이었을까, 절차를 갖춘 정치 운동이었을까?', ['절차적 반외세','사실 확인','여론 정치','외세 견제']],
    '헌의 6조를 밀어붙인 정치적 기대': ['황제권을 활용한 개혁 추진은 현실적 전략이었을까, 독립협회의 한계였을까?', ['황제권','헌의 6조','개혁 전략','제도화']],
    '대한의 마지막 희망이라는 절박함': ['독립협회를 마지막 희망으로 본 절박함은 자주독립 의식인가, 시대적 불안의 표현인가?', ['희망과 불안','자주독립','외세 개입','정치 위기']],
    '민권운동 지도자가 느낀 대중과의 거리': ['윤치호의 대중 비판은 엘리트주의인가, 개혁 운동의 고립감에서 나온 실망인가?', ['대중과의 거리','엘리트주의','민권 운동','사회적 지지']],
    '만민공동회 실패를 복합적으로 본 시선': ['만민공동회의 실패는 탄압 때문이었을까, 운동 내부의 전략과 여론 변화도 함께 작용했을까?', ['실패의 복합 요인','전략','여론 변화','황제권']],
    '독립협회 와해 이후의 씁쓸한 총결산': ['윤치호의 사후 평가는 실패에 대한 냉정한 진단인가, 좌절감이 만든 책임 전가인가?', ['좌절과 냉소','공공정신','사후 평가','책임 인식']]
  };

  function addStyles(){
    const old = $('#presentationEnhancementStyles');
    if(old) old.remove();
    const style = document.createElement('style');
    style.id = 'presentationEnhancementStyles';
    style.textContent = `
      .diary-card{min-width:0;display:flex;flex-direction:column;gap:.65rem}.diary-card .quote{max-height:min(34vh,24rem);overflow:auto;padding-right:.95rem;scrollbar-width:thin}.diary-card .pq{margin-top:.45rem;padding:.8rem;border-radius:.9rem;background:rgba(141,47,39,.1);font-weight:850;color:#3b291c}.diary-tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.2rem}.diary-tags .tag{margin-bottom:0;font-size:.72rem}

      body.cinema-transitioning .topbar{filter:brightness(.72) blur(.2px)}
      body.cinema-transitioning .slide.active .wrap{animation:cinemaPagePull .95s ease both;transform-origin:center center}
      @keyframes cinemaPagePull{0%{transform:scale(1);filter:none}35%{transform:scale(.982);filter:blur(1.2px) brightness(.72)}100%{transform:scale(1);filter:none}}
      body.stamp-shake{animation:stampBodyShake .36s ease both}@keyframes stampBodyShake{0%,100%{transform:translate3d(0,0,0)}18%{transform:translate3d(5px,-2px,0)}36%{transform:translate3d(-5px,2px,0)}54%{transform:translate3d(3px,1px,0)}72%{transform:translate3d(-2px,-1px,0)}}

      #inkLiteSweep{position:fixed;inset:0;z-index:10020;pointer-events:none;opacity:0;overflow:hidden;contain:layout paint;background:rgba(6,5,3,0)}
      #inkLiteSweep.active{opacity:1;background:rgba(6,5,3,.42);animation:inkVeilPulse 1.18s ease both}
      #inkLiteSweep .ink-lite-brush{position:absolute;top:-30vh;bottom:-30vh;left:-62vw;width:70vw;opacity:0;border-radius:42% 58% 64% 36% / 34% 65% 42% 58%;clip-path:polygon(8% 0,96% 7%,83% 21%,100% 38%,77% 57%,94% 75%,68% 100%,0 92%,13% 71%,2% 52%,17% 29%,0 10%);background:linear-gradient(90deg,rgba(7,6,4,0),rgba(7,6,4,.72) 10%,rgba(0,0,0,.98) 33%,rgba(3,2,1,.98) 56%,rgba(20,14,9,.82) 77%,rgba(201,154,58,.23) 89%,rgba(7,6,4,0));filter:drop-shadow(0 0 22px rgba(0,0,0,.92)) blur(.2px)}
      #inkLiteSweep .ink-lite-brush.b2{top:-26vh;bottom:-26vh;width:62vw;animation-delay:.08s;opacity:0;filter:drop-shadow(0 0 18px rgba(0,0,0,.86)) blur(.5px);transform:translateX(-84vw) rotate(8deg) skewX(8deg);background:linear-gradient(90deg,rgba(7,6,4,0),rgba(7,6,4,.64) 12%,rgba(0,0,0,.94) 42%,rgba(32,22,13,.72) 74%,rgba(201,154,58,.18) 88%,rgba(7,6,4,0))}
      #inkLiteSweep .ink-lite-edge{position:absolute;top:-25vh;bottom:-25vh;left:-30vw;width:15vw;opacity:0;border-radius:50%;transform:translateX(-55vw) rotate(-8deg);background:linear-gradient(90deg,transparent,rgba(245,234,210,.55),rgba(201,154,58,.36),transparent);filter:blur(8px)}
      #inkLiteSweep .ink-splatter{position:absolute;inset:-8vh -8vw;opacity:0;background:radial-gradient(circle at 13% 24%,rgba(0,0,0,.92) 0 2.5rem,transparent 2.7rem),radial-gradient(circle at 28% 74%,rgba(0,0,0,.82) 0 3.3rem,transparent 3.5rem),radial-gradient(circle at 62% 28%,rgba(0,0,0,.88) 0 4.6rem,transparent 4.9rem),radial-gradient(circle at 82% 60%,rgba(0,0,0,.78) 0 3.7rem,transparent 4rem),radial-gradient(circle at 45% 91%,rgba(0,0,0,.75) 0 2.9rem,transparent 3.1rem);filter:blur(2px)}
      #inkLiteSweep.active .ink-lite-brush{animation:inkLiteBrushBig 1.18s cubic-bezier(.38,0,.13,1) both}
      #inkLiteSweep.active .ink-lite-brush.b2{animation:inkLiteBrushBig2 1.18s cubic-bezier(.38,0,.13,1) both}
      #inkLiteSweep.active .ink-lite-edge{animation:inkLiteEdgeBig 1.18s cubic-bezier(.38,0,.13,1) both}
      #inkLiteSweep.active .ink-splatter{animation:inkSplatterFlash 1.18s ease both}
      @keyframes inkVeilPulse{0%{background:rgba(6,5,3,0)}20%{background:rgba(6,5,3,.55)}55%{background:rgba(6,5,3,.68)}100%{background:rgba(6,5,3,0)}}
      @keyframes inkLiteBrushBig{0%{transform:translateX(-86vw) rotate(-10deg) skewX(-8deg) scaleX(.85);opacity:0}10%{opacity:.98}42%{transform:translateX(24vw) rotate(-5deg) skewX(-4deg) scaleX(1.44);opacity:1}66%{transform:translateX(72vw) rotate(-7deg) skewX(-5deg) scaleX(1.18);opacity:.92}100%{transform:translateX(154vw) rotate(-10deg) skewX(-8deg) scaleX(.86);opacity:0}}
      @keyframes inkLiteBrushBig2{0%{transform:translateX(-98vw) rotate(8deg) skewX(8deg) scaleX(.82);opacity:0}18%{opacity:.78}48%{transform:translateX(18vw) rotate(5deg) skewX(4deg) scaleX(1.32);opacity:.95}74%{transform:translateX(80vw) rotate(7deg) skewX(6deg) scaleX(1.05);opacity:.72}100%{transform:translateX(145vw) rotate(8deg) skewX(8deg) scaleX(.9);opacity:0}}
      @keyframes inkLiteEdgeBig{0%{transform:translateX(-62vw) rotate(-8deg);opacity:0}20%{opacity:1}58%{opacity:.72}100%{transform:translateX(130vw) rotate(-8deg);opacity:0}}
      @keyframes inkSplatterFlash{0%,18%{opacity:0;transform:scale(.9)}36%{opacity:.58;transform:scale(1)}72%{opacity:.25}100%{opacity:0;transform:scale(1.04)}}

      .feedback .verdict-stamp{position:static!important;width:max-content!important;max-width:100%!important;margin:.9rem 0 0 auto!important;padding:.42rem .78rem .48rem!important;border:4px double rgba(141,47,39,.96)!important;border-radius:.38rem!important;display:block!important;color:var(--red,#8d2f27)!important;background:rgba(255,255,255,.38)!important;font-family:"Noto Serif KR","Noto Sans KR",serif!important;font-weight:950!important;text-align:center!important;letter-spacing:-.05em!important;opacity:1;transform:rotate(-5deg) scale(1);pointer-events:none!important;box-shadow:0 6px 14px rgba(141,47,39,.12)!important}.feedback .verdict-stamp span{display:block!important;font-size:1.18rem!important;line-height:1!important}.feedback .verdict-stamp small{display:block!important;margin-top:.18rem!important;font-family:"Noto Sans KR",sans-serif!important;font-size:.76rem!important;letter-spacing:-.03em!important}.feedback .verdict-stamp.stamp-impact{animation:choiceStampImpactBig .72s both!important;transform-origin:center center}.feedback .verdict-stamp.stamp-impact:after{content:"";position:absolute;inset:-14px;border:3px solid rgba(141,47,39,.32);border-radius:.52rem;opacity:0;animation:stampShockRing .72s ease both}@keyframes choiceStampImpactBig{0%{opacity:0;transform:translateY(-96px) rotate(-12deg) scale(2.45);filter:blur(2.4px)}22%{opacity:1;transform:translateY(0) rotate(-5deg) scale(1.24,.72);filter:none;box-shadow:inset 0 0 0 3px rgba(141,47,39,.45),0 0 0 0 rgba(141,47,39,.38),0 18px 28px rgba(141,47,39,.26)}39%{transform:translateY(-9px) rotate(-5deg) scale(.88,1.2)}56%{transform:translateY(0) rotate(-5deg) scale(1.08,.96)}76%{transform:translateY(0) rotate(-5deg) scale(.98,1.03)}100%{opacity:1;transform:translateY(0) rotate(-5deg) scale(1);filter:none;box-shadow:0 6px 14px rgba(141,47,39,.12)}}@keyframes stampShockRing{0%,20%{opacity:.75;transform:scale(.75)}100%{opacity:0;transform:scale(1.55)}}

      .slide.verdict-stage,.slide.final-verdict-stage{position:relative!important;overflow:hidden}.final-completion-stamp{position:absolute!important;right:clamp(1.2rem,7vw,5rem)!important;bottom:clamp(7.5rem,22vh,13rem)!important;z-index:50!important;min-width:9.4rem!important;padding:.68rem 1.05rem .75rem!important;border:.34rem solid #8d2f27!important;border-radius:.6rem!important;display:grid!important;place-items:center!important;color:#8d2f27!important;background:rgba(255,248,232,.16)!important;font-family:"Noto Serif KR","Noto Sans KR",serif!important;font-weight:950!important;font-size:clamp(1.45rem,3vmin,2.3rem)!important;line-height:1!important;letter-spacing:-.08em!important;opacity:1;transform:rotate(-7deg) scale(1);pointer-events:none!important;box-shadow:inset 0 0 0 .14rem rgba(141,47,39,.48),0 0 34px rgba(141,47,39,.36)!important}.final-completion-stamp.final-stamp-impact{animation:finalStampImpactBig .86s both!important;transform-origin:center center}@keyframes finalStampImpactBig{0%{opacity:0;transform:translate3d(0,-220px,0) rotate(-18deg) scale(2.05);filter:blur(3px)}28%{opacity:1;transform:translate3d(0,0,0) rotate(-7deg) scale(1.22,.76);filter:none;box-shadow:inset 0 0 0 .16rem rgba(141,47,39,.58),0 0 0 0 rgba(141,47,39,.35),0 0 40px rgba(141,47,39,.4)}45%{transform:translate3d(0,-12px,0) rotate(-7deg) scale(.9,1.18);box-shadow:inset 0 0 0 .14rem rgba(141,47,39,.48),0 0 0 34px rgba(141,47,39,0),0 0 34px rgba(141,47,39,.34)}64%{transform:translate3d(0,0,0) rotate(-7deg) scale(1.07,.98)}82%{transform:rotate(-7deg) scale(.98,1.02)}100%{opacity:1;transform:rotate(-7deg) scale(1)}}

      #returnPresentEffect{position:fixed;inset:0;z-index:10030;display:none;place-items:center;overflow:hidden;background:radial-gradient(circle at center,rgba(245,234,210,.2),transparent 18rem),radial-gradient(circle at 80% 20%,rgba(201,154,58,.26),transparent 30rem),radial-gradient(circle at 20% 80%,rgba(141,47,39,.2),transparent 26rem),#070604;color:var(--paper,#f5ead2);pointer-events:none}#returnPresentEffect.active{display:grid;animation:returnFade 3.2s ease both}#returnPresentEffect .return-tunnel{position:absolute;inset:-32vmax;background:repeating-conic-gradient(from 0deg,rgba(245,234,210,.1) 0deg 6deg,transparent 6deg 14deg),repeating-radial-gradient(circle at center,transparent 0 5.2rem,rgba(201,154,58,.14) 5.35rem 5.65rem,transparent 5.82rem 10rem);mix-blend-mode:screen;animation:returnTunnel 3s cubic-bezier(.22,.78,.2,1) both;opacity:.95}#returnPresentEffect .return-rings:before,#returnPresentEffect .return-rings:after{content:"";position:absolute;left:50%;top:50%;width:max(34rem,72vmax);height:max(34rem,72vmax);border:3px solid rgba(245,234,210,.28);border-radius:50%;transform:translate(-50%,-50%);animation:returnRing 2.1s ease-out infinite}#returnPresentEffect .return-rings:after{width:max(52rem,106vmax);height:max(52rem,106vmax);animation-delay:.22s;border-color:rgba(201,154,58,.34)}#returnPresentEffect .return-years{position:absolute;inset:0;z-index:3;font-weight:950;font-size:clamp(2.4rem,8vw,7rem);letter-spacing:-.08em;color:rgba(245,234,210,.24)}#returnPresentEffect .return-years span{position:absolute;left:50%;top:50%;opacity:0;animation:returnYear .72s ease-in-out both}#returnPresentEffect .return-years span:nth-child(1){animation-delay:0s}#returnPresentEffect .return-years span:nth-child(2){animation-delay:.34s}#returnPresentEffect .return-years span:nth-child(3){animation-delay:.68s}#returnPresentEffect .return-years span:nth-child(4){animation-delay:1.02s}#returnPresentEffect .return-years span:nth-child(5){animation-delay:1.36s;color:rgba(245,234,210,.58)}#returnPresentEffect .return-msg{position:absolute;left:50%;bottom:10vh;width:min(92vw,680px);z-index:4;text-align:center;padding:1.2rem 1.55rem;border:1px solid rgba(245,234,210,.26);border-radius:1.4rem;background:rgba(16,14,11,.66);backdrop-filter:blur(10px);box-shadow:0 24px 70px rgba(0,0,0,.36);animation:returnMsg 3.1s ease both}#returnPresentEffect .return-msg strong{display:block;font-family:"Noto Serif KR",serif;font-size:clamp(1.55rem,4.4vw,3rem);letter-spacing:-.06em;line-height:1.12}#returnPresentEffect .return-msg p{margin:.45rem 0 0;color:rgba(255,248,232,.75);line-height:1.55}@keyframes returnFade{0%{opacity:0}12%,82%{opacity:1}100%{opacity:0}}@keyframes returnRing{from{transform:translate(-50%,-50%) scale(1.85);opacity:0}28%{opacity:.62}to{transform:translate(-50%,-50%) scale(.42);opacity:0}}@keyframes returnTunnel{from{transform:scale(1.65) rotate(-180deg);opacity:.18}45%{opacity:.98}to{transform:scale(.72) rotate(0deg);opacity:.28}}@keyframes returnYear{0%{opacity:0;transform:translate(-50%,-50%) scale(.56);filter:blur(3px)}18%,68%{opacity:.98;transform:translate(-50%,-50%) scale(1);filter:blur(0)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.32);filter:blur(2px)}}@keyframes returnMsg{0%{opacity:0;transform:translate(-50%,26px) scale(.96)}28%,74%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-18px) scale(1.02)}}
    `;
    document.head.appendChild(style);
  }

  function routeText(route){
    if(!route) return '';
    const clone = route.cloneNode(true), strong = $('strong', clone);
    if(strong) strong.remove();
    return textOf(clone);
  }

  function readArticle(article, fallback){
    if(!article) return {...fallback};
    const title = textOf($('h3', article)) || fallback.title;
    const detail = diaryDetails[title] || [];
    const bodyP = $$('p', article).find(p => !p.classList.contains('quote') && !p.classList.contains('pq'));
    const tags = $$('.diary-tags .tag', article).map(textOf).filter(Boolean);
    return {date:textOf($('.diary-meta strong', article)) || fallback.date, source:textOf($('.diary-meta span', article)) || fallback.source, title, quote:textOf($('.quote', article)) || fallback.quote, body:textOf(bodyP) || fallback.body, routeTitle:textOf($('.route strong', article)) || fallback.routeTitle, routeText:routeText($('.route', article)) || fallback.routeText, question:textOf($('.pq', article)) || detail[0] || fallback.question, tags:tags.length ? tags : (detail[1] || fallback.tags || [])};
  }

  function nextElement(start, selector){
    let node = start ? start.nextSibling : null;
    while(node){ if(node.nodeType === Node.ELEMENT_NODE && node.matches(selector)) return node; node = node.nextSibling; }
    return null;
  }
  function previousDate(start, fallbackDate){
    let node = start ? start.previousSibling : null;
    while(node){ const match = textOf(node).match(/\d+\.\s*\d{4}-\d{2}-\d{2}/); if(match) return match[0]; node = node.previousSibling; }
    return fallbackDate;
  }
  function previousSource(start, fallbackSource){
    let node = start ? start.previousSibling : null;
    while(node){ if(node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN' && textOf(node).includes('국역 윤치호')) return textOf(node); node = node.previousSibling; }
    return fallbackSource;
  }
  function readOrphan(slide, titleText, fallback){
    const h3 = $$('h3', slide).find(el => textOf(el) === titleText);
    if(!h3) return {...fallback};
    const article = h3.closest('article.diary-card');
    if(article) return readArticle(article, fallback);
    const quote = nextElement(h3, 'p.quote');
    const body = quote ? nextElement(quote, 'p:not(.quote):not(.pq)') : null;
    const route = body ? nextElement(body, '.route') : null;
    const detail = diaryDetails[titleText] || [];
    return {date:previousDate(h3, fallback.date), source:previousSource(h3, fallback.source), title:titleText, quote:textOf(quote) || fallback.quote, body:textOf(body) || fallback.body, routeTitle:textOf($('strong', route)) || fallback.routeTitle, routeText:routeText(route) || fallback.routeText, question:detail[0] || fallback.question, tags:detail[1] || fallback.tags || []};
  }
  function cardHTML(card){
    const tags = (card.tags || []).map(tag => `<span class="tag">${esc(tag)}</span>`).join('');
    const route = card.routeTitle || card.routeText ? `<div class="route"><strong>${esc(card.routeTitle || '해석')}</strong>${esc(card.routeText)}</div>` : '';
    const question = card.question ? `<p class="pq">${esc(card.question)}</p>` : '';
    const tagBox = tags ? `<div class="diary-tags">${tags}</div>` : '';
    return `<article class="paper diary-card"><div class="diary-meta"><strong>${esc(card.date)}</strong><span>${esc(card.source)}</span></div><h3>${esc(card.title)}</h3><p class="quote">${esc(card.quote)}</p><p>${esc(card.body)}</p>${route}${question}${tagBox}</article>`;
  }
  function decorateDiaryCards(){
    $$('.diary-card').forEach(card => {
      const title = textOf($('h3', card)), detail = diaryDetails[title];
      if(!detail) return;
      if(!$('.pq', card)){ const p = document.createElement('p'); p.className = 'pq'; p.textContent = detail[0]; card.appendChild(p); }
      if(!$('.diary-tags', card)){ const box = document.createElement('div'); box.className = 'diary-tags'; box.innerHTML = detail[1].map(tag => `<span class="tag">${esc(tag)}</span>`).join(''); card.appendChild(box); }
    });
  }
  function removeLeftovers(slide, wrap){
    Array.from(slide.childNodes).forEach(node => { if(node === wrap) return; if(node.nodeType === Node.TEXT_NODE && textOf(node)) node.remove(); if(node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('final-completion-stamp')) node.remove(); });
    $$('article.diary-card,h3,p.quote,.route,.diary-tags,.pq', slide).forEach(el => { const fixedGrid = $('.wrap > .cols3', slide); if(fixedGrid && !fixedGrid.contains(el)) el.remove(); });
  }
  function fixYunchihoFirstSlide(){
    const slide = $$('.slide').find(s => (s.dataset.title || '').includes('윤치호 일기로 보는'));
    if(!slide) return;
    let wrap = $(':scope > .wrap', slide) || $('.wrap', slide);
    const grid = $('.cols3', wrap || slide);
    if(!wrap || !grid) return;
    if(slide.dataset.yunchihoFixed !== '1'){
      const defaults = {
        one:{date:'1. 1898-03-03',source:'국역 윤치호 영문 일기 5',title:'절차로 움직인 반외세 운동',quote:'',body:'',routeTitle:'',routeText:'',question:diaryDetails['절차로 움직인 반외세 운동'][0],tags:diaryDetails['절차로 움직인 반외세 운동'][1]},
        two:{date:'2. 1898-10-31',source:'국역 윤치호 영문 일기 5',title:'헌의 6조를 밀어붙인 정치적 기대',quote:'',body:'',routeTitle:'해석',routeText:'황제의 권위를 활용해 개혁을 제도화하려 한 현실적 전략과 한계가 함께 드러납니다.',question:diaryDetails['헌의 6조를 밀어붙인 정치적 기대'][0],tags:diaryDetails['헌의 6조를 밀어붙인 정치적 기대'][1]},
        three:{date:'3. 1898-11-05',source:'국역 윤치호 영문 일기 5',title:'대한의 마지막 희망이라는 절박함',quote:'',body:'',routeTitle:'해석',routeText:'자주독립 의식과 시대적 불안이 함께 드러납니다.',question:diaryDetails['대한의 마지막 희망이라는 절박함'][0],tags:diaryDetails['대한의 마지막 희망이라는 절박함'][1]}
      };
      const firstArticle = $$('article.diary-card', grid).find(card => textOf(card).includes('절차로 움직인 반외세 운동')) || $('article.diary-card', grid);
      const first = readArticle(firstArticle, defaults.one);
      const second = readOrphan(slide, '헌의 6조를 밀어붙인 정치적 기대', defaults.two);
      const third = readOrphan(slide, '대한의 마지막 희망이라는 절박함', defaults.three);
      const kicker = $('.kicker', wrap)?.innerHTML || '사료 강화 · 윤치호 일기';
      const title = $('h2', wrap)?.innerHTML || slide.dataset.title || '윤치호 일기로 보는 독립협회의 희망과 균열';
      const lead = $('.lead', wrap)?.innerHTML || '';
      const nextText = $('.next .main', wrap)?.innerHTML || '다음: 기대와 균열 →';
      wrap.innerHTML = `<div class="kicker">${kicker}</div><h2>${title}</h2><p class="lead">${lead}</p><div class="cols3">${cardHTML(first)}${cardHTML(second)}${cardHTML(third)}</div><div class="next"><button class="main" data-next>${nextText}</button></div>`;
      slide.dataset.yunchihoFixed = '1';
    }
    wrap = $(':scope > .wrap', slide) || $('.wrap', slide);
    removeLeftovers(slide, wrap);
  }

  function getSlides(){ return $$('.slide'); }
  function getCurrentIndex(){ if(typeof window.current === 'number') return window.current; const i = getSlides().findIndex(slide => slide.classList.contains('active')); return Math.max(0, i); }
  function ensureInkLayer(){
    let ink = $('#inkLiteSweep');
    if(!ink){
      ink = document.createElement('div');
      ink.id = 'inkLiteSweep';
      ink.innerHTML = '<div class="ink-splatter"></div><div class="ink-lite-brush"></div><div class="ink-lite-brush b2"></div><div class="ink-lite-edge"></div>';
      document.body.appendChild(ink);
    }
    return ink;
  }
  function ensureReturnLayer(){
    let layer = $('#returnPresentEffect');
    if(!layer){
      layer = document.createElement('div');
      layer.id = 'returnPresentEffect';
      layer.innerHTML = '<div class="return-tunnel"></div><div class="return-rings"></div><div class="return-years"><span>1896</span><span>1898</span><span>1899</span><span>1905</span><span>오늘</span></div><div class="return-msg"><strong>현재로 돌아갑니다</strong><p>우리 반의 선택을 마지막 결론으로 정리합니다.</p></div>';
      document.body.appendChild(layer);
    }
    return layer;
  }
  function playInkTransition(callback){
    const ink = ensureInkLayer();
    document.body.classList.add('cinema-transitioning');
    ink.classList.remove('active'); void ink.offsetWidth; ink.classList.add('active');
    setTimeout(() => { if(callback) callback(); }, 520);
    setTimeout(() => { ink.classList.remove('active'); document.body.classList.remove('cinema-transitioning'); }, 1220);
  }
  function refreshCinematicEffects(){ setTimeout(() => { applyChoiceStamp(); applyFinalStamp(); }, 70); }
  function punchScreen(){ document.body.classList.remove('stamp-shake'); void document.body.offsetWidth; document.body.classList.add('stamp-shake'); setTimeout(() => document.body.classList.remove('stamp-shake'), 430); }

  function applyChoiceStamp(){
    $$('.feedback.visible .verdict-stamp').forEach(stamp => {
      if(stamp.dataset.presentationStampPlayed === '1') return;
      stamp.dataset.presentationStampPlayed = '1';
      if(getComputedStyle(stamp).position === 'static') stamp.style.position = 'relative';
      stamp.classList.remove('stamp-impact'); void stamp.offsetWidth; stamp.classList.add('stamp-impact'); punchScreen();
      stamp.addEventListener('animationend', () => stamp.classList.remove('stamp-impact'), {once:true});
    });
  }

  function applyFinalStamp(){
    const slides = getSlides(), idx = getCurrentIndex(), active = slides[idx];
    if(!active) return;
    slides.forEach(slide => { if(slide !== active){ slide.classList.remove('final-verdict-stage','verdict-stage'); $$(':scope > .final-completion-stamp', slide).forEach(stamp => stamp.remove()); } });
    if(idx !== slides.length - 1) return;
    active.classList.add('final-verdict-stage','verdict-stage');
    let stamp = $(':scope > .final-completion-stamp', active);
    if(!stamp){ stamp = document.createElement('div'); stamp.className = 'final-completion-stamp'; stamp.innerHTML = '<span>판결 완료</span>'; active.appendChild(stamp); }
    if(stamp.dataset.presentationFinalPlayed !== '1'){
      stamp.dataset.presentationFinalPlayed = '1';
      stamp.classList.remove('final-stamp-impact'); void stamp.offsetWidth; stamp.classList.add('final-stamp-impact'); punchScreen();
      stamp.addEventListener('animationend', () => stamp.classList.remove('final-stamp-impact'), {once:true});
    }
  }

  function installCinematicEnhancements(){
    ensureInkLayer(); ensureReturnLayer();
    if(window.__PRESENTATION_BIG_CINEMATIC_INSTALLED__){ refreshCinematicEffects(); return; }
    const rawGoTo = window.goTo;
    if(typeof rawGoTo !== 'function') return;
    window.__PRESENTATION_BIG_CINEMATIC_INSTALLED__ = true;
    let direct = false;
    function goDirect(target, scroll=true){ direct = true; try{ return rawGoTo.call(window, target, scroll); } finally{ direct = false; } }
    function playReturnToPresent(target){
      const layer = ensureReturnLayer();
      layer.classList.remove('active'); void layer.offsetWidth; layer.classList.add('active');
      setTimeout(() => { goDirect(target, true); refreshCinematicEffects(); }, 2460);
      setTimeout(() => layer.classList.remove('active'), 3260);
    }
    window.goTo = function(i, scroll=true){
      const slides = getSlides(), target = Math.max(0, Math.min(Number(i) || 0, slides.length - 1)), now = getCurrentIndex();
      if(direct || target === now || $('#returnPresentEffect.active') || $('#timewarp.active')){ const result = rawGoTo.call(window, target, scroll); refreshCinematicEffects(); return result; }
      playInkTransition(() => { goDirect(target, scroll); refreshCinematicEffects(); });
    };
    window.nextSlide = function(){ const slides = getSlides(), now = getCurrentIndex(); if(now === slides.length - 2) return playReturnToPresent(now + 1); return window.goTo(now + 1); };
    window.prevSlide = function(){ return window.goTo(getCurrentIndex() - 1); };
    const rawStart = window.startTimeTravel;
    if(typeof rawStart === 'function') window.startTimeTravel = function(){ const result = rawStart.apply(this, arguments); setTimeout(refreshCinematicEffects, 2850); setTimeout(refreshCinematicEffects, 3450); return result; };
    document.addEventListener('click', e => {
      const next = e.target.closest('[data-next],#nextBtn');
      const prev = e.target.closest('#prevBtn');
      if(next){ e.preventDefault(); e.stopImmediatePropagation(); return window.nextSlide(); }
      if(prev){ e.preventDefault(); e.stopImmediatePropagation(); return window.prevSlide(); }
      refreshCinematicEffects();
    }, true);
    document.addEventListener('change', refreshCinematicEffects, true);
    document.addEventListener('keydown', e => { if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') setTimeout(refreshCinematicEffects, 80); }, true);
    new MutationObserver(refreshCinematicEffects).observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['class']});
    refreshCinematicEffects();
  }

  function boot(){ addStyles(); fixYunchihoFirstSlide(); decorateDiaryCards(); installCinematicEnhancements(); }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 800);
  setTimeout(boot, 1800);
})();
