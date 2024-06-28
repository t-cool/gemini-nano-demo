const canCreate = await window.ai.canCreateTextSession();

if (canCreate === "no") {
    console.log("Gemini Nano は利用できません");
} else {
    const session = await window.ai.createTextSession();
    const result = await session.prompt("What is the Matrix?");
    console.log(result);
}

