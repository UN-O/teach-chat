// 所有繁體中文文案集中管理，從 docs/page-content.md 提取
// 禁止在 component 內 hard-code 中文字串

export const siteText = {
  siteName: "老師怎麼辦...?",
  siteTagline: "親師溝通篇",
  siteFullName: "老師怎麼辦...? [親師溝通篇]",
} as const;

export const navText = {
  home: "首頁",
  technique: "教戰手冊",
  howToUse: "怎麼使用",
  scenario: "情境演練",
  polishText: "訊息潤稿",
  blog: "鬼故事",
  about: "關於我們",
  startPractice: "開始練習",
  footerTagline: "新手老師最安全的溝通練習場",
  footerCopyright: "© 2025 AI創新教育共學圈圈團隊。保留所有權利。",
} as const;

export const homeText = {
  hero: {
    eyebrow: "Free · For New Teachers",
    h1Line1: "老師怎麼辦...?",
    h1Line2: "[親師溝通篇]",
    subtitle:
      "專為新手老師打造的「親師溝通情境模擬器」，讓你在安全的防護網裡，免費練就從容應對的底氣。",
    ctaPrimary: "開始免費練習",
    ctaSecondary: "了解更多",
  },
  hook: {
    scenario: {
      eyebrow: "Scenario Practice",
      h2: "怎麼辦？親師溝通情境演練",
      body: "「叮咚！」螢幕那頭的訊息，是不是又讓你的心跳漏了一拍？真實的教育現場劇本，讓你先在這裡練習，造就在現實中的完美過關。",
      ctaFight: "情境一：同學們起衝突，怎麼跟家長說？",
      ctaDisorder: "情境二：學生表現失常，聯絡家長？",
      ctaMore: "探索更多真實挑戰",
    },
    polish: {
      eyebrow: "Message Polish",
      h2: "怕說錯話？專屬的訊息潤飾防護網",
      body: "將你想說的話貼上來，系統會自動幫你過濾情緒字眼，轉換成同理卻不失專業的溫暖回覆。",
      cta: "試試訊息潤飾小幫手 ✨",
    },
    technique: {
      eyebrow: "Technique Guide",
      h2: "新手教師教戰手冊",
      body: "沒有人天生就會和家長溝通。這裡整理了最關鍵的幾個技巧，讓你在開口之前，先有一套清晰的框架——從訊息破冰到升溫降溫，一步步建立你的溝通本能。",
      cta: "查閱教戰手冊",
      tags: [
        { code: "T01", label: "訊息破冰與開場設計" },
        { code: "T02", label: "事實與擔憂分層陳述" },
        { code: "T06", label: "升溫情況的降溫技術" },
        { code: "T00", label: "三明治溝通法" },
      ] as const,
    },
  },
  video: {
    eyebrow: "Intro Video",
    h2: "三分鐘快速上手",
  },
  intro: {
    eyebrow: "What You Get",
    h2: "一個模擬器，四個核心體驗",
    subtitle:
      "從沉浸式情境演練到 AI 評分，每個功能都為「讓新手老師不再害怕家長訊息」而設計。",
    scenario: {
      eyebrow: "01 · Scenario Training",
      h3: "沉浸式情境演練",
      body: "以第一人稱對話，體驗真實的家長溝通場景。兩大劇本、雙重難度，從班級衝突到學生失常，讓你在零風險的環境中反覆練習到熟練。",
      cta: "選擇情境，開始練習",
    },
    pad: {
      eyebrow: "02 · AI Parent Personas",
      h3: "AI 情緒建模的真實家長",
      body: "每位家長都有獨立的 PAD 情緒模型——情緒愉悅度、激活度、控制感三軸動態變化。你的每一句話，都牽動著對方下一刻的回應速度與語氣。",
    },
    scoring: {
      eyebrow: "03 · Skills Radar",
      h3: "18 項技巧科學評分",
      body: "完成每個階段後，AI 依據 18 項專業溝通技巧逐項評分，並生成技能雷達圖，讓你看清楚自己的強項與待加強的盲點。",
    },
    polish: {
      eyebrow: "04 · Message Polish",
      h3: "隨時可用的訊息潤飾防護網",
      body: "不想進遊戲？直接貼上你的草稿。AI 協助你濾除地雷詞彙、重整事實與擔憂陳述，一鍵生成安全又溫暖的回覆。",
      cta: "試試訊息潤飾",
    },
  },
  origin: {
    eyebrow: "Our Story",
    h2: "為什麼我們要做這個？",
    body: "我們發現許多充滿熱忱的新手教師，因為教育現場的溝通痛點深受其擾，甚至耗損了教學熱情。因此，我們開發這套情境模擬系統，希望透過真實情況的訓練，陪你一步步長出面對挑戰的溝通智慧。",
  },
  contact: {
    eyebrow: "Contact Us",
    h2: "讓我們一起共創價值",
    body: "遇到問題？或是想敲碗新劇本？隨時告訴我們。",
    email: "outegralstudio@gmail.com",
    ctaForm: "點此填寫問題回報與建議",
  },
} as const;

