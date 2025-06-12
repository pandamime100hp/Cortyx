//inputHelpers.ts

import { window } from 'vscode'

/**
 * Abstract function for creating a quick pick input enabling end user to input information.
 * 
 * @param placeholder Text displayed to indicate what to do.
 * @param items List of strings containing to display as options.
 * @param errorMsg Text displayed from a VSCode Warning Window if an error occurs.
 * @returns Promise of a string if successful, otherwise undefined.
 */
export async function showQuickPick(placeholder: string, items: string[], errorMsg: string): Promise<string | undefined> {
    const quickPick: string | undefined = await window.showQuickPick(
        items, 
        { placeHolder: placeholder, }
    );

    if (!quickPick) {
        window.showWarningMessage(errorMsg);
    }

    return quickPick;
}

/**
 * Abstract function for creating an input box enabling end user to input information.
 * 
 * @param prompt Text displayed to user indicating what to do.
 * @param secret Boolean value which sets the input box to a secret format or not.
 * @param validation Text which is compared against the entered value for validation.
 * @param validationMsg Text displayed if the user enters input that does not fit the validation check.
 * @param errorMsg Text displayed to user if there was an error.
 * @returns Promise of a string if successful, otherwise undefined.
 */
export async function showInputBox(prompt: string, secret: boolean = false, validation: string, validationMsg: string, errorMsg: string): Promise<string | undefined> {
    const inputBox: string | undefined = await window.showInputBox({
        prompt: prompt,
        password: secret ? true : false,
        validateInput: input => input.trim() === validation ? validationMsg : undefined
    });

    if (!inputBox) {
        window.showWarningMessage(errorMsg);
    }

    return inputBox;
}