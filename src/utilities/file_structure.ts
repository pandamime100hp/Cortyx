import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';


export type FileNode = {
    name: string;
    path: string;
    relativePath: string;
    isDirectory: boolean;
    fileType: string;
    size?: number;
    children?: FileNode[];
};



const FOLDERS = vscode.workspace.workspaceFolders;


export function getProjectRoot(): string | undefined {
    if (!FOLDERS || FOLDERS.length === 0) return undefined;

    return FOLDERS[0].uri.fsPath; // Usually the root of the first workspace folder
}


export async function buildFileTree(dir: string, root: string): Promise<FileNode[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    const nodes: FileNode[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(root, fullPath);

        const isDirectory = entry.isDirectory();

        const fileType = isDirectory
            ? 'directory'
            : path.extname(entry.name).replace('.', '').toLowerCase() || 'unknown';

        const node: FileNode = {
        name: entry.name,
        path: fullPath,
        relativePath,
        isDirectory,
        fileType
        };

        if (isDirectory) {
            node.children = await buildFileTree(fullPath, root);
        } else {
            const stat = await fs.stat(fullPath);
            node.size = stat.size;
        }

        nodes.push(node);
    }

    return nodes;
}