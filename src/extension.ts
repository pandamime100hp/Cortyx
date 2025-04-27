import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('✅ Extension "Cortyx" is now active!');

  const disposable = vscode.commands.registerCommand('extension.cortyx', () => {

    vscode.window.showInformationMessage('Cortyx activated');
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {
  console.log('🛑 Extension "Cortyx" is now deactivated.');
}