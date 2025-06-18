import { Configuration } from '../../src/configuration/configuration';
import { ExtensionContext } from 'vscode';
import { OpenAIConfiguration } from '../../src/configuration/openai-configuration';
import { LLM_PROVIDER } from '../../src/constants/constants';
import { showQuickPick } from '../../src/utilities/input-helpers.utility';
import { Output } from '../../src/utilities/output.utility';

jest.mock('../../src/utilities/output.utility');
jest.mock('../../src/utilities/input-helpers.utility');
jest.mock('../../src/configuration/openai-configuration');

const mockInfo = jest.fn();
const mockError = jest.fn();
const mockAdd = jest.fn();

(Output.getInstance as jest.Mock).mockReturnValue({
  info: mockInfo,
  error: mockError,
  add: mockAdd,
});

/* eslint-disable @typescript-eslint/no-explicit-any */
const mockGlobalState = new Map<string, any>();

const createMockContext = (): ExtensionContext => ({
    globalState: {
        get: jest.fn((key: string) => mockGlobalState.get(key)),
        update: jest.fn((key: string, value: any) => {
            mockGlobalState.set(key, value);
            return Promise.resolve();
        }),
    },
    subscriptions: [],
} as unknown as ExtensionContext);

describe('Configuration', () => {
    let context: ExtensionContext;

    beforeEach(() => {
        jest.clearAllMocks();
        mockGlobalState.clear();
        context = createMockContext();
    });

    describe('constructor', () => {
        it('should initialize with no provider if not set in globalState', () => {
            const config = new Configuration(context);
            expect(config['provider']).toBeUndefined();
        });

        it('should initialize with a provider from globalState', () => {
            mockGlobalState.set(LLM_PROVIDER, 'OpenAI');
            const config = new Configuration(context);
            expect(config['provider']).toBe('OpenAI');
        });
    });

    describe('getProviderConfiguration', () => {
        it('should return a valid provider configuration', () => {
            mockGlobalState.set(LLM_PROVIDER, 'OpenAI');
            const config = new Configuration(context);
            config['provider'] = 'OpenAI';
            const providerConfig = config.getProviderConfiguration();
            expect(providerConfig).toBeInstanceOf(OpenAIConfiguration);
        });

        it('should throw an error if provider is invalid', () => {
            const config = new Configuration(context);
            config['provider'] = 'InvalidProvider';
            expect(() => config.getProviderConfiguration()).toThrowError('There is no strategy for the provider InvalidProvider');
        });
    });

    describe('getModel', () => {
        it('should return AIModelContext from providerConfiguration', () => {
            const config = new Configuration(context);
            const mockStrategy = { name: 'OpenAI', promptAi: jest.fn(), getLlmModels: jest.fn() };
            config['providerConfiguration'] = {
                getStrategy: () => mockStrategy
            } as any;
            const model = config.getModel();
            expect(model.getProviderName()).toBe('OpenAI');
        });

        it('should throw if providerConfiguration is not set', () => {
            const config = new Configuration(context);
            expect(() => config.getModel()).toThrowError('Provider configuration has not been set');
        });
    });

    describe('getCommands', () => {
        it('should return commands from providerConfiguration', () => {
            const config = new Configuration(context);
            const mockCommands = [{ id: 'mockCommand' }];
            config['providerConfiguration'] = {
                getCommands: () => mockCommands
            } as any;

            const result = config.getCommands();
            expect(result).toEqual(mockCommands);
        });

        it('should throw if providerConfiguration is not set', () => {
            const config = new Configuration(context);
            expect(() => config.getCommands()).toThrowError('Provider configuration is not set');
        });
    });

    describe('configureLlmProvider', () => {
        it('should update global state and set provider when user selects a provider', async () => {
            (showQuickPick as jest.Mock).mockResolvedValue('OpenAI');
            const config = new Configuration(context);
            await config.configureLlmProvider();

            expect(context.globalState.update).toHaveBeenCalledWith(LLM_PROVIDER, 'OpenAI');
            expect(config['provider']).toBe('OpenAI');
        });

        it('should not update global state if user cancels selection', async () => {
            (showQuickPick as jest.Mock).mockResolvedValue(undefined);
            const config = new Configuration(context);
            await config.configureLlmProvider();

            expect(context.globalState.update).not.toHaveBeenCalled();
            expect(config['provider']).toBeUndefined();
        });
    });

    describe('configure', () => {
        it('should call configureLlmProvider and setup providerConfiguration', async () => {
            mockGlobalState.set(LLM_PROVIDER, 'OpenAI');
            const config = new Configuration(context);
            const mockConfigure = jest.fn();
            (OpenAIConfiguration as jest.Mock).mockImplementation(() => ({
                configure: mockConfigure
            }));

            await config.configure();

            expect(mockConfigure).toHaveBeenCalled();
        });
    });
});
