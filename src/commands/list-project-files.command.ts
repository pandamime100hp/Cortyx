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


export class ListProjectFiles implements ICommand {
    readonly id: string = 'cortyx.listProjectFiles';
    private readonly output: Output;

    /**
     * 
     * @param context 
     */
    constructor() {
        this.output = Output.getInstance();
    }
    
    /**
     * Registers the command.
     * 
     * @returns Registered disposable object which can be subscribed to the instance context.
     */
    register(): Disposable {
        this.output.info(`Registering command: ${this.id}`);
        return commands.registerCommand(this.id, (...args) => this.execute(...args));
    }
    
    /**
     * 
     * @param _args List of arguments required to be passed in for the execution.
     * @returns 
     */
    execute(...args: unknown[]): void {
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
