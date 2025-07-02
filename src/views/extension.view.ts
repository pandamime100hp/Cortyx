import { 
    CancellationToken, 
    commands, 
    Uri, 
    Webview, 
    WebviewView, 
    WebviewViewProvider, 
    WebviewViewResolveContext
} from 'vscode';
import { Output } from '../utilities/output.utility';
import { mainView } from '../constants/html';
import { Prompt } from '../types/prompt';

export class CortyxViewProvider implements WebviewViewProvider {
    private readonly output: Output = Output.getInstance();
    private readonly extensionUri: Uri;
    private _view?: WebviewView;
    private promptMode: Prompt = Prompt.REVIEW;
    readonly id: string = 'cortyxView';

    constructor(extensionUri: Uri) {
        this.output.info('Cortyx view initialising...');
        this.extensionUri = extensionUri;
        this.output.info('Cortyx view initialised');
    }

    /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
    resolveWebviewView(webviewView: WebviewView, _context: WebviewViewResolveContext, _token: CancellationToken) {
        this.output.info('Cortyx view resolving...');
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri]
        };

        this._view = webviewView;

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage((message: IAIAssistantMessage) => {
            this.output.info(`${message.type}`);
            switch (message.type) {
                case 'dev':
                    this.output.info('Received dev from webview');
                    this.promptMode = Prompt.DEV;
                    break;
                case 'test':
                    this.output.info('Received test from webview');
                    this.promptMode = Prompt.TEST;
                    break;
                case 'review':
                    this.output.info('Received review from webview');
                    this.promptMode = Prompt.REVIEW;
                    break;
                case 'promptAi':
                    this.output.info(`Received promptAi from webview. Prompt: ${message.payload?.prompt}`);
                    this.promptAi(message);
                    break;
                case 'resetContext':
                    this.output.info('Reset context triggered.');
                    break;
                default:
                    this.output.warn(`Unknown message type: ${message.type}`);
            }
        });

        this.output.info('Cortyx view resolved');
    }

    async promptAi(message: IAIAssistantMessage){
        if (!this._view) {
            this.output.warn('Cannot prompt AI: Webview is not initialized.');
            return;
        }

        this.output.info('Prompting AI...')


        const mode = message.payload?.mode ?? 'review'; // fallback
        this.output.info(`Prompt mode: ${mode}`);

        await commands.executeCommand('cortyx.promptAi', { prompt: message.payload?.prompt, mode: this.promptMode });

        this._view.show?.(true);
        this._view.webview.postMessage({
            type: 'aiResponse',
        });
    }

    dispose() {
        this._view = undefined;
        this.output.info('Cortyx view disposed.');
    }

    /* eslint-disable no-unused-vars */
    private _getHtmlForWebview(webview: Webview): string {
		const styleMainUri = webview.asWebviewUri(Uri.joinPath(this.extensionUri, 'media', 'styles/main.css'));
        const styleVsCodeUri = webview.asWebviewUri(Uri.joinPath(this.extensionUri, 'media', 'styles/vscode.css'));
		const scriptUri = webview.asWebviewUri(Uri.joinPath(this.extensionUri, 'media', 'scripts/main.js'));

        const nonce = _getNonce();

        const html = mainView
            .replace(/{URI_MAIN_CSS}/g, styleMainUri.toString())
            .replace(/{URI_VSCODE_CSS}/g, styleVsCodeUri.toString())
            .replace(/{CSP_SOURCE}/g, webview.cspSource)
            .replace(/{URI_SCRIPT}/g, scriptUri.toString())
            .replace(/{NONCE}/g, nonce);

        return html;
    }
}

function _getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
