# Cortyx - Intelligent Code Assistant for VS Code

**Cortyx** is a VS Code extension that offers intelligent code suggestions and insights, tailored to the context of your current codebase. It reads your entire project and provides accurate, relevant recommendations, helping developers improve their code, refactor more effectively, and debug faster.

## Features
- **Real-Time Code Suggestions**: Receive intelligent feedback and improvements for your code based on context.
- **Context-Aware Insights**: Cortyx keeps your code's context updated, ensuring suggestions are always relevant to the latest code.
- **Lightweight and Accurate**: Designed to prioritize accuracy over performance for a seamless development experience.

## How It Works
1. **Context Refresh**: Each time you ask Cortyx a question, it analyzes the entire codebase to ensure up-to-date insights.
2. **User Commands**: Trigger Cortyx through VS Code's Command Palette to ask code-related questions.
3. **AI-Powered Assistance**: Get accurate recommendations, from bug fixes to code style improvements and beyond.

## Installation
1. Open VS Code.
2. Go to the Extensions view (`Ctrl+Shift+X`).
3. Search for **Cortyx**.
4. Click **Install**.

## Usage
1. Open the Command Palette (`Ctrl+Shift+P`).
2. Type `Ask Cortyx` and press Enter.
3. Type your question about the codebase, and Cortyx will analyze and provide relevant insights.
   
## Configuration
- **Model Source**: Choose between local or remote AI models.
- **Codebase Scope**: Configure which folders or files should be analyzed (e.g., excluding `node_modules` or `.git`).

## Future Plans
- Integrating more advanced AI models for better accuracy.
- Optimizing performance for large codebases through intelligent file diffing and caching.

## Contributing
We welcome contributions! If you'd like to help improve **Cortyx**, feel free to fork the repository, submit issues, and create pull requests. Please ensure all code is well-tested and follows our contribution guidelines.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
