//mocks/outputs.ts

export const mockOutputChannel = {
  appendLine: jest.fn(),
  clear: jest.fn(),
  show: jest.fn(),
  name: 'Cortyx',
  dispose: jest.fn(),
  append: jest.fn(),
  hide: jest.fn(),
};

export const Output = jest.fn().mockImplementation(() => ({
  aiOutputChannel: mockOutputChannel,
  clear: jest.fn(() => mockOutputChannel.clear()),
  show: jest.fn(() => mockOutputChannel.show()),
  add: jest.fn((msg: string) => mockOutputChannel.append(msg)),
  addLine: jest.fn((msg: string) => mockOutputChannel.appendLine(msg)),
  clearAndShow: jest.fn(),
  info: jest.fn((msg: string) => mockOutputChannel.appendLine(msg)),
  warn: jest.fn((msg: string) => mockOutputChannel.appendLine(msg)),
  error: jest.fn((msg: string) => mockOutputChannel.appendLine(msg)),
}));
