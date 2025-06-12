import { ExtensionContext } from "vscode";
import { IExtensionCommand } from "../interfaces/command";
import { AIModelContext } from "../context/ai-model-context";

export interface CommandStrategy {
    getCommands(context: ExtensionContext, model: AIModelContext): IExtensionCommand[];
}