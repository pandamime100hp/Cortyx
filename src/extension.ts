import { commands, ExtensionContext, window } from 'vscode';
import { CommandRegistry } from './registries/command-registry';
import { Configuration } from './configuration/configuration';
import { Output } from './utilities/output.utility';
import { AIModelContext } from './context/ai-model-context';
import { AIAssistantViewProvider } from './views/extension.view';

// Holds the active command registry for cleanup on extension deactivation
let commandRegistry: CommandRegistry;
const output: Output = Output.getInstance();;

/**
 * Extension entrypoint.
 * 
 * @param context Enables access to the VSCode context which contains functionality such as secrets, workspace access and more.
 */
export async function activate(context: ExtensionContext) {
    output.info('Cortyx AI initialising...');
    const config: Configuration = new Configuration(context);
    config.configure();

    const provider: AIModelContext = config.getModel();

    commandRegistry = new CommandRegistry(context, provider);
    await commandRegistry.getCommands();
    commandRegistry.registerAll();

    const view = new AIAssistantViewProvider(context.extensionUri);
    const disposable = window.registerWebviewViewProvider('cortyxView', view);
    context.subscriptions.push(disposable);

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