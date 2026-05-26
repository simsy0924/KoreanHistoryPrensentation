// 윤치호 일기 파트가 지나치게 부정적으로 보이지 않도록
// '희망 → 절차적 추진 → 불안 → 대중과의 거리 → 실패 분석' 흐름으로 보정한다.
(function(){
  const VERSION = '2026-05-26-yunchiho-balanced-tone';
  if (window.__YUNCHIHO_TONE_REVISION__ === VERSION) return;
  window.__YUNCHIHO_TONE_REVISION__ = VERSION;

  function reviseEntries(){
    const entries = window.YUNCHIHO_DIARY_ENTRIES;
    if(!Array.isArray(entries)) return false;

    const byId = Object.fromEntries(entries.map(e => [e.id, e]));

    if(byId['yc-1898-03-03-russia-concession']){
      Object.assign(byId['yc-1898-03-03-russia-concession'], {
        cardTitle: '절차로 움직인 반외세 운동',
        summary: '러시아 절영도 조차 문제에서 윤치호는 즉각적인 구호보다 조사와 보고를 거친 대응을 주장했다.',
        interpretation: '독립협회가 단순한 감정적 반외세 운동만 한 것이 아니라, 사실 확인과 절차를 통해 여론을 정치적 압력으로 바꾸려 했음을 보여준다.',
        question: '독립협회의 반외세 운동은 감정적 저항이었을까, 절차를 갖춘 정치 운동이었을까?',
        axis: '절차적 반외세'
      });
    }

    if(byId['yc-1898-10-31-six-articles-ambiguous-approval']){
      Object.assign(byId['yc-1898-10-31-six-articles-ambiguous-approval'], {
        cardTitle: '헌의 6조를 밀어붙인 정치적 기대',
        summary: '헌의 6조에 대해 황제가 명확한 재가를 내리지 않았는데도, 독립협회는 이를 사실상 승인에 가까운 신호로 받아들이고 전국 배포를 결정했다.',
        interpretation: '이 장면은 독립협회가 황제권을 완전히 부정하기보다, 황제의 권위를 활용해 개혁을 제도화하려 했음을 보여준다. 동시에 황제권에 의존할 수밖에 없었던 한계도 드러난다.',
        question: '황제권을 활용한 개혁 추진은 현실적 전략이었을까, 독립협회의 한계였을까?',
        axis: '황제권과 개혁 전략'
      });
    }

    if(byId['yc-1898-11-05-foreign-puppets-last-hope']){
      Object.assign(byId['yc-1898-11-05-foreign-puppets-last-hope'], {
        cardTitle: '대한의 마지막 희망이라는 절박함',
        summary: '윤치호는 1898년 11월 5일 일기에서 정부가 친일·친러 인물에게 흔들리고 있다고 보았고, 일본과 러시아가 이권을 위해 조선 내부 정치에 개입한다고 비판했다.',
        interpretation: '이 사료는 윤치호가 독립협회를 단순한 정치 단체가 아니라 자주독립의 마지막 희망으로 보았음을 보여준다. 다만 그 절박함은 외세와 정적을 거칠고 적대적인 언어로 묘사하는 방식으로도 나타났다.',
        question: '독립협회를 마지막 희망으로 본 절박함은 자주독립 의식인가, 시대적 불안의 표현인가?',
        axis: '희망과 외세 불안'
      });
    }

    if(byId['yc-1898-11-06-six-articles-public-indifference']){
      Object.assign(byId['yc-1898-11-06-six-articles-public-indifference'], {
        cardTitle: '민권운동 지도자가 느낀 대중과의 거리',
        summary: '헌의 6조 정국에서 윤치호는 대중이 이 투쟁을 독립협회와 정부 사이의 사적 분쟁처럼 본다고 느끼며 깊은 실망을 드러냈다.',
        interpretation: '이 사료는 독립협회 지도부가 민권을 말하면서도 대중과 충분히 연결되지 못했다는 긴장을 보여준다. 윤치호의 표현은 신랄하지만, 그 속에는 개혁 운동이 넓은 사회적 지지를 얻지 못한다는 불안도 함께 담겨 있다.',
        question: '윤치호의 대중 비판은 엘리트주의인가, 개혁 운동의 고립감에서 나온 실망인가?',
        axis: '대중과의 거리'
      });
    }

    if(byId['yc-1898-12-27-mass-meeting-failure']){
      Object.assign(byId['yc-1898-12-27-mass-meeting-failure'], {
        cardTitle: '만민공동회 실패를 복합적으로 본 시선',
        summary: '윤치호는 만민공동회의 실패를 자금 부족, 급진파의 전략, 박영효 소환 문제, 대중 여론 이탈, 황제권의 무력 사용 등 여러 요인이 얽힌 결과로 보았다.',
        interpretation: '이 사료는 만민공동회의 실패를 정부 탄압 하나로만 설명하기 어렵다는 점을 보여준다. 윤치호는 운동의 가능성을 인정하면서도 전략·여론·외세·황제권의 충돌 속에서 실패 원인을 찾았다.',
        question: '만민공동회의 실패는 탄압 때문이었을까, 운동 내부의 전략과 여론 변화도 함께 작용했을까?',
        axis: '실패의 복합 요인'
      });
    }

    if(byId['yc-1899-12-31-post-collapse-review']){
      Object.assign(byId['yc-1899-12-31-post-collapse-review'], {
        cardTitle: '독립협회 와해 이후의 씁쓸한 총결산',
        summary: '독립협회가 해산된 뒤 윤치호는 지방 민중의 공공정신 부족과 일본인의 압제, 조선 사회의 무기력을 함께 비판했다.',
        interpretation: '이 사료는 독립협회 와해 이후 윤치호가 느낀 좌절과 냉소를 보여준다. 민중을 낮춰 보는 표현은 분명한 한계지만, 동시에 개혁의 실패를 사회 전체의 무기력 속에서 이해하려 한 기록이기도 하다.',
        question: '윤치호의 사후 평가는 실패에 대한 냉정한 진단인가, 좌절감이 만든 책임 전가인가?',
        axis: '좌절과 냉소'
      });
    }

    return true;
  }

  function strip(html){
    return String(html || '').replace(/<br\s*\/?>/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
  }

  function slideTitleText(slide){
    const html = (slide && slide.html) || '';
    const h2 = html.match(/<h2>([\s\S]*?)<\/h2>/);
    const h1 = html.match(/<h1>([\s\S]*?)<\/h1>/);
    return strip((h2 && h2[1]) || (h1 && h1[1]) || html.slice(0,180));
  }

  function patchSlideText(){
    if(typeof slides === 'undefined' || !Array.isArray(slides)) return false;
    let changed = false;

    slides.forEach(slide => {
      if(!slide || !slide.yunchihoDiary || typeof slide.html !== 'string') return;
      let html = slide.html;
      html = html
        .replace('윤치호 일기로 보는 독립협회의 속살','윤치호 일기로 보는 독립협회의 희망과 균열')
        .replace('앞에서 독립협회의 밝은 면, 제도적 한계, 그리고 인물들의 복잡한 행적을 살펴봤다면, 이제 지도부 내부의 시선을 1차 사료로 확인합니다. 윤치호 일기는 독립협회의 민권성, 엘리트주의, 황제권 인식이 한꺼번에 드러나는 자료입니다.','앞에서 독립협회의 밝은 면, 제도적 한계, 그리고 인물들의 복잡한 행적을 살펴봤다면, 이제 윤치호 일기로 그 운동의 내부 시선을 확인합니다. 윤치호 일기는 독립협회를 향한 기대, 절차적 개혁 의지, 대중과의 거리, 외세에 대한 불안, 실패 이후의 좌절을 함께 보여주는 자료입니다.')
        .replace('사료 강화 · 실패의 해석','사료 강화 · 기대와 균열')
        .replace('만민공동회는 왜 실패했나?','기대는 왜 균열로 바뀌었나?')
        .replace('윤치호는 만민공동회의 실패를 단순히 정부 탄압 하나로만 보지 않았습니다. 외세와 내부 정치 세력의 결합, 급진파의 전략, 대중 여론의 이탈, 황제권, 일본과 러시아의 이해관계까지 함께 보았습니다.','윤치호는 독립협회와 만민공동회에 큰 기대를 걸었지만, 시간이 갈수록 외세 개입, 내부 정치 세력의 충돌, 대중 여론의 이탈, 황제권과의 갈등을 함께 보게 됩니다. 이 흐름은 한 인물의 비난이 아니라 기대가 좌절로 바뀌는 과정을 보여줍니다.')
        .replace('발표에서 던질 최종 질문','이 섹션의 핵심 질문')
        .replace('독립협회는 민중과 함께한 운동이었을까, 아니면 민중을 계몽 대상으로 본 엘리트의 정치 기획이었을까?','독립협회는 당시 개화 지식인에게 절박한 희망이었지만, 왜 대중과의 거리와 정치적 고립을 넘지 못했을까?')
        .replace('이 질문은 앞에서 본 ‘밝은 면’과 ‘한계’를 다시 연결하는 역할을 합니다.','이 질문은 독립협회를 비판하기 위한 것이 아니라, 희망과 한계를 동시에 설명하기 위한 기준입니다.')
        .replace('독립협회 지도부의 절차주의와 엘리트주의 확인','독립협회 지도부의 절차주의와 대중과의 거리 확인')
        .replace('윤치호 일기는 독립협회를 더 나쁘게 만들기 위한 자료가 아니라, 더 입체적으로 보기 위한 자료입니다.','윤치호 일기는 독립협회를 깎아내리기 위한 자료가 아니라, 독립협회가 왜 절박한 희망이었고 왜 균열을 겪었는지 함께 보여주는 자료입니다.');

      if(html !== slide.html){
        slide.html = html;
        changed = true;
      }
    });

    if(changed && typeof render === 'function') render();
    return changed;
  }

  reviseEntries();

  function retryPatch(count){
    if(patchSlideText()) return;
    if(count > 0) setTimeout(() => retryPatch(count - 1), 120);
  }

  retryPatch(8);
})();