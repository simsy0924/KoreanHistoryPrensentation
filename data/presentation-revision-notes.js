// 학생 필기 수정안을 발표 흐름에 반영하는 후처리 스크립트.
// 핵심 수정: 첫 화면 문구, '손들기 질문' 표현, 1번 질문 선택지, 2단계 배경 타임라인.
(function(){
  const VERSION = '2026-05-26-note-revision';
  if (window.__PRESENTATION_NOTE_REVISION__ === VERSION) return;
  window.__PRESENTATION_NOTE_REVISION__ = VERSION;

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

  function timeItem(year, title, body){
    return `<div class="time"><div class="year">${year}</div><div><strong>${title}</strong><br><span>${body}</span></div></div>`;
  }

  function buildBackgroundSlide(){
    return `<section class="slide"><div class="wrap grid"><div><div class="kicker">2단계 · 배경 이해</div><h2>혼란의 시대: 외세, 황제, 민중</h2><p class="lead">독립협회와 광무개혁은 서로 따로 나온 사건이 아닙니다. 갑오개혁 이후 외세의 압박, 황제권 강화, 민중의 정치 참여 요구가 동시에 부딪히던 시대의 선택이었습니다.</p><div class="dark" id="whyReflection">첫 질문의 선택이 여기에 반영됩니다.</div></div><div class="paper"><div class="timeline">
      ${timeItem('1894','갑오개혁','근대 개혁이 시도되었지만 일본 영향력과 민중 지지 부족 등 한계가 있었습니다.')}
      ${timeItem('1895','을미사변','명성황후 시해로 일본 세력의 폭력성과 조선 정치의 불안정성이 드러났습니다.')}
      ${timeItem('1896','아관파천','일본의 영향력을 줄이려 했지만, 또 다른 외세인 러시아에 의존했다는 한계가 있었습니다.')}
      ${timeItem('1896','독립신문 창간과 독립협회 창립','독립신문·독립문 건립 운동·토론회 등을 통해 자주독립 요구가 확산되었습니다.')}
      ${timeItem('1897','대한제국 수립','고종이 황제로 즉위하고 대한제국을 선포하며 자주 국가임을 내세웠습니다.')}
      ${timeItem('1897~','광무개혁 실시','구본신참 원칙 아래 군사·토지·산업·근대 시설 개혁을 추진했지만, 민권 보장 부족과 열강 간섭의 한계가 있었습니다.')}
      ${timeItem('1898','만민공동회','자주 국권 운동이 본격적으로 전개되고, 민중이 정치 의견을 드러내는 장이 열렸습니다.')}
      ${timeItem('1898','관민공동회와 헌의 6조','국민의 뜻을 국정에 반영하려는 요구가 헌의 6조로 정리되었습니다.')}
      ${timeItem('1899','대한국 국제','독립협회 해산 이후 대한제국의 황제권이 더욱 강하게 규정되었습니다.')}
      ${timeItem('1904','러일전쟁','일본의 영향력이 커지며 대한제국의 자주권이 크게 약화되는 계기가 되었습니다.')}
    </div><div class="next"><button class="main" onclick="nextSlide()">다음: 대한제국의 출발 →</button></div></div></div></section>`;
  }

  function reviseBackgroundSlide(){
    const idx = findSlideIndex('혼란의 시대');
    if(idx < 0) return;
    slides[idx].html = buildBackgroundSlide();
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
    syncNextButtonLabels();
    reviseTimewarpYears();
    if (typeof render === 'function') render();
    return true;
  }

  if(!applyRevision()) {
    setTimeout(applyRevision, 80);
  }
})();
