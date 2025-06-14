import { ICommand } from "./command";

export interface ICommandStrategy {
    getCommands(): ICommand[];
}