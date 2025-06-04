import * as vscode from 'vscode'
import { OpenAIStrategy } from './providers/openai/OpenAIStrategy';
import { buildFileTree } from './utilities/file_structure';
import { OpenAIModelListResponse } from './providers/openai/OpenAITypes';
import { ChatCompletionOptions } from './providers/AIModelTypes';


export const aiOutputChannel = vscode.window.createOutputChannel('Cortyx AI');


const COMMANDS = {
    SET_ACTIVATE: 'cortyx.activate',
    SET_LLM: 'cortyx.set_llm',
    SET_API_URL: 'cortyx.set_api_url',
    SET_API_KEY: 'cortyx.set_api_key',
    SET_MODEL: 'cortyx.set_llm_model',
    GET_MODELS: 'cortyx.get_models',
    PROMPT_AI: 'cortyx.prompt_ai',
    LIST_PROJECT_FILES: 'cortyx.list_project_files',
};


export async function activate(context: vscode.ExtensionContext) {
    clearAndShowOutputChannel('🤖 AI Initialised!');

    const commands = [
        registerCommand(context, COMMANDS.SET_ACTIVATE),
        registerCommand(context, COMMANDS.SET_LLM),
        registerCommand(context, COMMANDS.SET_API_URL),
        registerCommand(context, COMMANDS.SET_API_KEY),
        registerCommand(context, COMMANDS.SET_MODEL),
        registerCommand(context, COMMANDS.GET_MODELS),
        registerCommand(context, COMMANDS.LIST_PROJECT_FILES),
        registerCommand(context, COMMANDS.PROMPT_AI),
    ]

    context.subscriptions.push(...commands);

    initialiseSettings(context);

    console.log('✅ Extension "Cortyx" is now active!');
}

async function initialiseSettings(context: vscode.ExtensionContext) {
    await ensureSetting(context, 'llm', COMMANDS.SET_LLM);
    await ensureSetting(context, 'apiUrl', COMMANDS.SET_API_URL);
    await ensureSetting(context, 'apiKey', COMMANDS.SET_API_KEY);
    await ensureSetting(context, 'model', COMMANDS.SET_MODEL);
}

async function ensureSetting(context: vscode.ExtensionContext, key: string, command: string) {
    if (!context.globalState.get(key))
        await vscode.commands.executeCommand(command);
}

function registerCommand(context: vscode.ExtensionContext, command: string): vscode.Disposable {
    switch (command) {
        case COMMANDS.GET_MODELS:
            return getModels(context);
        case COMMANDS.PROMPT_AI:
            return promptAI(context);
        case COMMANDS.LIST_PROJECT_FILES:
            return getFileTree();
        case COMMANDS.SET_MODEL:
            return setModel(context);
        case COMMANDS.SET_ACTIVATE:
            return setActivate(context);
        case COMMANDS.SET_LLM:
            return setLlm(context);
        case COMMANDS.SET_API_URL:
            return setApiUrl(context);
        case COMMANDS.SET_API_KEY:
            return setApiKey(context);
        default:
            throw new Error(`Unknown command: ${command}`);
    }
}

function clearAndShowOutputChannel(message: string) {
    aiOutputChannel.clear();
    aiOutputChannel.show(true);
    aiOutputChannel.appendLine(message);
}

function getModels(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.GET_MODELS, async () => {
        const strategy = new OpenAIStrategy(context);

        try{
            const models: OpenAIModelListResponse = await strategy.getModels();
            context.globalState.update('models', models.data)

            vscode.window.showInformationMessage(`Models: ${models.data.length}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch models: ${error}`);
            return; // Exit the function on error to prevent further execution
        }
    });
}

function promptAI(context: vscode.ExtensionContext) {
    return vscode.commands.registerCommand(COMMANDS.PROMPT_AI, async () => {
        const strategy = new OpenAIStrategy(context);

        const prompt: string | undefined = await vscode.window.showInputBox({
            prompt: 'Enter your AI prompt',
            password: false
        });

        const model = context.globalState.get('model') || undefined
        if (!model){
            vscode.window.showErrorMessage('No LLM model is set');
            return;
        }

        const BASE_PROMPT: string = 'You are an experienced Microsoft software developer with years of experience in web development. You are familiar with the best practices and standards set out by MS. You have been tasked with helping me on my project. Review the below input and provide critical feedback giving justifications:\n'

        const options: ChatCompletionOptions = {
            model: String(model),
            messages: [{role: 'user', content: String(BASE_PROMPT + prompt)}]
        }

        clearAndShowOutputChannel('🤖 Waiting for AI Response...');

        try {
            const response = await strategy.generateResponse(options)

            clearAndShowOutputChannel('🤖 AI Response:\n' + response.choices[0].message.content);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch response: ${error}`);
            clearAndShowOutputChannel(`🤖 Failed to fetch response: ${error}`);
            return;
        }
        
    });
}

function getFileTree(): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.LIST_PROJECT_FILES, async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace is open');
            return;
        }

        const fileTree = await buildFileTree(workspaceFolder.uri.fsPath, workspaceFolder.uri.fsPath);
        console.log(JSON.stringify(fileTree, null, 2));
        vscode.window.showInformationMessage('Project files listed in console.');
    });
}

function setModel(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.SET_MODEL, async () => {
        const strategy = new OpenAIStrategy(context);

        try {
            const models = await strategy.getModels();

            const modelValue = await vscode.window.showQuickPick(
                models.data.map(model => model.id),
                {
                    placeHolder: 'Select the model to use from the selected LLM provider',
                    canPickMany: false
                }
            );
            await context.globalState.update('model', modelValue);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch models: ${error}`);
            return;
        }
    });
}

function setActivate(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.SET_ACTIVATE, () => {
        vscode.window.showInformationMessage(`LLM provider set to ${context.globalState.get('llm')}`);
    });
}

function setLlm(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.SET_LLM, async () => {
        const llm: string | undefined = await context.globalState.get('llm');

        if (!llm) {
            const llmValue = await vscode.window.showQuickPick(
                ['OpenAI', 'Local Model'],
                {
                    placeHolder: 'Select your preferred LLM provider',
                    canPickMany: false
                }
            );
            await context.globalState.update('llm', llmValue);
            vscode.window.showInformationMessage(`LLM provider set to ${llm}`);
        } else {
            vscode.window.showWarningMessage('No LLM selected. The extension may not work correctly.');
        }
    });
}


function setApiUrl(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.SET_API_URL, async () => {
        const apiUrl: string | undefined = await context.globalState.get('apiUrl');

        if (!apiUrl) {
            const apiUrlValue: string | undefined = await vscode.window.showInputBox({
                prompt: 'Enter the API base URL',
                password: false,
                value: 'e.g. https://api.openai.com/v1'
            });
            await context.globalState.update('apiUrl', apiUrlValue);
            vscode.window.showInformationMessage(`LLM provider API URL set to ${apiUrl}`);
        } else {
            vscode.window.showWarningMessage('No API URL provided. The extension may not work correctly.');
        }
    });
}


function setApiKey(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.SET_API_KEY, async () => {
        const apiKey: string | undefined = await context.globalState.get('apiKey');

        if (!apiKey) {
            const apiKeyValue: string | undefined = await vscode.window.showInputBox({
                prompt: 'Enter the API key',
                password: true,
                value: '********'
            });
            await context.globalState.update('apiKey', apiKeyValue);
            vscode.window.showInformationMessage('LLM provider API key set');
        } else {
            vscode.window.showWarningMessage('No API key provided. The extension may not work correctly.');
        }
    });
}


export function deactivate() {
    console.log('🛑 Extension "Cortyx" is now deactivated.');
}
