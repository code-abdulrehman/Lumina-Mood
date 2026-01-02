import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

/**
 * AI MODEL CONFIGURATION
 * We use a prioritized list of models to stay within free tier quotas.
 * Verified Model IDs from Google AI Documentation (Jan 2026).
 */
const MODEL_PRIORITY = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
];

export const getGeminiChatResponse = async (
    apiKey: string,
    moodLabel: string,
    history: ChatMessage[],
    userInput?: string,
    userName?: string | null,
    interests?: string[]
) => {
    // Attempt each model in order of priority
    for (let i = 0; i < MODEL_PRIORITY.length; i++) {
        const activeModelName = MODEL_PRIORITY[i];

        try {
            if (!apiKey) throw new Error("Missing API Key");

            const genAI = new GoogleGenerativeAI(apiKey);

            const systemPrompt = `You are Lumina, a warm and empathetic mood companion.
            The user's name is ${userName || 'friend'}. ${interests && interests.length > 0 ? `They are interested in ${interests.join(', ')}.` : ''}
            The user is currently feeling "${moodLabel}".
            
            INSTRUCTIONS:
            1. Keep responses very short (1-2 sentences).
            2. Be warm, supportive, and never harsh.
            3. Mention or relate to one of their interests if helpful/appropriate for their current mood.
            4. Offer a quick, replyable follow-up.
            5. ALWAYS end with exactly 3 short suggestions/questions in this format:
            [SUGGESTIONS]: Suggestion 1? | Suggestion 2? | Suggestion 3?
            
            No medical advice.`;

            const model = genAI.getGenerativeModel({
                model: activeModelName,
                systemInstruction: systemPrompt
            });

            // SDK history preparation
            let historyForSDK = history
                .filter(msg => msg.text && msg.text.trim().length > 0)
                .map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }],
                }));

            if (historyForSDK.length > 0 && historyForSDK[0].role === 'model') {
                historyForSDK.unshift({
                    role: 'user',
                    parts: [{ text: `I am feeling ${moodLabel}.` }]
                });
            }

            let lastUserMsg = userInput || (historyForSDK.length === 0 ? `I'm feeling ${moodLabel}.` : "Tell me more.");

            if (historyForSDK.length > 0 && historyForSDK[historyForSDK.length - 1].role === 'user') {
                const popped = historyForSDK.pop();
                if (popped) lastUserMsg = popped.parts[0].text;
            }

            const chat = model.startChat({
                history: historyForSDK,
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7,
                }
            });

            const result = await chat.sendMessage(lastUserMsg);
            const response = await result.response;
            const text = response.text();

            if (!text || text.trim().length < 5) {
                throw new Error("Invalid or empty response");
            }

            return text.trim();

        } catch (error: any) {
            const errorMsg = error?.message || "";
            const isQuotaError = errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota');
            const isNotFoundError = errorMsg.includes('404') || errorMsg.includes('not found');
            const hasNextModel = i < MODEL_PRIORITY.length - 1;

            if ((isQuotaError || isNotFoundError) && hasNextModel) {
                console.warn(`### SWITCHING MODEL: ${activeModelName} failed (${errorMsg.includes('429') ? 'Quota' : '404'}). Trying ${MODEL_PRIORITY[i + 1]} ###`);
                continue;
            }

            console.error(`### GEMINI SDK ERROR (Final Attempt: ${activeModelName}) ###`, error?.message || error);

            if (!hasNextModel || (!isQuotaError && !isNotFoundError)) {
                const fallbacks: Record<string, string> = {
                    "default": "I'm right here with you. Let's take a slow breath together. You're doing great. [SUGGESTIONS]: Why do I feel like this? | How can I feel better? | What's a small step I can take?",
                    "Sad": "I hear how heavy things feel. It's okay to not be okay. [SUGGESTIONS]: How can I be kind to myself? | Why is today so hard? | Can we talk about something else?",
                    "Anxious": "Your mind is moving fast. Try counting 5 things you see. [SUGGESTIONS]: How do I stop overthinking? | Can you help me calm down? | Why do I feel so restless?",
                };
                return fallbacks[moodLabel] || fallbacks["default"];
            }
        }
    }

    return "I'm here for you. [SUGGESTIONS]: Tell me more. | Can you help? | What should I do?";
};

export const getGeminiResponse = async (apiKey: string, moodLabel: string, userName?: string | null, interests?: string[]) => {
    return getGeminiChatResponse(apiKey, moodLabel, [], undefined, userName, interests);
};

export const validateApiKey = async (apiKey: string): Promise<{ valid: boolean; error?: string }> => {
    try {
        if (!apiKey) return { valid: false, error: "Please enter an API key." };

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        // Try a very simple, low-token generation
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: "hi" }] }],
            generationConfig: { maxOutputTokens: 5 }
        });

        const response = await result.response;
        if (response.text()) {
            return { valid: true };
        }
        return { valid: false, error: "Could not verify key. Please try again." };
    } catch (error: any) {
        let msg = "Invalid API Key.";
        if (error?.message?.includes('429')) msg = "Quota exceeded or too many requests.";
        if (error?.message?.includes('403')) msg = "Key does not have permission for this model.";
        if (error?.message?.includes('API_KEY_INVALID')) msg = "The API key provided is invalid.";
        return { valid: false, error: msg };
    }
};

export const parseSuggestions = (text: string): { cleanText: string, suggestions: string[] } => {
    if (!text) return { cleanText: '', suggestions: [] };
    const parts = text.split('[SUGGESTIONS]:');
    const cleanText = parts[0].trim();
    const suggestions = parts[1]
        ? parts[1].split('|').map(s => s.trim()).filter(s => s.length > 5)
        : [];
    return { cleanText, suggestions };
};
