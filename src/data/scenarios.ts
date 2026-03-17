import type { ScenarioConfig, ScenarioName, Difficulty, PlayerAvatar } from '@/types'

type IntroEventFrame = {
  image: string
  caption: string
}

export type ScenarioIntroStep = {
  label: string
  content: string
  image?: string
  frames?: IntroEventFrame[]
}

const introEventFramesMap: Record<string, IntroEventFrame[]> = {
  'fight-basic': [
    {
      image: '/images/scenarios/step-event/1-1.svg',
      caption: '下課時間，兩位學生因小事起口角，現場氣氛快速升溫。',
    },
    {
      image: '/images/scenarios/step-event/1-2.svg',
      caption: '情緒爆發後出現推擠，受傷學生已由老師帶往保健室處置。',
    },
    {
      image: '/images/scenarios/step-event/1-3.svg',
      caption: '放學前，你需要通知雙方家長並維持中立，避免訊息再度升溫。',
    },
  ],
  'fight-advanced': [
    {
      image: '/images/scenarios/step-event/2-1.svg',
      caption: '跨班衝突在操場爆發，現場混亂且資訊仍不完整。',
    },
    {
      image: '/images/scenarios/step-event/2-2.svg',
      caption: '其中一位學生傷勢較重，學校已緊急安排就醫處理。',
    },
    {
      image: '/images/scenarios/step-event/2-3.svg',
      caption: '你必須在高壓下同步溝通，先穩住家長情緒再安排後續。',
    },
  ],
  'abnormal-basic': [
    {
      image: '/images/scenarios/step-event/3-1.svg',
      caption: '最近兩週，學生在課堂上頻繁發呆、趴桌，學習狀態明顯改變。',
    },
    {
      image: '/images/scenarios/step-event/3-2.svg',
      caption: '作業缺交與用餐減少的情況持續，老師開始擔心背後原因。',
    },
    {
      image: '/images/scenarios/step-event/3-3.svg',
      caption: '你需要主動聯繫家長，以關心語氣開啟對話並建立合作。',
    },
  ],
  'abnormal-advanced': [
    {
      image: '/images/scenarios/step-event/4-1.svg',
      caption: '學生在課堂上突然情緒崩潰，現場同學也受到驚嚇。',
    },
    {
      image: '/images/scenarios/step-event/4-2.svg',
      caption: '輔導老師已介入評估，判斷需要盡快安排更完整的支持。',
    },
    {
      image: '/images/scenarios/step-event/4-3.svg',
      caption: '你要在資訊有限時先安撫家長，並引導溝通轉向面談。',
    },
  ],
}

