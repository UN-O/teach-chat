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
    { id: 'T01', name: '首訊破冰與開場設計' },
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
    description: '老師主動傳送首訊，通知兩方家長今日事件',
    goals: '在首訊中讓兩位家長都感到被告知而非驚嚇；傳達傷勢已處置、孩子安全；不在首訊中定責',
    missions: {
      A: [
        { id: 'A1', label: '家長知道孩子今天發生了衝突', description: '訊息中提及事件發生' },
        { id: 'A2', label: '家長知道對方孩子有輕微受傷', description: '提及傷勢情況' },
        { id: 'A3', label: '家長知道學校已處理，孩子已道歉和解', description: '說明處置結果' },
        { id: 'A4', label: '開場未讓家長立即進入防禦狀態', description: '語氣溫和不指責' },
      ],
      B: [
        { id: 'B1', label: '家長知道孩子今天受傷了', description: '訊息中提及受傷事實' },
        { id: 'B2', label: '家長確認傷勢輕微已處置', description: '說明傷勢程度與處置' },
        { id: 'B3', label: '家長知道已和解', description: '說明和解結果' },
        { id: 'B4', label: '先讓家長安心再說事件經過', description: '訊息順序：先安心再說事' },
      ],
    },
    techniques: [
      { id: 'T01', name: '首訊破冰與開場設計' },
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
  storyLine: `週四下午體育課後，六年甲班的小明與六年乙班的小強在操場起衝突，兩人互毆，小強鼻樑撞傷流血，送至保健室後確認需要就醫縫合。事件涉及跨班，乙班老師林老師需與甲班張老師協調。小強家長已趕到學校陪同就醫，林老師需同步通知小明家長事件狀況，並在資訊不完整的情況下說明現況。`,
  techniques: [
    { id: 'T01', name: '首訊破冰與開場設計' },
    { id: 'T02', name: '事實與擔憂分層陳述' },
    { id: 'T04', name: '情緒語氣的文字轉換' },
    { id: 'T06', name: '升溫情況的降溫技術' },
    { id: 'T07', name: '適當收尾與後續約定' },
    { id: 'T10', name: '雙方家長分開通知的順序設計' },
    { id: 'T11', name: '事實陳述不帶定罪語氣' },
    { id: 'T12', name: '傷情通報的精確用語' },
    { id: 'T14', name: '不在 LINE 上做責任判定' },
    { id: 'T15', name: '後續處置措施的主動說明' },
  ],
  parents: {
    A: {
      name: '黃志明',
      childRelationLabel: '小明爸爸',
      age: 47,
      occupation: '工地主任，粗獷型，高中畢業',
      personality: '急躁、強勢，對學校管理有不滿，但私下其實很在乎孩子',
      speechStyle: '說話快、句子短，容易激動時語氣變強硬，偶爾說台語詞彙',
      catchphrases: ['搞什麼', '講清楚', '我去學校'],
      forbiddenWords: ['抱歉', '對不起'],
      coreMotivation: '保護孩子不被冤枉，讓學校負責',
      traumas: ['曾被老師不公平對待的經歷'],
      initialPAD: { pleasure: -2, arousal: 3, dominance: 2 },
      background: '雙親家庭，太太負責孩子教育，他較少參與。對學校有一定不信任感',
      parentingStyle: '偏嚴格，用威嚇管教，但愛孩子',
      initialKnowledge: '剛接到通知，非常緊張，想第一時間衝去學校',
    },
    B: {
      name: '蔡雅玲',
      childRelationLabel: '小強媽媽',
      age: 41,
      occupation: '全職媽媽，曾任護理師',
      personality: '細心敏感，因孩子受傷非常心疼，容易哭泣，但也會追問細節',
      speechStyle: '語氣帶哭腔，句子有時不完整，重複問同一件事',
      catchphrases: ['我的孩子怎麼了', '他還好嗎', '為什麼會這樣'],
      forbiddenWords: ['算了', '沒關係'],
      coreMotivation: '確認孩子安全，知道傷勢程度，追究責任',
      traumas: ['孩子小時候發生意外的創傷記憶'],
      initialPAD: { pleasure: -3, arousal: 4, dominance: -1 },
      background: '已陪孩子在醫院，心情非常焦急',
      parentingStyle: '過度保護型，孩子任何事都非常在意',
      initialKnowledge: '已知道孩子受傷需縫合，但不知道完整事件經過',
    },
  },
  phase1: {
    description: '高壓情境下的緊急通知',
    goals: '在資訊不完整的情況下，對施暴方家長傳送緊急通知，說明現況而不激化',
    missions: {
      A: [
        { id: 'A1', label: '告知事件發生', description: '說明孩子今天參與了衝突事件' },
        { id: 'A2', label: '說明對方傷勢（需就醫）', description: '告知對方孩子鼻樑受傷需縫合' },
        { id: 'A3', label: '說明學校正在處理', description: '學校已介入協調' },
        { id: 'A4', label: '未使用定罪語言', description: '全程用中性語言描述' },
      ],
      B: [
        { id: 'B1', label: '認可家長的情緒與辛苦', description: '表達對家長陪孩子就醫的感謝與關心' },
        { id: 'B2', label: '說明學校的處置進度', description: '說明學校目前的跟進狀況' },
        { id: 'B3', label: '承諾後續更新資訊', description: '表示會持續更新' },
      ],
    },
    techniques: [
      { id: 'T01', name: '首訊破冰與開場設計' },
      { id: 'T12', name: '傷情通報的精確用語' },
      { id: 'T11', name: '事實陳述不帶定罪語氣' },
      { id: 'T02', name: '事實與擔憂分層陳述' },
    ],
  },
  phase2: {
    description: '多方協調，安撫激動家長',
    missions: {
      A: [
        { id: 'A5', label: '成功降溫激動家長', description: '家長 PAD Arousal 降低 1 分以上' },
        { id: 'A6', label: '未在 LINE 上定責', description: '未承認孩子的錯誤或對方的錯誤' },
        { id: 'A7', label: '引導面談', description: '建議來校當面討論' },
        { id: 'A8', label: '說明後續協調計畫', description: '說明學校的跨班協調機制' },
      ],
      B: [
        { id: 'B5', label: '安撫情緒中的家長', description: '表達同理並讓家長感到被支持' },
        { id: 'B6', label: '說明後續資訊更新計畫', description: '承諾何時提供完整說明' },
        { id: 'B7', label: '未過度承諾賠償或處分', description: '說明需調查後才能確定' },
        { id: 'B8', label: '引導面談', description: '建議實體碰面溝通' },
      ],
    },
    questionBank: {
      A: [
        { id: 'P2A-Q1', phase: 2, question: '到底是怎麼回事？我要去學校！', trigger: 'start' },
        { id: 'P2A-Q2', phase: 2, question: '對方傷那麼重，是我孩子造成的嗎？' },
        { id: 'P2A-Q3', phase: 2, question: '學校要怎麼處理？記過嗎？' },
        { id: 'P2A-Q4', phase: 2, question: '你說學校在處理，是誰在負責？' },
      ],
      B: [
        { id: 'P2B-Q1', phase: 2, question: '老師，剛才醫生說可能需要縫三針，為什麼會這樣？', trigger: 'start' },
        { id: 'P2B-Q2', phase: 2, question: '是哪個班的孩子？對方家長有來嗎？' },
        { id: 'P2B-Q3', phase: 2, question: '醫療費用怎麼算？學校會負責嗎？' },
        { id: 'P2B-Q4', phase: 2, question: '這件事之後，我的孩子還要跟那個孩子在同一個學校嗎？' },
      ],
    },
    techniques: [
      { id: 'T06', name: '升溫情況的降溫技術' },
      { id: 'T14', name: '不在 LINE 上做責任判定' },
      { id: 'T15', name: '後續處置措施的主動說明' },
      { id: 'T07', name: '適當收尾與後續約定' },
      { id: 'T04', name: '情緒語氣的文字轉換' },
    ],
  },
  hints: [
    { techniqueId: 'T06', content: '家長說「我要去學校」時，先肯定他的關心：「非常理解您的擔心，也歡迎您來。我想先讓您知道目前的狀況…」避免正面衝突。' },
    { techniqueId: 'T12', content: '就醫情境下，傷情通報更需精確：「鼻樑有撞傷，正在就醫評估，我們也在等醫生的完整報告。」' },
    { techniqueId: 'T14', content: '跨班事件更容易引發定責爭議，堅持：「事件還在調查中，完整說明需要待調查完成後。」' },
  ],
  scoring: {
    totalScore: 40,
    grade: { excellent: 34, pass: 26, needWork: 17 },
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
    { id: 'T01', name: '首訊破冰與開場設計' },
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
      { id: 'T01', name: '首訊破冰與開場設計' },
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
    { id: 'T01', name: '首訊破冰與開場設計' },
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
      { id: 'T01', name: '首訊破冰與開場設計' },
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
      content: `本次訓練共分兩個關卡：\n\n**Phase 1**：你主動傳送首訊給家長。這個階段家長還沒回應，你需要把必要資訊都說清楚。\n\n**Phase 2**：家長開始回覆，你需要應對他們的問題和情緒。\n\n完成每個關卡後，系統會根據你的溝通技巧給你評分。加油！`,
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
