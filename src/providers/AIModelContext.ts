//AIModelContext.ts

import { IAIModelStrategy } from "./IAIModelStrategy";
import { ChatCompletionOptions } from "./AIModelTypes";
import { ChatCompletionResponse } from "./openai/OpenAITypes";

export class AIModelContext {
    private strategy: IAIModelStrategy;

    constructor(strategy: IAIModelStrategy){
        this.strategy = strategy;
    }

    setStrategy(strategy: IAIModelStrategy){
        this.strategy = strategy;
    }

    async ask(options: ChatCompletionOptions): Promise<ChatCompletionResponse>{
        return await this.strategy.generateResponse(options);
    }
}