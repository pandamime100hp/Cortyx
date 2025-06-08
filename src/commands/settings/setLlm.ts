//setLlm.ts

import * as vscode from 'vscode';
import { COMMANDS, GLOBAL_STATE_KEYS } from '../../constants';


export function setLlm(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.SET_LLM, async () => {
        const llm: string | undefined = await context.globalState.get(GLOBAL_STATE_KEYS.LLM);

        if (!llm) {
            const llmValue = await vscode.window.showQuickPick(
                ['OpenAI', 'Local Model'],
                {
                    placeHolder: 'Select your preferred LLM provider',
                    canPickMany: false
                }
            );
            await context.globalState.update(GLOBAL_STATE_KEYS.LLM, llmValue);
            vscode.window.showInformationMessage(`LLM provider set to ${llm}`);
        } else {
            vscode.window.showWarningMessage('No LLM selected. The extension may not work correctly.');
        }
    });
}