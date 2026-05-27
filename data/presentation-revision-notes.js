// 학생 필기 수정안을 발표 흐름에 반영하는 후처리 스크립트.
// 핵심 수정: 첫 화면 문구, '손들기 질문' 표현, 1번 질문 선택지, 2단계 배경 타임라인/이미지 갤러리, 6단계 사료 UI.
(function(){
  const VERSION = '2026-05-27-stage2-gallery-v4-clean';
  if (window.__PRESENTATION_NOTE_REVISION__ === VERSION) return;
  window.__PRESENTATION_NOTE_REVISION__ = VERSION;

  const backgroundGalleryItems = [
    {key:'gabo', year:'1894', title:'갑오개혁', image:'assets/images/갑오개혁.jpg', desc:'갑오개혁을 주도했던 김홍집'},
    {key:'eulmi', year:'1895', title:'을미사변', image:'assets/images/을미사변.jpg', desc:'을미사변의 자객들'},
    {key:'agwan', year:'1896', title:'아관파천', image:'assets/images/아관파천.webp', desc:'아관파천으로 고종이 피신한 당시 러시아 공사관'},
    {key:'independence', year:'1896', title:'독립협회', image:'assets/images/독립협회.jpg', desc:'독립협회가 대중에게 연설하는 그림'},
    {key:'empire', year:'1897', title:'대한제국', image:'assets/images/대한제국.jpg', desc:'파리만국박람회의 대한제국관 화보'},
    {key:'gwangmu', year:'1897~', title:'광무개혁', image:'assets/images/광무개혁.webp', desc:'광무개혁으로 만든 선박의 선원들'},
    {key:'manmin', year:'1898', title:'만민공동회', image:'assets/images/만민 공동회.png', desc:'만민공동회의 모습'},
    {key:'six', year:'1898', title:'헌의 6조', image:'assets/images/헌의6조.jpg', desc:'헌의 6조 사진'},
    {key:'gukje', year:'1899', title:'대한국 국제', image:'assets/images/대한국국제.jpeg', desc:'대한국 국제 사진'},
    {key:'war', year:'1904', title:'러일전쟁', image:'assets/images/러일전쟁.jpg', desc:'러일 전쟁을 묘사한 그림'}
  ];

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
    if (typeof slides === 'undefined' || !Array.isArray(slides)) return -1;
    return slides.findIndex(s => slideTitleText(s).includes(keyword));
  }

  function shortNextTitle(title){
    const t = strip(title);
    if(!t) return '다음으로';
    if(t.includes('우리는 역사를 왜')) return '역사를 배우는 이유';
    if(t.includes('혼란의 시대')) return '시대 상황 보기';
    if(t.includes('아관파천')) return '대한제국의 출발';
    if(t.includes('근대화는 누가')) return '개혁 주체 선택';
    if(t.includes('신문, 회보')) return '독립협회 사료';
    if(t.includes('민권과 자주독립')) return '독립협회의 밝은 면';
    if(t.includes('민주주의 단체')) return '독립협회의 한계';
    if(t.includes('국민')) return '국민은 주체였나';
    if(t.includes('중추원')) return '중추원 보기';
    if(t.includes('한 사람은')) return '인물 탐구';
    if(t.includes('윤치호 일기')) return '윤치호 일기';
    if(t.includes('만민공동회는 왜 실패')) return '실패와 사후 평가';
    if(t.includes('오늘 사용한 윤치호')) return '사료 인덱스';
    if(t.includes('황국협회')) return '황국협회 보기';
    if(t.includes('러시아만')) return '외세와 이권';
    if(t.includes('광무개혁은')) return '광무개혁 재조명';
    if(t.includes('구본신참')) return '광무개혁 세부 내용';
    if(t.includes('근거 자료')) return '근거 자료 정리';
    if(t.includes('우리 반의 역사')) return '학급 선택 정리';
    if(t.includes('그래서')) return '마지막 판단';
    if(t.includes('판결문')) return '결론';
    return t.length > 16 ? t.slice(0,16) + '…' : t;
  }

  function syncNextButtonLabels(){
    if (typeof slides === 'undefined' || !Array.isArray(slides)) return;
    slides.forEach((slide, idx) => {
      if(!slide || typeof slide.html !== 'string') return;
      const next = slides[idx + 1];
      if(!next) return;
      const label = '다음: ' + shortNextTitle(slideTitleText(next)) + ' →';
      slide.html = slide.html.replace(/다음: [^<→]*? →/g, label);
      slide.html = slide.html.replace(/다음 →/g, label);
      slide.html = slide.html.replace(/발표 시작하기 →/g, label);
      slide.html = slide.html.replace(/결론 보기 →/g, label);
    });
  }

  function reviseIntroSlide(){
    const idx = findSlideIndex('역사는 흑백이 아니다');
    if(idx < 0) return;
    let html = slides[idx].html;
    html = html
      .replace('선택형 발표 웹사이트 · 30분 구성','선택형 발표 웹사이트 · 우리 반 역사 토론')
      .replace('학생들은 손을 들고, 발표자는 버튼을 누릅니다.','우리 반 학생들의 투표로 역사에 대한 인식을 점검합니다.')
      .replace('각 질문에서 학생들이 가장 많이 선택한 답을 발표자가 누르면, 그 선택에 맞는 해설이 열리고 마지막 결론에 학급의 선택 흐름이 반영됩니다.','각 질문에서 우리 반이 선택한 답을 발표자가 누르면, 그 선택에 맞는 해설이 열리고 마지막 결론에 학급의 인식 변화가 반영됩니다.')
      .replace('좋은 편과 나쁜 편을 가르는 발표가 아니라, 복잡한 선택의 조건을 따져보는 발표입니다.','좋은 편과 나쁜 편을 가르는 발표가 아니라, 복잡한 선택의 조건을 따지고 더 나은 미래를 생각하는 발표입니다.');
    slides[idx].html = html;
  }

  function reviseQuestionWording(){
    if (typeof slides === 'undefined' || !Array.isArray(slides)) return;
    slides.forEach(slide => {
      if(!slide || typeof slide.html !== 'string') return;
      slide.html = slide.html
        .replace(/손들기 질문/g, '질문')
        .replace(/과거의 사실을 알기 위해/g, '과거에 있었던 일이 궁금해서')
        .replace(/같은 실수를 반복하지 않기 위해/g, '더 나은 미래를 만들기 위해')
        .replace(/실수를 반복하지 않기 위해/g, '더 나은 미래를 만들기 위해');
    });

    if (typeof F !== 'undefined' && F.why) {
      if (F.why.facts) {
        F.why.facts = [
          '과거에 대한 호기심은 역사 공부의 좋은 출발입니다.',
          '다만 궁금증에서 멈추지 않고, 그 일이 왜 일어났고 어떤 결과를 낳았는지 따져봐야 합니다.'
        ];
      }
      if (F.why.repeat) {
        F.why.repeat = [
          '미래를 향한 선택입니다.',
          '과거의 실패와 갈등을 살펴보는 이유는 더 나은 미래를 판단하기 위해서입니다.'
        ];
      }
    }
  }

  function addBackgroundGalleryStyles(){
    if(document.getElementById('backgroundGalleryStyles')) return;
    const style = document.createElement('style');
    style.id = 'backgroundGalleryStyles';
    style.textContent = `
      .bg-stage{display:grid;grid-template-columns:.86fr 1.14fr;gap:1rem;align-items:stretch}
      .bg-left{display:flex;flex-direction:column;justify-content:space-between;gap:1rem;min-width:0}
      .bg-left .lead{color:rgba(255,248,232,.88)}
      .bg-gallery{display:grid;gap:.85rem;min-width:0}
      .era-buttons{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.48rem}
      .era-btn{border:1px solid rgba(245,234,210,.24);background:linear-gradient(180deg,rgba(255,248,232,.13),rgba(255,248,232,.07));color:#fff7df;border-radius:.9rem;padding:.58rem .68rem;font-weight:950;font-size:.88rem;cursor:pointer;text-align:left;transition:transform .16s ease,background .16s ease,border-color .16s ease,box-shadow .16s ease;box-shadow:inset 0 0 0 1px rgba(255,255,255,.025)}
      .era-btn span{display:block;color:#f4cf78;font-size:.73rem;margin-bottom:.1rem;font-weight:950;letter-spacing:.01em}
      .era-btn:hover{background:linear-gradient(180deg,rgba(201,154,58,.24),rgba(245,234,210,.10));border-color:rgba(244,207,120,.55);transform:translateY(-1px)}
      .era-btn.active{background:linear-gradient(180deg,#f1c76e,#c99a3a);border-color:#f7df9d;color:#21160b;box-shadow:0 10px 22px rgba(0,0,0,.22)}
      .era-btn.active span{color:#5a3504}
      .era-image-card{position:relative;min-height:21.5rem;border-radius:1.3rem;overflow:hidden;background:#21180f;border:1px solid rgba(245,234,210,.20);box-shadow:0 22px 60px rgba(0,0,0,.32)}
      .era-image-card:before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.12) 46%,rgba(0,0,0,.68));pointer-events:none}
      .era-image-card img{width:100%;height:100%;min-height:21.5rem;object-fit:cover;display:block;filter:saturate(.96) contrast(1.04);transition:opacity .18s ease}
      .era-image-caption{position:absolute;left:.75rem;right:.75rem;bottom:.75rem;z-index:2;padding:.88rem 1rem;background:rgba(12,10,8,.84);border:1px solid rgba(245,234,210,.18);border-radius:1rem;color:#fff8e8;backdrop-filter:blur(10px);box-shadow:0 16px 34px rgba(0,0,0,.28)}
      .era-image-caption strong{display:block;font-family:"Noto Serif KR",serif;font-size:1.28rem;margin-bottom:.25rem;color:#fff1c9;letter-spacing:-.04em}
      .era-image-caption p{margin:0;color:rgba(255,248,232,.92);line-height:1.5;font-weight:700}
      .bg-mini-timeline{display:grid;gap:.45rem;margin-top:.75rem;max-height:15rem;overflow:auto;padding-right:.25rem}
      .bg-mini-timeline .time{padding:.58rem .68rem;border-radius:.82rem;background:rgba(245,234,210,.09);border:1px solid rgba(245,234,210,.16)}
      .bg-mini-timeline .year{font-size:.76rem;min-width:3.1rem;color:#f4cf78;font-weight:950}
      .bg-mini-timeline strong{font-size:.92rem;color:#fff8e8}
      .bg-mini-timeline span{font-size:.82rem;line-height:1.35;color:rgba(255,248,232,.80)}
      @media(max-width:980px){.bg-stage{grid-template-columns:1fr}.era-buttons{grid-template-columns:repeat(2,minmax(0,1fr))}.era-image-card,.era-image-card img{min-height:17.5rem}}
    `;
    document.head.appendChild(style);
  }

  function timeItem(year, title, body){
    return `<div class="time"><div class="year">${year}</div><div><strong>${title}</strong><br><span>${body}</span></div></div>`;
  }

  function galleryButton(item, active){
    return `<button class="era-btn${active ? ' active' : ''}" onclick="window.showBackgroundImage('${item.key}')"><span>${item.year}</span>${item.title}</button>`;
  }

  window.showBackgroundImage = function(key){
    const item = backgroundGalleryItems.find(v => v.key === key) || backgroundGalleryItems[0];
    const img = document.getElementById('eraGalleryImage');
    const title = document.getElementById('eraGalleryTitle');
    const desc = document.getElementById('eraGalleryDesc');
    if(img){
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = item.image;
        img.alt = item.title;
        img.style.opacity = '1';
      }, 90);
    }
    if(title) title.textContent = item.title;
    if(desc) desc.textContent = item.desc;
    document.querySelectorAll('.era-btn').forEach(btn => btn.classList.remove('active'));
    const idx = backgroundGalleryItems.findIndex(v => v.key === item.key);
    const buttons = document.querySelectorAll('.era-btn');
    if(buttons[idx]) buttons[idx].classList.add('active');
  };

  function buildBackgroundSlide(){
    const first = backgroundGalleryItems[0];
    return `<section class="slide"><div class="wrap bg-stage"><div class="bg-left"><div><div class="kicker">2단계 · 배경 이해</div><h2>혼란의 시대:<br>외세, 황제, 민중</h2><p class="lead">독립협회와 광무개혁은 서로 따로 나온 사건이 아닙니다. 갑오개혁 이후 외세의 압박, 황제권 강화, 민중의 정치 참여 요구가 동시에 부딪히던 시대의 선택이었습니다.</p><div class="dark" id="whyReflection">첫 질문의 선택이 여기에 반영됩니다.</div></div><div class="bg-mini-timeline">
      ${timeItem('1894','갑오개혁','근대 개혁이 시도되었지만 일본 영향력과 민중 지지 부족 등 한계가 있었습니다.')}
      ${timeItem('1895','을미사변','명성황후 시해로 일본 세력의 폭력성과 조선 정치의 불안정성이 드러났습니다.')}
      ${timeItem('1896','아관파천','일본의 영향력을 줄이려 했지만, 또 다른 외세인 러시아에 의존했다는 한계가 있었습니다.')}
      ${timeItem('1896','독립협회와 독립신문','독립신문·독립문 건립 운동·토론회 등을 통해 자주독립 요구가 확산되었습니다.')}
      ${timeItem('1897','대한제국 수립','고종이 황제로 즉위하고 대한제국을 선포하며 자주 국가임을 내세웠습니다.')}
      ${timeItem('1897~','광무개혁 실시','구본신참 원칙 아래 군사·토지·산업·근대 시설 개혁을 추진했습니다.')}
      ${timeItem('1898','만민공동회와 헌의 6조','민중의 정치 참여와 국정 개혁 요구가 공개 집회와 헌의 6조로 드러났습니다.')}
      ${timeItem('1899','대한국 국제','대한제국의 황제권이 강하게 규정되었습니다.')}
      ${timeItem('1904','러일전쟁','일본의 영향력이 커지며 대한제국의 자주권이 크게 약화되는 계기가 되었습니다.')}
    </div></div><div class="paper bg-gallery"><div class="era-buttons">${backgroundGalleryItems.map((item, idx) => galleryButton(item, idx === 0)).join('')}</div><figure class="era-image-card"><img id="eraGalleryImage" src="${first.image}" alt="${first.title}"><figcaption class="era-image-caption"><strong id="eraGalleryTitle">${first.title}</strong><p id="eraGalleryDesc">${first.desc}</p></figcaption></figure><div class="next"><button class="main" onclick="nextSlide()">다음: 대한제국의 출발 →</button></div></div></div></section>`;
  }

  function reviseBackgroundSlide(){
    const idx = findSlideIndex('혼란의 시대');
    if(idx < 0) return;
    addBackgroundGalleryStyles();
    slides[idx].html = buildBackgroundSlide();
  }

  function addSourceEvidenceStyles(){
    if(document.getElementById('sourceEvidenceRevisionStyles')) return;
    const style = document.createElement('style');
    style.id = 'sourceEvidenceRevisionStyles';
    style.textContent = `
      .source-stage{display:grid;grid-template-columns:.86fr 1.14fr;gap:1rem;align-items:stretch}
      .source-hero{display:flex;flex-direction:column;justify-content:space-between;min-height:100%}
      .source-hero .lead{margin-bottom:1rem}
      .source-brief{display:grid;gap:.65rem;margin-top:1rem}
      .source-brief div{padding:.85rem;border-radius:1rem;background:rgba(245,234,210,.075);border:1px solid rgba(245,234,210,.13)}
      .source-brief strong{display:block;color:var(--paper);margin-bottom:.15rem}
      .source-brief span{display:block;color:rgba(255,248,232,.72);font-size:.94rem;line-height:1.55}
      .source-board{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;margin-bottom:.9rem}
      .source-card{position:relative;min-height:13rem;border-radius:1.35rem;padding:1rem;background:linear-gradient(160deg,var(--paper) 0%,#dfcb9d 100%);color:var(--ink);box-shadow:0 20px 50px rgba(0,0,0,.22);overflow:hidden}
      .source-card:before{content:"";position:absolute;inset:0;background:linear-gradient(rgba(40,31,23,.045) 1px,transparent 1px);background-size:100% 1.7rem;pointer-events:none}
      .source-card > *{position:relative}
      .source-card .source-num{display:inline-grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:var(--red);color:var(--paper);font-weight:950;margin-bottom:.55rem}
      .source-card h3{margin-bottom:.45rem;color:var(--ink)}
      .source-card p{margin:.35rem 0;color:#5f4c39;line-height:1.55;font-size:.95rem}
      .source-card .mini-tag{display:inline-flex;margin-top:.55rem;padding:.22rem .52rem;border-radius:999px;background:rgba(201,154,58,.22);color:#704b0c;font-weight:900;font-size:.78rem}
      .evidence-path{display:grid;grid-template-columns:repeat(4,1fr);gap:.55rem;margin:.8rem 0}
      .evidence-node{position:relative;padding:.78rem .7rem;border-radius:1rem;background:rgba(245,234,210,.08);border:1px solid rgba(245,234,210,.13);text-align:center;color:rgba(255,248,232,.84);font-weight:900;line-height:1.3}
      .evidence-node:not(:last-child):after{content:"→";position:absolute;right:-.48rem;top:50%;transform:translateY(-50%);color:var(--gold);font-size:1.1rem}
      .six-preview{margin-top:.9rem;padding:1rem;border-radius:1.2rem;background:rgba(201,154,58,.13);border:1px solid rgba(201,154,58,.25)}
      .six-preview h3{margin-bottom:.55rem;color:var(--paper)}
      .six-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.45rem}
      .six-grid span{padding:.52rem .6rem;border-radius:.75rem;background:rgba(16,14,11,.32);border:1px solid rgba(245,234,210,.1);font-size:.9rem;color:rgba(255,248,232,.78)}
      .source-footer{display:flex;gap:.7rem;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-top:.9rem}
      .source-footer .route{margin:0;flex:1 1 22rem}
      @media(max-width:980px){.source-stage,.source-board,.evidence-path,.six-grid{grid-template-columns:1fr}.evidence-node:not(:last-child):after{content:"↓";right:50%;top:auto;bottom:-.65rem;transform:translateX(50%)}}
    `;
    document.head.appendChild(style);
  }

  function buildSourceEvidenceSlide(){
    return `<section class="slide"><div class="wrap source-stage"><div class="source-hero"><div><div class="kicker">6단계 · 독립협회를 사료로 보기</div><h2>신문, 회보, 상소문:<br>여론이 정치가 되다</h2><p class="lead">이 화면은 사건을 길게 나열하기보다, 독립협회의 주장이 어떤 매체를 거쳐 정치 요구로 커졌는지 한눈에 보이도록 정리했습니다.</p></div><div class="source-brief"><div><strong>읽는 순서</strong><span>신문으로 여론 형성 → 토론회로 쟁점 확대 → 상소문과 헌의 6조로 제도화</span></div><div><strong>발표 포인트</strong><span>독립협회는 단순 계몽 단체가 아니라, 말과 글을 정치적 압력으로 바꾸려 했던 단체입니다.</span></div></div></div><div><div class="source-board"><article class="source-card"><span class="source-num">1</span><h3>독립신문</h3><p>한글 중심 신문을 통해 자주독립과 개화 사상을 넓게 알렸습니다.</p><span class="mini-tag">여론 형성</span></article><article class="source-card"><span class="source-num">2</span><h3>대조선독립협회회보</h3><p>독립협회의 생각을 더 조직적으로 보여주는 공식 자료입니다.</p><span class="mini-tag">단체의 목소리</span></article><article class="source-card"><span class="source-num">3</span><h3>구국 운동 상소문</h3><p>의회 설치, 자유권, 신체·재산권 보장 요구가 정치적 문장으로 정리됩니다.</p><span class="mini-tag">정치 요구</span></article></div><div class="dark"><h3>사료가 움직인 방향</h3><div class="evidence-path"><div class="evidence-node">계몽<br>신문</div><div class="evidence-node">토론회<br>쟁점화</div><div class="evidence-node">상소문<br>압박</div><div class="evidence-node">헌의 6조<br>개혁안</div></div><div class="six-preview"><h3>헌의 6조를 볼 때 잡을 기준</h3><div class="six-grid"><span>① 외세 의존을 줄이려는 자주성</span><span>② 국민 의견을 국정에 반영하려는 민권성</span><span>③ 황제 재가에 기대는 한계</span><span>④ 지도부 중심 운동이라는 한계</span></div></div></div><div class="source-footer"><div class="route"><strong>다음 연결</strong>이 사료들을 바탕으로 독립협회의 밝은 면과 한계를 나누어 봅니다.</div><button class="main" onclick="nextSlide()">다음: 독립협회의 밝은 면 →</button></div></div></div></section>`;
  }

  function reviseSourceEvidenceSlide(){
    const idx = findSlideIndex('신문, 회보');
    if(idx < 0) return;
    addSourceEvidenceStyles();
    slides[idx].html = buildSourceEvidenceSlide();
  }

  function reviseTimewarpYears(){
    const years = document.querySelector('.years');
    if(!years) return;
    years.innerHTML = '<span>2026</span><span>1904</span><span>1899</span><span>1898</span><span>1897</span><span>1896</span><span>1895</span><span>1894</span>';
  }

  function applyRevision(){
    if (typeof slides === 'undefined' || !Array.isArray(slides)) return false;
    reviseIntroSlide();
    reviseQuestionWording();
    reviseBackgroundSlide();
    reviseSourceEvidenceSlide();
    syncNextButtonLabels();
    reviseTimewarpYears();
    if (typeof render === 'function') render();
    return true;
  }

  if(!applyRevision()) {
    setTimeout(applyRevision, 80);
  }
})();
