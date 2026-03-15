import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'

export function getLLMModel() {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })
    return google('gemini-2.5-flash')
  }

  if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    return openai('gpt-5-mini')
  }

  throw new Error('No LLM API key configured. Set GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY.')
}

export const googleProviderOptions = {
  google: {
    thinkingConfig: { thinkingBudget: 0 },
  },
}
