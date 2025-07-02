export const mainView: string = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src {CSP_SOURCE}; script-src 'nonce-{NONCE}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="{URI_MAIN_CSS}" rel="stylesheet">
    <link href="{URI_VSCODE_CSS}" rel="stylesheet">
    <title>Cortyx</title>
</head>
<body>
    <h3>Welcome to Cortyx</h3>
    <p>This panel can show AI suggestions, files to review, etc.</p>

    <div class="ui-container">
        <div class="button-container">
            <button class="dev-button" id="dev-btn">Code</button>
            <button class="test-button" id="test-btn">Test</button>
            <button class="review-button selected" id="review-btn">Review</button>
        </div>
        
        <textarea 
            class="prompt-input-textarea" 
            id="prompt-input" 
            name="prompt-input-textarea" 
            rows="6"
            placeholder="Enter your prompt here..."
        ></textarea>
        
        <div class="button-container">
            <button class="prompt-button" id="prompt-btn">Prompt AI</button>
            <button class="reset-button" id="reset-btn">Reset Context</button>
        </div>
    </div>

    <div class="loading-indicator" id="loading-indicator" style="display: none;">🤖 Thinking...</div>

    <script src="{URI_SCRIPT}" nonce="{NONCE}"></script>
</body>
</html>
`;