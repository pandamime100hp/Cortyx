import { window } from 'vscode'

/**
 * Displays a quick pick input for user selection.
 *
 * @param placeholder - Text indicating what to do.
 * @param items - Array of strings to be displayed as options.
 * @param errorMsg - Message shown if the user cancels or an error occurs.
 * @returns A promise resolving to the selected string, or undefined if canceled.
 */
export async function showQuickPick(placeholder: string, items: string[], errorMsg: string): Promise<string | undefined> {
    const quickPick = await window.showQuickPick(items, { placeHolder: placeholder});

    if (!quickPick) {
        window.showWarningMessage(errorMsg);
    }

    return quickPick;
}

/**
 * Displays an input box for user input.
 *
 * @param prompt - Text displayed to the user.
 * @param secret - Whether the input should be masked.
 * @param validation - A validation rule (could be regex or a specific string).
 * @param validationMsg - Message displayed if validation fails.
 * @param errorMsg - Message shown if an error occurs.
 * @returns A promise resolving to the input string, or undefined if canceled.
 */
export async function showInputBox(prompt: string, secret: boolean = false, validation: string, validationMsg: string, errorMsg: string): Promise<string | undefined> {
    const inputBox = await window.showInputBox({
        prompt: prompt,
        password: secret,
        validateInput: input => input.trim() === validation ? validationMsg : undefined
    });

    if (!inputBox) {
        window.showWarningMessage(errorMsg);
    }

    return inputBox;
}