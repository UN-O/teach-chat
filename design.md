這分文件的細節 content 在 docs/page-content.md

metadata
title: 老師怎麼辦...? [親師溝通篇]
description: 
why we developed this product
what we hope to achieve
how can the product help the teachers
why do the teachers need this
open graphy: hero page 內容

/home
(最優先) 這頁的
hero section
title (標準字)
封面圖片
一句話：產品簡介、目標
hook section
圖片：情境訓練功能(角色頭痛照)
文案：情境訓練簡紹
按鈕: 情境一 (去到 /scenario/disorder)
按鈕: 情境二 (去到 /scenario/studentfeud)
按鈕: 探索更多(去到 /scenario/情境列表)
圖片：訊息潤飾(聊天室打字)
文案：訊息潤飾功能簡介
按鈕: 訊息潤飾 (去到 /polishtext)
introduction setion
feature
圖片：情境訓練功能截圖
文案：功能目的＋使用說明
圖片：訊息潤飾功能截圖
文案：功能目的＋使用說明
origin 為什麼我們要做這個
圖片：team pic
文案：發現教師因為教育現場的溝通問題深受其擾，因此開發情境模擬來訓練溝通技巧，以面對教育現場真實情況
contact 聯絡資料
email
問題回報與建議: google 表單

/technique 
(最優先) 新手教師交戰手冊
介紹：我們
溝同平台技巧
教師官方 line，好處
溝通技巧系列［編號］
包含三明治

/polish
(最優先) 潤飾工具，運用溝通技巧
	-文案：簡介功能及引導使用者操作
	-訊息輸入框
	-AI輸出文案內容


/about
我們團隊跟目標，仿照共備社群，推動更有，這次以[老師怎麼辦...? [親師溝通篇]]參加親子天下比賽

找到贊助、計畫就做更多主題
解鎖
職場溝通篇
合作學習篇

徵才
影響力推廣人才
美術設計人才


/how to use
(先空著)
這頁是 step by step 的圖文介紹
將最後才來實作，使用完成的截圖來撰寫使用流程
介紹這個系統可以做甚麼



/blog(教師鬼故事集)
這頁是教師在教育現場遇到的各種鬼故事的經驗分享
以及 小編的建議
我要投稿按鈕，跳轉 google 表單
可以投稿



/scenario
情境列表
圖卡按鈕: 情境一 (去到 /scenario/fight)
圖卡按鈕: 情境二 (去到 /scenario/abnormal)

/scenario/[name]
圖片
標題：情境模擬
介紹事件類型
文案：事情的組成、利害關係、嚴重性(要走SOP)
按鈕：查看更多（）
選擇難度開始練習
tab 
簡單
圖片：事件圖片
圖片：角色大頭貼（學生、家長、學校行政）
文案：劇情簡介：利害關係人（學生家庭背景、學校行政）、發生事件經過
文案：練習運用的溝通技巧（hashtag）
困難
圖片：事件圖片
圖片：角色大頭貼（學生、家長、學校行政）
文案：劇情簡介：利害關係人（學生家庭背景、學校行政）、發生事件經過
文案：練習運用的溝通技巧（hashtag）
開始練習


/scenario/[name]/[難度標籤]/[uuid]

這裡開始有個 hook 管理整個遊戲狀態。狀態先保存在 local 之後會要上到 db 去

有頁面狀態"init", "intro", "interact", "report" 四個頁面

順序是"init" -> "intro" ->"interact"->  "report" 

"interact" 的部分是遊戲的本體，有 "chat" 跟 "score" 兩個頁面

遊戲關卡有兩個
"phase-1"（互動角色未上線） 
"phase-2"（互動角色上線）

每個關卡都會有 "chat" 跟 "score" 兩個頁面
關卡內可以反覆練習
"chat" (phase-1) <-> "score" (phase-1) -> "chat" (phase-2) <-> "score" (phase-2) 

"chat" 主要有
chatlist 跟 chatroom (direct message) 、mission 三個ＵＩ組件
chatlist 顯示可以互動的角色
chatroom 玩家可以傳訊息 給 角色
mission 可以展開，顯示這個 phase 需要完成的任務的 checklist

在 phase-1 角色都處於未上線狀態，使用者可以傳多則訊息 但不會觸發 Action1
但會異步不卡住ＵＩ觸發 Action3 checkMission 背景檢查
達成任務後就 有按鈕可以開始評分


在 phase-2 
有個遊戲引擎來由起始觸發、玩家觸發、自主觸發 Action1 產生角色準備發送的 seq

起始觸發 就直接顯示

