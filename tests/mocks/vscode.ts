import { 
  Extension, 
  ExtensionContext, 
  ExtensionMode, 
  GlobalEnvironmentVariableCollection, 
  LanguageModelAccessInformation, 
  Memento, 
  OutputChannel, 
  SecretStorage, 
  Uri 
} from "vscode";


export const mockOutputChannel: OutputChannel = {
    appendLine: jest.fn(),
    clear: jest.fn(),
    show: jest.fn(),
    name: '',
    dispose: jest.fn(),
    append: jest.fn(),
    hide: jest.fn(),
    replace: jest.fn()
};

export const mockGlobalState: ExtensionContext['globalState'] = {
  get: jest.fn((key: string) => {
    if (key === 'apiKey') return 'mock-key';
    if (key === 'apiUrl') return 'https://mock-api.com/v1';
    return undefined;
  }),
  update: jest.fn(),
  keys: jest.fn(),
  setKeysForSync: jest.fn()
};

export const ProgressLocation = {
  SourceControl: 1,
  Window: 10,
  Notification: 15
};

const mockSecrets: SecretStorage = {
  get: jest.fn(),
  store: jest.fn(),
  delete: jest.fn(),
  onDidChange: jest.fn()
}

export const mockContext: ExtensionContext = {
  subscriptions: [],
  workspaceState: {} as Memento,
  globalState: mockGlobalState,
  extensionPath: '',
  asAbsolutePath: jest.fn(),
  storagePath: '',
  globalStoragePath: '',
  logPath: '',
  secrets: mockSecrets,
  extensionUri: {} as Uri,
  environmentVariableCollection: {} as GlobalEnvironmentVariableCollection,
  storageUri: {} as Uri,
  globalStorageUri: {} as Uri,
  logUri: {} as Uri,
  extensionMode: {} as ExtensionMode,
  extension: {} as Extension<unknown>,
  languageModelAccessInformation: {} as LanguageModelAccessInformation
} as ExtensionContext;

export const commands = {
  registerCommand: jest.fn().mockReturnValue({ dispose: jest.fn() }),
  executeCommand: jest.fn()
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