export const techniqueText = {
  eyebrow: "Teacher Handbook",
  h1: "新手教師教戰手冊",
  intro:
    "親愛的老師，辛苦了。溝通是一門需要練習的藝術，這裡為你準備了一套「溝通急救箱」。當你不知道該怎麼辦時，隨時來這裡翻翻找找。",
  platform: {
    eyebrow: "Platform",
    h2: "溝通平台技巧：教師官方 LINE 的好處",
    body: "LINE 是一把雙面刃。建立「教師官方 LINE」能為你設立明確的上下班界線，保護私人生活。同時要記得：文字沒有溫度但有證據，學會判斷「何時該用文字告知，何時該果斷打電話」，是你保護自己的第一步。",
  },
  coreTitle: "溝通技巧系列",
  techniques: [
    {
      eyebrow: "技巧 00",
      code: "T00",
      h3: "三明治溝通法",
      body: "肯定 → 建議 → 鼓勵。把難以開口的建議或壞消息，包覆在具體溫暖的肯定與未來的期盼中，能大幅降低家長的防備心。",
      comingSoon: false,
    },
    {
      eyebrow: "技巧 01",
      code: "T01",
      h3: "訊息破冰與開場設計",
      body: "傳第一則訊息時，千萬不要讓家長覺得「孩子出事了」。先說出讓對方安心的現況（例如：孩子目前安全），再切入正題。",
      comingSoon: false,
    },
    {
      eyebrow: "技巧 02",
      code: "T02",
      h3: "事實與擔憂分層陳述",
      body: "將「發生了什麼事實」與「老師的擔憂」分開說明。不要把成績退步或上課發呆，直接說成「孩子有問題」的指責。",
      comingSoon: false,
    },
    {
      eyebrow: "技巧 03",
      code: "T04",
      h3: "情緒語氣的文字轉換",
      body: null,
      comingSoon: true,
    },
    {
      eyebrow: "技巧 04",
      code: "T06",
      h3: "升溫情況的降溫技術",
      body: "面對焦慮家長，光說「請放心」是不夠的。先用文字承接情緒（「我知道您一定很擔心」），再給出現況資訊，家長的情緒才能落地。",
      comingSoon: false,
    },
    {
      eyebrow: "技巧 05",
      code: "T07",
      h3: "適當收尾與後續約定",
      body: null,
      comingSoon: true,
    },
  ],
} as const;

