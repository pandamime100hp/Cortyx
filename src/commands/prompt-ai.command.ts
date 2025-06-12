import { Disposable } from "vscode";
import { IExtensionCommand } from "../interfaces/command";

export class PromptAI implements IExtensionCommand {
    readonly id: string = 'cortyx.promptAI';

    register(): Disposable {
        throw new Error("Method not implemented.");
    }
    execute(...args: unknown[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}


// export function promptAi(context: vscode.ExtensionContext, strategy: OpenAIStrategy, output: Output) {
//     return vscode.commands.registerCommand(COMMAND.PROMPT_AI, async () => {
//         const prompt: string | undefined = await vscode.window.showInputBox({
//             prompt: 'Enter your AI prompt',
//             password: false
//         });

//         const model: string | undefined = context.globalState.get(GLOBAL_STATE_KEYS.MODEL)
//         if (!model){
//             vscode.window.showErrorMessage('No LLM model is set');
//             return;
//         }

//         const BASE_PROMPT: string = 'You are an experienced Microsoft software developer with years of experience in web development. You are familiar with the best practices and standards set out by MS. You have been tasked with helping me on my project. Review the below input and provide critical feedback giving justifications:\n'

//         const options: ChatCompletionOptions = {
//             model: String(model),
//             messages: [{role: 'user', content: String(BASE_PROMPT + prompt)}]
//         }

//         output.clearAndShow('🤖 Waiting for AI Response...');

//         try {
//             const response = await strategy.generateResponse(options)

//             output.clearAndShow('🤖 AI Response:\n' + response.choices[0].message.content);
//         } catch (error) {
//             vscode.window.showErrorMessage(`Failed to fetch response: ${error}`);
//             output.clearAndShow(`🤖 Failed to fetch response: ${error}`);
//             return;
//         }
//     });
// }