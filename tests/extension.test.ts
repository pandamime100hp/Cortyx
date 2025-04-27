import * as vscode from './mocks/vscode';
import { activate, deactivate } from '../src/extension'
import { ExtensionContext } from 'vscode';

console.log(vscode);

describe('Extension', () => {
    // Allows us to mock the `console.log` function without having a real instance of it
    beforeEach(() => {
        // We replae the real `console.log` function with an empty function
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    // Resets the mocked `console.log` function back to normal
    afterEach(() => {
        (console.log as jest.Mock).mockRestore();
    });

    it('should log message on activate', () => {
        activate(vscode.mockContext);

        expect(console.log).toHaveBeenCalledWith('✅ Extension "Cortyx" is now active!');
    });

    it('should log message on deactivate', () => {
        deactivate();
        expect(console.log).toHaveBeenCalledWith('🛑 Extension "Cortyx" is now deactivated.')
    });

    it('should register `extension.cortyx` command', () => {
        activate(vscode.mockContext);

        expect(vscode.commands.registerCommand).toHaveBeenCalledWith('extension.cortyx', expect.any(Function));
    });

    it('should show information message when `extension.cortyx` command is executed', () => {
        const showInfoSpy = jest.spyOn(vscode.window, 'showInformationMessage');
        const command = vscode.commands.registerCommand.mock.calls[0][1];

        command();
        expect(showInfoSpy).toHaveBeenCalledWith('Cortyx activated');
    });
});