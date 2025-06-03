import { IAIModelStrategy } from "./IAIModelStrategy";

export class AIModelContext {
    private strategy: IAIModelStrategy;

    constructor(strategy: IAIModelStrategy){
        this.strategy = strategy;
    }

    setStrategy(strategy: IAIModelStrategy){
        this.strategy = strategy;
    }

    async ask(prompt: string): Promise<string>{
        return await this.strategy.generateResponse(prompt);
    }
}