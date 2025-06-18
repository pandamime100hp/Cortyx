import { ExtensionContext } from "vscode";
import { LLM_PROVIDER } from '../constants/constants';
import { showQuickPick } from '../utilities/input-helpers.utility';
import { Output } from "../utilities/output.utility";
import { AIModelContext } from "../context/ai-model-context";
import { IProviderConfiguration } from "../interfaces/provider-configuration";
import { OpenAIConfiguration } from "./openai-configuration";
import { ICommand } from "../interfaces/command";


export class Configuration{
    private readonly LLM_PROVIDERS: string[] = ['OpenAI'];
    private readonly output: Output = Output.getInstance();
    private context: ExtensionContext;
    providerConfiguration: IProviderConfiguration | undefined;
    provider: string | undefined;

    /* eslint-disable no-unused-vars */
    private providerConfigurations: { [key: string]: new (context: ExtensionContext) => IProviderConfiguration } = {
        OpenAI: OpenAIConfiguration,
        // Ollama: OllamaStrategy
    };

    /**
     * Creates an instance of Configuration.
     * @param context - The extension context provided by VS Code.
     */
    constructor(context: ExtensionContext) {
        this.output.info('Configuration initialising...')
        this.context = context;
        this.provider = context.globalState.get(LLM_PROVIDER);
        this.output.info('Configuration initialised')
    }

    /**
     * Configures the LLM provider if not already set, and initializes the provider configuration.
     */
    async configure() {
        if (!this.provider) {
            await this.configureLlmProvider();
        }

        this.providerConfiguration = this.getProviderConfiguration();
        this.providerConfiguration.configure();
    }

    /**
     * Retrieves the provider configuration based on the selected provider.
     * @returns The provider configuration instance.
     * @throws Will throw an error if there is no strategy for the selected provider.
     */
    getProviderConfiguration(): IProviderConfiguration {
        const Provider = this.providerConfigurations[this.provider ?? ''];
        if (!Provider) {
            this.output.error(`There is no strategy for the provider ${this.provider}`)
            throw new Error(`There is no strategy for the provider ${this.provider}`);
        }
        return new Provider(this.context);
    }

    /**
     * Retrieves the AI model context based on the current provider configuration.
     * @returns The AI model context.
     * @throws Will throw an error if the provider configuration is not set.
     */
    getModel(): AIModelContext {
        if (!this.providerConfiguration) {
            throw new Error("Provider configuration has not been set");
        }
        return new AIModelContext(this.providerConfiguration.getStrategy());
    }

    /**
     * Retrieves the command list provided by the current provider configuration.
     * @returns An array of commands.
     * @throws Will throw an error if the provider configuration is not set.
     */
    getCommands(): ICommand[] {
        if (!this.providerConfiguration) {
            throw new Error("Provider configuration is not set");
        }
        return this.providerConfiguration.getCommands();
    }

    /**
     * Prompts the user to select a LLM provider and updates the global state with the selection.
     * @throws Will throw an error if no LLM provider is chosen.
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
}