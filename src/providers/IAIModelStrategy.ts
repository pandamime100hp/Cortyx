export interface IAIModelStrategy {
    // eslint-disable-next-line no-unused-vars
    generateResponse(prompt: string): Promise<string>;
}