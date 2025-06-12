import { CommandStrategy } from './command.strategy';
import { ExtensionCommand } from '../types';
import { ExtensionContext } from 'vscode';

export class GlobalCommandStrategy implements CommandStrategy {
    constructor(private context: ExtensionContext) {}

    getCommands(): ExtensionCommand[] {
        return [
            // new SetProvider(context),
            // new SetURL(context),
        ];
    }
}