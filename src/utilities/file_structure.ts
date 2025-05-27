import * as vscode from 'vscode';

export function getProjectRoot(): string | undefined {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) return undefined;

    return folders[0].uri.fsPath; // Usually the root of the first workspace folder
}