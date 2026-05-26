// 황국협회 슬라이드를 '단순 악역'이 아니라
// 보부상의 폐단과 황제권의 정치적 동원이 결합한 탄압 사례로 정리한다.
(function(){
  const VERSION = '2026-05-26-hwangguk-revision';
  if (window.__HWANGGUK_ASSOCIATION_REVISION__ === VERSION) return;
  window.__HWANGGUK_ASSOCIATION_REVISION__ = VERSION;

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
    return slides.findIndex(s => slideTitleText(s).includes(keyword) || strip(s.html).includes(keyword));
  }

  function addStyles(){
    if(document.getElementById('hwanggukRevisionStyles')) return;
    const style = document.createElement('style');
    style.id = 'hwanggukRevisionStyles';
    style.textContent = `
      .hwangguk-stage{display:grid;grid-template-columns:.82fr 1.18fr;gap:1rem;align-items:stretch}
      .hwangguk-left{display:flex;flex-direction:column;justify-content:space-between;gap:1rem}
      .hwangguk-thesis{padding:1rem;border-radius:1.2rem;background:rgba(141,47,39,.18);border:1px solid rgba(141,47,39,.34);color:rgba(255,248,232,.82)}
      .hwangguk-thesis strong{display:block;color:var(--paper);font-family:"Noto Serif KR",serif;font-size:1.22rem;line-height:1.25;margin-bottom:.45rem}
      .hwangguk-thesis p{margin:.4rem 0 0;color:rgba(255,248,232,.74);line-height:1.58}
      .hwangguk-map{display:grid;grid-template-columns:repeat(4,1fr);gap:.55rem}
      .hwangguk-map div{position:relative;min-height:5.6rem;padding:.76rem .62rem;border-radius:1rem;background:rgba(245,234,210,.075);border:1px solid rgba(245,234,210,.13);color:rgba(255,248,232,.78);font-size:.88rem;line-height:1.38}
      .hwangguk-map div:not(:last-child):after{content:"→";position:absolute;right:-.45rem;top:50%;transform:translateY(-50%);color:var(--gold);font-weight:950}
      .hwangguk-map strong{display:block;color:var(--paper2);font-size:.94rem;margin-bottom:.18rem}
      .hwangguk-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.7rem}
      .hwangguk-card{position:relative;padding:1rem;border-radius:1.2rem;background:linear-gradient(160deg,var(--paper) 0%,#dfcb9d 100%);color:var(--ink);box-shadow:0 16px 42px rgba(0,0,0,.2);overflow:hidden}
      .hwangguk-card:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(40,31,23,.045) 1px,transparent 1px);background-size:100% 1.55rem;pointer-events:none}
      .hwangguk-card>*{position:relative}
      .hwangguk-card .tag{margin-bottom:.55rem}
      .hwangguk-card h3{margin-bottom:.45rem;color:var(--ink)}
      .hwangguk-card p{margin:.35rem 0;color:#5f4c39;line-height:1.54;font-size:.95rem}
      .hwangguk-card.critical{border:2px solid rgba(141,47,39,.38)}
      .hwangguk-verdict{margin-top:.75rem;padding:.9rem 1rem;border-radius:1.1rem;background:rgba(201,154,58,.13);border:1px solid rgba(201,154,58,.25);color:rgba(255,248,232,.8)}
      .hwangguk-verdict strong{display:block;color:var(--paper);font-family:"Noto Serif KR",serif;font-size:1.12rem;margin-bottom:.35rem}
      .hwangguk-verdict p{margin:0;line-height:1.6}
      .hwangguk-stage .choice-panel{margin-top:.85rem}
      @media(max-width:980px){.hwangguk-stage,.hwangguk-grid,.hwangguk-map{grid-template-columns:1fr}.hwangguk-map div:not(:last-child):after{content:"↓";right:50%;top:auto;bottom:-.62rem;transform:translateX(50%)}}
    `;
    document.head.appendChild(style);
  }

  function buildQuestion(){
    if(typeof question === 'function'){
      return question('hwangguk','질문','황국협회는 어떻게 평가해야 할까요?',[
        ['villain','민권 운동을 탄압한 나쁜 단체',{citizen:1,realism:1},'독립협회와 만민공동회를 폭력적으로 탄압한 단체'],
        ['used','권력에 동원된 보부상 조직',{realism:2},'보부상의 조직력이 황제권과 정부에 의해 동원된 사례'],
        ['both','나쁜 결과와 구조적 배경을 함께 봐야 한다',{complexity:2,realism:1},'탄압의 책임과 정치적 동원 구조를 함께 봐야 한다'],
        ['unknown','자료를 더 보고 판단해야 한다',{complexity:1},'보부상의 폐단과 정부의 동원 과정을 더 확인해야 한다']
      ],'다음: 외세와 이권 →');
    }
    return '<div class="next"><button class="main" onclick="nextSlide()">다음: 외세와 이권 →</button></div>';
  }

  function buildSlide(){
    return `<section class="slide"><div class="wrap hwangguk-stage"><div class="hwangguk-left"><div><div class="kicker">황국협회 재평가</div><h2>민중 조직이었지만,<br>민권 운동은 아니었다</h2><p class="lead">황국협회는 단순히 “또 다른 민중 단체”로 보기 어렵습니다. 보부상 조직의 특권과 폐단, 황제권의 정치적 필요, 독립협회 탄압이 결합된 사례였습니다.</p></div><div class="hwangguk-thesis"><strong>핵심 판단</strong><p>황국협회는 나쁜 결과를 만든 단체가 맞습니다. 다만 그 나쁨은 ‘그냥 악당이라서’가 아니라, 보부상의 폐단과 권력의 동원이 결합하면서 더 폭력적인 탄압 도구가 되었기 때문입니다.</p></div><div class="dark"><h3>충돌의 흐름</h3><div class="hwangguk-map"><div><strong>보부상 기반</strong>전국적으로 이동하고 결집할 수 있는 상업 조직</div><div><strong>특권과 폐단</strong>상업상 특권, 횡포, 폭력성에 대한 비판</div><div><strong>권력의 동원</strong>황제권과 보수 세력이 독립협회 견제에 활용</div><div><strong>탄압과 충돌</strong>만민공동회·독립협회 공격으로 정치적 폭력화</div></div></div></div><div><div class="hwangguk-grid"><article class="hwangguk-card"><span class="tag">기반</span><h3>보부상 조직</h3><p>황국협회는 보부상을 기반으로 했습니다. 보부상은 장시와 지역을 오가던 상업 집단이었고, 전국적 연결망과 동원력을 가지고 있었습니다.</p><p>이 점 때문에 황국협회는 실제 거리 정치에서 빠르게 사람을 모을 수 있었습니다.</p></article><article class="hwangguk-card critical"><span class="tag">문제</span><h3>보부상의 폐단</h3><p>보부상은 단순한 서민 상인이 아니라, 특권과 횡포로 비판받던 면도 있었습니다. 이 조직력이 정치와 결합하면 민중 보호가 아니라 압박과 폭력으로 나타날 수 있었습니다.</p></article><article class="hwangguk-card critical"><span class="tag">역할</span><h3>독립협회 탄압</h3><p>황국협회는 독립협회와 만민공동회를 견제하고 공격하는 데 동원되었습니다. 따라서 독립협회 탄압의 책임에서 자유로울 수 없습니다.</p><p>민중 기반을 가졌다고 해서 자동으로 민권적이거나 진보적인 것은 아니었습니다.</p></article><article class="hwangguk-card"><span class="tag">의미</span><h3>권력에 동원된 민중 조직</h3><p>이 사례는 민중 조직도 권력과 결합하면 개혁을 밀어주는 힘이 아니라 개혁을 막는 힘이 될 수 있음을 보여줍니다.</p><p>그래서 황국협회는 ‘민중 대 정부’라는 단순 구도를 깨는 사례입니다.</p></article></div><div class="hwangguk-verdict"><strong>정리</strong><p>황국협회는 나쁜 단체였다고 평가할 수 있습니다. 그러나 발표의 핵심은 욕하는 데서 끝나는 것이 아니라, 보부상의 폐단과 황제권의 정치적 동원이 어떻게 민권 운동 탄압으로 이어졌는지를 설명하는 것입니다.</p></div>${buildQuestion()}</div></div></section>`;
  }

  function reviseFeedback(){
    if(typeof F === 'undefined' || !F.hwangguk) return;
    F.hwangguk.villain = [
      '탄압의 책임을 분명히 보는 선택입니다.',
      '황국협회는 독립협회와 만민공동회를 공격하는 데 동원되었고, 그 결과는 분명히 비판받아야 합니다.'
    ];
    F.hwangguk.used = [
      '정치적 동원 구조를 강조한 선택입니다.',
      '보부상 조직의 힘과 폐단이 황제권·정부의 필요와 결합하면서 탄압 도구가 되었습니다.'
    ];
    F.hwangguk.both = [
      '가장 입체적인 판단입니다.',
      '황국협회의 나쁜 결과를 인정하면서도, 왜 그런 폭력적 역할을 하게 되었는지 구조까지 설명할 수 있습니다.'
    ];
    F.hwangguk.unknown = [
      '자료 중심 태도입니다.',
      '보부상의 실제 폐단, 정부의 동원 과정, 독립협회와의 충돌 양상을 더 확인하면 판단이 선명해집니다.'
    ];
  }

  function apply(){
    let idx = findSlideIndex('황국협회');
    if(idx < 0) idx = findSlideIndex('보부상');
    if(idx < 0) return false;
    addStyles();
    reviseFeedback();
    slides[idx].html = buildSlide();
    if(typeof render === 'function') render();
    return true;
  }

  if(!apply()) setTimeout(apply, 150);
})();
