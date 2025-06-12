//openai/types.ts

/**
 * 
 */
export interface OpenAIModel {
    id: string;
    object: 'model';
    created: number;
    owned_by: string;
}

/**
 * 
 */
export interface OpenAIModelListResponse {
    object: 'list';
    data: OpenAIModel[];
}

/**
 * A single message used in the chat completion prompt.
 */
export interface OpenAIChatMessage {
  /**
   * Role of the message author.
   * - system: Sets up initial context
   * - user: The end-user's input
   * - assistant: The LLM's response
   */
  role: 'system' | 'user' | 'assistant';

  /**
   * Content of the message.
   */
  content: string;
}

/**
 * 
 */
export interface OpenAIChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: {
    index: number;
    message: OpenAIChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}