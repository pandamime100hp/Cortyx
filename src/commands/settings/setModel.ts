//setModel.ts

import * as vscode from 'vscode';
import { IAIModelStrategy } from '../../providers/IAIModelStrategy';
import { COMMANDS, GLOBAL_STATE_KEYS } from '../../constants';


export function setModel(context: vscode.ExtensionContext, strategy: IAIModelStrategy): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.SET_MODEL, async () => {
        try {
            const models = await strategy.getModels();

            const modelValue = await vscode.window.showQuickPick(
                models.data.map(model => model.id),
                {
                    placeHolder: 'Select the model to use from the selected LLM provider',
                    canPickMany: false
                }
            );
            await context.globalState.update(GLOBAL_STATE_KEYS.MODEL, modelValue);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch models: ${error}`);
            return;
        }
    });
}