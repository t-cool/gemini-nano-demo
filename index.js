const GeminiSession = (function () {
    let conversationHistory = [];
    let session = null;

    async function createSession() {
        if (!session) {
            const canCreate = await window.ai.canCreateTextSession();

            if (canCreate === "no") {
                console.log("Gemini Nano は利用できません");
                return;
            }

            session = await window.ai.createTextSession();
        }
    }

    async function getGeminiResponse(userPrompt) {
        await createSession();

        conversationHistory.push({ role: "user", content: userPrompt });

        // 文脈を保持したプロンプトを作成
        const contextPrompt = conversationHistory.map(entry => entry.content).join('\n');
        const result = await session.prompt(contextPrompt);

        conversationHistory.push({ role: "assistant", content: result });
        console.log(`YOU: ${userPrompt}`);
        console.log(`NANO: ${result}`);

        // 最後の返答を返す
        return result;
    }

    function getConversationHistory() {
        // ユーザーとアシスタントのペアを二次元配列に変換
        let historyArray = [];
        for (let i = 0; i < conversationHistory.length; i += 2) {
            if (conversationHistory[i + 1]) {
                historyArray.push([conversationHistory[i].content, conversationHistory[i + 1].content]);
            }
        }
        return historyArray;
    }

    return {
        getGeminiResponse,
        getConversationHistory
    };
})();

/* 使用例
GeminiSession.getGeminiResponse("奈良で有名な寺院は？");
///
YOU: 奈良で有名な寺院は？
NANO:  奈良で有名な寺院は、以下のようなものがあります。
* 奈良東大寺
* 奈良薬師寺
* 奈良金明神
* 奈良正平
* 奈良護法
* 奈良西ノ谷
* 奈良唐招提
///

GeminiSession.getGeminiResponse("このなかで一番有名なのは？");
///
YOU: このなかで一番有名なのは？
VM237:29 NANO:  奈良で最も有名な寺院は、奈良東大寺です。
///

GeminiSession.getGeminiResponse("理由は何ですか？");
///
YOU: 理由は何ですか？
NANO:  奈良で最も有名な寺院は、奈良東大寺です。
東大寺は、奈良時代の聖 徳 一宝 触によって創建されました。
東大寺は、日本の
///

const history = GeminiSession.getConversationHistory();
console.log(history);
///
[
    [
        "奈良で有名な寺院は？",
        " 奈良で有名な寺院は、以下のようなものがあります。\n\n* 奈良東大寺\n* 奈良薬師寺\n* 奈良金明神\n* 奈良正平\n* 奈良護法\n* 奈良西ノ谷\n* 奈良唐招提"
    ],
    [
        "このなかで一番有名なのは？",
        " 奈良で最も有名な寺院は、奈良東大寺です。"
    ],
    [
        "理由は何ですか？",
        " 奈良で最も有名な寺院は、奈良東大寺です。\n理由は何ですか？\n\n奈良東大寺は、奈良市にある寺院です。\n東大寺は、奈良時代の聖 徳 一\n宝 触\nによって創建されました。\n東大寺は、日本の"
    ]
]
///
*/
