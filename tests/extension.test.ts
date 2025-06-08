//extension.test.ts

import { activate, deactivate } from '../src/extension';
import { COMMANDS, GLOBAL_STATE_KEYS } from '../src/constants';
import { Output } from './mocks/output';
import { mockContext, mockGlobalState } from './mocks/vscode';
import * as vscode from 'vscode';

jest.mock('vscode', () => {
  const actual = jest.requireActual('vscode');
  const mockOutputChannel = {
    appendLine: jest.fn(),
    clear: jest.fn(),
    show: jest.fn(),
    name: 'Cortyx',
    dispose: jest.fn(),
    append: jest.fn(),
    hide: jest.fn()
  };

  return {
    ...actual,
    window: {
      ...actual.window,
      createOutputChannel: jest.fn(() => mockOutputChannel),
      showInformationMessage: jest.fn(),
      showErrorMessage: jest.fn(),
      showWarningMessage: jest.fn(),
      showQuickPick: jest.fn(),
      showInputBox: jest.fn(),
      withProgress: jest.fn(async (_, task) => await task()),
    },
    commands: {
      registerCommand: jest.fn(),
      executeCommand: jest.fn(),
    },
    workspace: {
      workspaceFolders: [
        { uri: { fsPath: '/mock/project/root' } }
      ]
    }
  };
});
jest.mock('../src/providers/openai/OpenAIStrategy');
jest.mock('../src/utilities/output');

// Mock command modules
jest.mock('../src/commands/getModels', () => ({
  getModels: jest.fn(() => ({ dispose: jest.fn() }))
}));
jest.mock('../src/commands/promptAi', () => ({
  promptAi: jest.fn(() => ({ dispose: jest.fn() }))
}));
jest.mock('../src/commands/listProjectFiles', () => ({
  listProjectFiles: jest.fn(() => ({ dispose: jest.fn() }))
}));
jest.mock('../src/commands/settings/setModel', () => ({
  setModel: jest.fn(() => ({ dispose: jest.fn() }))
}));
jest.mock('../src/commands/settings/setLlm', () => ({
  setLlm: jest.fn(() => ({ dispose: jest.fn() }))
}));
jest.mock('../src/commands/settings/setApiUrl', () => ({
  setApiUrl: jest.fn(() => ({ dispose: jest.fn() }))
}));
jest.mock('../src/commands/settings/setApiKey', () => ({
  setApiKey: jest.fn(() => ({ dispose: jest.fn() }))
}));

describe('Cortyx Extension', () => {
  let outputMock: jest.Mocked<InstanceType<typeof Output>>;
  let executeCommandMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    outputMock = {
      clearAndShow: jest.fn(),
      info: jest.fn(),
      error: jest.fn()
    } as unknown as jest.Mocked<InstanceType<typeof Output>>;

    (Output as jest.Mock).mockImplementation(() => outputMock);

    executeCommandMock = jest.fn();
    (vscode.commands.executeCommand as unknown as jest.Mock) = executeCommandMock;
  });

//   it('activates and calls commands for undefined settings', async () => {
//     mockGlobalState.get = jest.fn(() => undefined); // All settings undefined

//     await activate(mockContext);

//     expect(outputMock.clearAndShow).toHaveBeenCalledWith('🤖 AI Initialised!');

//     expect(executeCommandMock).toHaveBeenCalledWith(COMMANDS.SET_LLM);
//     expect(executeCommandMock).toHaveBeenCalledWith(COMMANDS.SET_API_URL);
//     expect(executeCommandMock).toHaveBeenCalledWith(COMMANDS.SET_API_KEY);
//     expect(executeCommandMock).toHaveBeenCalledWith(COMMANDS.SET_MODEL);
//   });

  it('skips commands for existing settings', async () => {
    mockGlobalState.get = jest.fn((key: string) => {
      return key === GLOBAL_STATE_KEYS.LLM ? 'openai' : undefined;
    });

    await activate(mockContext);

    expect(executeCommandMock).not.toHaveBeenCalledWith(COMMANDS.SET_LLM);
    expect(executeCommandMock).toHaveBeenCalledWith(COMMANDS.SET_API_URL);
  });

//   it('logs errors if a command fails', async () => {
//     executeCommandMock.mockImplementation((cmd: string) => {
//       if (cmd === COMMANDS.SET_API_KEY) throw new Error('Command failure');
//     });

//     await activate(mockContext);

//     expect(outputMock.error).toHaveBeenCalledWith(
//       expect.stringContaining('Error executing command cortyx.set_api_key: Error: Command failure')
//     );
//   });

//   it('clears output on deactivate', async () => {
//     await activate(mockContext);
//     deactivate();
//     expect(outputMock.clearAndShow).toHaveBeenCalledWith('🛑 Extension "Cortyx" is now deactivated.');
//   });
});