const fightBasic: ScenarioConfig = {
  name: 'fight',
  difficulty: 'basic',
  parentIds: ['A', 'B'],
  title: '學生打架（初階）',
  summary: '班級衝突事件通知',
  storyLine: `週三下午第二節下課，五年二班的小傑與小宇在走廊因借橡皮擦起口角。小傑情緒激動，一把推倒小宇，小宇跌坐在地，右膝蓋擦傷。班上同學立刻大叫，引來走廊巡視的王老師。王老師將兩人帶至輔導室冷靜，確認小宇傷勢後送保健室消毒包紮，傷口不深無需就醫。事後在王老師見證下，小傑主動向小宇道歉，兩人握手和解。放學前，王老師需分別透過 LINE 通知小傑家長（施暴方）與小宇家長（受傷方），說明事件經過與學校的處理方式。`,
  techniques: [
    { id: 'T01', name: '訊息破冰與開場設計' },
    { id: 'T02', name: '事實與擔憂分層陳述' },
    { id: 'T04', name: '情緒語氣的文字轉換' },
    { id: 'T07', name: '適當收尾與後續約定' },
    { id: 'T10', name: '雙方家長分開通知的順序設計' },
    { id: 'T11', name: '事實陳述不帶定罪語氣' },
    { id: 'T12', name: '傷情通報的精確用語' },
    { id: 'T15', name: '後續處置措施的主動說明' },
    { id: 'T17', name: '受傷方家長的安撫語氣' },
  ],
  parents: {
    A: {
      name: '陳建國',
      childRelationLabel: '小傑爸爸',
      age: 44,
      occupation: '工廠領班，勞工階層，國中畢業',
      personality: '直接、容易衝動，對孩子打架感到丟臉但也會護短，教育觀念偏「男生打架很正常」',
      speechStyle: '用語直白，句子短促，偶爾帶粗口但不嚴重，習慣用問句表達不滿',
      catchphrases: ['怎樣啦', '沒關係啦', '就這樣嗎'],
      forbiddenWords: ['受害', '申訴', '法律'],
      coreMotivation: '保護孩子不被學校過度處罰，維護家庭顏面',
      traumas: ['自己小時候被老師體罰的經歷', '離婚後對教育角色缺失的愧疚'],
      initialPAD: { pleasure: -1, arousal: 2, dominance: 1 },
      background: '單親（離婚），小傑與他同住，工作忙碌，和小傑溝通不多，對學校事務不太關心',
      parentingStyle: '偏放任，偶爾情緒化管教，較少溫和溝通',
      initialKnowledge: '尚不知情，接到老師訊息前完全不知道。直覺反應是「孩子打架被老師告狀了」',
    },
    B: {
      name: '林美慧',
      childRelationLabel: '小宇媽媽',
      age: 38,
      occupation: '國小教師，中產階層，大學畢業',
      personality: '理性但護子心切，本身是老師所以會從教育角度思考，但孩子受傷時仍會情緒化',
      speechStyle: '用語精確，習慣用完整句子，會主動提問，語氣中帶有教師的專業感',
      catchphrases: ['請問', '我想確認一下', '謝謝老師'],
      forbiddenWords: ['隨便', '算了'],
      coreMotivation: '確保孩子安全，了解完整事件，確保學校有妥善處理',
      traumas: ['曾目睹班上學生因校園霸凌而心理受創的案例'],
      initialPAD: { pleasure: -2, arousal: 3, dominance: 1 },
      background: '雙薪家庭，夫妻教育觀念一致，非常重視孩子的安全感與人際關係',
      parentingStyle: '民主型，重視溝通，對學校事件會認真追問但不會無理取鬧',
      initialKnowledge: '尚不知情。接到通知後第一反應是確認孩子的傷勢，接著會想知道是誰造成的以及學校如何處置',
    },
  },
  phase1: {
    description: '老師主動傳送訊息，通知兩方家長今日事件',
    goals: '在訊息中讓兩位家長都感到被告知而非驚嚇；傳達傷勢已處置、孩子安全；不在訊息中定責',
    missions: {
      A: [
        { id: 'A1', label: '家長知道孩子今天發生了衝突', description: '訊息中提及事件發生' },
        { id: 'A2', label: '家長知道對方孩子有輕微受傷', description: '提及傷勢情況' },
        { id: 'A3', label: '家長知道學校已處理，孩子已道歉和解', description: '說明處置結果' },
        { id: 'A4', label: '訊息不帶入情緒性用詞，立場中立', description: '語氣溫和不指責' },
      ],
      B: [
        { id: 'B1', label: '家長知道孩子今天受傷了', description: '訊息中提及受傷事實' },
        { id: 'B2', label: '家長確認傷勢輕微已處置', description: '說明傷勢程度與處置' },
        { id: 'B3', label: '家長知道已和解', description: '說明和解結果' },
        { id: 'B4', label: '先讓家長安心再說事件經過', description: '訊息順序：先安心再說事' },
      ],
    },
    techniques: [
      { id: 'T01', name: '訊息破冰與開場設計' },
      { id: 'T11', name: '事實陳述不帶定罪語氣' },
      { id: 'T12', name: '傷情通報的精確用語' },
      { id: 'T17', name: '受傷方家長的安撫語氣' },
    ],
  },
  phase2: {
    description: '家長提問，老師回應並收尾',
    missions: {
      A: [
        { id: 'A5', label: '回應家長對事件細節的詢問', description: '清楚說明衝突經過' },
        { id: 'A6', label: '未在 LINE 上做責任判定', description: '未說誰對誰錯' },
        { id: 'A7', label: '說明學校後續處置流程', description: '主動告知輔導、紀錄流程' },
        { id: 'A8', label: '提出明確的後續約定', description: '有時間、方式、行動的收尾' },
      ],
      B: [
        { id: 'B5', label: '回應家長對傷勢處理的確認', description: '說明保健室處置詳情' },
        { id: 'B6', label: '未透露對方孩子的全名', description: '保護學生隱私' },
        { id: 'B7', label: '說明學校對事件的後續處置', description: '說明輔導與記錄流程' },
        { id: 'B8', label: '引導面談而非繼續在 LINE 討論', description: '適時轉移至實體溝通' },
      ],
    },
    questionBank: {
      A: [
        { id: 'P1A-Q1', phase: 2, question: '老師，我兒子怎麼了？', trigger: 'start' },
        { id: 'P1A-Q2', phase: 2, question: '對方的孩子傷得嚴不嚴重？需要賠錢嗎？' },
        { id: 'P1A-Q3', phase: 2, question: '學校會不會記過？' },
        { id: 'P1A-Q4', phase: 2, question: '這件事到底是誰先動手的？', trigger: 'no-explanation' },
        { id: 'P1A-Q5', phase: 2, question: '那以後怎麼辦，我兒子在班上沒事吧？', trigger: 'insufficient' },
      ],
      B: [
        { id: 'P1B-Q1', phase: 2, question: '老師，小宇的傷有沒有正確處理？有沒有拍照記錄？', trigger: 'start' },
        { id: 'P1B-Q2', phase: 2, question: '是哪個同學？我可以知道嗎？' },
        { id: 'P1B-Q3', phase: 2, question: '學校對那個同學有什麼處置？' },
        { id: 'P1B-Q4', phase: 2, question: '這樣的事件會記錄在案嗎？' },
        { id: 'P1B-Q5', phase: 2, question: '我想當面了解，可以約時間嗎？', trigger: 'no-meeting' },
      ],
    },
    techniques: [
      { id: 'T14', name: '不在 LINE 上做責任判定' },
      { id: 'T15', name: '後續處置措施的主動說明' },
      { id: 'T07', name: '適當收尾與後續約定' },
      { id: 'T04', name: '情緒語氣的文字轉換' },
      { id: 'T06', name: '升溫情況的降溫技術' },
    ],
  },
  hints: [
    { techniqueId: 'T01', content: '試試看這樣開頭：先說出自己的身份和想分享「一件事」，不要直接說「出事了」。例：「XXX 家長您好，我是○○老師，今天想讓您知道孩子在學校的一個狀況…」' },
    { techniqueId: 'T11', content: '通知施暴方時，避免用「你的孩子打人」。試試：「今天發生了一個衝突，想讓您了解一下…」' },
    { techniqueId: 'T12', content: '說明傷勢時要具體：部位、程度、處置三個要素。例：「膝蓋有輕微擦傷，已在保健室消毒包紮，不需要就醫。」' },
    { techniqueId: 'T14', content: '家長追問「誰先動手」時，可以這樣回：「這部分我們還在了解中，我想在資訊完整後再跟您說明，這樣比較公平。」' },
    { techniqueId: 'T15', content: '主動加上學校的後續行動，讓家長感到被處理：「學校這邊會安排輔導老師跟進，也會做事件紀錄。」' },
    { techniqueId: 'T07', content: '每次結束對話前，提出一個明確的下一步：「如果您有任何疑問，歡迎今晚直接打電話給我，或明天到校我們當面聊。」' },
  ],
  scoring: {
    totalScore: 36,
    grade: { excellent: 30, pass: 22, needWork: 14 },
  },
}

