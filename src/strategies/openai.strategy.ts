// openai/strategy.openai.ts

import { IAIModelStrategy } from '../interfaces/ai-model';
import { getBearerAuthHeader } from '../utilities/auth.utility';
import { ExtensionContext } from 'vscode';
import { OpenAIModelListResponse } from '../types/openai';
import { Output } from '../utilities/output.utility';
import { 
    ChatCompletionOptions, 
    LLMModelListResponse, 
    ChatCompletionResponse 
} from '../types/chat';
import { 
    LLM_API_KEY, 
    LLM_API_URL 
} from '../constants/constants';


export class OpenAIStrategy implements IAIModelStrategy{
    // https://platform.openai.com/docs/api-reference/introduction

    private output: Output = Output.getInstance();
    private context: ExtensionContext;
    private readonly url: string;
    readonly name: string = 'OpenAI';

    /**
     * 
     * @param context 
     */
    constructor(context: ExtensionContext){
        this.output.info('OpenAI initialising...');
        this.context = context;
        const url = this.context.globalState.get<string>(LLM_API_URL);
        if (!url) {
            this.output.error('Missing OpenAI configuration URL');
        }
        this.url = url!;
        this.output.info('OpenAI initialised');
    }

    /**
     * 
     * @param options 
     * @returns 
     */
    async promptAi(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
        const METHOD: string = 'POST';
        const completionsEndpoint = new URL('v1/chat/completions', this.url).toString();

        this.output.info(`Executing ${METHOD} ${completionsEndpoint}`);

        try {
            const response = await fetch(completionsEndpoint, {
                method: METHOD,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await this.context.secrets.get(LLM_API_KEY)}`,
                },
                body: JSON.stringify({
                    model: options.model,
                    messages: options.messages,
                    temperature: options.temperature ?? 0.7,
                    max_tokens: options.max_tokens ?? 1024,
                    stream: options.stream ?? false,
                }),
            });

            this.checkResponse(response);

            const messages: ChatCompletionResponse = await response.json();

            this.output.info(`Response ${response.status}`);

            return {
                object: 'chat.completion',
                id: messages.id,
                model: messages.model,
                created: messages.created,
                choices: messages.choices.map(choice => ({
                    index: choice.index,
                    message: choice.message,
                    finish_reason: choice.finish_reason,
                })),
                usage: messages.usage
            };
        } catch (error) {
            this.handleError('Failed to get response from OpenAI', error);
        }
    }

    /**
     * 
     * @returns 
     */
    async getLlmModels(): Promise<LLMModelListResponse> {
        const METHOD: string = 'GET';
        const modelsEndpoint = new URL('v1/models', this.url).toString();

        this.output.info(`Executing ${METHOD} ${modelsEndpoint}`);

        try {
            const response = await fetch(modelsEndpoint, { 
                method: METHOD,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await this.context.secrets.get(LLM_API_KEY)}`,
                }, 
            });

            this.checkResponse(response);

            const data: OpenAIModelListResponse = await response.json();
            const models: string[] = data.data.map(model => model.id);
            return { models };
        } catch (error) {
            this.handleError('Failed to fetch models from OpenAI', error);
        }
    }

    /**
     * 
     * @param response 
     */
    private async checkResponse(response: Response) {
        if (!response.ok) {
            const error = await response.text();
            this.handleError('OpenAI API error', error);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            const text = await response.text();
            this.handleError('Expected JSON but got', text);
        }
    }

    private handleError(message: string, error: unknown): never {
        const errorMessage = `${message}: ${String(error)}`;
        this.output.addLine(errorMessage);
        this.output.error(errorMessage);
        throw new Error(errorMessage);
    }
}