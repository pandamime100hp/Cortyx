//mocks/vscode.ts

import { ExtensionContext, Memento, OutputChannel } from "vscode";


export const mockOutputChannel: OutputChannel = {
    appendLine: jest.fn(),
    clear: jest.fn(),
    show: jest.fn(),
    name: '',
    dispose: jest.fn(),
    append: jest.fn(),
    hide: jest.fn()
};

export const mockGlobalState: ExtensionContext['globalState'] = {
  get: jest.fn((key: string) => {
    if (key === 'apiKey') return 'mock-key';
    if (key === 'apiUrl') return 'https://mock-api.com/v1';
    return undefined;
  }),
  update: jest.fn()
};

export const ProgressLocation = {
  SourceControl: 1,
  Window: 10,
  Notification: 15
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

export const commands = {
  registerCommand: jest.fn(),
};
  
export const window = {
  showInformationMessage: jest.fn(),
  showErrorMessage: jest.fn(),
  showWarningMessage: jest.fn(),
  showQuickPick: jest.fn(),
  showInputBox: jest.fn(),
  createOutputChannel: jest.fn(() => mockOutputChannel),
  withProgress: jest.fn(async (_, task) => await task())
};

export const workspace = {
  workspaceFolders: [
    { uri: { fsPath: '/mock/project/root' } }
  ]
};
