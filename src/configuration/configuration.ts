// configuration/configuration.ts

import { ExtensionContext } from "vscode";

import { 
    LLM_PROVIDER,
    LLM_API_URL,
    LLM_API_KEY
} from '../constants/constant';
import { 
    showInputBox, 
    showQuickPick 
} from '../utilities/input-helpers.utility';
import { OpenAIStrategy } from "../strategies/openai.strategy";
import { IAIModelStrategy } from "../interfaces/ai-model";
import { Output } from "../utilities/output.utility";
import { AIModelContext } from "../context/ai-model-context";


export class Configuration{
    private readonly LLM_PROVIDERS: string[] = ['OpenAI', 'Ollama'];
    private readonly output: Output;
    private context: ExtensionContext;
    provider: string | undefined;
    url: string | undefined;

    private models: { [key: string]: new (context: ExtensionContext) => IAIModelStrategy } = {
        OpenAI: OpenAIStrategy,
        // Ollama: OllamaStrategy
    };

    /**
     * 
     * @param context 
     */
    constructor(context: ExtensionContext) {
        this.output = Output.getInstance();
        this.output.info('Configuration initialising...')

        this.context = context;
        this.provider = context.globalState.get(LLM_PROVIDER);
        this.url = context.globalState.get(LLM_API_URL);
        
        this.output.info('Configuration initialised')
    }

    /**
     * 
     */
    async configure() {
        if (!this.provider) {
            await this.configureLlmProvider();
        }

        if (!this.url) {
            await this.configureUrl();
        }

        // if (!await this.context.secrets.get(LLM_API_KEY)) {
        //     await this.configureKey();
        // }
    }

    /**
     * 
     * @returns 
     */
    getModel(): AIModelContext {
        const Model = this.models[this.provider ?? ''];
        if (!Model) {
            this.output.error(`There is no strategy for the provider ${this.provider}`)
            throw new Error(`There is no strategy for the provider ${this.provider}`);
        }
        return new AIModelContext(new Model(this.context));
    }

    /**
     * 
     */
    async configureLlmProvider() {
        const PLACEHOLDER: string = 'Select the LLM provider';
        const ERROR_MSG: string = 'No LLM provider was chosen';

        const llmProviderSelected: string | undefined = await showQuickPick(
            PLACEHOLDER, this.LLM_PROVIDERS, ERROR_MSG
        );

        if (llmProviderSelected) {
            await this.context.globalState.update(LLM_PROVIDER, llmProviderSelected);
            this.provider = llmProviderSelected;
        }
    }

    /**
     * 
     */
    async configureUrl() {
        const PROMPT: string = 'Input the LLM provider API URL';
        const SECRET: boolean = false;
        const VALIDATION: string = '';
        const VALIDATION_MSG = 'API URL cannot be empty';
        const ERROR_MSG = 'No API URL provided';

        const llmApiUrl: string | undefined = await showInputBox(
            PROMPT, SECRET, VALIDATION, VALIDATION_MSG, ERROR_MSG
        );

        if (llmApiUrl) {
            await this.context.globalState.update(LLM_API_URL, llmApiUrl);
            this.url = llmApiUrl;
        }
    }

    /**
     * 
     */
    async configureKey() {
        const PROMPT: string = 'Input the LLM provider API key';
        const SECRET: boolean = true;
        const VALIDATION: string = '';
        const VALIDATION_MSG = 'API key cannot be empty';
        const ERROR_MSG = 'No API key provided';

        const llmApiKey: string | undefined = await showInputBox(
            PROMPT, SECRET, VALIDATION, VALIDATION_MSG, ERROR_MSG
        );

        if (llmApiKey) {
            await this.context.secrets.store(LLM_API_KEY, llmApiKey);
        }
    }
}