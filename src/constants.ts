//constants.ts

/* eslint-disable no-unused-vars */
export enum COMMANDS {
    GET_MODELS = 'cortyx.get_models',
    LIST_PROJECT_FILES = 'cortyx.list_project_files',
    PROMPT_AI = 'cortyx.prompt_ai',

    // Setup related commands
    SET_ACTIVATE = 'cortyx.activate',
    SET_API_KEY = 'cortyx.set_api_key',
    SET_API_URL = 'cortyx.set_api_url',
    SET_LLM = 'cortyx.set_llm',
    SET_MODEL = 'cortyx.set_llm_model',
};

export const GLOBAL_STATE_KEYS = {
    LLM: 'llm',
    API_URL: 'apiUrl',
    API_KEY: 'apiKey',
    MODEL: 'model',
    MODELS: 'models'
};