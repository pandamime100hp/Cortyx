//extension.ts

import { 
    ExtensionContext 
} from 'vscode';
import { CommandRegistry } from './commands/command-registry';
import { Configuration } from './configuration/configuration';
import { Output } from './utilities/output.utility';
import { AIModelContext } from './providers/context.providers';

// Holds the active command registry for cleanup on extension deactivation
let commandRegistry: CommandRegistry;
let output: Output;

/**
 * Extension entrypoint.
 * 
 * @param context Enables access to the VSCode context which contains functionality such as secrets, workspace access and more.
 */
export async function activate(context: ExtensionContext) {
    output = Output.getInstance();
    output.info('Cortyx AI initialising...');
    const config: Configuration = new Configuration(context);
    config.configure();

    const model: AIModelContext = config.getModel();

    commandRegistry = new CommandRegistry(context);

    commandRegistry.getCommands(model);
    commandRegistry.registerAll();

    output.info('Cortyx AI initialised');
}

/**
 * Extension function which is called when the extension is closed or uninstalled.
 */
export function deactivate() {
    output.warn('Cortyx AI deactivating...')
    commandRegistry?.disposeCommands();
    console.log('Cortyx AI deactivated');
}