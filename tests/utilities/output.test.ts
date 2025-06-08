//output.test.ts

import * as vscode from '../mocks/vscode';
import { Output } from '../../src/utilities/output';

describe('Output', () => {
    let output: Output;

    beforeEach(() => {
        jest.clearAllMocks();
        output = new Output();

        // @ts-expect-error: override private method for test
        output.formatTimestamp = () => '2025-06-06T12:00:00.000Z';
    });

    describe('constructor', () => {
        it('should create a new output channel', () => {
            expect(vscode.window.createOutputChannel).toHaveBeenCalledTimes(1);
        });
    });

    describe('clear', () => {
        it('should clear the output channel', () => {
            output.clear();
            expect(vscode.mockOutputChannel.clear).toHaveBeenCalledTimes(1);
        });
    });

    describe('show', () => {
        it('should show the output channel (default preserveFocus = true)', () => {
            output.show();
            expect(vscode.mockOutputChannel.show).toHaveBeenCalledWith(true);
        });

        it('should show the output channel with preserveFocus = false', () => {
            output.show(false);
            expect(vscode.mockOutputChannel.show).toHaveBeenCalledWith(false);
        });
    });

    describe('add', () => {
        it('should append raw message', () => {
            output.add('raw message');
            expect(vscode.mockOutputChannel.append).toHaveBeenCalledWith('raw message');
        });
    });

    describe('addLine', () => {
        it('should append a line', () => {
            output.addLine('a line');
            expect(vscode.mockOutputChannel.appendLine).toHaveBeenCalledWith('a line');
        });
    });

    describe('clearAndShow', () => {
        it('should clear, show, and add a line', () => {
            output.clearAndShow('hi');
            expect(vscode.mockOutputChannel.clear).toHaveBeenCalled();
            expect(vscode.mockOutputChannel.show).toHaveBeenCalled();
            expect(vscode.mockOutputChannel.appendLine).toHaveBeenCalledWith('hi');
        });
    });

    describe('info', () => {
        it('should log an info message with timestamp', () => {
            output.info('some info');
            expect(vscode.mockOutputChannel.appendLine).toHaveBeenCalledWith(
                '2025-06-06T12:00:00.000Z | [INFO] | some info'
            );
        });
    });

    describe('warn', () => {
        it('should log a warning message with timestamp', () => {
            output.warn('a warning');
            expect(vscode.mockOutputChannel.appendLine).toHaveBeenCalledWith(
                '2025-06-06T12:00:00.000Z | [WARN] | a warning'
            );
        });
    });

    describe('error', () => {
        it('should log an error message with timestamp', () => {
            output.error('an error occurred');
            expect(vscode.mockOutputChannel.appendLine).toHaveBeenCalledWith(
                '2025-06-06T12:00:00.000Z | [ERROR] | an error occurred'
            );
        });
    });
});
