import { 
    commands, 
    Disposable, 
    ProgressLocation, 
    window,
    workspace
} from "vscode";
import { ICommand } from "../interfaces/command";
import { Output } from "../utilities/output.utility";
import { buildFileTree } from "../utilities/file-structure.utility";
import { FileNode } from "../types/file-node";

/**
 * Class that implements the ICommand interface to list all project files
 * in the currently opened workspace in Visual Studio Code.
 * Handles command registration and execution with appropriate progress reporting.
 */
export class ListProjectFiles implements ICommand {
    readonly id: string = 'cortyx.listProjectFiles';
    private readonly output: Output;

    /**
     * Creates an instance of ListProjectFiles.
     * Initializes the output utility instance used for logging.
     */
    constructor() {
        this.output = Output.getInstance();
    }
    
    /**
     * Registers the command to list project files.
     * Logs the registration process and returns a disposable object
     * that can be used to unregister the command.
     *
     * @returns The disposable object for command registration.
     */
    register(): Disposable {
        this.output.info(`Registering command: ${this.id}`);
        return commands.registerCommand(this.id, () => this.execute());
    }
    
    /**
     * Executes the command to list the project files in the currently opened workspace.
     * Displays progress and handles the potential errors during file tree building.
     *
     * @returns This method does not return a value.
     */
    execute(): void {
        const workspaceFolder = workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            window.showErrorMessage('No workspace is open');
            return;
        }

        window.withProgress({
            location: ProgressLocation.Window,
            title: 'Building project file tree...',
            cancellable: false
        }, async () => {
            try {
                const fileTree: FileNode[] = await buildFileTree(workspaceFolder.uri.fsPath, workspaceFolder.uri.fsPath);
                this.output.clearAndShow(`Below is your project structure in the form of a JSON:\n\n${JSON.stringify(fileTree, null, 2)}`);
            } catch (error) {
                window.showErrorMessage('Error building file tree: ' + error);
                return;
            }
        });
    }
}
