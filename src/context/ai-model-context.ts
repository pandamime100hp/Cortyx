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
     * Initializes AIModelContext with a strategy.     
     * @param strategy The strategy to be used for AI model interactions.     
     */  
    constructor(strategy: IAIModelStrategy){
        this.output = Output.getInstance();
        this.strategy = strategy;
    }

    /**     
     * Changes the current strategy.     
     * @param strategy The new strategy to be set.     
     */
    setStrategy(strategy: IAIModelStrategy){
        this.strategy = strategy;
    }

    /**     
     * Returns the name of the current strategy.     
     * @returns Name of the strategy used.     
     */  
    getProviderName(): string {
        return this.strategy.name;
    }

    /**     
     * Sends a prompt to the configured AI model strategy and returns the response.     
     * @param options Options including messages and model info.     
     * @returns A chat completion response.     
     */
    async promptAi(options: ChatCompletionOptions): Promise<ChatCompletionResponse>{
        this.output.add(`Generating response with strategy: ${this.strategy.constructor.name}`, true);
        this.output.info(`Generating response with strategy: ${this.strategy.constructor.name}`);
        return await this.strategy.promptAi(options);
    }

    /**     
     * Retrieves all available LLM models.     
     * @returns A list of available LLM models.
     */
    async getAvailableLlmModels(): Promise<LLMModelListResponse> {
        this.output.add('Getting all available LLM models', true);
        this.output.info('Getting all available LLM models');
        return await this.strategy.getLlmModels();
    }
}