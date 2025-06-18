import { showInputBox, showQuickPick } from '../../src/utilities/input-helpers.utility';
import { window } from '../mocks/vscode';

jest.mock('vscode', () => ({
    window: {
        showInputBox: jest.fn(),
        showQuickPick: jest.fn(),
        showWarningMessage: jest.fn(),
    },
}));

describe('showQuickPick', () => {
    it('should return the selected item', async () => {
        // Mock the window.showQuickPick method
        const mockShowQuickPick = window.showQuickPick.mockResolvedValue('Item1');
        const result = await showQuickPick('Select an item', ['Item1', 'Item2'], 'No selection made');
        
        expect(result).toBe('Item1');
        expect(mockShowQuickPick).toHaveBeenCalledWith(['Item1', 'Item2'], { placeHolder: 'Select an item' });
    });

    it('should show warning message on cancellation', async () => {
        window.showQuickPick.mockResolvedValue(undefined);
        const mockShowWarningMessage = jest.spyOn(window, 'showWarningMessage');
        
        const result = await showQuickPick('Select an item', ['Item1', 'Item2'], 'No selection made');
        
        expect(result).toBeUndefined();
        expect(mockShowWarningMessage).toHaveBeenCalledWith('No selection made');
    });
});

describe('showInputBox', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return valid input', async () => {
        window.showInputBox.mockResolvedValue('ValidInput');
        const result = await showInputBox('Enter input', false, 'ExpectedValue', 'Invalid input', 'Error occurred');
        expect(result).toBe('ValidInput');
    });

    it('should show validation message for invalid input', async () => {
        window.showInputBox.mockResolvedValue('InvalidInput');
        const result = await showInputBox('Enter input', false, 'ExpectedValue', 'Invalid input', 'Error occurred');
        expect(window.showWarningMessage).not.toHaveBeenCalled();
        expect(result).toBe('InvalidInput'); // Depending on how you want to handle invalid input.
    });

    it('should show warning message and return undefined if canceled', async () => {
        window.showInputBox.mockResolvedValue(undefined);
        const result = await showInputBox('Enter input', false, 'ExpectedValue', 'Invalid input', 'Error occurred');
        expect(window.showWarningMessage).toHaveBeenCalledWith('Error occurred');
        expect(result).toBeUndefined();
    });
});