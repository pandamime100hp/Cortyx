import { Disposable } from "vscode";

export interface IExtensionCommand {
  readonly id: string;

  /**
   * 
   */
  register(): Disposable;

  /**
   * 
   * @param args 
   */
  execute(...args: unknown[]): Promise<void> | void;
}