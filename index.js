async function play_nano(){
    (async () => {
        const canCreate = await window.ai.canCreateTextSession();
    
        if (canCreate === "no") {
            console.log("Gemini Nano は利用できません");
        } else {
            const session = await window.ai.createTextSession();
            let conversationHistory = [];
    
            for (let i = 0; i < 5; i++) { // 5回ループする例
                let userPrompt = prompt("質問を入力してください:");
                conversationHistory.push({ role: "user", content: userPrompt });
    
                // 文脈を保持したプロンプトを作成
                const contextPrompt = conversationHistory.map(entry => `${entry.content}`).join('\n');
                const result = await session.prompt(contextPrompt);
    
                conversationHistory.push({ role: "assistant", content: result });
                console.log(result);
            }
        }
    })();
}
