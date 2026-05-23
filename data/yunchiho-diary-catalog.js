// 윤치호 일기 자료 인덱싱용 초기 카탈로그
// 출처: 국사편찬위원회 한국사데이터베이스 > 한국사 총설 DB > 한국사료총서
// 목적: 발표 사이트에서 윤치호 일기를 직접 인용하기 전, 자료 묶음/연도/키워드/태그를 안정적으로 관리한다.

window.YUNCHIHO_DIARY_CATALOG = {
  meta: {
    id: "yunchiho-diary-khdb-sa",
    title: "윤치호 일기 자료 카탈로그",
    sourceInstitution: "국사편찬위원회",
    sourceDatabase: "한국사데이터베이스",
    sourceSection: "한국사 총설 DB > 한국사료총서",
    listUrl: "https://db.history.go.kr/diachronic/level.do?itemId=sa",
    createdFor: "독립협회·대한제국 발표 사이트 내용 보강",
    note: "이 파일은 실제 사료 본문을 넣기 전 단계의 카탈로그이다. 본문 인용은 국역본 원문 확인 후 entries에 추가한다."
  },

  sourceCollections: [
    {
      group: "original",
      label: "원문 계열",
      description: "한국사료총서 제19집으로 등록된 윤치호 일기 원문 계열",
      items: [
        { title: "尹致昊日記 一", author: "윤치호(尹致昊)", series: "한국사료총서 제19집" },
        { title: "尹致昊日記 二", author: "윤치호(尹致昊)", series: "한국사료총서 제19집" },
        { title: "尹致昊日記 三", author: "윤치호(尹致昊)", series: "한국사료총서 제19집" },
        { title: "尹致昊日記 四", author: "윤치호(尹致昊)", series: "한국사료총서 제19집" },
        { title: "尹致昊日記 五", author: "윤치호(尹致昊)", series: "한국사료총서 제19집" },
        { title: "尹致昊日記 六", author: "윤치호(尹致昊)", series: "한국사료총서 제19집" },
        { title: "尹致昊日記 七", author: "윤치호(尹致昊)", series: "한국사료총서 제19집" },
        { title: "尹致昊日記 八", author: "윤치호(尹致昊)", series: "한국사료총서 제19집" },
        { title: "尹致昊日記 九", author: "윤치호(尹致昊)", series: "한국사료총서 제19집" },
        { title: "尹致昊日記 十", author: "윤치호(尹致昊)", series: "한국사료총서 제19집" },
        { title: "尹致昊日記 十一", author: "윤치호(尹致昊)", series: "한국사료총서 제19집" },
        { title: "尹致昊書翰集 (尹致昊日記 十二)", author: "윤치호(尹致昊)", series: "한국사료총서 제19집" }
      ]
    },
    {
      group: "translation",
      label: "국역 계열",
      description: "발표 사이트 본문 인용에 우선 사용할 국역 윤치호 영문 일기 계열",
      items: [
        { title: "윤치호일기 제1권(국역 윤치호 영문 일기1)", author: "윤치호(尹致昊)", series: "" },
        { title: "국역 윤치호 영문 일기1", author: "윤치호(尹致昊)", series: "한국사료총서 번역서1" },
        { title: "국역 윤치호 영문 일기2", author: "윤치호(尹致昊)", series: "한국사료총서 번역서2" },
        { title: "국역 윤치호 영문 일기3", author: "윤치호(尹致昊)", series: "한국사료총서 번역서3" },
        { title: "국역 윤치호 영문 일기4", author: "윤치호(尹致昊)", series: "한국사료총서 번역서4" },
        { title: "국역 윤치호 영문 일기5", author: "윤치호(尹致昊)", series: "한국사료총서 번역서5" },
        { title: "국역 윤치호 영문 일기6", author: "윤치호(尹致昊)", series: "한국사료총서 번역서6" },
        { title: "국역 윤치호 영문 일기7", author: "윤치호(尹致昊)", series: "한국사료총서 번역서7" },
        { title: "국역 윤치호 영문 일기8", author: "윤치호(尹致昊)", series: "한국사료총서 번역서8" },
        { title: "국역 윤치호 영문 일기9", author: "윤치호(尹致昊)", series: "한국사료총서 번역서9" },
        { title: "국역 윤치호 영문 일기10", author: "윤치호(尹致昊)", series: "한국사료총서 번역서10" }
      ]
    }
  ],

  focus: {
    primaryPeriod: {
      startYear: 1896,
      endYear: 1898,
      reason: "아관파천, 독립협회 창립, 만민공동회, 헌의 6조, 중추원 개편, 독립협회 해산과 직접 연결되는 시기"
    },
    expansionPeriod: {
      startYear: 1899,
      endYear: 1905,
      reason: "대한제국 체제, 광무개혁, 러일전쟁 전후의 외세 인식 변화 확인용"
    },
    searchKeywords: [
      "독립협회",
      "만민공동회",
      "중추원",
      "헌의 6조",
      "고종",
      "황제",
      "대한제국",
      "러시아",
      "일본",
      "미국",
      "서재필",
      "민중",
      "백성",
      "자유",
      "의회",
      "개혁",
      "문명",
      "기독교"
    ],
    presentationTags: [
      "독립협회",
      "민권",
      "엘리트주의",
      "외세인식",
      "고종비판",
      "대한제국",
      "개혁론",
      "모순"
    ]
  },

  // 실제 본문 인용은 검증 후 여기에 추가한다.
  // quote에는 발표에 띄울 짧은 국역 인용문을 넣고, sourceUrl에는 해당 DB 항목 URL을 넣는다.
  entries: [
    /*
    {
      id: "yc-1898-0001",
      date: "1898-00-00",
      year: 1898,
      sourceTitle: "국역 윤치호 영문 일기",
      sourceCollection: "한국사료총서",
      sourceUrl: "",
      topics: ["독립협회", "민권", "모순"],
      quote: "",
      summary: "",
      interpretation: "",
      question: "이 기록은 독립협회를 더 긍정적으로 보이게 하는가, 더 복잡하게 보이게 하는가?",
      importance: 5
    }
    */
  ]
};
