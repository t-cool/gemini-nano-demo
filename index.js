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

GeminiSession.getGeminiResponse("このなかで一番有名なのは？");

GeminiSession.getGeminiResponse("理由は何でfすか？");

const history = GeminiSession.getConversationHistory();
console.log(history);
*/
