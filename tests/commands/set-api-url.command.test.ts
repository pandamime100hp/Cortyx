import { SetAPIURL } from '../../src/commands/set-api-url.command';
import { commands, mockContext } from '../mocks/vscode';
import { Output } from '../../src/utilities/output.utility';
import { showInputBox } from '../../src/utilities/input-helpers.utility';

// Mocks
jest.mock('../../src/utilities/output.utility');
jest.mock('../../src/utilities/input-helpers.utility');

describe('SetAPIURL Command', () => {
    const mockInfo = jest.fn();
    const mockUpdate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (Output.getInstance as jest.Mock).mockReturnValue({
            info: mockInfo,
        });
    });

    it('should register the command', () => {
        const registerSpy = jest.spyOn(commands, 'registerCommand').mockReturnValue({ dispose: jest.fn() });

        const cmd = new SetAPIURL(mockContext);
        const disposable = cmd.register();

        expect(registerSpy).toHaveBeenCalledWith(cmd.id, expect.any(Function));
        expect(disposable).toBeDefined();
        expect(mockInfo).toHaveBeenCalledWith(`Registering command: ${cmd.id}`);
        registerSpy.mockRestore();
    });

    it('should not update global state if no API URL is provided', async () => {
        (showInputBox as jest.Mock).mockResolvedValue(undefined); // Simulate user cancel

        const cmd = new SetAPIURL(mockContext);
        await cmd.execute();

        expect(mockUpdate).not.toHaveBeenCalled();
    });
});
