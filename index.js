const getGeminiResponse = (function () {
    let conversationHistory = [];
    let session = null;

    return async function (userPrompt) {
        if (!session) {
            const canCreate = await window.ai.canCreateTextSession();

            if (canCreate === "no") {
                console.log("Gemini Nano は利用できません");
                return;
            }

            session = await window.ai.createTextSession();
        }

        conversationHistory.push({ role: "user", content: userPrompt });

        // 文脈を保持したプロンプトを作成
        const contextPrompt = conversationHistory.map(entry => entry.content).join('\n');
        const result = await session.prompt(contextPrompt);

        conversationHistory.push({ role: "assistant", content: result });
        console.log(`YOU: ${userPrompt}`);
        console.log(`NANO: ${result}`);
    };
})();

/* 使用例
getGeminiResponse("奈良で有名な寺院は？").then(finalResponse => {
    // => "興福寺、東大寺、唐招提寺"
});

getGeminiResponse("このなかで一番有名なのは？").then(finalResponse => {
    // => "東大寺"
});

getGeminiResponse("理由は何ですか？").then(finalResponse => {
    // => "759年からの歴史があるからです"
});

*/
