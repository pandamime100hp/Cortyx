import { IAIModelStrategy } from '../IAIModelStrategy';

import { getBearerAuthHeader } from '../../utilities/auth';
import { parseURL } from '../../utilities/strings';

import { OpenAIEndpoints } from './OpenAIEndpoints';

import * as vscode from 'vscode'


export class OpenAIStrategy implements IAIModelStrategy{
    // https://platform.openai.com/docs/api-reference/introduction

    private readonly apiKey;
    private readonly url;

    constructor(context: vscode.ExtensionContext){
        const apiKey = context.globalState.get('apiToken');
        const url = context.globalState.get('apiUrl');


        console.log(apiKey);
        console.log(typeof(apiKey));

        if (!apiKey || !url){
            throw new Error('Missing OpenAI environment variables.');
        }

        this.apiKey = apiKey;
        this.url = url;
    }

    async generateResponse(prompt: string): Promise<string> {
        // const completionsEndpoint: string = parseURL(this.url, OpenAIEndpoints.COMPLETIONS);

        throw new Error('Method not implemented.');
    }

    async getModels(): Promise<string>{
        const modelsEndpoint: string = parseURL(String(this.url), OpenAIEndpoints.MODELS);

        const header = {
            headers: getBearerAuthHeader(String(this.apiKey))
        };

        const response = await fetch(modelsEndpoint, header)

        if (!response.ok){
            const error = await response.text();
            throw new Error(`OpenAI error: ${response.status} ${error}`);
        }

        const data = await response.json();

        return data;
    }
}