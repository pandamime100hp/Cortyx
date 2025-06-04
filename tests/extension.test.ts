import * as vscode from './mocks/vscode';
import { activate, deactivate } from '../src/extension'
import { OpenAIStrategy } from '../src/providers/openai/OpenAIStrategy';
import * as fileStructure from '../src/utilities/file_structure';

jest.mock('../src/providers/openai/OpenAIStrategy');
jest.mock('../src/utilities/file_structure');

describe('Extension', () => {
    const commands = [
        'cortyx.activate',
        'cortyx.set_llm',
        'cortyx.set_api_url',
        'cortyx.set_api_key',
        'cortyx.set_llm_model',
        'cortyx.get_models',
        'cortyx.list_project_files',
        'cortyx.prompt_ai'
    ];

    // Allows us to mock the `console.log` function without having a real instance of it
    beforeEach(() => {
        // We replae the real `console.log` function with an empty function
        jest.spyOn(console, 'log').mockImplementation(() => {});

        vscode.mockContext.globalState.get = jest.fn((key: string) => {
            if (key === 'apiKey') return 'mock_api_key';
            if (key === 'apiUrl') return 'https://mock-api.openai.com/v1';
            return undefined;
        });

        vscode.commands.registerCommand.mockClear();
        jest.clearAllMocks();
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

    it('should register all expected commands', () => {
        activate(vscode.mockContext);

        const commandIds = vscode.commands.registerCommand.mock.calls.map(call => call[0]);

        expect(commandIds).toEqual(commands);
    });

    it('cortyx.get_models shows models info', async () => {
        const mockModels = { data: [{ id: 'gpt-4' }] };
        (OpenAIStrategy as jest.Mock).mockImplementation(() => ({
            getModels: jest.fn().mockResolvedValue(mockModels),
        }));

        activate(vscode.mockContext);

        const callback = vscode.commands.registerCommand.mock.calls.find(call => call[0] === 'cortyx.get_models')?.[1];
        await callback();

        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(expect.stringContaining('Models:'));
    });

    it('cortyx.list_project_files without workspace shows error', async () => {
        Object.defineProperty(vscode.workspace, 'workspaceFolders', {
            get: () => undefined
        });

        activate(vscode.mockContext);

        const callback = vscode.commands.registerCommand.mock.calls.find(call => call[0] === 'cortyx.list_project_files')?.[1];
        await callback();

        expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('No workspace is open');
    });

    it('cortyx.list_project_files with workspace logs file tree', async () => {
        jest.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue([
            { uri: { fsPath: '/test' } }
        ]);

        jest.spyOn(fileStructure, 'buildFileTree').mockResolvedValue([
            { 
                name: '',
                path: '',
                relativePath: '',
                isDirectory: true,
                fileType: '',
                size: 0,
                children: undefined 
            }
        ]);
        jest.spyOn(console, 'log').mockImplementation(() => {});

        activate(vscode.mockContext);

        const callback = vscode.commands.registerCommand.mock.calls.find(call => call[0] === 'cortyx.list_project_files')?.[1];
        await callback();

        expect(fileStructure.buildFileTree).toHaveBeenCalled();
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Project files listed in console.');
    });

    it('cortyx.activate shows current llm', async () => {
        vscode.mockContext.globalState.get = jest.fn().mockReturnValue('OpenAI');

        activate(vscode.mockContext);

        const callback = vscode.commands.registerCommand.mock.calls.find(call => call[0] === 'cortyx.activate')?.[1];
        await callback();

        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('LLM provider set to OpenAI');
    });

    it('cortyx.set_llm updates when undefined and selection is made', async () => {
        vscode.mockContext.globalState.get = jest.fn(() => undefined);
        vscode.window.showQuickPick.mockResolvedValue('OpenAI');

        activate(vscode.mockContext);

        const callback = vscode.commands.registerCommand.mock.calls.find(call => call[0] === 'cortyx.set_llm')?.[1];
        await callback();

        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('LLM provider set to undefined');
        expect(vscode.mockContext.globalState.update).toHaveBeenCalledWith('llm', 'OpenAI');
    });

    it('cortyx.set_llm shows warning when already defined', async () => {
        vscode.mockContext.globalState.get = jest.fn(() => 'OpenAI');

        activate(vscode.mockContext);

        const callback = vscode.commands.registerCommand.mock.calls.find(call => call[0] === 'cortyx.set_llm')?.[1];
        await callback();

        expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
            'No LLM selected. The extension may not work correctly.'
        );
    });

    it('cortyx.set_api_url updates when undefined', async () => {
        vscode.mockContext.globalState.get = jest.fn().mockReturnValue(undefined);
        vscode.window.showInputBox.mockResolvedValue('https://mock-api');

        activate(vscode.mockContext);

        const callback = vscode.commands.registerCommand.mock.calls.find(call => call[0] === 'cortyx.set_api_url')?.[1];
        await callback();

        expect(vscode.mockContext.globalState.update).toHaveBeenCalledWith('apiUrl', 'https://mock-api');
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('LLM provider API URL set to undefined');
    });

    it('cortyx.set_api_key updates when undefined', async () => {
        vscode.mockContext.globalState.get = jest.fn().mockReturnValue(undefined);
        vscode.window.showInputBox.mockResolvedValue('mock-key');

        activate(vscode.mockContext);

        const callback = vscode.commands.registerCommand.mock.calls.find(call => call[0] === 'cortyx.set_api_key')?.[1];
        await callback();

        expect(vscode.mockContext.globalState.update).toHaveBeenCalledWith('apiKey', 'mock-key');
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('LLM provider API key set');
    });
});