import { ExtensionContext } from 'vscode';
import { IAIModelStrategy } from './ai-model';
import { ICommand } from './command';

export interface IProviderConfiguration {
    readonly context: ExtensionContext;

    /**
     * 
     */
    configure(): void;

    /**
     * 
     */
    getStrategy(): IAIModelStrategy;
    
    /**
     * 
     */
    getCommands(): ICommand[];
}