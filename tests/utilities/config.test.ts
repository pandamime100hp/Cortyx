import { Config } from '../../src/utilities/config';
import * as vscode from 'vscode';


describe('Config', () => {
    afterEach(() => {
        jest.resetModules(); // clear module cache to apply fresh mocks
        jest.clearAllMocks(); // reset spies
    });

    it('should create an empty config', async () => {
        const { Config } = await import('../../src/utilities/config');

        const result = new Config().load();

        expect(result).toEqual(Promise.resolve({}));
    });

    it('should set the configPath based on mocked root', async () => {
        jest.mock('../../src/utilities/file_structure', () => ({
            getProjectRoot: () => '/mock/project/root'
        }));

        const { Config } = await import('../../src/utilities/config');
        const config = new Config();

        expect(config['configPath']).toContain('\\mock\\project\\root\\.cortyx\\config.json');
    });
    
    it('should show an error if no workspace is open', async () => {
        jest.mock('../../src/utilities/file_structure', () => ({
            getProjectRoot: jest.fn(() => undefined)
        }));
        
        const vscode = await import('vscode');
        const { Config } = await import('../../src/utilities/config');
        new Config();
        
        expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('No workspace folder open. Please open a project to continue.');
    });
});