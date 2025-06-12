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