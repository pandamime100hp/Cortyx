//getModels.ts

import * as vscode from 'vscode';
import { OpenAIModelListResponse } from '../providers/openai/OpenAITypes';
import { IAIModelStrategy } from '../providers/IAIModelStrategy';
import { COMMANDS, GLOBAL_STATE_KEYS } from '../constants';


export function getModels(context: vscode.ExtensionContext, strategy: IAIModelStrategy): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.GET_MODELS, async () => {
        try{
            const models: OpenAIModelListResponse = await strategy.getModels();
            context.globalState.update(GLOBAL_STATE_KEYS.MODELS, models.data)

            vscode.window.showInformationMessage(`Models: ${models.data.length}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch models: ${error}`);
            return; // Exit the function on error to prevent further execution
        }
    });
}