const fightAdvanced: ScenarioConfig = {
  name: 'fight',
  difficulty: 'advanced',
  parentIds: ['A', 'B'],
  title: '學生打架（進階）',
  summary: '跨班衝突，需就醫',
  storyLine: `週五體育課結束後，更衣室傳出激烈爭吵聲。八年甲班的小凱與八年乙班的小翔因上週線上遊戲糾紛積怨已久，小翔趁換衣時衝過去打了小凱，小凱臉部腫脹明顯。同學緊急通報體育老師介入，校護評估後認為需進一步確認，由甲班導師陳老師（你）陪同小凱至診所就醫。乙班導師李老師將小翔帶回辦公室，小翔堅稱是對方先言語挑釁。目擊同學說法不一，調查尚未完成。你需在返校後透過 LINE 通知小凱媽媽（受傷方）與小翔爸爸（施暴方），同時也要與李老師協調通知的時機與措辭，避免兩邊家長收到不一致的說法。`,
  techniques: [
    { id: 'T01', name: '訊息破冰與開場設計' },
    { id: 'T02', name: '事實與擔憂分層陳述' },
    { id: 'T04', name: '情緒語氣的文字轉換' },
    { id: 'T06', name: '升溫情況的降溫技術' },
    { id: 'T07', name: '適當收尾與後續約定' },
    { id: 'T09', name: '媒介判斷：何時不該用 LINE' },
    { id: 'T10', name: '雙方家長分開通知的順序設計' },
    { id: 'T12', name: '傷情通報的精確用語' },
    { id: 'T13', name: '憤怒家長的即時文字降溫' },
    { id: 'T14', name: '不在 LINE 上做責任判定' },
    { id: 'T16', name: '引導從 LINE 轉為面談' },
    { id: 'T18', name: '截圖風險意識與用字自審' },
  ],
  parents: {
    A: {
      name: '吳雅婷',
      childRelationLabel: '小凱媽媽',
      age: 41,
      occupation: '護理師，中產階層，專科畢業',
      personality: '平時理性，孩子受傷時情緒化，具備醫療知識對傷勢描述非常敏感，單親媽媽非常保護小凱',
      speechStyle: '平時用語專業，激動時連續追問，句子快速，有時字句不完整。會主動要書面紀錄',
      catchphrases: ['我需要完整的說明', '現在狀況怎樣', '書面紀錄我要留著'],
      forbiddenWords: ['算了', '沒事'],
      coreMotivation: '確認孩子安全，取得完整資訊，後續可能追究責任',
      traumas: ['孩子小時候在學校受傷曾被校方輕描淡寫帶過'],
      initialPAD: { pleasure: -3, arousal: 4, dominance: 2 },
      background: '單親，小凱與她同住，對學校安全管理有高度要求，孩子受傷後一定會追究',
      parentingStyle: '民主但嚴格，重視規則與後果',
      initialKnowledge: '完全不知情，接到通知時小凱可能還在診所',
    },
    B: {
      name: '黃志明',
      childRelationLabel: '小翔爸爸',
      age: 46,
      occupation: '業務經理，中上階層，大學畢業',
      personality: '強勢、慣用施壓策略，認為孩子不可能無故打人，傾向幫孩子找理由，對外歸因',
      speechStyle: '語氣強勢主導，習慣反問，句子乾脆，不輕易認錯',
      catchphrases: ['一定有原因', '兩邊都要查清楚', '不能只聽一面之詞'],
      forbiddenWords: ['我孩子不對', '認錯'],
      coreMotivation: '讓學校查清楚，不要讓孩子背黑鍋，保持主導',
      traumas: ['曾有孩子被不公平指責的經歷'],
      initialPAD: { pleasure: -1, arousal: 2, dominance: 3 },
      background: '雙薪家庭，孩子由祖父母帶大，對小翔管教不一致，小翔有衝動控制問題',
      parentingStyle: '偏縱容，遇到問題習慣對外歸因',
      initialKnowledge: '完全不知情，第一反應是「一定有原因」',
    },
  },
  teacher: {
    persona: {
      name: '李承翰',
      age: 32,
      role: '八年乙班導師（小翔的班導師）',
      personality: '資歷較淺（第三年），有點緊張，擔心家長投訴，傾向從輕處理，有時衝動行事',
      speechStyle: '說話有點快，語氣略帶不確定，用同事語氣溝通，偶爾流露出焦慮',
      catchphrases: ['你覺得呢', '我是說…', '這樣應該OK吧'],
      coordinationContext: `今天體育課後更衣室衝突：你（李老師）班的小翔打了陳老師班的小凱，小凱臉部腫脹需就醫。陳老師陪小凱就醫，你帶小翔回辦公室。
關鍵協調點：
1. 通知順序：應先通知受傷方（吳雅婷），再通知施暴方（黃志明），這樣受傷方不會先聽到錯誤說法
2. 措辭一致：兩邊老師對事件描述要一致，不能一個說「衝突」一個說「攻擊」
3. 責任判定：兩邊都不要在 LINE 上定責，等調查完成
你有一個衝動：想先通知黃爸爸（自己班的家長），請陳老師協助提醒正確的順序`,
    },
    coordinationMissions: [
      {
        id: 'C1',
        label: '提醒李老師通知受傷方優先',
        description: '引導李老師先通知吳雅婷再通知黃志明',
      },
      {
        id: 'C2',
        label: '統一兩邊對事件的描述措辭',
        description: '確認兩位老師對事件的說法一致（例如都說「衝突」而非定責）',
      },
    ],
    initialMessage: '陳老師，你那邊怎麼樣了？我想說先傳訊息給黃爸爸說一下，你覺得可以嗎？',
  },
  phase1: {
    description: '在就醫高壓情境下通知雙方家長事件現況，同時與李老師協調通知順序與措辭',
    goals: '讓雙方家長知道事件現況，未定責，老師在場陪同，情緒未完全失控',
    missions: {
      A: [
        { id: 'A1', label: '告知孩子受傷且正在就醫', description: '讓吳雅婷知道小凱的傷勢與就醫狀態' },
        { id: 'A2', label: '告知老師陪同在場', description: '讓家長知道老師全程陪同就醫' },
        { id: 'A3', label: '未傳達任何責任判定', description: '未在訊息中指明誰的錯' },
        { id: 'A4', label: '承諾後續說明', description: '表示後續會提供完整資訊' },
      ],
      B: [
        { id: 'B1', label: '告知孩子涉及衝突且在辦公室', description: '讓黃志明知道小翔目前在辦公室等候' },
        { id: 'B2', label: '告知對方孩子需就醫', description: '中性說明對方傷勢現況' },
        { id: 'B3', label: '未傳達任何責任判定', description: '全程用中性語言，無定責' },
      ],
    },
    techniques: [
      { id: 'T01', name: '訊息破冰與開場設計' },
      { id: 'T12', name: '傷情通報的精確用語' },
      { id: 'T18', name: '截圖風險意識與用字自審' },
      { id: 'T10', name: '雙方家長分開通知的順序設計' },
    ],
  },
  phase2: {
    description: '應對雙方激動家長的追問，降溫並引導轉為面談，全程不在 LINE 上定責',
    missions: {
      A: [
        { id: 'A5', label: '承接吳雅婷的激動情緒', description: '用同理語氣讓家長感到被接住' },
        { id: 'A6', label: '未在 LINE 上定責或承諾處分', description: '避免「是小翔先打的」或承諾賠償' },
        { id: 'A7', label: '主動引導面談', description: '提出來校面談的時間' },
        { id: 'A8', label: '判斷適時切換媒介', description: '在話題升溫時提出改打電話或面談' },
      ],
      B: [
        { id: 'B5', label: '應對黃志明的追問未定責', description: '在「是不是對方先挑釁」的追問下未定責' },
        { id: 'B6', label: '說明調查尚未完成', description: '清楚表明調查結果需等待' },
        { id: 'B7', label: '引導面談', description: '邀請面談以進行完整說明' },
      ],
    },
    questionBank: {
      A: [
        { id: 'P2A-Q1', phase: 2, question: '老師！小凱怎麼樣了！傷勢嚴不嚴重！', trigger: 'start' },
        { id: 'P2A-Q2', phase: 2, question: '是哪個班的孩子？我要知道是誰！' },
        { id: 'P2A-Q3', phase: 2, question: '對方孩子會受到什麼處分？學校早就知道了嗎？' },
        { id: 'P2A-Q4', phase: 2, question: '我需要有完整的書面紀錄，這件事要怎麼處理？' },
        { id: 'P2A-Q5', phase: 2, question: '我要來學校，你們什麼時候有空？' },
      ],
      B: [
        { id: 'P2B-Q1', phase: 2, question: '老師，到底發生什麼事？我兒子說對方先嗆他的。', trigger: 'start' },
        { id: 'P2B-Q2', phase: 2, question: '有沒有目擊者？說法一致嗎？' },
        { id: 'P2B-Q3', phase: 2, question: '學校的處分標準是什麼？是兩邊一樣嗎？' },
        { id: 'P2B-Q4', phase: 2, question: '你們對對方家長也說了一樣的話嗎？' },
      ],
    },
    techniques: [
      { id: 'T13', name: '憤怒家長的即時文字降溫' },
      { id: 'T14', name: '不在 LINE 上做責任判定' },
      { id: 'T16', name: '引導從 LINE 轉為面談' },
      { id: 'T09', name: '媒介判斷：何時不該用 LINE' },
      { id: 'T07', name: '適當收尾與後續約定' },
    ],
  },
  hints: [
    { techniqueId: 'T13', content: '家長情緒激烈時，先承接情緒再說事實：「我知道您現在一定很擔心也很心疼，這完全可以理解。」然後再接：「目前孩子的狀況是…」' },
    { techniqueId: 'T14', content: '黃爸爸追問「是不是對方先挑釁」時：「我了解您想搞清楚來龍去脈，但目前各方說法還不完全一致，我希望在調查清楚後再跟您說明，這樣對雙方都比較公平。」' },
    { techniqueId: 'T16', content: '就醫事件不適合在 LINE 繼續：「吳媽媽，這件事我很想當面跟您完整說明，您方便今晚或明天早上來學校嗎？我會把所有紀錄都準備好。」' },
    { techniqueId: 'T09', content: '當話題觸及「誰的錯」「要提告」「處分細節」，就應切換媒介：「這個問題非常重要，我想確保給您正確的答案，可以我們電話說或見面談嗎？」' },
    { techniqueId: 'T10', content: '通知前先與李老師確認：1. 受傷方優先通知；2. 兩邊都說「衝突」不說「攻擊」；3. 兩邊都不在 LINE 定責。' },
  ],
  scoring: {
    totalScore: 36,
    grade: { excellent: 30, pass: 22, needWork: 14 },
  },
}

