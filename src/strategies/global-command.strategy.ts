import { ICommandStrategy } from '../interfaces/command-strategy';
import { ICommand } from '../interfaces/command';
import { ExtensionContext } from 'vscode';
import { SetAPIURL } from '../commands/set-api-url.command';

export class GlobalCommandStrategy implements ICommandStrategy {
    private context: ExtensionContext;

    constructor(context: ExtensionContext) {
        this.context = context;
    }

    getCommands(): ICommand[] {
        return [
            new SetAPIURL(this.context),
        ];
    }
}