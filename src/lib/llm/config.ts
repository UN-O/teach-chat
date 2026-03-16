import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'

export function getDialogueLLMModel() {
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        const google = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        })
        return google('gemini-3-flash-preview') // 暫時設定一樣，因為 pro 一定要思考
    }

    if (process.env.OPENAI_API_KEY) {
        const openai = createOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        })
        return openai('gpt-5-mini')
    }

    throw new Error('No LLM API key configured. Set GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY.')
}

export function getTaskLLMModel() {
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        const google = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        })
        return google('gemini-3-flash-preview')
    }

    if (process.env.OPENAI_API_KEY) {
        const openai = createOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        })
        return openai('gpt-5-mini')
    }

    throw new Error('No LLM API key configured. Set GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY.')
}

export function getLLMModel() {
    return getDialogueLLMModel()
}

export const googleProviderOptions = {
    google: {
        thinkingConfig: { thinkingBudget: 0 },
    },
}
