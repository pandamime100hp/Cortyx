//providers/context.providers.ts

import { Output } from "../utilities/output.utility";
import { IAIModelStrategy } from "../interfaces/ai-model";
import { 
    ChatCompletionOptions, 
    ChatCompletionResponse, 
    LLMModelListResponse 
} from "../types/chat";



export class AIModelContext {
    private readonly output: Output;
    private strategy: IAIModelStrategy;

    /**
     * 
     * @param strategy 
     */
    constructor(strategy: IAIModelStrategy){
        this.output = Output.getInstance();
        this.strategy = strategy;
    }

    /**
     * 
     * @param strategy 
     */
    setStrategy(strategy: IAIModelStrategy){
        this.strategy = strategy;
    }

    /**
     * @returns Name of the strategy used.
     */
    getProviderName(): string {
        return this.strategy.name;
    }

    /**
     * Sends a prompt to the configured AI model strategy and returns the response.
     *
     * @param options Options including messages and model info.
     * @returns A chat completion response.
     */
    async promptAi(options: ChatCompletionOptions): Promise<ChatCompletionResponse>{
        this.output.addLine(`Generating response with strategy: ${this.strategy.constructor.name}`);
        this.output.info(`Generating response with strategy: ${this.strategy.constructor.name}`);
        return await this.strategy.promptAi(options);
    }

    /**
     * 
     * @returns 
     */
    async getLlmModels(): Promise<LLMModelListResponse> {
        this.output.addLine('Getting all available LLM models');
        this.output.info('Getting all available LLM models');
        return await this.strategy.getLlmModels();
    }
}