const apiKey ="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";  // Replace with your actual Groq API Key
const model = "llama3-8b-8192";  // Updated to LLaMA 3 (8B-8192)

async function fetchRecommendation() {
    const urlParams = new URLSearchParams(window.location.search);
    const mood = urlParams.get("mood");
    const location = urlParams.get("location");

    if (!mood || !location) {
        document.getElementById("result").innerHTML = "<p class='error'>Invalid input. Please try again.</p>";
        return;
    }

    document.getElementById("loading").style.display = "block";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: "You are a travel expert. Give short, engaging travel suggestions based on mood and location." },
                    { role: "user", content: `I feel ${mood} and I am in ${location}. Recommend a travel spot in one short paragraph.` }
                ],
                max_tokens: 50  // Limits response length
            })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorDetails.error?.message || "Invalid request format"}`);
        }

        const result = await response.json();
        document.getElementById("loading").style.display = "none";

        if (result.choices && result.choices.length > 0) {
            document.getElementById("result").innerHTML = `<p class='output'>🌍 ${result.choices[0].message.content}</p>`;
        } else {
            document.getElementById("result").innerHTML = `<p class='error'>No response from AI. Try again!</p>`;
        }
    } catch (error) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("result").innerHTML = `<p class='error'>Error: ${error.message}</p>`;
    }
}

document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "index.html";
});

window.onload = fetchRecommendation;

