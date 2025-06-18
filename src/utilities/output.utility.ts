import { 
    OutputChannel, 
    window 
} from 'vscode';
import { LogLevel } from '../types/log';


/**
 * Manages output channels for logging information and messages in the VSCode extension.
 * Implements the Singleton pattern to ensure only one instance of the Output class exists.
 */
export class Output {
    private readonly outputChannelName: string = 'Cortyx AI';

    private static instance: Output;
    private readonly aiOutputChannel: OutputChannel;
    private readonly logsOutputChannel: OutputChannel;

    /**
     * Initializes the Output class, creating the main output channel and a logs output channel.
     */
    constructor() {
        this.aiOutputChannel = window.createOutputChannel(this.outputChannelName);
        this.logsOutputChannel = window.createOutputChannel(this.outputChannelName + ' Logs');
    }

    /**
     * Returns the singleton instance of the Output class.
     * @returns The single instance of the Output class.
     */
    public static getInstance(): Output {
        if (!Output.instance) {
            Output.instance = new Output();
        }
        return Output.instance;
    }

    /**
     * Formats the current timestamp as an ISO string.
     * @returns The formatted timestamp as a string.
     */
    protected formatTimestamp(): string {
        return new Date().toISOString();
    }

    /**
     * Clears the main output channel.
     */
    public clear() {
        this.aiOutputChannel.clear();
    }

    /**
     * Displays the main output channel.
     * @param preserveFocus If true, the focus will remain on the output channel; otherwise, focus may shift.
     */
    public show(preserveFocus: boolean = true) {
        this.aiOutputChannel.show(preserveFocus);
    }

    /** 
     * Adds a message to the main output channel.
     * @param message The message to be displayed.
     * @param shouldAppendLine If true, appends the message as a new line; otherwise, appends it to the current line.
     */
    /* eslint-disable @typescript-eslint/no-unused-expressions */
    public add(message: string, shouldAppendLine: boolean) {
        shouldAppendLine ? this.aiOutputChannel.appendLine(message) : this.aiOutputChannel.append(message);
    }

    /**
     * Clears the output channel, shows it, and adds a specified message.
     * @param message The message to display after clearing and showing the output channel.
     */
    public clearAndShow(message: string) {
        this.clear();
        this.show();
        this.add(message, true);
    }

    /**
     * Logs an informational message to the logs output channel with a timestamp.
     * @param message The informational message to log.
     */
    public info(message: string) {
        this.logsOutputChannel.appendLine(`${this.formatTimestamp()} | ${LogLevel.INFO} | ${message}`);
    }

    /**
     * Logs a warning message to the logs output channel with a timestamp.
     * @param message The warning message to log.
     */
    public warn(message: string) {
        this.logsOutputChannel.appendLine(`${this.formatTimestamp()} | ${LogLevel.WARN} | ${message}`);
    }

    /**
     * Logs an error message to the logs output channel with a timestamp.
     * @param message The error message to log.
     */
    public error(message: string) {
        this.logsOutputChannel.appendLine(`${this.formatTimestamp()} | ${LogLevel.ERROR} | ${message}`);
    }
}
