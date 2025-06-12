//file_structure.ts

import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * 
 */
export type FileNode = {
    name: string;
    path: string;
    relativePath: string;
    isDirectory: boolean;
    fileType: string;
    size?: number;
    children?: FileNode[];
};

/**
 * 
 */
const IGNORE = [
    '.git', 'coverage', 'node_modules', 'out'
]

/**
 * 
 * @param name 
 * @returns 
 */
function getFileType(name: string): string {
    const ext = path.extname(name).toLowerCase();
    return ext ? ext.slice(1) : 'unknown';
}

/**
 * 
 * @param dir 
 * @param root 
 * @returns 
 */
export async function buildFileTree(dir: string, root: string): Promise<FileNode[]> {
    let entries;

    try {
        entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (err) {
        console.error(`Failed to read directory: ${dir}`, err);
        return [];
    }

    const nodes: FileNode[] = [];

    for (const entry of entries) {
        if (IGNORE.includes(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(root, fullPath);
        const isDirectory = entry.isDirectory();
        const fileType = isDirectory ? 'directory' : getFileType(entry.name);

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