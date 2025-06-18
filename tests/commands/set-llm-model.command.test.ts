import { SetLLMModel } from '../../src/commands/set-llm-model.command';
import { commands, mockContext } from '../mocks/vscode';
import { Output } from '../../src/utilities/output.utility';
import { showQuickPick } from '../../src/utilities/input-helpers.utility';

// Mocks
jest.mock('../../src/utilities/output.utility');
jest.mock('../../src/utilities/input-helpers.utility');

describe('SetLLMModel Command', () => {
  const mockInfo = jest.fn();
  const mockWarn = jest.fn();
  const mockUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (Output.getInstance as jest.Mock).mockReturnValue({
      info: mockInfo,
      warn: mockWarn,
    });
  });

  it('should register the command', () => {
    const registerSpy = jest
      .spyOn(commands, 'registerCommand')
      .mockReturnValue({ dispose: jest.fn() });

    const cmd = new SetLLMModel(mockContext);
    const disposable = cmd.register();

    expect(registerSpy).toHaveBeenCalledWith(cmd.id, expect.any(Function));
    expect(mockInfo).toHaveBeenCalledWith(`Registering command: ${cmd.id}`);
    expect(disposable).toBeDefined();
    registerSpy.mockRestore();
  });

  it('should warn if no models are in global state', async () => {
    mockContext.globalState.get = jest.fn().mockReturnValue(undefined);

    const cmd = new SetLLMModel(mockContext);
    await cmd.execute();

    expect(mockWarn).toHaveBeenCalledWith('No LLM models have been fetched');
    expect(showQuickPick).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('should not update global state if user cancels model selection', async () => {
    const models = ['gpt-4', 'gpt-3.5'];
    mockContext.globalState.get = jest.fn().mockReturnValue(models);
    (showQuickPick as jest.Mock).mockResolvedValue(undefined);

    const cmd = new SetLLMModel(mockContext);
    await cmd.execute();

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockInfo).not.toHaveBeenCalledWith(expect.stringMatching(/selected/));
  });
});
