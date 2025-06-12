## ✅ Naming Conventions

| Artifact Type | Naming Convention | Example |
|--------|--------|--------|
| File names | kebab-case | `ai-model-context.ts` |
| Classes | PascalCase| `OpenAIStrategy` |
| Interfaces | `I` prefix + PascalCase | `IAIProviderStrategy` |
| Types | PascalCase | `ModelInfo`, `ChatRequestParams` |
| Enums | PascalCase | `ProviderType` |
| Functions/Methods | camelCase | `generateResponse()` | 
| Constants | UPPER_SNAKE_CASE | `DEFAULT_MODEL_NAME` | 
| Variables | camelCase | `strategy`, `outputChannel` | 
| Folders | kebab-case | `strategies/`, `commands/` | 

## 📁 Folder Structure with Sample Files

```plaintext
src/
├── commands/                        # VS Code commands
│   ├── generate-docs.command.ts
│   ├── run-analysis.command.ts
│   └── get-llm-models.command.ts
├── strategies/                      # AI provider strategy implementations
│   ├── openai-strategy.ts
│   ├── claude-strategy.ts
│   ├── ollama-strategy.ts
│   └── lm-studio-strategy.ts
├── context/                         # Context wrappers and strategy injectors
│   ├── ai-model-context.ts
│   └── context-provider.ts
├── interfaces/                      # Common interface contracts
│   ├── iai-provider-strategy.ts
│   ├── igeneration-options.ts
│   └── iconfigurable.ts
├── types/                           # Shared types & enums
│   ├── model.types.ts
│   ├── chat.types.ts
│   └── command.types.ts
├── registry/                        # Command and strategy registries
│   ├── command-registry.ts
│   └── provider-registry.ts
├── utilities/                       # Shared helper functions and classes
│   ├── context-helpers.ts
│   ├── logger.ts
│   └── string-utils.ts
├── configuration/                   # Configuration handling
│   ├── extension-config.ts
│   ├── config-loader.ts
│   └── config-updater.ts
├── constants/                       # Constant values, keys, and defaults
│   ├── default-models.ts
│   ├── config-keys.ts
│   └── extension-constants.ts
├── extension.ts                     # VS Code extension entry point
└── globals.d.ts                     # Global type declarations (if needed)
```