玩家觸發、自主觸發的 根據角色的 config 的 t_delay API 回來後不立即顯示，放入 seq 而是等到 remaining = max(0, t_delay - elapsed) 如果玩家沒有再傳新的訊息（會清掉 seq）才顯示第一泡泡

顯示第一泡泡時同步做三件事：
   - 把玩家訊息標成已讀（`readBy`）
   - 寫入角色訊息
   - 套用 PAD delta（只在第一泡泡套用，避免重
若有多泡泡，後續以固定 gap（800ms）依序追加

背景平行任務：checkMission updateMemories updatePAD

llm Action1 generateMessage 根據 聊天記錄＋seq(未發送訊息)、角色設計、角色狀態(PAD)、世界觀記憶、角色動態記憶、角色目的、發訊息建議、玩家標籤 來產生角色可能會講的訊息陣列
回應字數與 PAD 的 D 有關、回應數量與 A 有關、回應風格與 P 有關，數值區間可以分別對應到不同的 prompt 或程式的隨機採樣設定

每 15 秒 去觸發有 (A+5)/10 的機率去處發 checkSend 
llm Action2 checkSend 根據 聊天記錄 與 角色目的 決定是否還需要發送訊息，如果判斷 ture 就做發訊息建議，並且觸發 generateMessage 連續觸發 true 將降低角色的 P 值不耐煩。如果判斷為 false 直等到玩家有傳新的訊息 才再開始每 15 秒檢查
llm Action3 checkMission 檢查過關條件是否有達成

異步不阻塞處理
llm Action4 updateMemories 以聊天記錄、角色設計、玩家標籤、世界觀記憶 去更新角色對於事件與教師的理解
llm Action5 updatePAD 以聊天記錄、角色設計、玩家標籤、世界觀記憶 去更新角色現在的 PAD

每一關都會有 過關條件 由狀態更新後自動觸發 llm 去判斷是否達成（Action3），達成後在右上角 會有完成按鈕，可以進入到 "score" 使用 docs/scenarios/rubrics.md 內的對應評分標準以 llm 針對聊天記錄進行評分

進入 "score" 後
llm Action6 generateScore 根據 聊天記錄與 rubrics 來產生對應項目的分數


介面設計
“init” 使用者選擇
有四個 avatar 可以選
輸入 名字
選擇教育場域 國小、國中
選擇身份 實習老師、兼課老師、代課老師、正式老師


“intro” 
	設計得像是 rpg 遊戲的頁面 有對話筐 跟 示意圖，有三張圖跟對應的文字 來講故事的前情提要
接下來是 老師老師苦惱圖（根據 avatar 不同）
有兩個
按鈕: 開始遊戲 ( 進入 interact)
按鈕: 返回遊戲列表 (回到 /scenario/[name])

“chat”
這個階段的介面是 聊天室選單與聊天室 手機版是兩個各一頁，電腦版顯示在一起

“chatlist” 聊天室列表
文案：任務目標、行動建議
圖片：角色大頭貼，也有狀態顯示還有多少則未讀訊息
文案：角色名稱
文案：聊天室最後訊息文案
按鈕: 聊天室 (去到 /chat)
按鈕: i (事件經過說明 完整的 description select-none)
按鈕: 返回遊戲列表 的箭頭(去到 /scenario)


“chat” 聊天室
任務列表按鈕：列點任務目標
文案：任務目標、行動建議
圖片：角色大頭貼
文案：角色名稱
文案：聊天對話內容
文案：溝通技巧提示
按鈕: i (事件經過說明)
輸入：對話輸入框
按鈕: 輸入對話

遊戲狀態 “phase1 score 單元結算
觸發機制：phase1任務皆完成
顯示
圖表：技能雷達圖
文案：技巧項目
文案：得分
文案：評分說明
按鈕：下一關 (去到 /phase 2)
按鈕：再玩一次 (去到 /phase 1)
按鈕：返回遊戲列表 (去到 /scenario)

遊戲狀態 “phase2 score 單元結算
觸發機制：phase2任務皆完成
圖表：技能雷達圖
文案：技巧項目
文案：得分
文案：評分說明
按鈕：查看總建議 (去到 /final)
按鈕：再玩一次 (去到 /phase2)
按鈕：返回遊戲列表 (去到 /scenario)


“final”: 總分建議
圖表：技能雷達圖
文案：全部技巧總得分
文案：說明
文案：建議
連結：推薦延伸閱讀
按鈕：該關再玩一次 (重設 遊戲狀態為 phase 2)
按鈕：重頭再玩一次 (重設 遊戲狀態為 /phase 1)
按鈕：返回遊戲列表 (去到 /scenario)


