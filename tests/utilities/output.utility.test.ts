import { 
    mockOutputChannel, 
    window 
} from '../mocks/vscode';
import { Output } from '../../src/utilities/output.utility';

describe('Output', () => {
    let output: Output;

    beforeEach(() => {
        jest.clearAllMocks();
        output = Output.getInstance();

        // @ts-expect-error: override private method for test
        output.formatTimestamp = () => '2025-06-06T12:00:00.000Z';
    });

    describe('constructor', () => {
        it('should create two new output channels', () => {
            expect(window.createOutputChannel).toHaveBeenCalledTimes(2);
        });

        it('should return the same instance for multiple calls', () => {
            const instance1 = Output.getInstance();
            const instance2 = Output.getInstance();
            expect(instance1).toBe(instance2);
        });

        it('should create output channels', () => {
            const output = Output.getInstance();
            expect(output['aiOutputChannel']).toBeDefined();
            expect(output['logsOutputChannel']).toBeDefined();
        });
    });

    describe('clear', () => {
        it('should clear the aiOutputChannel', () => {
            const output = Output.getInstance();
            const clearSpy = jest.spyOn(output['aiOutputChannel'], 'clear');
            output.clear();
            expect(clearSpy).toHaveBeenCalled();
        });
    });

    describe('show', () => {
        it('should show the output channel (default preserveFocus = true)', () => {
            output.show();
            expect(mockOutputChannel.show).toHaveBeenCalledWith(true);
        });

        it('should show the output channel with preserveFocus = false', () => {
            output.show(false);
            expect(mockOutputChannel.show).toHaveBeenCalledWith(false);
        });

        it('should show the aiOutputChannel with preserveFocus', () => {
            const output = Output.getInstance();
            const showSpy = jest.spyOn(output['aiOutputChannel'], 'show');
            output.show(false);
            expect(showSpy).toHaveBeenCalledWith(false);
        });
    });

    describe('add', () => {
        it('should append or appendLine based on shouldAppendLine flag', () => {
            const output = Output.getInstance();
            const appendLineSpy = jest.spyOn(output['aiOutputChannel'], 'appendLine');
            const appendSpy = jest.spyOn(output['aiOutputChannel'], 'append');

            output.add('Test message', true);
            expect(appendLineSpy).toHaveBeenCalledWith('Test message');
            expect(appendSpy).not.toHaveBeenCalled();

            output.add('Test message', false);
            expect(appendSpy).toHaveBeenCalledWith('Test message');
            expect(appendLineSpy).toHaveBeenCalledTimes(1); // Ensure appendLine was only called once
        });
    });

    describe('clearAndShow', () => {
        it('should clear, show, and add a line', () => {
            output.clearAndShow('hi');
            expect(mockOutputChannel.clear).toHaveBeenCalled();
            expect(mockOutputChannel.show).toHaveBeenCalled();
            expect(mockOutputChannel.appendLine).toHaveBeenCalledWith('hi');
        });
    });

    describe('info', () => {
        it('should log an info message with timestamp', () => {
            output.info('some info');
            expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
                '2025-06-06T12:00:00.000Z | INFO | some info'
            );
        });
    });

    describe('warn', () => {
        it('should log a warning message with timestamp', () => {
            output.warn('a warning');
            expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
                '2025-06-06T12:00:00.000Z | WARN | a warning'
            );
        });
    });

    describe('error', () => {
        it('should log an error message with timestamp', () => {
            output.error('an error occurred');
            expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
                '2025-06-06T12:00:00.000Z | ERROR | an error occurred'
            );
        });
    });
});
