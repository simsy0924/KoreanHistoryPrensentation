// 발표 보조 레이어
// index.html의 윤치호 일기 섹션에서 깨진 카드 구조를 화면에서 보정한다.
(function(){
  'use strict';

  const VERSION = '2026-06-01-yunchiho-no-duplicates';
  if(window.__PRESENTATION_ENHANCEMENTS__ === VERSION) return;
  window.__PRESENTATION_ENHANCEMENTS__ = VERSION;

  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const textOf = node => (node && node.textContent || '').trim();

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

  function esc(value){
    return String(value || '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  }

  function addStyles(){
    if($('#presentationEnhancementStyles')) return;
    const style = document.createElement('style');
    style.id = 'presentationEnhancementStyles';
    style.textContent = `
      .diary-card{min-width:0;display:flex;flex-direction:column;gap:.65rem}
      .diary-card .quote{max-height:min(34vh,24rem);overflow:auto;padding-right:.95rem;scrollbar-width:thin}
      .diary-card .pq{margin-top:.45rem;padding:.8rem;border-radius:.9rem;background:rgba(141,47,39,.1);font-weight:850;color:#3b291c}
      .diary-tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.2rem}
      .diary-tags .tag{margin-bottom:0;font-size:.72rem}
    `;
    document.head.appendChild(style);
  }

  function routeText(route){
    if(!route) return '';
    const clone = route.cloneNode(true);
    const strong = $('strong', clone);
    if(strong) strong.remove();
    return textOf(clone);
  }

  function readArticle(article, fallback){
    if(!article) return {...fallback};
    const title = textOf($('h3', article)) || fallback.title;
    const detail = diaryDetails[title] || {};
    const bodyP = $$('p', article).find(p => !p.classList.contains('quote') && !p.classList.contains('pq'));
    return {
      date: textOf($('.diary-meta strong', article)) || fallback.date,
      source: textOf($('.diary-meta span', article)) || fallback.source,
      title,
      quote: textOf($('.quote', article)) || fallback.quote,
      body: textOf(bodyP) || fallback.body,
      routeTitle: textOf($('.route strong', article)) || fallback.routeTitle,
      routeText: routeText($('.route', article)) || fallback.routeText,
      question: textOf($('.pq', article)) || detail.question || fallback.question,
      tags: $$('.diary-tags .tag', article).map(textOf).filter(Boolean).length ? $$('.diary-tags .tag', article).map(textOf).filter(Boolean) : (detail.tags || fallback.tags || [])
    };
  }

  function nextElement(start, selector){
    let node = start ? start.nextSibling : null;
    while(node){
      if(node.nodeType === Node.ELEMENT_NODE && node.matches(selector)) return node;
      node = node.nextSibling;
    }
    return null;
  }

  function previousDate(start, fallbackDate){
    let node = start ? start.previousSibling : null;
    while(node){
      const match = textOf(node).match(/\d+\.\s*\d{4}-\d{2}-\d{2}/);
      if(match) return match[0];
      node = node.previousSibling;
    }
    return fallbackDate;
  }

  function previousSource(start, fallbackSource){
    let node = start ? start.previousSibling : null;
    while(node){
      if(node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN' && textOf(node).includes('국역 윤치호')) return textOf(node);
      node = node.previousSibling;
    }
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
    const detail = diaryDetails[titleText] || {};
    return {
      date: previousDate(h3, fallback.date),
      source: previousSource(h3, fallback.source),
      title: titleText,
      quote: textOf(quote) || fallback.quote,
      body: textOf(body) || fallback.body,
      routeTitle: textOf($('strong', route)) || fallback.routeTitle,
      routeText: routeText(route) || fallback.routeText,
      question: detail.question || fallback.question,
      tags: detail.tags || fallback.tags || []
    };
  }

  function cardHTML(card){
    const tags = (card.tags || []).map(tag => `<span class="tag">${esc(tag)}</span>`).join('');
    const route = card.routeTitle || card.routeText ? `<div class="route"><strong>${esc(card.routeTitle || '해석')}</strong>${esc(card.routeText)}</div>` : '';
    const question = card.question ? `<p class="pq">${esc(card.question)}</p>` : '';
    const tagBox = tags ? `<div class="diary-tags">${tags}</div>` : '';
    return `<article class="paper diary-card"><div class="diary-meta"><strong>${esc(card.date)}</strong><span>${esc(card.source)}</span></div><h3>${esc(card.title)}</h3><p class="quote">${esc(card.quote)}</p><p>${esc(card.body)}</p>${route}${question}${tagBox}</article>`;
  }

  function removeLeftovers(slide, wrap){
    // 깨진 HTML이 브라우저 보정 과정에서 wrap 바깥에 남긴 옛날 카드/문장 제거
    Array.from(slide.childNodes).forEach(node => {
      if(node === wrap) return;
      if(node.nodeType === Node.TEXT_NODE && textOf(node)) node.remove();
      if(node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('final-completion-stamp')) node.remove();
    });

    // 혹시 wrap 밖이 아닌 slide 내부 다른 위치에 남은 중복 일기 요소도 제거
    $$('article.diary-card,h3,p.quote,.route,.diary-tags,.pq', slide).forEach(el => {
      const fixedGrid = $('.wrap > .cols3', slide);
      if(fixedGrid && !fixedGrid.contains(el)) el.remove();
    });
  }

  function decorateDiaryCards(){
    $$('.diary-card').forEach(card => {
      const title = textOf($('h3', card));
      const detail = diaryDetails[title];
      if(!detail) return;
      if(!$('.pq', card)){
        const p = document.createElement('p');
        p.className = 'pq';
        p.textContent = detail.question;
        card.appendChild(p);
      }
      if(!$('.diary-tags', card)){
        const box = document.createElement('div');
        box.className = 'diary-tags';
        box.innerHTML = detail.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join('');
        card.appendChild(box);
      }
    });
  }

  function fixYunchihoFirstSlide(){
    const slide = $$('.slide').find(s => (s.dataset.title || '').includes('윤치호 일기로 보는'));
    if(!slide) return;
    let wrap = $(':scope > .wrap', slide) || $('.wrap', slide);
    const grid = $('.cols3', wrap || slide);
    if(!wrap || !grid) return;

    if(slide.dataset.yunchihoFixed !== '1'){
      const defaults = {
        one: {date:'1. 1898-03-03', source:'국역 윤치호 영문 일기 5', title:'절차로 움직인 반외세 운동', quote:'', body:'', routeTitle:'', routeText:'', question:diaryDetails['절차로 움직인 반외세 운동'].question, tags:diaryDetails['절차로 움직인 반외세 운동'].tags},
        two: {date:'2. 1898-10-31', source:'국역 윤치호 영문 일기 5', title:'헌의 6조를 밀어붙인 정치적 기대', quote:'', body:'', routeTitle:'해석', routeText:'황제의 권위를 활용해 개혁을 제도화하려 한 현실적 전략과 한계가 함께 드러납니다.', question:diaryDetails['헌의 6조를 밀어붙인 정치적 기대'].question, tags:diaryDetails['헌의 6조를 밀어붙인 정치적 기대'].tags},
        three: {date:'3. 1898-11-05', source:'국역 윤치호 영문 일기 5', title:'대한의 마지막 희망이라는 절박함', quote:'', body:'', routeTitle:'해석', routeText:'자주독립 의식과 시대적 불안이 함께 드러납니다.', question:diaryDetails['대한의 마지막 희망이라는 절박함'].question, tags:diaryDetails['대한의 마지막 희망이라는 절박함'].tags}
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

  function boot(){
    addStyles();
    fixYunchihoFirstSlide();
    decorateDiaryCards();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 800);
  setTimeout(boot, 1800);
})();
