// 발표 보조 레이어
// 윤치호 일기 카드 보정 + 발표용 시네마틱 효과 복구
(function(){
  'use strict';

  const VERSION = '2026-06-10-presentation-cinematic-restore';
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
    if($('#presentationEnhancementStyles')) return;
    const style = document.createElement('style');
    style.id = 'presentationEnhancementStyles';
    style.textContent = `
      .diary-card{min-width:0;display:flex;flex-direction:column;gap:.65rem}.diary-card .quote{max-height:min(34vh,24rem);overflow:auto;padding-right:.95rem;scrollbar-width:thin}.diary-card .pq{margin-top:.45rem;padding:.8rem;border-radius:.9rem;background:rgba(141,47,39,.1);font-weight:850;color:#3b291c}.diary-tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.2rem}.diary-tags .tag{margin-bottom:0;font-size:.72rem}
      .ink-transition{position:fixed;inset:0;z-index:998;pointer-events:none;opacity:0;overflow:hidden;background:radial-gradient(circle at 20% 35%,rgba(9,7,5,.96) 0 5rem,transparent 5.2rem),radial-gradient(circle at 70% 45%,rgba(9,7,5,.92) 0 7rem,transparent 7.3rem),radial-gradient(circle at 45% 70%,rgba(9,7,5,.9) 0 8rem,transparent 8.4rem);filter:blur(1px) contrast(1.24)}.ink-transition:before,.ink-transition:after{content:"";position:absolute;inset:-22%;background:radial-gradient(circle at 12% 20%,#080604 0 4%,transparent 4.5%),radial-gradient(circle at 28% 70%,#080604 0 7%,transparent 7.5%),radial-gradient(circle at 58% 36%,#080604 0 10%,transparent 10.6%),radial-gradient(circle at 80% 62%,#080604 0 8%,transparent 8.8%),radial-gradient(circle at 44% 88%,#080604 0 6%,transparent 6.6%);opacity:.96;transform:scale(.32) rotate(-8deg)}.ink-transition.active{animation:inkScreen .9s cubic-bezier(.2,.75,.25,1) both}.ink-transition.active:before{animation:inkBlot .9s cubic-bezier(.2,.75,.25,1) both}.ink-transition.active:after{animation:inkBlot2 .9s cubic-bezier(.2,.75,.25,1) both}@keyframes inkScreen{0%{opacity:0}28%{opacity:1}62%{opacity:1}100%{opacity:0}}@keyframes inkBlot{0%{transform:scale(.22) rotate(-14deg);filter:blur(10px)}45%{transform:scale(1.22) rotate(3deg);filter:blur(2px)}100%{transform:scale(1.55) rotate(8deg);filter:blur(7px)}}@keyframes inkBlot2{0%{transform:scale(.18) rotate(10deg);filter:blur(12px)}52%{transform:scale(1.35) rotate(-5deg);filter:blur(2px)}100%{transform:scale(1.7) rotate(-10deg);filter:blur(8px)}}
      .feedback .verdict-stamp{position:static!important;width:max-content!important;max-width:100%!important;margin:.9rem 0 0 auto!important;padding:.38rem .72rem .44rem!important;border:3px double rgba(141,47,39,.9)!important;border-radius:.38rem!important;display:block!important;color:var(--red,#8d2f27)!important;background:rgba(255,255,255,.34)!important;font-family:"Noto Serif KR","Noto Sans KR",serif!important;font-weight:900!important;text-align:center!important;letter-spacing:-.04em!important;opacity:1;transform:rotate(-5deg) scale(1);pointer-events:none!important;box-shadow:0 6px 14px rgba(141,47,39,.12)!important}.feedback .verdict-stamp span{display:block!important;font-size:1.12rem!important;line-height:1!important}.feedback .verdict-stamp small{display:block!important;margin-top:.18rem!important;font-family:"Noto Sans KR",sans-serif!important;font-size:.74rem!important;letter-spacing:-.03em!important}.feedback .verdict-stamp.stamp-impact{animation:choiceStampImpact .54s cubic-bezier(.16,1.14,.28,1) both!important}@keyframes choiceStampImpact{0%{opacity:0;transform:translateY(-30px) rotate(-15deg) scale(2.15);filter:blur(2px)}54%{opacity:1;transform:translateY(0) rotate(-5deg) scale(.9);filter:none;box-shadow:inset 0 0 0 2px rgba(141,47,39,.34),0 0 0 10px rgba(141,47,39,.16),0 12px 24px rgba(141,47,39,.18)!important}76%{transform:translateY(0) rotate(-5deg) scale(1.04)}100%{opacity:1;transform:translateY(0) rotate(-5deg) scale(1);filter:none}}
      .slide.final-verdict-stage{position:relative!important;overflow:hidden}.final-completion-stamp{position:absolute!important;right:clamp(1.2rem,7vw,5rem)!important;bottom:clamp(7.5rem,22vh,13rem)!important;z-index:50!important;min-width:8.4rem!important;padding:.55rem .9rem .62rem!important;border:.28rem solid #8d2f27!important;border-radius:.55rem!important;display:grid!important;place-items:center!important;color:#8d2f27!important;background:rgba(255,248,232,.12)!important;font-family:"Noto Serif KR","Noto Sans KR",serif!important;font-weight:950!important;font-size:clamp(1.25rem,2.6vmin,2rem)!important;line-height:1!important;letter-spacing:-.08em!important;opacity:1;transform:rotate(-7deg) scale(1);pointer-events:none!important;box-shadow:inset 0 0 0 .12rem rgba(141,47,39,.42),0 0 24px rgba(141,47,39,.24)!important}.final-completion-stamp.final-stamp-impact{animation:finalStampImpact .62s cubic-bezier(.16,1.12,.28,1) both!important}@keyframes finalStampImpact{0%{opacity:0;transform:translate3d(0,-160px,0) rotate(-17deg) scale(1.8);filter:blur(2px)}58%{opacity:1;transform:translate3d(0,0,0) rotate(-7deg) scale(.93);filter:none}78%{transform:translate3d(0,0,0) rotate(-7deg) scale(1.04)}100%{opacity:1;transform:translate3d(0,0,0) rotate(-7deg) scale(1);filter:none}}
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
  function ensureInkLayer(){ let ink = $('#inkTransition'); if(!ink){ ink = document.createElement('div'); ink.id = 'inkTransition'; ink.className = 'ink-transition'; document.body.appendChild(ink); } return ink; }
  function playInkTransition(callback){ const ink = ensureInkLayer(); ink.classList.remove('active'); void ink.offsetWidth; ink.classList.add('active'); setTimeout(() => { if(callback) callback(); }, 360); setTimeout(() => ink.classList.remove('active'), 950); }
  function isTimewarpActive(){ const warp = $('#timewarp'); return !!(warp && warp.classList.contains('active')); }
  function refreshCinematicEffects(){ setTimeout(() => { applyChoiceStamp(); applyFinalStamp(); }, 70); }

  function applyChoiceStamp(){
    $$('.feedback.visible .verdict-stamp').forEach(stamp => {
      if(stamp.dataset.presentationStampPlayed === '1') return;
      stamp.dataset.presentationStampPlayed = '1';
      stamp.classList.remove('stamp-impact');
      void stamp.offsetWidth;
      stamp.classList.add('stamp-impact');
      stamp.addEventListener('animationend', () => stamp.classList.remove('stamp-impact'), {once:true});
    });
  }

  function applyFinalStamp(){
    const slides = getSlides(), idx = getCurrentIndex(), active = slides[idx];
    if(!active) return;
    slides.forEach(slide => { if(slide !== active){ slide.classList.remove('final-verdict-stage'); $$(':scope > .final-completion-stamp', slide).forEach(stamp => stamp.remove()); } });
    if(idx !== slides.length - 1) return;
    active.classList.add('final-verdict-stage');
    let stamp = $(':scope > .final-completion-stamp', active);
    if(!stamp){ stamp = document.createElement('div'); stamp.className = 'final-completion-stamp'; stamp.innerHTML = '<span>판결 완료</span>'; active.appendChild(stamp); }
    if(stamp.dataset.presentationFinalPlayed !== '1'){
      stamp.dataset.presentationFinalPlayed = '1';
      stamp.classList.remove('final-stamp-impact');
      void stamp.offsetWidth;
      stamp.classList.add('final-stamp-impact');
      stamp.addEventListener('animationend', () => stamp.classList.remove('final-stamp-impact'), {once:true});
    }
  }

  function installCinematicEnhancements(){
    ensureInkLayer();
    if(window.__PRESENTATION_CINEMATIC_INSTALLED__){ refreshCinematicEffects(); return; }
    const rawGoTo = window.goTo;
    if(typeof rawGoTo !== 'function') return;
    window.__PRESENTATION_CINEMATIC_INSTALLED__ = true;
    let suppressInk = false;
    function goDirect(target, scroll=true){ suppressInk = true; try{ return rawGoTo.call(window, target, scroll); } finally{ suppressInk = false; } }
    function playFinalWarp(target){
      const warp = $('#timewarp');
      if(!warp) return window.goTo(target);
      const strong = $('.wmsg strong', warp), p = $('.wmsg p', warp);
      if(strong) strong.textContent = '현재로 돌아갑니다';
      if(p) p.textContent = '우리 반의 선택을 마지막 결론으로 정리합니다';
      warp.classList.remove('active'); void warp.offsetWidth; warp.classList.add('active');
      setTimeout(() => { goDirect(target, true); refreshCinematicEffects(); }, 2750);
      setTimeout(() => warp.classList.remove('active'), 3350);
    }
    window.goTo = function(i, scroll=true){
      const slides = getSlides(), target = Math.max(0, Math.min(Number(i) || 0, slides.length - 1)), now = getCurrentIndex();
      if(suppressInk || isTimewarpActive() || target === now){ const result = rawGoTo.call(window, target, scroll); refreshCinematicEffects(); return result; }
      playInkTransition(() => { goDirect(target, scroll); refreshCinematicEffects(); });
    };
    window.nextSlide = function(){ const slides = getSlides(), now = getCurrentIndex(); if(now === slides.length - 2) return playFinalWarp(now + 1); return window.goTo(now + 1); };
    window.prevSlide = function(){ return window.goTo(getCurrentIndex() - 1); };
    const rawStart = window.startTimeTravel;
    if(typeof rawStart === 'function') window.startTimeTravel = function(){ const result = rawStart.apply(this, arguments); setTimeout(refreshCinematicEffects, 2850); setTimeout(refreshCinematicEffects, 3450); return result; };
    document.addEventListener('click', refreshCinematicEffects, true);
    document.addEventListener('change', refreshCinematicEffects, true);
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
