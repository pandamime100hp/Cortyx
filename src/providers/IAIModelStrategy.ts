export interface IAIModelStrategy {
    generateResponse(prompt: string): Promise<string>;
}