const abnormalBasic: ScenarioConfig = {
  name: 'abnormal',
  difficulty: 'basic',
  parentIds: ['A'],
  title: '學生失常（初階）',
  summary: '學生表現異常，老師主動聯繫家長',
  storyLine: `五年甲班的小芳近兩週來上課時頻繁趴桌、作業缺交、在校吃飯明顯減少。導師陳老師多次觀察後，決定透過 LINE 聯繫小芳媽媽，了解家裡是否有狀況，並表達學校的觀察與關心。`,
  techniques: [
    { id: 'T01', name: '訊息破冰與開場設計' },
    { id: 'T02', name: '事實與擔憂分層陳述' },
    { id: 'T04', name: '情緒語氣的文字轉換' },
    { id: 'T05', name: '讀取後不回應的處理' },
    { id: 'T07', name: '適當收尾與後續約定' },
    { id: 'T09', name: '媒介判斷：何時不該用 LINE' },
  ],
  parents: {
    A: {
      name: '吳淑芬',
      childRelationLabel: '小芳媽媽',
      age: 40,
      occupation: '百貨公司專櫃人員，中產階層',
      personality: '外表溫和、習慣迴避衝突，實際上對孩子的狀況感到焦慮但不知如何開口',
      speechStyle: '語氣柔和，說話謹慎，會用「嗯嗯」「是嗎」來緩衝，不太主動提供資訊',
      catchphrases: ['嗯嗯', '好的老師', '我知道了'],
      forbiddenWords: ['根本', '你懂什麼'],
      coreMotivation: '希望孩子沒事，不想讓老師知道家裡最近有困難',
      traumas: ['近期與丈夫關係緊張，孩子可能感受到家庭氣氛'],
      initialPAD: { pleasure: -1, arousal: 1, dominance: -1 },
      background: '雙親家庭，最近夫妻感情不睦，孩子在家也有點沉默',
      parentingStyle: '溫和但略顯被動，不擅長主動溝通',
      initialKnowledge: '模糊感覺孩子最近有點不對，但沒深入了解',
    },
    B: {
      name: '吳淑芬',  // 只有一位家長的情境，B 與 A 相同
      childRelationLabel: '小芳媽媽',
      age: 40,
      occupation: '百貨公司專櫃人員，中產階層',
      personality: '外表溫和、習慣迴避衝突',
      speechStyle: '語氣柔和，說話謹慎',
      catchphrases: ['嗯嗯', '好的老師'],
      forbiddenWords: ['根本'],
      coreMotivation: '希望孩子沒事',
      traumas: ['夫妻關係緊張'],
      initialPAD: { pleasure: -1, arousal: 1, dominance: -1 },
      background: '雙親家庭，最近夫妻感情不睦',
      parentingStyle: '溫和但略顯被動',
      initialKnowledge: '模糊感覺孩子最近有點不對',
    },
  },
  phase1: {
    description: '老師主動發起初次聯繫，說明觀察',
    goals: '讓家長知道老師的關心是出自觀察與擔憂，而非指責，建立溝通意願',
    missions: {
      A: [
        { id: 'A1', label: '說明觀察到的具體行為', description: '提及趴桌、作業缺交、吃飯減少等具體現象' },
        { id: 'A2', label: '表達關心而非指責', description: '語氣以擔憂為主，不帶評判' },
        { id: 'A3', label: '詢問家中是否有狀況', description: '開放性提問，邀請家長分享' },
      ],
      B: [
        { id: 'B1', label: '說明觀察到的具體行為', description: '同上' },
        { id: 'B2', label: '表達關心而非指責', description: '同上' },
        { id: 'B3', label: '詢問家中是否有狀況', description: '同上' },
      ],
    },
    techniques: [
      { id: 'T01', name: '訊息破冰與開場設計' },
      { id: 'T02', name: '事實與擔憂分層陳述' },
      { id: 'T04', name: '情緒語氣的文字轉換' },
    ],
  },
  phase2: {
    description: '家長回覆，老師回應並建立後續計畫',
    missions: {
      A: [
        { id: 'A4', label: '回應家長的說明或迴避', description: '無論家長回應如何都保持開放' },
        { id: 'A5', label: '提出學校可以提供的資源', description: '如輔導室、持續觀察等' },
        { id: 'A6', label: '建立後續聯繫計畫', description: '約定下次更新時間或方式' },
      ],
      B: [
        { id: 'B4', label: '回應家長的說明或迴避', description: '同上' },
        { id: 'B5', label: '提出學校可以提供的資源', description: '同上' },
        { id: 'B6', label: '建立後續聯繫計畫', description: '同上' },
      ],
    },
    questionBank: {
      A: [
        { id: 'P3A-Q1', phase: 2, question: '謝謝老師關心…家裡最近…也沒什麼啦。', trigger: 'start' },
        { id: 'P3A-Q2', phase: 2, question: '小芳在學校真的有這樣嗎？我不知道耶。' },
        { id: 'P3A-Q3', phase: 2, question: '那學校這邊可以怎麼幫她嗎？' },
      ],
      B: [
        { id: 'P3B-Q1', phase: 2, question: '謝謝老師關心…家裡最近…也沒什麼啦。', trigger: 'start' },
        { id: 'P3B-Q2', phase: 2, question: '小芳在學校真的有這樣嗎？我不知道耶。' },
        { id: 'P3B-Q3', phase: 2, question: '那學校這邊可以怎麼幫她嗎？' },
      ],
    },
    techniques: [
      { id: 'T05', name: '讀取後不回應的處理' },
      { id: 'T07', name: '適當收尾與後續約定' },
      { id: 'T09', name: '媒介判斷：何時不該用 LINE' },
    ],
  },
  hints: [
    { techniqueId: 'T02', content: '把「觀察到的事實」和「老師的擔憂」分開說。先說事實：「最近兩週觀察到小芳上課較容易趴桌…」再說擔憂：「老師很擔心她最近的狀態…」' },
    { techniqueId: 'T01', content: '這種情境開場更要溫和：不要說「有件事要說」，試試「想跟您聊聊最近在學校觀察到的一些狀況，不是壞事，就是想一起關心小芳。」' },
  ],
  scoring: {
    totalScore: 24,
    grade: { excellent: 20, pass: 15, needWork: 10 },
  },
}

