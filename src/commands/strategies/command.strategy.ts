import { ExtensionContext } from "vscode";
import { ExtensionCommand } from "../types";
import { AIModelContext } from "../../providers/context.providers";

export interface CommandStrategy {
    getCommands(context: ExtensionContext, model: AIModelContext): ExtensionCommand[];
}