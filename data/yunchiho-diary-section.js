// 윤치호 일기 섹션을 기존 발표 슬라이드 배열에 동적으로 삽입한다.
// index.html의 기존 구조를 최대한 건드리지 않기 위한 후처리 스크립트.
(function(){
  const VERSION = '2026-05-23-button-label-fix';

  function esc(value){
    return String(value == null ? '' : value)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }

  function strip(html){
    return String(html || '')
      .replace(/<br\s*\/?>/g,' ')
      .replace(/<[^>]+>/g,'')
      .replace(/\s+/g,' ')
      .trim();
  }

  function slideTitleText(slide){
    const html = (slide && slide.html) || '';
    const h2 = html.match(/<h2>([\s\S]*?)<\/h2>/);
    const h1 = html.match(/<h1>([\s\S]*?)<\/h1>/);
    return strip((h2 && h2[1]) || (h1 && h1[1]) || html.slice(0,180));
  }

  function findSlideIndex(keyword){
    return slides.findIndex(s => slideTitleText(s).includes(keyword));
  }

  function removeSlideByKeyword(keyword){
    const idx = findSlideIndex(keyword);
    if(idx < 0) return null;
    return slides.splice(idx,1)[0];
  }

  function normalizeMovedPeopleSlide(slide){
    if(!slide || !slide.html) return slide;
    slide.html = slide.html
      .replace('4단계 · 인물 재조명: 먼저 지도부를 본다','인물 재조명 · 한계의 얼굴들')
      .replace('독립협회를 평가하기 전에, 먼저 그 운동을 이끈 사람들을 봅니다. 지도부의 시선과 한계를 알면 독립협회의 활동도 더 객관적으로 볼 수 있습니다.','앞에서 독립협회의 밝은 면과 제도적 한계를 살펴봤습니다. 이제 그 운동을 이끈 인물들의 복합적인 행적을 보고, 곧바로 윤치호 일기로 지도부 내부의 시선을 확인합니다.')
      .replace('다음: 개혁 주체 선택 →','다음: 윤치호 일기 →');
    return slide;
  }

  function diaryCard(entry, index){
    const tags = (entry.topics || []).slice(0, 4).map(t => '<span class="tag">'+esc(t)+'</span>').join(' ');
    const date = [entry.date, entry.lunarDate, entry.weekday].filter(Boolean).join(' · ');
    return `
      <article class="paper diary-card">
        <div class="diary-meta"><strong>${index + 1}. ${esc(date)}</strong><span>${esc(entry.sourceTitle)}</span></div>
        <h3>${esc(entry.cardTitle)}</h3>
        <p class="quote">“${esc(entry.quote)}”</p>
        <p>${esc(entry.summary)}</p>
        <div class="route"><strong>해석</strong>${esc(entry.interpretation)}</div>
        <p class="pq">${esc(entry.question)}</p>
        <div class="diary-tags">${tags}</div>
      </article>`;
  }

  function diaryTable(entries){
    return entries.map(e => `
      <div class="term">
        <strong>${esc(e.date)}</strong>
        <span>${esc(e.cardTitle)} — ${esc(e.axis || '')}</span>
      </div>`).join('');
  }

  function buildIntroSlide(entries){
    const firstThree = entries.slice(0,3).map((e,i)=>diaryCard(e,i)).join('');
    return {
      yunchihoDiary: true,
      html: `<section class="slide"><div class="wrap">
        <div class="kicker">사료 강화 · 윤치호 일기</div>
        <h2>윤치호 일기로 보는 독립협회의 속살</h2>
        <p class="lead">앞에서 독립협회의 밝은 면, 제도적 한계, 그리고 인물들의 복잡한 행적을 살펴봤다면, 이제 지도부 내부의 시선을 1차 사료로 확인합니다. 윤치호 일기는 독립협회의 민권성, 엘리트주의, 황제권 인식이 한꺼번에 드러나는 자료입니다.</p>
        <div class="cols3">${firstThree}</div>
        <div class="next"><button class="main" onclick="nextSlide()">다음: 실패와 사후 평가 →</button></div>
      </div></section>`
    };
  }

  function buildFollowSlide(entries){
    const rest = entries.slice(3).map((e,i)=>diaryCard(e,i+3)).join('');
    return {
      yunchihoDiary: true,
      html: `<section class="slide"><div class="wrap">
        <div class="kicker">사료 강화 · 실패의 해석</div>
        <h2>만민공동회는 왜 실패했나?</h2>
        <p class="lead">윤치호는 만민공동회의 실패를 단순히 정부 탄압 하나로만 보지 않았습니다. 급진파의 전략, 대중 여론의 이탈, 황제권, 일본과 러시아의 이해관계까지 함께 보았습니다.</p>
        <div class="cols2">${rest}</div>
        <div class="paper" style="margin-top:1rem">
          <h3>발표에서 던질 최종 질문</h3>
          <p>독립협회는 민중과 함께한 운동이었을까, 아니면 민중을 계몽 대상으로 본 엘리트의 정치 기획이었을까?</p>
          <div class="quote">이 질문은 앞에서 본 ‘밝은 면’과 ‘한계’를 다시 연결하는 역할을 합니다.</div>
        </div>
        <div class="next"><button class="main" onclick="nextSlide()">다음: 사료 인덱스 →</button></div>
      </div></section>`
    };
  }

  function buildIndexSlide(entries){
    return {
      yunchihoDiary: true,
      html: `<section class="slide"><div class="wrap grid">
        <div>
          <div class="kicker">사료 인덱스</div>
          <h2>오늘 사용한 윤치호 일기 5개</h2>
          <p class="lead">발표자는 이 표를 보고 필요한 사료 카드로 돌아갈 수 있습니다. 모든 항목은 국사편찬위원회 한국사데이터베이스의 한국사료총서 계열 자료를 기준으로 정리했습니다.</p>
          <div class="paper">${diaryTable(entries)}</div>
          <div class="next"><button class="main" onclick="nextSlide()">다음: 인물 탐구 →</button></div>
        </div>
        <aside class="dark">
          <h3>이 섹션의 역할</h3>
          <ul class="hist">
            <li>헌의 6조의 민권성과 황제권 의존성 비교</li>
            <li>독립협회 지도부의 절차주의와 엘리트주의 확인</li>
            <li>만민공동회 실패를 탄압만이 아니라 전략·여론·외세 문제로 해석</li>
          </ul>
          <div class="route"><strong>핵심 결론</strong>윤치호 일기는 독립협회를 더 나쁘게 만들기 위한 자료가 아니라, 더 입체적으로 보기 위한 자료입니다.</div>
        </aside>
      </div></section>`
    };
  }

  function reorderBaseSlides(){
    // 목표 흐름:
    // 독립협회의 밝은 면 → 한계/국민 인식/중추원 → 인물 재조명 → 윤치호 일기
    const peopleSlide = normalizeMovedPeopleSlide(removeSlideByKeyword('한 사람은 하나의 단어로 설명될까'));
    if(!peopleSlide) return;

    let insertAfter = findSlideIndex('중추원은 의회가 될 수 있었을까');
    if(insertAfter < 0) insertAfter = findSlideIndex('‘국민’은 주체였을까');
    if(insertAfter < 0) insertAfter = findSlideIndex('독립협회는 민주주의 단체였을까');
    if(insertAfter < 0) insertAfter = findSlideIndex('민권과 자주독립의 가능성');
    if(insertAfter < 0) insertAfter = Math.min(7, slides.length - 1);

    slides.splice(insertAfter + 1, 0, peopleSlide);
  }

  function injectDiarySlides(){
    if(!Array.isArray(window.YUNCHIHO_DIARY_ENTRIES) || !window.YUNCHIHO_DIARY_ENTRIES.length) return false;
    if(typeof slides === 'undefined' || !Array.isArray(slides)) return false;
    if(slides.some(s => s && s.yunchihoDiary)) return true;

    reorderBaseSlides();

    const entries = window.YUNCHIHO_DIARY_ENTRIES;
    let insertAfter = findSlideIndex('한 사람은 하나의 단어로 설명될까');
    if(insertAfter < 0) insertAfter = findSlideIndex('중추원은 의회가 될 수 있었을까');
    if(insertAfter < 0) insertAfter = findSlideIndex('‘국민’은 주체였을까');
    if(insertAfter < 0) insertAfter = Math.min(9, Math.max(1, slides.length - 1));

    slides.splice(insertAfter + 1, 0, buildIntroSlide(entries), buildFollowSlide(entries), buildIndexSlide(entries));

    if(typeof render === 'function') render();
    return true;
  }

  function addDiaryStyles(){
    if(document.getElementById('yunchiho-diary-styles')) return;
    const style=document.createElement('style');
    style.id='yunchiho-diary-styles';
    style.textContent=`
      .diary-card{min-height:100%;display:flex;flex-direction:column;gap:.65rem}
      .diary-meta{display:flex;justify-content:space-between;gap:.8rem;flex-wrap:wrap;color:#6f5a3f;font-size:.86rem;border-bottom:1px dashed rgba(40,31,23,.2);padding-bottom:.45rem}
      .diary-card .quote{font-family:"Noto Serif KR","Noto Sans KR",serif;font-weight:800;font-size:1.05rem;line-height:1.55;color:#3b291c;background:rgba(141,47,39,.08)}
      .diary-tags{display:flex;gap:.35rem;flex-wrap:wrap;margin-top:auto}
      .diary-tags .tag{margin-bottom:0}
      .diary-debug{position:fixed;right:.8rem;bottom:.8rem;z-index:9999;padding:.25rem .5rem;border-radius:999px;background:rgba(16,14,11,.72);color:#f5ead2;font-size:.72rem;border:1px solid rgba(245,234,210,.18)}
    `;
    document.head.appendChild(style);
  }

  function addDebugBadge(){
    if(document.getElementById('diaryDebugBadge')) return;
    const badge=document.createElement('div');
    badge.id='diaryDebugBadge';
    badge.className='diary-debug';
    badge.textContent='윤치호 섹션 '+VERSION;
    document.body.appendChild(badge);
    setTimeout(()=>badge.remove(),3500);
  }

  function boot(){
    addDiaryStyles();
    if(injectDiarySlides()) addDebugBadge();
    else setTimeout(function(){ if(injectDiarySlides()) addDebugBadge(); }, 50);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
