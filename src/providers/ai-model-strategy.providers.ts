// providers/ai-model-context.providers.ts

import { 
    ChatCompletionOptions, 
    ChatCompletionResponse,
    LLMModelListResponse, 
} from "./types";

/**
 * Defines the interface for an AI model strategy.
 */
export interface AIModelStrategy {
    readonly name: string;

    /**
     * Sends a chat completion request to the LLM provider.
     * 
     * @param options Options for the chat completion including messages, model, etc.
     * @returns A promise that resolves with the completion response.
     */
    promptAi(options: ChatCompletionOptions): Promise<ChatCompletionResponse>;

    /**
     * Retrieves a list of available models from the LLM provider.
     * 
     * @returns A promise that resolves with the list of available models.
     */
    getLlmModels(): Promise<LLMModelListResponse>;
}