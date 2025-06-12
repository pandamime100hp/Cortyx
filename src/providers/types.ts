//providers/types.ts

export interface ChatCompletionResponse {
  // Unique identifier of the response
  id: string;

  // Object type identifier (optional, provider-specific) 
  object?: string;

  // The model used to generate the response
  model: string;

  // Timestamp or unix epoch when the response was created
  created?: number;

  // The generated chat messages or completions
  choices: ChatCompletionChoice[];

  // Token usage statistics if available (prompt tokens, completion tokens, total tokens)
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatMessage {
  // Who sent this message (e.g. 'system', 'user', 'assistant')
  role: 'system' | 'user' | 'assistant';

  // The actual text content
  content: string;
}

export interface ChatCompletionChoice {
  // Index of this choice in the response (usually 0-based)
  index: number;

  // The actual chat message or text generated
  message: ChatMessage;

  // Reason why the completion ended (e.g. stop sequence, max tokens, etc)
  finish_reason?: string;
}

export interface ChatCompletionOptions {
  // Model to use for completion
  model: string;

  // Array of messages forming the conversation 
  messages: ChatMessage[];

  // Sampling temperature, controls randomness 
  temperature?: number;

  // Maximum number of tokens to generate 
  max_tokens?: number;

  // Whether to stream the response tokens (optional) 
  stream?: boolean;
}

export interface LLMModelListResponse {
  // List of available model IDs/names
  models: string[],
}