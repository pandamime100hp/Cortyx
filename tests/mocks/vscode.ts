import { ExtensionContext, Memento } from "vscode";

export const commands = {
  registerCommand: jest.fn(),
};
  
export const window = {
  showInformationMessage: jest.fn(),
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


