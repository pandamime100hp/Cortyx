import { ListProjectFiles } from '../../src/commands/list-project-files.command';
import { commands, window, workspace, ProgressLocation } from '../mocks/vscode';
import { Output } from '../../src/utilities/output.utility';
import { buildFileTree } from '../../src/utilities/file-structure.utility';

// Mocks
jest.mock('../../src/utilities/output.utility');
jest.mock('../../src/utilities/file-structure.utility');

describe('ListProjectFiles Command', () => {
    const mockInfo = jest.fn();
    const mockClearAndShow = jest.fn();
    const mockShowErrorMessage = jest.fn();
    const mockWithProgress = jest.fn();

    const fakeUri = { fsPath: '/fake/path' };

    beforeEach(() => {
        jest.clearAllMocks();

        (Output.getInstance as jest.Mock).mockReturnValue({
            info: mockInfo,
            clearAndShow: mockClearAndShow,
        });

        (window.showErrorMessage as jest.Mock) = mockShowErrorMessage;
        (window.withProgress as jest.Mock) = mockWithProgress;

        // Default mock for withProgress just runs the callback
        mockWithProgress.mockImplementation((_opts, callback) => callback());
    });

    it('should register the command', () => {
        const registerSpy = jest.spyOn(commands, 'registerCommand').mockReturnValue({ dispose: jest.fn() });

        const command = new ListProjectFiles();
        const disposable = command.register();

        expect(registerSpy).toHaveBeenCalledWith(command.id, expect.any(Function));
        expect(disposable).toBeDefined();
        expect(mockInfo).toHaveBeenCalledWith(`Registering command: ${command.id}`);

        registerSpy.mockRestore();
    });

    it('should show error if no workspace is open', () => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (workspace.workspaceFolders as any) = undefined;

        const command = new ListProjectFiles();
        command.execute();

        expect(mockShowErrorMessage).toHaveBeenCalledWith('No workspace is open');
        expect(mockWithProgress).not.toHaveBeenCalled();
    });

    it('should build and log the project file tree', async () => {
        const mockTree = [{ name: 'index.ts', path: '/fake/path/index.ts', type: 'file' }];
        (buildFileTree as jest.Mock).mockResolvedValue(mockTree);
        (workspace.workspaceFolders as any) = [{ uri: fakeUri }];

        const command = new ListProjectFiles();
        await command.execute();

        expect(mockWithProgress).toHaveBeenCalledWith(
            expect.objectContaining({
                location: ProgressLocation.Window,
                title: 'Building project file tree...',
            }),
            expect.any(Function)
        );

        expect(buildFileTree).toHaveBeenCalledWith('/fake/path', '/fake/path');
        expect(mockClearAndShow).toHaveBeenCalledWith(expect.stringContaining(JSON.stringify(mockTree, null, 2)));
    });

    it('should handle and show error when buildFileTree throws', async () => {
        (buildFileTree as jest.Mock).mockRejectedValue('Filesystem error');
        (workspace.workspaceFolders as any) = [{ uri: fakeUri }];

        const command = new ListProjectFiles();
        await command.execute();

        expect(mockShowErrorMessage).toHaveBeenCalledWith('Error building file tree: Filesystem error');
    });
});
