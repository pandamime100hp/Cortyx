//setApiKey.ts

import * as vscode from 'vscode';
import { COMMANDS, GLOBAL_STATE_KEYS } from '../../constants';


export function setApiKey(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.SET_API_KEY, async () => {
        const apiKey: string | undefined = await context.globalState.get(GLOBAL_STATE_KEYS.API_KEY);

        if (!apiKey) {
            const apiKeyValue: string | undefined = await vscode.window.showInputBox({
                prompt: 'Enter the API key',
                password: true,
                value: '********'
            });
            await context.globalState.update(GLOBAL_STATE_KEYS.API_KEY, apiKeyValue);
            vscode.window.showInformationMessage('LLM provider API key set');
        } else {
            vscode.window.showWarningMessage('No API key provided. The extension may not work correctly.');
        }
    });
}