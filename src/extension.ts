import * as vscode from 'vscode'
import { OpenAIStrategy } from './providers/openai/OpenAIStrategy';
import { buildFileTree } from './utilities/file_structure';


export async function activate(context: vscode.ExtensionContext) {
    const commands = [setActivate, setLlm, setApiUrl, setApiKey, getModels, getFileTree]

    commands.forEach(command => {
        context.subscriptions.push(command(context));
    });

    console.log('✅ Extension "Cortyx" is now active!');
}


function getModels(context: vscode.ExtensionContext): vscode.Disposable {
    const disposable = vscode.commands.registerCommand('cortyx.get_models', async () => {
        const openai = new OpenAIStrategy(context);

        const models = await openai.getModels();

        const stringifyModels = JSON.stringify(models);
        vscode.window.showInformationMessage(`Models: ${stringifyModels}`);
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
                prompt: 'Enter the API token',
                password: false,
                value: '********'
            });
            await context.globalState.update('apiKey', apiKeyValue);
            vscode.window.showInformationMessage('LLM provider API token set');
        } else {
            vscode.window.showWarningMessage('No API token provided. The extension may not work correctly.');
        }
    });

    return disposable;
}


export function deactivate() {
    console.log('🛑 Extension "Cortyx" is now deactivated.');
}