const abnormalAdvanced: ScenarioConfig = {
  name: 'abnormal',
  difficulty: 'advanced',
  parentIds: ['A'],
  title: '學生失常（進階）',
  summary: '學生情緒危機，輔導員介入',
  storyLine: `國二乙班的小翔在課堂上突然情緒崩潰大哭，被帶至輔導室後表示在家有很大的壓力，但拒絕說詳情。輔導老師評估後建議需要專業介入，班導師賴老師需在資訊有限的情況下，通知小翔媽媽孩子今天的狀況，並引導家長理解需要專業協助。`,
  techniques: [
    { id: 'T01', name: '訊息破冰與開場設計' },
    { id: 'T02', name: '事實與擔憂分層陳述' },
    { id: 'T04', name: '情緒語氣的文字轉換' },
    { id: 'T06', name: '升溫情況的降溫技術' },
    { id: 'T07', name: '適當收尾與後續約定' },
    { id: 'T09', name: '媒介判斷：何時不該用 LINE' },
    { id: 'T16', name: '引導從 LINE 轉為面談' },
  ],
  parents: {
    A: {
      name: '何秀蘭',
      childRelationLabel: '小翔媽媽',
      age: 45,
      occupation: '會計，中產階層，嚴謹型',
      personality: '焦慮型家長，對孩子管控較嚴，聽到孩子情緒崩潰會先進入防禦模式',
      speechStyle: '語速快，會反覆問同一問題，容易把問題歸因給學校或他人',
      catchphrases: ['為什麼', '那你們學校', '我要來學校'],
      forbiddenWords: ['隨便', '沒差'],
      coreMotivation: '確保孩子沒有被傷害，了解到底發生了什麼',
      traumas: ['曾有親子衝突導致孩子一度拒學的經歷'],
      initialPAD: { pleasure: -3, arousal: 4, dominance: 1 },
      background: '單親媽媽，一人撫養孩子，壓力大，對孩子的任何問題都高度警覺',
      parentingStyle: '偏控制型，對孩子期望高，溝通方式較指令式',
      initialKnowledge: '完全不知道孩子今天發生了什麼',
    },
    B: {
      name: '何秀蘭',
      childRelationLabel: '小翔媽媽',
      age: 45,
      occupation: '會計，中產階層，嚴謹型',
      personality: '焦慮型家長',
      speechStyle: '語速快，容易歸因給學校',
      catchphrases: ['為什麼', '那你們學校'],
      forbiddenWords: ['隨便'],
      coreMotivation: '確保孩子沒有被傷害',
      traumas: ['親子衝突導致拒學的經歷'],
      initialPAD: { pleasure: -3, arousal: 4, dominance: 1 },
      background: '單親媽媽，壓力大',
      parentingStyle: '偏控制型',
      initialKnowledge: '完全不知道孩子今天發生了什麼',
    },
  },
  phase1: {
    description: '危機情境下的緊急通知',
    goals: '在資訊有限下，讓家長知道孩子今天的狀況，並引導家長接受專業協助的必要性',
    missions: {
      A: [
        { id: 'A1', label: '告知孩子今天情緒狀態', description: '說明孩子情緒崩潰大哭的事實' },
        { id: 'A2', label: '說明已有輔導介入', description: '說明輔導老師已介入' },
        { id: 'A3', label: '表達關心不帶指責', description: '語氣溫和，不暗示是家長的錯' },
      ],
      B: [
        { id: 'B1', label: '告知孩子今天情緒狀態', description: '同上' },
        { id: 'B2', label: '說明已有輔導介入', description: '同上' },
        { id: 'B3', label: '表達關心不帶指責', description: '同上' },
      ],
    },
    techniques: [
      { id: 'T01', name: '訊息破冰與開場設計' },
      { id: 'T02', name: '事實與擔憂分層陳述' },
      { id: 'T04', name: '情緒語氣的文字轉換' },
    ],
  },
  phase2: {
    description: '焦慮家長的引導與轉介面談',
    missions: {
      A: [
        { id: 'A4', label: '成功降溫焦慮家長', description: '讓家長情緒稍微穩定' },
        { id: 'A5', label: '說明輔導老師評估結果', description: '說明建議需要專業協助' },
        { id: 'A6', label: '引導轉為面談', description: '建議來校面談而非繼續 LINE 討論' },
        { id: 'A7', label: '未透露孩子私密內容', description: '保護孩子說的話的隱私' },
      ],
      B: [
        { id: 'B4', label: '成功降溫焦慮家長', description: '同上' },
        { id: 'B5', label: '說明輔導老師評估結果', description: '同上' },
        { id: 'B6', label: '引導轉為面談', description: '同上' },
        { id: 'B7', label: '未透露孩子私密內容', description: '同上' },
      ],
    },
    questionBank: {
      A: [
        { id: 'P4A-Q1', phase: 2, question: '老師，你說小翔哭了？到底發生了什麼？是有人欺負他嗎？', trigger: 'start' },
        { id: 'P4A-Q2', phase: 2, question: '他跟輔導老師說了什麼？你可以告訴我嗎？' },
        { id: 'P4A-Q3', phase: 2, question: '為什麼他不跟我說？是我哪裡做不好嗎？' },
        { id: 'P4A-Q4', phase: 2, question: '那我現在要去學校嗎？' },
      ],
      B: [
        { id: 'P4B-Q1', phase: 2, question: '老師，你說小翔哭了？到底發生了什麼？是有人欺負他嗎？', trigger: 'start' },
        { id: 'P4B-Q2', phase: 2, question: '他跟輔導老師說了什麼？你可以告訴我嗎？' },
        { id: 'P4B-Q3', phase: 2, question: '為什麼他不跟我說？是我哪裡做不好嗎？' },
        { id: 'P4B-Q4', phase: 2, question: '那我現在要去學校嗎？' },
      ],
    },
    techniques: [
      { id: 'T06', name: '升溫情況的降溫技術' },
      { id: 'T16', name: '引導從 LINE 轉為面談' },
      { id: 'T07', name: '適當收尾與後續約定' },
      { id: 'T09', name: '媒介判斷：何時不該用 LINE' },
    ],
  },
  hints: [
    { techniqueId: 'T16', content: '這種情況非常適合轉為面談：「這件事用文字很難完整說明，我想邀請您明天早上來學校，我和輔導老師一起跟您說明，這樣比較完整。」' },
    { techniqueId: 'T06', content: '家長問「是我哪裡做不好嗎」時，不要肯定也不要否定，先同理：「您願意這樣反思，孩子真的很幸福。我們一起來了解更多，找到最適合小翔的方式。」' },
  ],
  scoring: {
    totalScore: 28,
    grade: { excellent: 24, pass: 18, needWork: 12 },
  },
}

