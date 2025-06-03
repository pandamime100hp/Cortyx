import { ChatCompletionOptions } from "./AIModelTypes";
import { ChatCompletionResponse } from "./openai/OpenAITypes";

export interface IAIModelStrategy {
    // eslint-disable-next-line no-unused-vars
    generateResponse(options: ChatCompletionOptions): Promise<ChatCompletionResponse>;
}