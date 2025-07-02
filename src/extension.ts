import { ExtensionContext, window } from 'vscode';
import { CommandRegistry } from './registries/command-registry';
import { Configuration } from './configuration/configuration';
import { Output } from './utilities/output.utility';
import { AIModelContext } from './context/ai-model-context';
import { CortyxViewProvider } from './views/extension.view';

// Holds the active command registry for cleanup on extension deactivation
let commandRegistry: CommandRegistry;
let view: CortyxViewProvider;
const output: Output = Output.getInstance();;

/**
 * Extension entrypoint.
 * 
 * @param context Enables access to the VSCode context which contains functionality such as secrets, workspace access and more.
 */
export async function activate(context: ExtensionContext) {
    output.info('Cortyx AI initialising...');

    // Configures initial extension settings
    const config: Configuration = new Configuration(context);
    config.configure();

    // Gets the selected provider model
    const provider: AIModelContext = config.getModel();

    // Registers all appropriate pallette commands based on selected provider
    commandRegistry = new CommandRegistry(context, provider);
    await commandRegistry.getCommands();
    commandRegistry.registerAll();

    // Registers Cortyx view enabling user interaction with the registered provider LLM.
    view = new CortyxViewProvider(context.extensionUri);
    const disposable = window.registerWebviewViewProvider(view.id, view);
    context.subscriptions.push(disposable);

    output.info('Cortyx AI initialised');
}

/**
 * Extension function which is called when the extension is closed or uninstalled.
 */
export function deactivate() {
    output.warn('Cortyx AI deactivating...')
    commandRegistry?.disposeCommands();
    view?.dispose();
    console.log('Cortyx AI deactivated');
}