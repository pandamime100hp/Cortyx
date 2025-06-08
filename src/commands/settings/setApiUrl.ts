//setApiUrl.ts

import * as vscode from 'vscode';
import { COMMANDS, GLOBAL_STATE_KEYS } from '../../constants';


export function setApiUrl(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.SET_API_URL, async () => {
        const apiUrl: string | undefined = await context.globalState.get(GLOBAL_STATE_KEYS.API_URL);

        if (!apiUrl) {
            const apiUrlValue: string | undefined = await vscode.window.showInputBox({
                prompt: 'Enter the API base URL',
                password: false,
                value: 'e.g. https://api.openai.com/v1'
            });
            await context.globalState.update(GLOBAL_STATE_KEYS.API_URL, apiUrlValue);
            vscode.window.showInformationMessage(`LLM provider API URL set to ${apiUrl}`);
        } else {
            vscode.window.showWarningMessage('No API URL provided. The extension may not work correctly.');
        }
    });
}