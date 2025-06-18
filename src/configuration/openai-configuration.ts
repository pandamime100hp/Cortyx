import { ExtensionContext } from 'vscode';
import { IProviderConfiguration } from '../interfaces/provider-configuration';
import { OpenAIStrategy } from '../strategies/openai.strategy';
import { IAIModelStrategy } from '../interfaces/ai-model';
import { ICommand } from '../interfaces/command';
import { SetOpenAIAPIKey } from '../commands/openai/set-openai-api-key.command';
import { Output } from '../utilities/output.utility';
import { showInputBox } from '../utilities/input-helpers.utility';
import { 
    LLM_API_URL, 
    LLM_API_KEY 
} from '../constants/constants';


/**
 * Class representing the configuration for the OpenAI provider.
 * This class handles the initialization and management of the 
 * OpenAI API URL and API key, including user prompts for 
 * configuration.
 */
export class OpenAIConfiguration implements IProviderConfiguration {
    readonly context: ExtensionContext;
    output: Output = Output.getInstance();

    url: string | undefined;
    /* eslint-disable no-undef */
    private apiKey: Thenable<string | undefined> | undefined;

    /**
     * Creates an instance of OpenAIConfiguration.
     * @param context The context provided by the VS Code extension API.
     */
    constructor(context: ExtensionContext) {
        this.output.info('OpenAIConfiguration initialising...');
        this.context = context;

        this.url = context.globalState.get(LLM_API_URL);
        this.apiKey = context.secrets.get(LLM_API_KEY);
        this.output.info('OpenAIConfiguration initialised');
    }

    /**
     * Configures the OpenAI API settings.
     * Prompts the user to enter the API key and URL if they are not already set.
     * @returns A promise that resolves when configuration is complete.
     */
    async configure() {
        if (!this.apiKey) {
            await this.configureApiKey();
        }

        if (!this.url) {
            await this.configureUrl();
        }
    }

    /**
     * Gets the AI model strategy associated with OpenAI.
     * @returns An instance of OpenAIStrategy.
     */
    getStrategy(): IAIModelStrategy {
        return new OpenAIStrategy(this.context);
    }

    /**
     * Retrieves a list of commands associated with OpenAI configuration.
     * @returns An array of commands for managing OpenAI settings.
     */
    getCommands(): ICommand[] {
        return [
            new SetOpenAIAPIKey(this.context)
        ];
    }

    /**
     * Prompts the user to input the LLM provider API URL and updates the global state.
     * @returns A promise that resolves when the URL has been configured.
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
     * Prompts the user to input the LLM provider API key and updates the global state.
     * @returns A promise that resolves when the API key has been configured.
     */
    async configureApiKey() {
        const PROMPT: string = 'Input the LLM provider API key';
        const SECRET: boolean = true;
        const VALIDATION: string = '';
        const VALIDATION_MSG = 'API key cannot be empty';
        const ERROR_MSG = 'No API key provided';

        const llmApiKey: string | undefined = await showInputBox(
            PROMPT, SECRET, VALIDATION, VALIDATION_MSG, ERROR_MSG
        );

        if (llmApiKey) {
            await this.context.globalState.update(LLM_API_KEY, llmApiKey);
            this.apiKey = this.context.globalState.get(LLM_API_KEY);
            this.output.warn(`API key set`);
        }
    }
}