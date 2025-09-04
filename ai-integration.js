// AI Image Analysis Integration for AGI Type Tool
class AIImageIntegration {
    constructor() {
        this.selectedFile = null;
        this.isProcessing = false;

        // =================================
        // API KEY CONFIGURATION
        // =================================
        // 1. Get your OpenAI API key from: https://platform.openai.com/api-keys
        // 2. Replace 'your-openai-api-key-here' with your actual API key
        // 3. Example: this.API_KEY = 'sk-proj-abcd1234...';
        // =================================
        this.API_KEY = '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'; // Replace this with your OpenAI API key
        this.AI_PROVIDER = 'openai'; // Fixed to OpenAI only

        this.initializeElements();
        this.bindEvents();
        this.updateApiHint();

        // Initialize keyboard input state
        this.initializeKeyboardInput();
    }

    initializeElements() {
        // AI Panel elements
        this.aiPanel = document.getElementById('ai-panel');
        this.aiPanelToggle = document.getElementById('ai-panel-toggle');
        this.aiPanelContent = document.querySelector('.tp-folder-content');

        // API elements
        this.aiProvider = document.getElementById('aiProvider');
        this.apiKeyInput = document.getElementById('apiKey');
        this.apiHint = document.getElementById('apiHint');

        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.imagePreview = document.getElementById('imagePreview');

        // Control elements
        this.processBtn = document.getElementById('processBtn');
        this.demoBtn = document.getElementById('demoBtn');
        this.loading = document.getElementById('loading');
        this.result = document.getElementById('result');
        this.resultText = document.getElementById('resultText');
        this.resetBtn = document.getElementById('resetBtn');

        // Manual input elements
        this.manualTextInput = document.getElementById('manualTextInput');
        this.manualTypeBtn = document.getElementById('manualTypeBtn');
        this.removeWordBtn = document.getElementById('removeWordBtn');

        // Keyboard input toggle
        this.keyboardInputToggle = document.getElementById('keyboardInputToggle');

        // Initialize keyboard input state
        this.isKeyboardInputEnabled = true;
    }

