//output.ts

import { 
    OutputChannel, 
    window 
} from 'vscode';

export class Output {
    private readonly NAME: string = 'Cortyx AI';

    private static instance: Output;
    private readonly aiOutputChannel: OutputChannel;
    private readonly logsOutputChannel: OutputChannel;

    /**
     * 
     */
    constructor() {
        this.aiOutputChannel = window.createOutputChannel(this.NAME);
        this.logsOutputChannel = window.createOutputChannel(this.NAME + ' Logs');
    }

    /**
     * Returns the singleton instance of the Output class.
     */
    public static getInstance(): Output {
        if (!Output.instance) {
            Output.instance = new Output();
        }
        return Output.instance;
    }

    /**
     * 
     * @returns 
     */
    private formatTimestamp(): string {
        return new Date().toISOString();
    }

    /**
     * 
     */
    clear() {
        this.aiOutputChannel.clear();
    }

    /**
     * 
     * @param preserveFocus 
     */
    show(preserveFocus: boolean = true) {
        this.aiOutputChannel.show(preserveFocus);
    }

    /**
     * 
     * @param message 
     */
    add(message: string) {
        this.aiOutputChannel.append(message);
    }

    /**
     * 
     * @param message 
     */
    addLine(message: string) {
        this.aiOutputChannel.appendLine(message);
    }

    /**
     * 
     * @param message 
     */
    clearAndShow(message: string) {
        this.clear();
        this.show();
        this.addLine(message);
    }

    /**
     * 
     * @param message 
     */
    info(message: string) {
        this.logsOutputChannel.appendLine(`${this.formatTimestamp()} | [INFO] | ${message}`);
    }

    /**
     * 
     * @param message 
     */
    warn(message: string) {
        this.logsOutputChannel.appendLine(`${this.formatTimestamp()} | [WARN] | ${message}`);
    }

    /**
     * 
     * @param message 
     */
    error(message: string) {
        this.logsOutputChannel.appendLine(`${this.formatTimestamp()} | [ERROR] | ${message}`);
    }
}
