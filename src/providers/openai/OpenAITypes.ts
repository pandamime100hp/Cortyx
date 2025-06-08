//OpenAITypes.ts

import { ChatMessage } from "../AIModelTypes";

export interface OpenAIModel {
    id: string;
    object: 'model';
    created: number;
    owned_by: string;
}

export interface OpenAIModelListResponse {
    object: 'list';
    data: OpenAIModel[];
}

export interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}