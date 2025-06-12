import { Disposable } from "vscode";

export interface ExtensionCommand {
  readonly id: string;
  register(): Disposable;
  execute(...args: any[]): Promise<void>;
}