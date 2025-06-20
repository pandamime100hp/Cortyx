import { 
    CancellationToken, 
    Uri, 
    Webview, 
    WebviewView, 
    WebviewViewProvider, 
    WebviewViewResolveContext
} from 'vscode';
import { Output } from '../utilities/output.utility';

export class AIAssistantViewProvider implements WebviewViewProvider {
    private readonly output: Output = Output.getInstance();
    private readonly extensionUri: Uri;
    private _view?: Webview;

    constructor(extensionUri: Uri) {
        this.output.info('Cortyx view initialising...');
        this.extensionUri = extensionUri;
        this.output.info('Cortyx view initialised');
    }

    /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
    resolveWebviewView(webviewView: WebviewView, _context: WebviewViewResolveContext, _token: CancellationToken) {
        this.output.info('Resolving Cortyx view');
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri]
        };

        this._view = webviewView.webview;

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        this.output.info('Resolved Cortyx view');
    }

    private _getHtmlForWebview(webview: Webview): string {
        return `<!DOCTYPE html>
            <html lang="en">
            <body>
                <h3>Welcome to AI Assistant</h3>
                <p>This panel can show AI suggestions, files to review, etc.</p>
                <button>Code</button>
                <button>Test</button>
                <button>Review</button>
                <button>Reset Context</button>
                <textarea id="prompt-input" name="prompt-input-textarea", rows="6", cols="50"></textarea>
            </body>
            </html>`;
    }
}
