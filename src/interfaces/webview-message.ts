interface IAIAssistantMessage {
    type: 'dev' | 'test' | 'review' | 'promptAi' | 'aiResponse' | 'resetContext' | 'log'; // add other types as needed
    payload?: any;
}