const scenarios: Record<string, ScenarioConfig> = {
  'fight-basic': fightBasic,
  'fight-advanced': fightAdvanced,
  'abnormal-basic': abnormalBasic,
  'abnormal-advanced': abnormalAdvanced,
}

export function getScenarioConfig(
  name: ScenarioName,
  difficulty: Difficulty,
): ScenarioConfig {
  const key = `${name}-${difficulty}`
  const config = scenarios[key]
  if (!config) throw new Error(`Scenario not found: ${key}`)
  return config
}

export function getAllScenarios(): ScenarioConfig[] {
  return Object.values(scenarios)
}

export function getScenarioIntroSteps(
  name: ScenarioName,
  difficulty: Difficulty,
  playerName: string,
  playerAvatar: PlayerAvatar,
): ScenarioIntroStep[] {
  const scenario = getScenarioConfig(name, difficulty)
  const eventKey = `${name}-${difficulty}`

  return [
    {
      label: '事件發生',
      content: scenario.storyLine,
      frames: introEventFramesMap[eventKey] ?? [],
    },
    {
      label: '老師面對的挑戰',
      image: `/images/avatars/think/${playerAvatar}.svg`,
      content: `${playerName} 老師，放學前你需要透過 LINE 通知家長今天發生的事情。\n\n這不是一件容易的事——你需要讓家長知道發生了什麼，同時保持冷靜、不激化情緒、不在 LINE 上定責，還要給家長安心感。`,
    },
    {
      label: '你的任務',
      content: `本次訓練共分兩個關卡：\n\n**Phase 1**：你主動傳送訊息給家長。這個階段家長還沒回應，你需要把必要資訊都說清楚。\n\n**Phase 2**：家長開始回覆，你需要應對他們的問題和情緒。\n\n完成每個關卡後，系統會根據你的溝通技巧給你評分。加油！`,
    },
  ]
}

export const scenarioMeta = {
  fight: {
    name: 'fight' as ScenarioName,
    title: '班級衝突',
    description: '學生在校發生肢體衝突，老師需同時通知雙方家長，在不激化矛盾的前提下說明事件並收尾。',
    image: '/images/scenarios/fight.svg',
    color: '#FF5A5F',
    difficulties: ['basic', 'advanced'] as Difficulty[],
  },
  abnormal: {
    name: 'abnormal' as ScenarioName,
    title: '學生失常',
    description: '學生在校出現異常行為或情緒危機，老師需主動聯繫家長，傳達觀察與關心，並引導家長接受協助。',
    image: '/images/scenarios/abnormal.svg',
    color: '#4A90E2',
    difficulties: ['basic', 'advanced'] as Difficulty[],
  },
}
