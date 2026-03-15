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
圖卡按鈕: 情境一 (去到 /scenario/disorder)
圖卡按鈕: 情境二 (去到 /scenario/studentfeud)

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


/scenario/[name]/[uuid]
這裡開始有個 hook 管理整個遊戲狀態

互動流程
“init” 使用者選擇
“intro” 
	設計得像是 rpg 的
三張 圖片與對應的：事件圖
圖片：老師苦惱圖，對應的圖說
按鈕: 開始遊戲 (去到 /chatlist)
按鈕: 返回遊戲列表 (去到 /scenario)
“chat”
這個階段的介面是 聊天室選單與聊天室，讓老師
這個階段有兩個關卡phase1 phase2
“chatlist” 聊天室列表
文案：任務目標、行動建議
圖片：角色大頭貼
文案：角色名稱
文案：聊天室最後訊息文案
按鈕: 聊天室 (去到 /chat)
按鈕: i (事件經過說明)
按鈕: 返回遊戲列表 (去到 /scenario)
“chat” 聊天室
進度條
任務列表按鈕：列點任務目標
文案：任務目標、行動建議
圖片：角色大頭貼
文案：角色名稱
文案：聊天對話內容
文案：溝通技巧提示
按鈕: i (事件經過說明)
按鈕: 返回聊天室列表 (去到 /chatlist)
輸入：對話輸入框
按鈕: 輸入對話
遊戲狀態 “phase1-sectionclose” 單元結算
觸發機制：phase1任務皆完成
顯示
圖表：技能雷達圖
文案：技巧項目
文案：得分
文案：評分說明
按鈕：下一關 (去到 /phase 2)
按鈕：再玩一次 (去到 /phase 1)
按鈕：返回遊戲列表 (去到 /scenario)
遊戲狀態 “phase2-sectionclose” 單元結算
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


