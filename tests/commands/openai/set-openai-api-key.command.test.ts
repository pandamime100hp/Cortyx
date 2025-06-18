import { SetOpenAIAPIKey } from '../../../src/commands/openai/set-openai-api-key.command';
import { Output } from '../../../src/utilities/output.utility';
import { showInputBox } from '../../../src/utilities/input-helpers.utility';
import { ExtensionContext, commands } from 'vscode';
import { mockContext } from '../../mocks/vscode';

// Mock modules
jest.mock('../../../src/utilities/input-helpers.utility');
jest.mock('../../../src/utilities/output.utility');

describe('SetOpenAIAPIKey', () => {
    const mockStore = jest.fn();
    const mockInfo = jest.fn();
    const mockError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (Output.getInstance as jest.Mock).mockReturnValue({
            info: mockInfo,
            error: mockError,
        });

        // Reset input box mock
        (showInputBox as jest.Mock).mockReset();
    });

    it('should register the command', () => {
        const spy = jest.spyOn(commands, 'registerCommand').mockReturnValue({ dispose: jest.fn() });
        const command = new SetOpenAIAPIKey(mockContext as ExtensionContext);

        const disposable = command.register();

        expect(spy).toHaveBeenCalledWith(command.id, expect.any(Function));
        expect(disposable).toBeDefined();
        expect(mockInfo).toHaveBeenCalledWith(`Registering command: ${command.id}`);

        spy.mockRestore();
    });

    it('should not store API key if none is provided', async () => {
        (showInputBox as jest.Mock).mockResolvedValue(undefined);

        const command = new SetOpenAIAPIKey(mockContext as ExtensionContext);
        await command.execute();

        expect(mockStore).not.toHaveBeenCalled();
    });

    it('should handle errors when storing API key fails', async () => {
        const error = new Error('Storage failure');
        (showInputBox as jest.Mock).mockImplementation(() => {
            throw error;
        });

        const command = new SetOpenAIAPIKey(mockContext as ExtensionContext);
        await command.execute();

        expect(mockError).toHaveBeenCalledWith(`Error storing API key: ${error}`);
    });
});