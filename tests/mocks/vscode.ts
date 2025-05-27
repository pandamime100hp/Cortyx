import { ExtensionContext, Memento } from "vscode";

export const commands = {
  registerCommand: jest.fn(),
};
  
export const window = {
  showInformationMessage: jest.fn(),
};

export const workspace = {
  workspaceFolders: [
    { uri: { fsPath: '/mock/project/root' } }
  ]
};

export const mockContext: ExtensionContext = {
  subscriptions: [],
  workspaceState: {} as Memento,
  globalState: {} as Memento,
  extensionPath: '',
  asAbsolutePath: jest.fn(),
  storagePath: '',
  globalStoragePath: '',
  logPath: ''
}


