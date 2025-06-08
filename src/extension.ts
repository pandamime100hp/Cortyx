//extension.ts

import * as vscode from 'vscode';
import { OpenAIStrategy } from './providers/openai/OpenAIStrategy';
import { getModels } from './commands/getModels';
import { promptAi } from './commands/promptAi';
import { listProjectFiles } from './commands/listProjectFiles';
import { setModel } from './commands/settings/setModel';
import { setLlm } from './commands/settings/setLlm';
import { setApiUrl } from './commands/settings/setApiUrl';
import { setApiKey } from './commands/settings/setApiKey';
import { Output } from './utilities/output';
import { COMMANDS, GLOBAL_STATE_KEYS } from './constants';

let strategy: OpenAIStrategy;
let output: Output;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    output = new Output();
    strategy = new OpenAIStrategy(context);

    registerCommands(context, Object.values(COMMANDS));
    await initialiseSettings(context);

    output.clearAndShow('🤖 AI Initialised!');
}

async function initialiseSettings(context: vscode.ExtensionContext): Promise<void> {
    await Promise.all([
        ensureSetting(context, GLOBAL_STATE_KEYS.LLM, COMMANDS.SET_LLM),
        ensureSetting(context, GLOBAL_STATE_KEYS.API_URL, COMMANDS.SET_API_URL),
        ensureSetting(context, GLOBAL_STATE_KEYS.API_KEY, COMMANDS.SET_API_KEY),
        ensureSetting(context, GLOBAL_STATE_KEYS.MODEL, COMMANDS.SET_MODEL)
    ]);
}

async function ensureSetting(context: vscode.ExtensionContext, key: string, command: string): Promise<void> {
    if (!context.globalState.get(key)) {
        try{
            await vscode.commands.executeCommand(command);
        } catch (error) {
            output.error(`Error executing command ${command}: ${error}`);
        }
    }
}

function registerCommands(context: vscode.ExtensionContext, commands: string[]): void {
    context.subscriptions.push(
        ...commands.map(
            command => {
                switch (command) {
                    case COMMANDS.GET_MODELS: return getModels(context, strategy);
                    case COMMANDS.PROMPT_AI: return promptAi(context, strategy, output);
                    case COMMANDS.LIST_PROJECT_FILES: return listProjectFiles(output);
                    case COMMANDS.SET_MODEL: return setModel(context, strategy);
                    case COMMANDS.SET_ACTIVATE: return setActivate(context);
                    case COMMANDS.SET_LLM: return setLlm(context);
                    case COMMANDS.SET_API_URL: return setApiUrl(context);
                    case COMMANDS.SET_API_KEY: return setApiKey(context);
                    default: throw new Error(`Unknown command: ${command}`);
                }
            }
        )
    );
}

function setActivate(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(COMMANDS.SET_ACTIVATE, () => {
        const llm = context.globalState.get(GLOBAL_STATE_KEYS.LLM);
        output.info(`LLM provider set to ${llm}`);
    });
}

export function deactivate(): void {
    output.clearAndShow('🛑 Extension "Cortyx" is now deactivated.');
}