export const aboutText = {
  eyebrow: "About Us",
  h1: "關於我們",
  teamName: "AI創新教育共學圈圈團隊",
  intro:
    "我們是一群關心教育生態的夥伴。就像學校裡的「共備社群」一樣，我們希望透過科技，成為全台新手教師最堅實的後盾。這次，我們帶著《老師怎麼辦...? [親師溝通篇]》參與親子天下比賽，希望能推動更友善的親師關係，讓更多在教育前線奮鬥的老師們看見：你們並不孤單。",
  futurePlans: {
    eyebrow: "Future Plans",
    h2: "解鎖未來計畫",
    body: "只要找到贊助與計畫支持，我們就能為老師們做更多！未來預計解鎖：",
    items: [
      {
        label: "職場溝通篇（即將推出）",
        desc: "面對行政要求、資深前輩，如何優雅應對？",
      },
      {
        label: "合作學習篇（即將推出）",
        desc: "班級經營的眉眉角角，一次掌握。",
      },
    ],
  },
  recruit: {
    eyebrow: "Join Us",
    h2: "徵才：加入我們",
    body: "想和我們一起為教育圈做點什麼嗎？歡迎加入！",
    positions: [
      {
        label: "影響力推廣人才",
        desc: "擅長社群經營，熱愛分享教育觀點。",
      },
      {
        label: "美術設計人才",
        desc: "用畫筆勾勒出能撫慰老師疲憊心靈的視覺。",
      },
    ],
  },
  teamMembers: [
    {
      name: "UN-O",
      role: "清大 AI 助教負責人",
      desc: "清大竹師教育學院博士班・AI 融入教育實務研究",
    },
    {
      name: "芸辰",
      role: "新創×社創 斜槓大學生",
      desc: "台大心理系・人機互動心理學實驗研究",
    },
    {
      name: "小柯",
      role: "智慧社區產品設計",
      desc: "清大英語教育系",
    },
    {
      name: "Jerry",
      role: "資訊系統與人機互動研究",
      desc: "清大服務科學博士班",
    },
    {
      name: "Ritmo",
      role: "清大 AI 助教開發者",
      desc: "清大工學院學士班・全端工程師",
    },
  ],
} as const;

export const howToUseText = {
  eyebrow: "How To Use",
  h1: "系統使用導覽",
  intro:
    "完整的模擬流程，從選擇劇本到查看評分，每個步驟都為讓你真正練到、學到而設計。",
  steps: [
    {
      num: "01",
      phase: null as string | null,
      h3: "選擇情境與難度",
      body: "從兩大情境劇本中挑選：班級衝突或學生失常，再決定簡單或困難難度。每個情境都有完整的事件背景、人物設定與利害關係，難度越高涉及的家長越多、情緒越複雜。",
      features: [] as { label: string; desc: string }[],
    },
    {
      num: "02",
      phase: null as string | null,
      h3: "建立你的老師角色",
      body: "選擇角色頭像、輸入姓名、選擇任教場域（國小 / 國中）與身份（實習 / 兼課 / 代課 / 正式老師），讓情境更貼近你的真實處境。",
      features: [] as { label: string; desc: string }[],
    },
    {
      num: "03",
      phase: null as string | null,
      h3: "閱讀前情提要",
      body: "以 RPG 故事方式呈現的事件背景——發生了什麼、涉及哪些人、時間與地點。務必記住關鍵細節，對話時這些都是你最重要的依據。",
      features: [] as { label: string; desc: string }[],
    },
    {
      num: "04",
      phase: "Phase 1",
      h3: "主動告知：傳送你的第一則訊息",
      body: "家長目前還沒上線。你需要主動傳訊息給雙方家長，完成本階段的告知任務。側邊的任務面板會追蹤所有目標，資深老師也會即時給你溝通建議——完成所有任務後才能進入評分。",
      features: [
        { label: "任務面板", desc: "追蹤本階段所有目標，清楚知道還差什麼" },
        {
          label: "資深老師即時建議",
          desc: "根據當前對話狀況，提示你應注意的溝通技巧",
        },
      ],
      subImages: [
        {
          src: "/images/how-to-use-step-04-1.jpeg",
          label: "資深老師即時建議",
          alt: "資深老師建議面板截圖",
        },
        {
          src: "/images/how-to-use-step-04-2.jpeg",
          label: "回應指引",
          alt: "回應指引提示截圖",
        },
      ] as { src: string; label: string; alt: string }[],
    },
    {
      num: "05",
      phase: "Phase 2",
      h3: "家長上線，即時互動開始",
      body: "家長看到你的訊息後開始回應！每位家長有獨立的 AI 情緒模型，回應速度與語氣會隨你的對話內容動態改變。處理追問、安撫情緒，並在適當時機引導對話收尾。",
      features: [
        {
          label: "AI 情緒建模",
          desc: "家長情緒三軸（愉悅度、激活度、控制感）即時更新，影響回應內容與速度",
        },
        {
          label: "資深老師即時建議",
          desc: "針對家長當下情緒狀態，提供降溫或引導策略",
        },
      ],
    },
    {
      num: "06",
      phase: "Score",
      h3: "查看技能雷達圖與逐項評分",
      body: "每個階段完成後，AI 依據 18 項親師溝通技巧逐一評分（1–4 分），並以雷達圖呈現你的強項與盲點。每項技巧都附有具體評語與改善建議，讓你知道下次要調整什麼。",
      features: [
        { label: "18 項技巧評分", desc: "每項 1–4 分，附評語與具體改善建議" },
        { label: "技能雷達圖", desc: "視覺化呈現整體溝通表現，一眼看出強弱項" },
      ],
    },
    {
      num: "07",
      phase: "Final",
      h3: "總結建議，決定下一步",
      body: "查看兩個階段的綜合雷達圖與個人化建議，系統會推薦你延伸閱讀相關溝通技巧。可以直接重玩任一階段繼續磨練，也可以回到情境列表挑戰不同劇本。",
      features: [] as { label: string; desc: string }[],
    },
  ],
  cta: "前往情境列表開始練習",
} as const;

