// openai/strategy.openai.ts

import { IAIModelStrategy } from '../interfaces/ai-model';
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


/**
 * Class representing the OpenAI strategy for AI model interactions.
 * Implements the IAIModelStrategy interface.
 */
export class OpenAIStrategy implements IAIModelStrategy{
    // https://platform.openai.com/docs/api-reference/introduction

    private output: Output = Output.getInstance();
    private context: ExtensionContext;
    private readonly url: string;
    readonly name: string = 'OpenAI';

    /**
     * Creates an instance of OpenAIStrategy.
     * @param context - The VSCode extension context.
     * @throws Will throw an error if the OpenAI URL is not configured.
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
     * Sends a prompt to the OpenAI API and retrieves the response.
     * @param options - The options for the chat completion including model, messages, temperature, and max tokens.
     * @returns A promise that resolves to the ChatCompletionResponse from OpenAI.
     */
    async promptAi(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
        const HTTP_METHOD: string = 'POST';
        const completionsEndpoint = new URL('v1/chat/completions', this.url).toString();

        this.output.info(`Executing ${HTTP_METHOD} ${completionsEndpoint}`);

        const headers = await this.createHeaders();

        const body = JSON.stringify({
            model: options.model,
            messages: options.messages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.max_tokens ?? 1024,
            stream: options.stream ?? false,
        });

        const data: ChatCompletionResponse = await this.executeFetch(HTTP_METHOD, completionsEndpoint, headers, body);

        return this.formatResponse(data)
    }

    /**
     * Retrieves the list of available LLM models from the OpenAI API.
     * @returns A promise that resolves to a list of LLM models.
     */
    async getLlmModels(): Promise<LLMModelListResponse> {
        const HTTP_METHOD: string = 'GET';
        const modelsEndpoint = new URL('v1/models', this.url).toString();

        this.output.info(`Executing ${HTTP_METHOD} ${modelsEndpoint}`);

        const headers = await this.createHeaders();

        const data: OpenAIModelListResponse = await this.executeFetch(HTTP_METHOD, modelsEndpoint, headers);
        const models: string[] = data.data.map(model => model.id);
        return { models };
    }

    /**
     * Checks the response from the OpenAI API for errors.
     * @param response - The response object from the fetch call.
     * @throws Will throw an error if the response is not OK or if the content type is not JSON.
     */
    private async checkResponse(response: Response): Promise<void> {
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

    /**
     * Creates the headers required for an API request.
     *
     * @returns A promise that resolves to an object containing the 'Content-Type' and 'Authorization' headers.
     */
    private async createHeaders(): Promise<Record<string, string>> {
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await this.context.secrets.get(LLM_API_KEY)}`,
        };
    }

    /**
     * Formats the raw response from the chat completion API into a standardized structure.
     *
     * @param response - The raw response from the API that needs to be formatted.
     * @returns The formatted response object.
     */
    private formatResponse(response: ChatCompletionResponse): ChatCompletionResponse {
         return {
            object: 'chat.completion',
            id: response.id,
            model: response.model,
            created: response.created,
            choices: response.choices.map(choice => ({
                index: choice.index,
                message: choice.message,
                finish_reason: choice.finish_reason,
            })),
            usage: response.usage
        };
    }

    /**
     * Executes a fetch request to the specified endpoint with the given method, headers, and body.
     *
     * @param method - The HTTP method (GET, POST, etc.) to use for the request.
     * @param endpoint - The URL endpoint to which the request is made.
     * @param header - The headers to include in the request.
     * @param body - The optional request body to send with the request.
     * @returns A promise that resolves to the JSON response from the fetch request.
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private async executeFetch(method: string, endpoint: string, header: Record<string, string>, body: string | null = null): Promise<any> {
        const init = { 
            method: method,
            headers: header, 
            body: body
        };

        try {
            const response: Response = await fetch(endpoint, init);

            this.checkResponse(response);

            return await response.json();
        } catch (error) {
            this.handleError('Failed to fetch models from OpenAI', error);
        }
    }

    /**
     * Handles errors by logging an error message and throwing a new error.
     *
     * @param message - A message describing the error context.
     * @param error - The caught error object or message.
     * @returns This function does not return a value; it always throws an error.
     */
    private handleError(message: string, error: unknown): never {
        const errorMessage = `${message}: ${String(error)}`;
        this.output.add(errorMessage, true);
        this.output.error(errorMessage);
        throw new Error(errorMessage);
    }
}