    bindEvents() {
        // AI Panel toggle
        this.aiPanelToggle.addEventListener('click', () => this.togglePanel());
        document.querySelector('.tp-folder-header').addEventListener('click', () => this.togglePanel());

        // File upload events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Process events
        this.processBtn.addEventListener('click', () => this.processImage());
        this.demoBtn.addEventListener('click', () => this.processDemo());
        this.resetBtn.addEventListener('click', () => this.reset());

        // Manual input events
        if (this.manualTypeBtn) {
            this.manualTypeBtn.addEventListener('click', () => this.processManualInput());
        }
        if (this.removeWordBtn) {
            this.removeWordBtn.addEventListener('click', () => this.removeLastWord());
        }
        if (this.manualTextInput) {
            this.manualTextInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.processManualInput();
                }
            });
        }

        // Keyboard input toggle event
        if (this.keyboardInputToggle) {
            this.keyboardInputToggle.addEventListener('change', (e) => {
                this.toggleKeyboardInput(e.target.checked);
            });
        }
    }

    togglePanel() {
        const folder = document.getElementById('ai-folder');
        const isExpanded = folder.classList.contains('tp-folder-expanded');
        if (isExpanded) {
            folder.classList.remove('tp-folder-expanded');
            this.aiPanelToggle.textContent = '+';
        } else {
            folder.classList.add('tp-folder-expanded');
            this.aiPanelToggle.textContent = '−';
        }
    }

    updateApiHint() {
        // Fixed to OpenAI only
        if (this.apiHint) {
            this.apiHint.innerHTML = 'OpenAI API: <a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com/api-keys</a>';
        }
        if (this.apiKeyInput) {
            this.apiKeyInput.placeholder = 'Enter OpenAI API Key...';
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFileSelect(e) {
        if (e.target.files.length > 0) {
            this.handleFile(e.target.files[0]);
        }
    }

    handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file!');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File too large! Please select an image smaller than 5MB.');
            return;
        }

        this.selectedFile = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.imagePreview.src = e.target.result;
            this.imagePreview.classList.add('show');
            this.processBtn.style.display = 'inline-block';
            this.result.classList.remove('show');
        };
        reader.readAsDataURL(file);
    }

    async processImage() {
        if (!this.selectedFile) {
            alert('Please select an image first!');
            return;
        }

        if (this.isProcessing) return;

        this.isProcessing = true;
        this.processBtn.disabled = true;
        this.loading.classList.add('show');
        this.result.style.display = 'none';

        try {
            let description;

            if (this.API_KEY && this.API_KEY !== 'your-openai-api-key-here') {
                // Test API connection first
                const isConnected = await this.testApiConnection(this.API_KEY, this.AI_PROVIDER);
                if (!isConnected) {
                    throw new Error('Cannot connect to OpenAI API. Please check your API key and internet connection.');
                }

                description = await this.getDescriptionFromOpenAI(this.selectedFile, this.API_KEY);
            } else {
                // Demo mode if API key not configured
                description = await this.getDemoDescription();
            }

            this.showResult(description);
            this.typeDescription(description);
        } catch (error) {
            console.error('Error:', error);
            let errorMessage = error.message;

            if (error.message.includes('401')) {
                errorMessage = 'Invalid API Key. Please check your key.';
            } else if (error.message.includes('403')) {
                errorMessage = 'API Key does not have access. Please check your key.';
            } else if (error.message.includes('429')) {
                errorMessage = 'Too many requests. Please try again later.';
            } else if (error.message.includes('Network error')) {
                errorMessage = 'Network connection error. Please check your internet.';
            }

            this.showResult(`❌ Error: ${errorMessage}`);
        } finally {
            this.isProcessing = false;
            this.processBtn.disabled = false;
            this.loading.classList.remove('show');
        }
    }

    async processDemo() {
        if (this.isProcessing) return;

        this.isProcessing = true;
        this.demoBtn.disabled = true;
        this.loading.classList.add('show');
        this.result.style.display = 'none';

        try {
            const description = await this.getDemoDescription();
            this.showResult(description);
            this.typeDescription(description);
        } catch (error) {
            this.showResult(`❌ Demo Error: ${error.message}`);
        } finally {
            this.isProcessing = false;
            this.demoBtn.disabled = false;
            this.loading.classList.remove('show');
        }
    }

    async getDescriptionFromOpenAI(file, apiKey) {
        const base64 = await this.fileToBase64(file);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "Describe this image in 2-3 words in vietnamese . Return only the words in all cap, no comma and period, emdash, endash and hypernation."
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: base64
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 20
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Cannot connect to OpenAI API. Please check your internet connection.');
            }
            throw error;
        }
    }



    async getDemoDescription() {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const demoDescriptions = [
            'Cảnh đẹp', 'Con mèo', 'Món ăn', 'Hoa đẹp', 'Thành phố',
            'Biển xanh', 'Núi cao', 'Ô tô', 'Người đàn', 'Trẻ em',
            'Cây xanh', 'Nhà cửa', 'Điện thoại', 'Máy tính', 'Sách vở',
            'Bầu trời', 'Mặt trời', 'Mặt trăng', 'Ngôi sao', 'Cầu vồng'
        ];

        return demoDescriptions[Math.floor(Math.random() * demoDescriptions.length)];
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    showResult(description) {
        this.resultText.textContent = description;
        this.result.classList.add('show');
        this.loading.classList.remove('show');
    }

    typeDescription(description) {
        // Clear existing content
        document.getElementById("wrapper").innerHTML = "";
        window.currentWord = null;

        // Create the first word container
        this.createNewWord();

        // Simulate typing the description
        this.simulateTyping(description);
    }

    simulateTyping(text) {
        // Mark AI typing as in progress
        window.aiTypingInProgress = true;

        const words = text.split(' ');
        let wordIndex = 0;
        let charIndex = 0;

        const typeNextChar = () => {
            if (wordIndex >= words.length) {
                // Clear AI typing flag when done
                window.aiTypingInProgress = false;
                return;
            }

            const word = words[wordIndex];
            if (charIndex >= word.length) {
                // Move to next word
                wordIndex++;
                charIndex = 0;
                if (wordIndex < words.length) {
                    // Add space between words
                    this.simulateKeyPress(' ');
                    setTimeout(typeNextChar, 100);
                }
                return;
            }

            const char = word[charIndex];
            this.simulateKeyPress(char);
            charIndex++;

            setTimeout(typeNextChar, 250); // Typing speed
        };

        typeNextChar();
    }

    simulateKeyPress(char) {
        // Handle space ALWAYS as a word separator, regardless of Vietnamese mode
        if (char === ' ') {
            // Create new word directly instead of simulating keypress
            this.createNewWord();
            return;
        }

        // Store original keyboard state
        const originalDirectTyping = window.directTypingEnabled;
        const originalDirectTypingDisabled = window.directTypingDisabled;
        const originalVietnameseActive = window.vietnameseInputActive;

        try {
            // Temporarily enable keyboard input for AI typing
            window.directTypingEnabled = true;
            window.directTypingDisabled = false;
            window.aiTypingInProgress = true; // Flag to identify AI typing

            // Use the Vietnamese input system if available for Vietnamese characters
            if (window.vietnameseInput && window.vietnameseInput.isVietnameseMode) {
                // For Vietnamese characters, use the Vietnamese input system
                window.vietnameseInputActive = true;
                window.vietnameseInput.displayCharacter(char);
            } else {
                // For regular characters, use direct display to avoid conflicts
                this.displayCharacterDirect(char);
            }
        } finally {
            // Restore original state after a short delay
            setTimeout(() => {
                window.directTypingEnabled = originalDirectTyping;
                window.directTypingDisabled = originalDirectTypingDisabled;
                window.vietnameseInputActive = originalVietnameseActive;
                window.aiTypingInProgress = false;
            }, 10);
        }
    }

    displayCharacterDirect(char) {
        // Ensure we have a current word
        if (!window.currentWord) {
            this.createNewWord();
        }

        const newLetter = document.createElement("div");
        newLetter.classList.add('letter');

        // Find the correct SVG path for the character
        const upperChar = char.toUpperCase();
        const svgPath = `chars/${upperChar}.svg`;

        newLetter.style.backgroundImage = `url('${svgPath}')`;
        newLetter.style.backgroundSize = 'contain';
        newLetter.style.backgroundRepeat = 'no-repeat';
        newLetter.style.backgroundPosition = 'center';

        // Add to current word immediately
        window.currentWord.appendChild(newLetter);

        // Set width using SVG width calculation
        if (window.getSVGWidth) {
            window.getSVGWidth(svgPath).then(width => {
                newLetter.style.flex = (width / 17.21).toFixed(2);
                if (window.updateWordFlex) {
                    window.updateWordFlex(window.currentWord);
                }
            }).catch((error) => {
                // Fallback if SVG not found
                newLetter.style.flex = "1";
                if (window.updateWordFlex) {
                    window.updateWordFlex(window.currentWord);
                }
            });
        } else {
            // Fallback width
            newLetter.style.flex = "1";
        }
    }

    createNewWord() {
        if (window.createWordContainer) {
            // Tạo word mới chỉ khi currentWord có content
            if (window.currentWord && window.currentWord.childNodes.length > 0) {
                window.currentWord = window.createWordContainer();
            } else if (!window.currentWord) {
                // Đảm bảo luôn có một word container
                window.currentWord = window.createWordContainer();
            }
        } else {
            // Fallback if createWordContainer is not available
            const word = document.createElement('div');
            word.classList.add('word');
            const wrapper = document.getElementById('wrapper');
            if (wrapper) {
                wrapper.appendChild(word);
                window.currentWord = word;
            }
        }
    }

    processManualInput() {
        if (!this.manualTextInput) {
            console.error('Manual text input element not found');
            alert('Error: Input field not found!');
            return;
        }

        const text = this.manualTextInput.value.trim();

        if (!text) {
            alert('Please enter some text first!');
            return;
        }

        // Disable button during processing
        if (this.manualTypeBtn) {
            this.manualTypeBtn.disabled = true;
            this.manualTypeBtn.textContent = 'Typing...';
        }

        console.log('Processing manual input:', text);

        // Clear input field
        this.manualTextInput.value = '';

        // Type the text using the same method as AI
        this.typeManualText(text);

        // Re-enable button after typing completes
        const estimatedTime = text.length * 150 + 1000; // Rough estimate
        setTimeout(() => {
            if (this.manualTypeBtn) {
                this.manualTypeBtn.disabled = false;
                this.manualTypeBtn.textContent = 'Type Text';
            }
        }, Math.min(estimatedTime, 5000)); // Cap at 5 seconds
    }

    typeManualText(text) {
        // Don't clear existing content, just add to it
        // Only create new word if there isn't a current one
        if (!window.currentWord) {
            this.createNewWord();
        }

        // Simulate typing the text
        this.simulateTyping(text);
    }

    removeLastWord() {
        const wrapper = document.getElementById('wrapper');
        if (!wrapper) {
            console.error('Wrapper not found');
            return;
        }

        const words = wrapper.querySelectorAll('.word');
        if (words.length === 0) {
            console.log('No words to remove');
            return;
        }

        // Remove the last word
        const lastWord = words[words.length - 1];
        lastWord.remove();

        // Update currentWord to the new last word, or null if no words left
        const remainingWords = wrapper.querySelectorAll('.word');
        if (remainingWords.length > 0) {
            window.currentWord = remainingWords[remainingWords.length - 1];
        } else {
            window.currentWord = null;
        }

        console.log(`Removed word. Remaining words: ${remainingWords.length}`);
    }

    toggleKeyboardInput(enabled) {
        this.isKeyboardInputEnabled = enabled;

        if (enabled) {
            console.log('Keyboard input enabled');
            // Enable Vietnamese input if available
            if (window.vietnameseInput) {
                // Re-enable Vietnamese input handlers
                window.vietnameseInputActive = window.vietnameseInput.isVietnameseMode;
            }
            // Set global flag to allow direct typing
            window.directTypingEnabled = true;
            window.directTypingDisabled = false;
        } else {
            console.log('Keyboard input disabled');
            // Disable Vietnamese input handlers
            if (window.vietnameseInput) {
                window.vietnameseInputActive = false;
            }
            // Set global flag to prevent direct typing
            window.directTypingEnabled = false;
            window.directTypingDisabled = true;
        }

        // Update UI state
        this.updateKeyboardInputUI(enabled);
    }

    updateKeyboardInputUI(enabled) {
        // Update toggle switch state
        if (this.keyboardInputToggle) {
            this.keyboardInputToggle.checked = enabled;
        }

        // Update visual feedback for Tweakpane style
        const toggleSection = document.querySelector('.tp-section:last-child');
        if (toggleSection) {
            if (enabled) {
                toggleSection.style.background = 'var(--tp-container-background-color)';
                toggleSection.style.borderColor = 'var(--tp-groove-foreground-color)';
            } else {
                toggleSection.style.background = 'var(--tp-monitor-background-color)';
                toggleSection.style.borderColor = '#e74c3c';
            }
        }

        // Update hint text
        const hintText = document.querySelector('.tp-hint');
        if (hintText) {
            if (enabled) {
                hintText.textContent = 'Keyboard input is enabled. You can type directly with your keyboard.';
                hintText.style.color = 'var(--tp-label-foreground-color)';
            } else {
                hintText.textContent = 'Keyboard input is disabled. Use the manual input box above to type.';
                hintText.style.color = '#e74c3c';
            }
        }
    }

    initializeKeyboardInput() {
        // Set initial state based on checkbox
        const initialState = this.keyboardInputToggle ? this.keyboardInputToggle.checked : true;
        this.toggleKeyboardInput(initialState);

        // Set up global flags for keyboard handling
        window.directTypingEnabled = initialState;
        window.directTypingDisabled = !initialState;
    }

    reset() {
        this.selectedFile = null;
        this.fileInput.value = '';
        this.imagePreview.classList.remove('show');
        this.processBtn.style.display = 'none';
        this.result.classList.remove('show');
        this.loading.classList.remove('show');

        // Clear manual input
        if (this.manualTextInput) {
            this.manualTextInput.value = '';
        }
    }

    async testApiConnection(apiKey, provider) {
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            return response.ok;
        } catch (error) {
            console.error('API test failed:', error);
            return false;
        }
    }
}

// Initialize AI integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.aiIntegration = new AIImageIntegration();
});
