// 所有繁體中文文案集中管理，從 docs/page-content.md 提取
// 禁止在 component 內 hard-code 中文字串

export const siteText = {
  siteName: "老師怎麼辦...?",
  siteTagline: "親師溝通篇",
  siteFullName: "老師怎麼辦...? [親師溝通篇]",
} as const;

export const navText = {
  home: "首頁",
  technique: "技巧手冊",
  howToUse: "怎麼使用",
  blog: "鬼故事",
  about: "關於我們",
  startPractice: "開始練習",
  footerTagline: "新手老師最安全的溝通練習場",
  footerCopyright: "© 2025 AI創新教育工學圈圈團隊。保留所有權利。",
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
      ctaDisorder: "情境二：學生表現失常，與家長確認？",
      ctaMore: "探索更多真實挑戰",
    },
    polish: {
      eyebrow: "Message Polish",
      h2: "怕說錯話？專屬的訊息潤飾防護網",
      body: "將你想說的話貼上來，系統會自動幫你過濾情緒字眼，轉換成同理卻不失專業的溫暖回覆。",
      cta: "試試訊息潤飾小幫手 ✨",
    },
  },
  intro: {
    eyebrow: "Why This Simulator",
    h2: "為什麼這個模擬器？",
    scenario: {
      eyebrow: "Immersive Practice",
      h3: "沉浸式情境演練",
      body: "真實還原家長的情緒起伏。提供第一人稱的對話訓練，系統將根據你的回應，即時給予降溫或定責風險的反饋。",
    },
    polish: {
      eyebrow: "Safe Text Filter",
      h3: "安全無痛的文字濾鏡",
      body: "把不確定的訊息草稿丟上來！我們協助你做到「事實與擔憂分層陳述」，讓關心精準傳達。",
    },
  },
  origin: {
    eyebrow: "Our Story",
    h2: "為什麼我們要做這個？",
    body: "我們發現許多充滿熱忱的新手教師，因為教育現場的溝通痛點深受其擾，甚至耗損了教學熱情。因此，我們開發這套情境模擬系統，希望透過真實情況的訓練，陪你一步步長出面對挑戰的溝通智慧。",
  },
  contact: {
    eyebrow: "Contact Us",
    h2: "聯絡我們，我們一直都在",
    body: "遇到問題？或是想敲碗新劇本？隨時告訴我們。",
    email: "contact@teachchat.tw",
    ctaForm: "點此填寫問題回報與建議",
  },
} as const;

export const techniqueText = {
  eyebrow: "Teacher Handbook",
  h1: "新手教師交戰手冊",
  intro:
    "親愛的老師，辛苦了。溝通是一門需要練習的藝術，這裡為你準備了一套「溝通急救箱」。當你不知道該怎麼辦時，隨時來這裡翻翻找找。",
  platform: {
    eyebrow: "Platform",
    h2: "溝通平台技巧：教師官方 LINE 的好處",
    body: "LINE 是一把雙面刃。建立「教師官方 LINE」能為你設立明確的上下班界線，保護私人生活。同時要記得：文字沒有溫度但有證據，學會判斷「何時該用文字告知，何時該果斷打電話」，是你保護自己的第一步。",
  },
  coreTitle: "核心溝通技巧系列",
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
      h3: "首訊破冰與開場設計",
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
  teamName: "AI創新教育工學圈圈團隊",
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
    { name: "成員一", role: "教育研究", placeholder: true },
    { name: "成員二", role: "前端開發", placeholder: true },
    { name: "成員三", role: "UI/UX 設計", placeholder: true },
    { name: "成員四", role: "AI 工程", placeholder: true },
    { name: "成員五", role: "內容策劃", placeholder: true },
  ],
} as const;

export const howToUseText = {
  eyebrow: "How To Use",
  h1: "系統使用導覽",
  intro: "介紹這個系統可以為你做什麼。跟著以下圖文步驟，無痛上手你的專屬溝通模擬器！",
  screenshotNotice:
    "截圖教學將於系統完整上線後更新，敬請期待！",
  steps: [
    {
      num: "01",
      h3: "選擇情境",
      body: "從兩大情境（班級衝突／學生失常）中選出你想練習的類型，再選擇簡單或困難難度。",
    },
    {
      num: "02",
      h3: "練習對話",
      body: "系統扮演真實家長，根據你的回覆動態調整情緒。練習用文字完成告知、安撫與收尾。",
    },
    {
      num: "03",
      h3: "查看成績",
      body: "完成後獲得技能雷達圖與各項技巧評分，了解自己的強項與待加強之處。",
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
