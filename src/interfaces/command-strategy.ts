import { ExtensionContext } from "vscode";
import { ICommand } from "./command";
import { AIModelContext } from "../context/ai-model-context";

export interface ICommandStrategy {
    getCommands(context: ExtensionContext, model: AIModelContext): ICommand[];
}