import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';
import { getProjectRoot } from './file_structure';


export class Config {
    private config?: Record<string, string | number> = {};
    private configPath: string = '';

    constructor(){
        const root = getProjectRoot();
        if (!root) {
            vscode.window.showErrorMessage('No workspace folder open. Please open a project to continue.');
            return;
        }

        const CONFIG_PATH = path.join('.cortyx', 'config.json');
        this.configPath = path.join(root, CONFIG_PATH);
    }

    async load() {
        try {
            const data = await fs.readFile(this.configPath, 'utf8');
            this.config = JSON.parse(data);
        } catch {
            this.config = {};
        }
    }

    async save() {
        await fs.mkdir(path.dirname(this.configPath), { recursive: true });
        await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
    }
}