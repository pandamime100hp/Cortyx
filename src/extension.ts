import * as vscode from 'vscode'
import { OpenAIStrategy } from './providers/openai/OpenAIStrategy';
import { buildFileTree } from './utilities/file_structure';
import { OpenAIModelListResponse } from './providers/openai/OpenAITypes';
import { ChatCompletionOptions } from './providers/AIModelTypes';


export const aiOutputChannel = vscode.window.createOutputChannel('Cortyx AI');


export async function activate(context: vscode.ExtensionContext) {
    aiOutputChannel.clear(); // Optional: clear old content
    aiOutputChannel.show(true); // Reveal panel, focus = true

    aiOutputChannel.appendLine('🤖 AI Initialised!');


    const commands = [setActivate, setLlm, setApiUrl, setApiKey, setModel, getModels, getFileTree, promptAI]

    commands.forEach(command => {
        context.subscriptions.push(command(context));
    });

    console.log('✅ Extension "Cortyx" is now active!');
}


function getModels(context: vscode.ExtensionContext): vscode.Disposable {
    const disposable = vscode.commands.registerCommand('cortyx.get_models', async () => {
        const strategy = new OpenAIStrategy(context);

        const models: OpenAIModelListResponse = await strategy.getModels();

        context.globalState.update('models', models['data'])

        vscode.window.showInformationMessage(`Models: ${models['data'].length}`);
    });

    return disposable;
}


function promptAI(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('cortyx.prompt_ai', async () => {
        const strategy = new OpenAIStrategy(context);

        const prompt: string | undefined = await vscode.window.showInputBox({
            prompt: 'Enter your AI prompt',
            password: false,
        });

        const model = context.globalState.get('model') || undefined

        if (!model){
            vscode.window.showErrorMessage('No LLM model is set');
            return;
        }

        const options: ChatCompletionOptions = {
            model: String(model),
            messages: [{role: 'user', content: String(prompt)}]
        }

        const response = await strategy.generateResponse(options)

        aiOutputChannel.clear(); // Optional: clear old content
        aiOutputChannel.show(true); // Reveal panel, focus = true

        aiOutputChannel.appendLine('🤖 AI Response:\n');
        aiOutputChannel.appendLine(response.choices[0].message.content);
    });

    return disposable;
}


function getFileTree(): vscode.Disposable {
    const disposable = vscode.commands.registerCommand('cortyx.list_project_files', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace is open');
            return;
        }

        const fileTree = await buildFileTree(workspaceFolder.uri.fsPath, workspaceFolder.uri.fsPath);
        console.log(JSON.stringify(fileTree, null, 2));
        vscode.window.showInformationMessage('Project files listed in console.');
    });

    return disposable;
}


function setModel(context: vscode.ExtensionContext): vscode.Disposable {
    const disposable = vscode.commands.registerCommand('cortyx.set_llm_model', async () => {
        const strategy = new OpenAIStrategy(context);

        const models = await strategy.getModels();

        const modelValue = await vscode.window.showQuickPick(
            models.data.map(model => model.id),
            {
                placeHolder: 'Select the model to use from the selected LLM provider',
                canPickMany: false
            }
        );
        await context.globalState.update('model', modelValue);
    });

    return disposable;
}


function setActivate(context: vscode.ExtensionContext): vscode.Disposable {
    const disposable = vscode.commands.registerCommand('cortyx.activate', () => {
        vscode.window.showInformationMessage(`LLM provider set to ${context.globalState.get('llm')}`);
    });

    return disposable;
}


function setLlm(context: vscode.ExtensionContext): vscode.Disposable {
    const disposable = vscode.commands.registerCommand('cortyx.set_llm', async () => {
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

    return disposable;
}


function setApiUrl(context: vscode.ExtensionContext): vscode.Disposable {
    const disposable = vscode.commands.registerCommand('cortyx.set_api_url', async () => {
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

    return disposable;
}


function setApiKey(context: vscode.ExtensionContext): vscode.Disposable {
    const disposable = vscode.commands.registerCommand('cortyx.set_api_key', async () => {
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

    return disposable;
}


export function deactivate() {
    console.log('🛑 Extension "Cortyx" is now deactivated.');
}
