import { IAIModelStrategy } from '../IAIModelStrategy';

import { getBearerAuthHeader } from '../../utilities/auth';
import { parseURL } from '../../utilities/strings';

import { OpenAIEndpoints } from './OpenAIEndpoints';


export class OpenAIStrategy implements IAIModelStrategy{
    // https://platform.openai.com/docs/api-reference/introduction

    private readonly apiKey: string;
    private readonly url: string;

    constructor(){
        const apiKey = process.env.OPENAI_SA_API_KEY;
        const url = process.env.OPENAI_URL;

        if (!apiKey || !url){
            throw new Error('Missing OpenAI environment variables.');
        }

        this.apiKey = apiKey;
        this.url = url;
    }

    async generateResponse(prompt: string): Promise<string> {
        const completionsEndpoint: string = parseURL(this.url, OpenAIEndpoints.COMPLETIONS);

        throw new Error('Method not implemented.');
    }

    async getModels(): Promise<string>{
        const modelsEndpoint: string = parseURL(this.url, OpenAIEndpoints.MODELS);

        const response = await fetch(modelsEndpoint)

        if (!response.ok){
            const error = await response.text();
            throw new Error(`OpenAI error: ${response.status} ${error}`);
        }

        const data = await response.json();
        return data;
    }
}