import { Disposable } from "vscode";

export interface ICommand {
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