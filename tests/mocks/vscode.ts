import { ExtensionContext, Memento } from "vscode";

export const commands = {
  registerCommand: jest.fn(),
};
  
export const window = {
  showInformationMessage: jest.fn(),
  showErrorMessage: jest.fn(),
  showWarningMessage: jest.fn(),
  showQuickPick: jest.fn(),
  showInputBox: jest.fn(),
  createOutputChannel: jest.fn(() => ({
    clear: jest.fn(),
    show: jest.fn(),
    appendLine: jest.fn(),
  }))
};

export const workspace = {
  workspaceFolders: [
    { uri: { fsPath: '/mock/project/root' } }
  ]
};

export const mockGlobalState: ExtensionContext['globalState'] = {
  get: jest.fn((key: string) => {
    if (key === 'apiKey') return 'mock-key';
    if (key === 'apiUrl') return 'https://mock-api.com/v1';
    return undefined;
  }),
  update: jest.fn()
};

export const mockContext: ExtensionContext = {
  subscriptions: [],
  workspaceState: {} as Memento,
  globalState: mockGlobalState as unknown as Memento,
  extensionPath: '',
  asAbsolutePath: jest.fn(),
  storagePath: '',
  globalStoragePath: '',
  logPath: ''
}


