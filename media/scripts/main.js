// @ts-check

(function () {
    /* eslint-disable no-undef */
    const vscode = acquireVsCodeApi();
    // const oldState = vscode.getState() || {};

    /* eslint-disable no-undef */
    const promptButton = document.querySelector('.prompt-button');
    const resetButton = document.querySelector('.reset-button');
    const loadingIndicator = document.getElementById('loading-indicator');


    const devBtn = document.getElementById('dev-btn');
    const testBtn = document.getElementById('test-btn');
    const reviewBtn = document.getElementById('review-btn');

    const modeButtons = [devBtn, testBtn, reviewBtn];
    let currentMode = 'review'; // Default mode

    devBtn?.addEventListener('click', () => setMode('dev', devBtn));
    testBtn?.addEventListener('click', () => setMode('test', testBtn));
    reviewBtn?.addEventListener('click', () => setMode('review', reviewBtn));

    promptButton?.addEventListener('click', () => {
        promptAiEvent();
    });

    resetButton?.addEventListener('click', () => {
        vscode.postMessage({ type: 'resetContext' });
    });

    // Handle messages sent from the extension
    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'dev':
                console.log('Dev prompt triggered by extension');
                break;
            case 'test':
                console.log('Test prompt triggered by extension');
                break;
            case 'review':
                console.log('Review prompt triggered by extension');
                break;
            case 'promptAi':
                // Could trigger UI update or something in response
                console.log('AI prompt triggered by extension');
                promptAiEvent();
                break;
            case 'aiResponse':
                console.log('AI response received');
                loadingIndicator.style.display = 'none';
                break;
            case 'resetContext':
                console.log('AI context reset triggered by extension');
                break;
            // Add more cases here
        }
    });

    function setMode(mode, button) {
        currentMode = mode;
        vscode.postMessage({ type: mode });

        modeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    }

    function promptAiEvent() {
        const promptInput = document.getElementById('prompt-input');
        const prompt = promptInput?.value.trim();

        if (!prompt) return;

        loadingIndicator.style.display = 'block';

        vscode.postMessage({
            type: 'promptAi',
            payload: { prompt },
            mode: currentMode
        });

        promptInput.value = '';
    }
})();
