//OpenAIStrategy.test.ts

import mockFetch, { createMockFetchResponse } from '../../mocks/fetch';
import { OpenAIStrategy } from '../../../src/providers/openai/OpenAIStrategy';
// import { activate } from '../../../src/extension';
import * as vscode from '../../mocks/vscode';


describe('Open AI Strategy', () => {
    const mockModels = {
        'object': 'list',
        'data': [
            {
                'id': 'model-id-0',
                'object': 'model',
                'created': 1686935002,
                'owned_by': 'organization-owner'
            }, {
                'id': 'model-id-1',
                'object': 'model',
                'created': 1686935002,
                'owned_by': 'organization-owner',
            }, {
                'id': 'model-id-2',
                'object': 'model',
                'created': 1686935002,
                'owned_by': 'openai'
            },
        ]
    }

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});

        mockFetch.mockResolvedValue(createMockFetchResponse(mockModels));

        vscode.mockContext.globalState.get = jest.fn((key: string) => {
            if (key === 'apiKey') return 'mock_token';
            if (key === 'apiUrl') return 'https://mock-api.openai.com/v1';
            return undefined;
        });
    });

    afterEach(() => {
        (console.log as jest.Mock).mockRestore();
        jest.resetAllMocks();
    });

    it('should return missing env vars exception', () => {
        vscode.mockContext.globalState.get = jest.fn(() => undefined);
        expect(() => new OpenAIStrategy(vscode.mockContext)).toThrow('Missing OpenAI configuration: API Key URL');
    });

    it('should return mocked models', async () => {          
        const result = await new OpenAIStrategy(vscode.mockContext).getModels()

        expect(fetch).toHaveBeenCalled();
        expect(result).toStrictEqual(mockModels);
    });

    // it('should call showInformationMessage for get_models', async () => {
    //     activate(vscode.mockContext);

    //     const command = vscode.commands.registerCommand.mock.calls.find(
    //         ([name]) => name === 'cortyx.get_models')?.[1];
        
    //     if (!command) {
    //         throw new Error('get_models command not registered');
    //     }
        
    //     await command();

    //     expect(fetch).toHaveBeenCalled();
    //     expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
    //         expect.stringContaining('Models:')
    //     );
    // });

    it('should throw error when fetch response is not ok', async () => {
        mockFetch.mockResolvedValue(createMockFetchResponse({ error: 'fail' }, 500)); // 500 status

        const strategy = new OpenAIStrategy(vscode.mockContext);
        await expect(strategy.getModels()).rejects.toThrow(/OpenAI error: 500/);

        expect(fetch).toHaveBeenCalled();
    });
});