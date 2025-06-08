//output.ts

import * as vscode from 'vscode';

export class Output {
    private readonly aiOutputChannel: vscode.OutputChannel;

    constructor(name: string = 'Cortyx AI') {
        this.aiOutputChannel = vscode.window.createOutputChannel(name);
    }

    private formatTimestamp(): string {
        return new Date().toISOString();
    }

    clear() {
        this.aiOutputChannel.clear();
    }

    show(preserveFocus: boolean = true) {
        this.aiOutputChannel.show(preserveFocus);
    }

    add(message: string) {
        this.aiOutputChannel.append(message);
    }

    addLine(message: string) {
        this.aiOutputChannel.appendLine(message);
    }

    clearAndShow(message: string) {
        this.clear();
        this.show();
        this.addLine(message);
    }

    info(message: string) {
        this.addLine(`${this.formatTimestamp()} | [INFO] | ${message}`);
    }

    warn(message: string) {
        this.addLine(`${this.formatTimestamp()} | [WARN] | ${message}`);
    }

    error(message: string) {
        this.addLine(`${this.formatTimestamp()} | [ERROR] | ${message}`);
    }
}
