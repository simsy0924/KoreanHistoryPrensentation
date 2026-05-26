// 6단계 '독립협회를 사료로 보기' 화면에서 발표 팁 성격의 문구를 제거하고
// 실제 사료 내용과 역사적 의미를 늘리는 후처리 스크립트.
(function(){
  const VERSION = '2026-05-26-source-content';
  if (window.__SOURCE_SLIDE_CONTENT_REVISION__ === VERSION) return;
  window.__SOURCE_SLIDE_CONTENT_REVISION__ = VERSION;

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

  function addStyles(){
    if(document.getElementById('sourceSlideContentStyles')) return;
    const style = document.createElement('style');
    style.id = 'sourceSlideContentStyles';
    style.textContent = `
      .source-content-stage{display:grid;grid-template-columns:.78fr 1.22fr;gap:1rem;align-items:stretch}
      .source-left{display:flex;flex-direction:column;gap:.85rem;justify-content:space-between}
      .source-left .lead{margin-bottom:.2rem}
      .source-summary{display:grid;gap:.55rem}
      .source-summary article{padding:.78rem .85rem;border-radius:1rem;background:rgba(245,234,210,.075);border:1px solid rgba(245,234,210,.13)}
      .source-summary strong{display:block;color:var(--paper);margin-bottom:.18rem;font-size:.98rem}
      .source-summary p{margin:0;color:rgba(255,248,232,.72);font-size:.91rem;line-height:1.52}
      .source-right{display:grid;gap:.75rem}
      .source-doc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.65rem}
      .source-doc{position:relative;padding:.9rem;border-radius:1.2rem;background:linear-gradient(160deg,var(--paper) 0%,#dfcb9d 100%);color:var(--ink);box-shadow:0 16px 42px rgba(0,0,0,.2);overflow:hidden;min-height:11rem}
      .source-doc:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(40,31,23,.05) 1px,transparent 1px);background-size:100% 1.55rem;pointer-events:none}
      .source-doc>*{position:relative}
      .source-doc b{display:inline-grid;place-items:center;width:1.9rem;height:1.9rem;border-radius:50%;background:var(--red);color:var(--paper);margin-bottom:.45rem;font-weight:950}
      .source-doc h3{margin:0 0 .4rem;color:var(--ink);font-size:1.16rem}
      .source-doc p{margin:.25rem 0;color:#5f4c39;line-height:1.5;font-size:.9rem}
      .source-doc .mini-tag{display:inline-flex;margin-top:.45rem;padding:.2rem .5rem;border-radius:999px;background:rgba(201,154,58,.22);color:#704b0c;font-weight:900;font-size:.74rem}
      .article-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.45rem}
      .article-grid span{padding:.58rem .62rem;border-radius:.78rem;background:rgba(16,14,11,.38);border:1px solid rgba(245,234,210,.1);color:rgba(255,248,232,.8);font-size:.85rem;line-height:1.42}
      .article-grid strong{display:block;color:var(--paper2);font-size:.78rem;margin-bottom:.15rem}
      .source-balance{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
      .balance-box{padding:.8rem;border-radius:1rem;background:rgba(245,234,210,.075);border:1px solid rgba(245,234,210,.13)}
      .balance-box h3{margin:0 0 .45rem;color:var(--paper);font-size:1.08rem}
      .balance-box ul{margin:0;padding-left:1.05rem;color:rgba(255,248,232,.76);font-size:.9rem;line-height:1.5}
      .source-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem}
      .source-flow div{position:relative;text-align:center;padding:.62rem .5rem;border-radius:.85rem;background:rgba(201,154,58,.13);border:1px solid rgba(201,154,58,.24);color:rgba(255,248,232,.82);font-weight:900;font-size:.86rem;line-height:1.3}
      .source-flow div:not(:last-child):after{content:"→";position:absolute;right:-.44rem;top:50%;transform:translateY(-50%);color:var(--gold)}
      .source-content-stage .next{margin-top:.25rem}
      @media(max-width:980px){.source-content-stage,.source-doc-grid,.article-grid,.source-balance,.source-flow{grid-template-columns:1fr}.source-flow div:not(:last-child):after{content:"↓";right:50%;top:auto;bottom:-.62rem;transform:translateX(50%)}}
    `;
    document.head.appendChild(style);
  }

  function buildSlide(){
    return `<section class="slide"><div class="wrap source-content-stage"><div class="source-left"><div><div class="kicker">6단계 · 독립협회를 사료로 보기</div><h2>신문, 회보, 상소문:<br>여론이 정치가 되다</h2><p class="lead">독립협회는 독립문을 세운 단체에 머물지 않았습니다. 글과 토론, 상소를 통해 국민 여론을 만들고 그 여론을 국정 개혁 요구로 바꾸려 했습니다.</p></div><div class="source-summary"><article><strong>독립신문의 의미</strong><p>한글과 영문을 활용해 국내 백성뿐 아니라 외국인에게도 조선의 상황을 알렸고, 자주독립·문명개화·정치 개혁의 필요성을 반복해서 제기했습니다.</p></article><article><strong>토론회와 회보의 의미</strong><p>독립관 토론회와 대조선독립협회회보는 독립협회의 문제의식을 조직화했습니다. 교육·상업·위생 같은 계몽 주제는 점차 토지, 의회, 국정 개혁 문제로 넓어졌습니다.</p></article><article><strong>상소문의 의미</strong><p>구국 운동 상소문은 언론·집회·출판·결사의 자유, 신체와 재산권 보장, 의회 설치 요구를 국가 권력에 직접 전달한 정치적 문서였습니다.</p></article></div><div class="next"><button class="main" onclick="nextSlide()">다음: 독립협회의 밝은 면 →</button></div></div><div class="source-right"><div class="source-doc-grid"><article class="source-doc"><b>1</b><h3>독립신문</h3><p>여론을 넓히는 매체였습니다. 백성에게 새 정치 언어를 전달하고, 정부 정책과 외세 문제를 공론장에 올렸습니다.</p><span class="mini-tag">신문 · 여론</span></article><article class="source-doc"><b>2</b><h3>대조선독립협회회보</h3><p>독립협회의 공식적인 주장과 활동 방향을 보여줍니다. 계몽과 개혁을 단체의 목소리로 정리한 자료입니다.</p><span class="mini-tag">회보 · 조직</span></article><article class="source-doc"><b>3</b><h3>상소문과 헌의 6조</h3><p>단순한 주장에 그치지 않고, 국가 제도와 권력 운영 방식을 바꾸자는 요구로 발전했습니다.</p><span class="mini-tag">상소 · 제도</span></article></div><div class="dark"><h3>독립협회 요구의 변화</h3><div class="source-flow"><div>계몽<br>문명개화</div><div>여론<br>형성</div><div>국정 개혁<br>요구</div><div>민권·자주<br>정치 운동</div></div></div><div class="six-preview"><h3>헌의 6조의 핵심 내용</h3><div class="article-grid"><span><strong>자주성</strong>외국에 의존하지 말고 관민이 힘을 합쳐 황제권과 나라의 독립을 지키자는 주장</span><span><strong>이권 제한</strong>외국과의 조약·이권 계약은 대신과 중추원이 함께 확인해야 한다는 요구</span><span><strong>재정 공개</strong>국가 재정을 탁지부로 통일하고 예산과 결산을 국민에게 알리자는 요구</span><span><strong>법치 요구</strong>중대한 죄는 공개 재판을 거친 뒤 처벌해야 한다는 요구</span><span><strong>인사 개혁</strong>관리 임명에서 정부 대신들의 의견을 반영해야 한다는 요구</span><span><strong>실행 요구</strong>개혁 조항을 말로만 끝내지 말고 실제 규정으로 시행하자는 요구</span></div></div><div class="source-balance"><div class="balance-box"><h3>밝은 면</h3><ul><li>신문과 토론으로 여론 정치의 가능성을 열었다.</li><li>재정 공개, 법치, 의회적 요소를 요구했다.</li><li>외세 이권 침탈에 맞서는 자주성을 강조했다.</li></ul></div><div class="balance-box"><h3>한계</h3><ul><li>황제권 자체를 부정하지는 않았다.</li><li>지도부 중심의 엘리트 운동 성격이 강했다.</li><li>민중을 완전한 정치 주체로 보았는지는 논쟁적이다.</li></ul></div></div></div></div></section>`;
  }

  function apply(){
    const idx = findSlideIndex('신문, 회보');
    if(idx < 0) return false;
    addStyles();
    slides[idx].html = buildSlide();
    if(typeof render === 'function') render();
    return true;
  }

  if(!apply()) setTimeout(apply, 120);
})();
