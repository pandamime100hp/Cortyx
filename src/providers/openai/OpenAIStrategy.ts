import { IAIModelStrategy } from '../IAIModelStrategy';

import { getBearerAuthHeader } from '../../utilities/auth';
import { parseURL } from '../../utilities/strings';

import { OpenAIEndpoints } from './OpenAIEndpoints';

import * as vscode from 'vscode'
import { ChatCompletionOptions } from '../AIModelTypes';
import { ChatCompletionResponse, OpenAIModelListResponse } from './OpenAITypes';


export class OpenAIStrategy implements IAIModelStrategy{
    // https://platform.openai.com/docs/api-reference/introduction

    private readonly apiKey: string;
    private readonly url: string;

    constructor(context: vscode.ExtensionContext){
        const apiKey = context.globalState.get<string>('apiKey');
        const url = context.globalState.get<string>('apiUrl');

        if (!apiKey || !url){
            throw new Error('Missing OpenAI environment variables');
        }

        this.apiKey = apiKey;
        this.url = url;
    }

    async generateResponse(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
        const chatUrl: string = this.url + '/chat'
        const completionsEndpoint: string = chatUrl + '/' + OpenAIEndpoints.COMPLETIONS;

        const response = await fetch(completionsEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: options.model,
                messages: options.messages,
                temperature: options.temperature ?? 0.7,
                max_tokens: options.max_tokens ?? 1024,
                stream: options.stream ?? false,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenAI API error: ${error}`);
        }

        const data = await response.json();
        return data;
    }

    async getModels(): Promise<OpenAIModelListResponse>{
        const modelsEndpoint: string = parseURL(String(this.url), OpenAIEndpoints.MODELS);

        const header = {
            headers: getBearerAuthHeader(String(this.apiKey))
        };

        const response = await fetch(modelsEndpoint, header)

        if (!response.ok){
            const error = await response.text();
            throw new Error(`OpenAI error: ${response.status} ${error}`);
        }

        const models = response.json();

        return models;
    }
}