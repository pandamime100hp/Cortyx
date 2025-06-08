//IAIModelStrategy.ts

import { ChatCompletionOptions } from "./AIModelTypes";
import { ChatCompletionResponse, OpenAIModelListResponse } from "./openai/OpenAITypes";

export interface IAIModelStrategy {
    // eslint-disable-next-line no-unused-vars
    generateResponse(options: ChatCompletionOptions): Promise<ChatCompletionResponse>;
    getModels(): Promise<OpenAIModelListResponse>;
}