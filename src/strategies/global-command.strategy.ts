import { CommandStrategy } from './command.strategy';
import { IExtensionCommand } from '../interfaces/command';
import { ExtensionContext } from 'vscode';

export class GlobalCommandStrategy implements CommandStrategy {
    private context: ExtensionContext;

    constructor(context: ExtensionContext) {
        this.context = context;
    }

    getCommands(): IExtensionCommand[] {
        return [
            // new SetProvider(context),
            // new SetURL(context),
        ];
    }
}