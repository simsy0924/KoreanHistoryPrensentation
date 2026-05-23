// 윤치호 일기 자료 인덱싱용 카탈로그
// 출처: 국사편찬위원회 한국사데이터베이스 > 한국사 총설 DB > 한국사료총서
// 목적: 발표 사이트에서 윤치호 일기를 직접 인용하기 전, 자료 묶음/연도/키워드/태그/수집 후보를 안정적으로 관리한다.

window.YUNCHIHO_DIARY_CATALOG = {
  meta: {
    id: "yunchiho-diary-khdb-sa",
    title: "윤치호 일기 자료 카탈로그",
    sourceInstitution: "국사편찬위원회",
    sourceDatabase: "한국사데이터베이스",
    sourceSection: "한국사 총설 DB > 한국사료총서",
    listUrl: "https://db.history.go.kr/diachronic/level.do?itemId=sa",
    createdFor: "독립협회·대한제국 발표 사이트 내용 보강",
    status: "catalog-and-import-queue-ready",
    note: "이 파일은 실제 사료 본문을 넣기 전 단계의 카탈로그와 수집 큐이다. 본문 인용은 국역본 원문 확인 후 entries에 추가한다."
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

  importQueue: [
    {
      id: "queue-1896-russia-refuge",
      period: "1896",
      searchTerms: ["아관파천", "러시아", "고종", "공사관"],
      targetTags: ["외세인식", "고종비판", "대한제국"],
      reason: "대한제국 수립 전후의 외세 의존 문제를 윤치호의 시선으로 확인하기 위한 후보",
      presentationQuestion: "자주 독립을 말하던 시대에 왜 왕은 외국 공사관으로 갔는가?"
    },
    {
      id: "queue-1896-independence-club-start",
      period: "1896",
      searchTerms: ["독립협회", "독립", "협회", "서재필"],
      targetTags: ["독립협회", "민권", "개혁론"],
      reason: "독립협회 초기에 윤치호가 기대한 정치·사회 개혁의 방향을 찾기 위한 후보",
      presentationQuestion: "독립협회는 처음부터 민권 운동이었는가, 아니면 개화 지식인의 계몽 단체였는가?"
    },
    {
      id: "queue-1897-empire-proclamation",
      period: "1897",
      searchTerms: ["대한제국", "황제", "환구단", "자주", "독립"],
      targetTags: ["대한제국", "외세인식", "모순"],
      reason: "대한제국 선포가 자주독립의 선언이었는지, 황제권 강화였는지 판단할 사료 후보",
      presentationQuestion: "대한제국 선포는 독립의 선언인가, 권력 강화의 선언인가?"
    },
    {
      id: "queue-1898-mass-meeting",
      period: "1898",
      searchTerms: ["만민공동회", "백성", "민중", "회중", "군중"],
      targetTags: ["독립협회", "민권", "엘리트주의"],
      reason: "만민공동회를 윤치호가 민중 정치로 보았는지, 통제해야 할 군중으로 보았는지 확인하기 위한 후보",
      presentationQuestion: "윤치호에게 만민공동회 참여자는 정치의 주체였는가, 동원된 군중이었는가?"
    },
    {
      id: "queue-1898-six-articles",
      period: "1898",
      searchTerms: ["헌의 6조", "헌의", "6조", "자유", "인민"],
      targetTags: ["민권", "개혁론", "독립협회"],
      reason: "헌의 6조의 민권·개혁 성격을 일기 자료로 보강하기 위한 후보",
      presentationQuestion: "헌의 6조는 실제 민권 요구였는가, 제한된 정치 개혁 요구였는가?"
    },
    {
      id: "queue-1898-jungchuwon",
      period: "1898",
      searchTerms: ["중추원", "의관", "의회", "관제", "개편"],
      targetTags: ["민권", "개혁론", "모순"],
      reason: "중추원 개편이 의회 정치의 가능성이었는지, 황제권 아래 제한된 장치였는지 판단할 후보",
      presentationQuestion: "중추원 개편은 조선식 의회 정치의 시작으로 볼 수 있는가?"
    },
    {
      id: "queue-1898-emperor-conflict",
      period: "1898",
      searchTerms: ["고종", "황제", "폐하", "독립협회", "정부"],
      targetTags: ["고종비판", "대한제국", "모순"],
      reason: "독립협회와 황제권의 충돌을 윤치호가 어떻게 해석했는지 확인하기 위한 후보",
      presentationQuestion: "독립협회가 부딪힌 가장 큰 벽은 외세였는가, 황제권이었는가?"
    },
    {
      id: "queue-1898-hwangguk-association",
      period: "1898",
      searchTerms: ["황국협회", "보부상", "충돌", "해산", "탄압"],
      targetTags: ["독립협회", "고종비판", "모순"],
      reason: "독립협회 해산 과정에서 보수 세력·황국협회·정부의 역할을 보여줄 후보",
      presentationQuestion: "황국협회는 자발적 보수 세력이었는가, 정치적으로 동원된 세력이었는가?"
    },
    {
      id: "queue-1899-gwangmu-reform",
      period: "1899~1901",
      searchTerms: ["광무", "개혁", "토지", "군대", "황제"],
      targetTags: ["대한제국", "개혁론", "모순"],
      reason: "독립협회 해산 뒤 대한제국 정부 주도 개혁을 비교하기 위한 확장 후보",
      presentationQuestion: "광무개혁은 독립협회가 사라진 뒤의 대안이었는가?"
    },
    {
      id: "queue-1904-russo-japanese-war",
      period: "1904~1905",
      searchTerms: ["러일전쟁", "일본", "러시아", "보호", "독립"],
      targetTags: ["외세인식", "대한제국", "모순"],
      reason: "초기 외세 인식이 러일전쟁 전후에 어떻게 바뀌었는지 비교하기 위한 확장 후보",
      presentationQuestion: "윤치호의 현실주의는 일본의 위험을 충분히 보았는가?"
    }
  ],

  entryTemplate: {
    id: "yc-YYYY-MM-DD-keyword",
    date: "YYYY-MM-DD",
    year: 1898,
    sourceTitle: "국역 윤치호 영문 일기",
    sourceCollection: "한국사료총서",
    sourceUrl: "",
    topics: ["독립협회", "민권", "모순"],
    quote: "",
    summary: "",
    interpretation: "",
    question: "이 기록은 독립협회를 더 긍정적으로 보이게 하는가, 더 복잡하게 보이게 하는가?",
    importance: 5,
    verification: {
      quoteChecked: false,
      dateChecked: false,
      sourceUrlChecked: false
    }
  },

  // 실제 본문 인용은 검증 후 여기에 추가한다.
  // quote에는 발표에 띄울 짧은 국역 인용문을 넣고, sourceUrl에는 해당 DB 항목 URL을 넣는다.
  entries: []
};
