// //listProjectFiles.ts

// import * as vscode from 'vscode';
// import { buildFileTree } from '../utilities/fileStructure';
// import { COMMAND } from '../utilities/constants';
// import { Output } from '../utilities/output';


// export function listProjectFiles(output: Output): vscode.Disposable {
//     return vscode.commands.registerCommand(COMMAND.LIST_PROJECT_FILES, async () => {
//         const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
//         if (!workspaceFolder) {
//             vscode.window.showErrorMessage('No workspace is open');
//             return;
//         }

//         vscode.window.withProgress({
//             location: vscode.ProgressLocation.Window,
//             title: 'Building project file tree...',
//             cancellable: false
//         }, async () => {
//             try {
//                 const fileTree = await buildFileTree(workspaceFolder.uri.fsPath, workspaceFolder.uri.fsPath);
//                 output.clearAndShow(`Below is your project structure in the form of a JSON:\n\n${JSON.stringify(fileTree, null, 2)}`);
//             } catch (error) {
//                 vscode.window.showErrorMessage('Error building file tree: ' + error);
//                 return;
//             }
//         });
        
//     });
// }