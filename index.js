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

        // ユーザのプロンプトを保存
        let userEntry = { role: "user", content: userPrompt };
        
        // 文脈を保持したプロンプトを作成
        const contextPrompt = conversationHistory.flatMap(pair => [pair[0].content, pair[1].content]).join('\n') + '\n' + userPrompt;
        const result = await session.prompt(contextPrompt);

        // アシスタントの応答を保存
        let assistantEntry = { role: "assistant", content: result };
        
        // ペアをconversationHistoryに追加
        conversationHistory.push([userEntry, assistantEntry]);

        console.log(`YOU: ${userPrompt}`);
        console.log(`NANO: ${result}`);

        // 返答を返す
        return conversationHistory;
    }

    function getConversationHistory() {
        return conversationHistory;
    }

    return {
        getGeminiResponse,
        getConversationHistory
    };
})();

/* 使用例
GeminiSession.getGeminiResponse("奈良で有名な寺院は？");
// => "興福寺、東大寺、唐招提寺"

GeminiSession.getGeminiResponse("一番のおすすめは？");
// => "東大寺"

// 会話の記録を取得
setTimeout(() => {
    const history = GeminiSession.getConversationHistory();
    console.log(JSON.stringify(history, null, 2));
}, 1000);
*/
