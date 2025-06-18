// tests/configuration/openai-configuration.test.ts

import { OpenAIConfiguration } from '../../src/configuration/openai-configuration';
import { Output } from '../../src/utilities/output.utility';
import { showInputBox } from '../../src/utilities/input-helpers.utility';
import { LLM_API_URL, LLM_API_KEY } from '../../src/constants/constants';

jest.mock('../../src/utilities/output.utility');
jest.mock('../../src/utilities/input-helpers.utility');

const mockUpdate = jest.fn();
const mockGet = jest.fn();
const mockGetSecrets = jest.fn();

/* eslint-disable @typescript-eslint/no-unused-vars */
const createMockContext = (url?: string, apiKey?: string) => ({
  globalState: {
    get: mockGet,
    update: mockUpdate,
  },
  secrets: {
    get: mockGetSecrets,
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
} as any);

describe('OpenAIConfiguration', () => {
  const mockInfo = jest.fn();
  const mockWarn = jest.fn();
  (Output.getInstance as jest.Mock).mockReturnValue({
    info: mockInfo,
    warn: mockWarn,
    error: jest.fn(),
    add: jest.fn(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly with context values', () => {
    mockGet.mockReturnValue('https://api.openai.com');
    mockGetSecrets.mockReturnValue(Promise.resolve('secret-key'));
    const context = createMockContext();

    const config = new OpenAIConfiguration(context);

    expect(config.url).toBe('https://api.openai.com');
    expect(mockInfo).toHaveBeenCalledWith('OpenAIConfiguration initialising...');
    expect(mockInfo).toHaveBeenCalledWith('OpenAIConfiguration initialised');
  });

  it('should configure API key if missing', async () => {
    const context = createMockContext();
    const config = new OpenAIConfiguration(context);
    (showInputBox as jest.Mock).mockResolvedValue('new-api-key');

    config['apiKey'] = undefined;
    await config.configureApiKey();

    expect(mockUpdate).toHaveBeenCalledWith(LLM_API_KEY, 'new-api-key');
    expect(mockWarn).toHaveBeenCalledWith('API key set');
  });

  it('should configure API URL if missing', async () => {
    const context = createMockContext();
    const config = new OpenAIConfiguration(context);
    (showInputBox as jest.Mock).mockResolvedValue('https://new.url');

    config.url = undefined;
    await config.configureUrl();

    expect(mockUpdate).toHaveBeenCalledWith(LLM_API_URL, 'https://new.url');
    expect(config.url).toBe('https://new.url');
  });

  it('getStrategy should return OpenAIStrategy', () => {
    const context = createMockContext();
    const config = new OpenAIConfiguration(context);

    const strategy = config.getStrategy();

    expect(strategy.constructor.name).toBe('OpenAIStrategy');
  });

  it('getCommands should return OpenAI commands', () => {
    const context = createMockContext();
    const config = new OpenAIConfiguration(context);

    const commands = config.getCommands();

    expect(commands.length).toBeGreaterThan(0);
    expect(commands[0].constructor.name).toBe('SetOpenAIAPIKey');
  });
});