export const blogText = {
  eyebrow: "Teacher Ghost Stories",
  h1: "教師鬼故事集",
  intro:
    "教育現場總有些令人哭笑不得、甚至寒毛直豎的「奇葩日常」。不管是深夜狂叩的家長，還是令人窒息的神邏輯對話，寫下來吧！這裡有全台老師陪你一起苦笑，還有貼心小編為你提供破局的實用建議。",
  featuredTitle: "精選經驗分享",
  ctaSubmit: "我要投稿！分享我的教育現場經歷",
  form: {
    eyebrow: "Submit Your Story",
    h2: "投稿你的鬼故事",
    fields: {
      title: "故事標題",
      titlePlaceholder: "下一個就是我的標題了...",
      schoolType: "學校類型",
      schoolOptions: ["國小", "國中", "高中"] as const,
      nickname: "老師稱謂（選填）",
      nicknamePlaceholder: "例如：七年級導師、國小科任老師",
      content: "故事內容",
      contentPlaceholder:
        "把你的鬼故事寫下來吧！可以匿名，只要故事是真實的就好。",
      email: "Email（選填）",
      emailPlaceholder: "若編輯想進一步採訪，方便聯繫你",
      submit: "送出投稿",
      submitSuccess: "感謝投稿！我們收到你的故事了，敬請期待刊登。",
    },
  },
  placeholderStories: [
    {
      eyebrow: "案例分享",
      title: "深夜 11 點的 LINE 訊息",
      excerpt:
        "那天我剛洗完澡，手機震動了。家長傳來一長串訊息，開頭是：「老師，我有問題想問你……」我的心當下沉了一下。",
    },
    {
      eyebrow: "案例分享",
      title: "橡皮擦引發的家長大戰",
      excerpt:
        "本來以為只是孩子間的小摩擦，沒想到兩邊家長在 LINE 群組裡你來我往，最後演變成要求我「公開道歉」的局面。",
    },
    {
      eyebrow: "案例分享",
      title: "「我要去投訴你」的那通電話",
      excerpt:
        "電話那頭，家長的聲音比我預期的還要激動。我深吸一口氣，想起了那句話：先承接情緒，再給資訊。",
    },
  ],
} as const;
