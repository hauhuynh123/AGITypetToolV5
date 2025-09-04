/**
 * Vietnamese Input Support System
 * Supports Telex input method with comprehensive diacritics and tone marks
 */
class VietnameseInput {
    constructor() {
        this.inputMethod = 'telex';
        this.isVietnameseMode = false;
        this.pendingBase = '';
        this.pendingDiacritics = [];

        // Character mappings organized for better maintainability
        this.initializeCharacterMappings();
        this.initializeTelexMappings();

        this.init();
    }

    /**
     * Initialize character mappings in a more organized way
     */
    initializeCharacterMappings() {
        this.vietnameseChars = {
            a: {
                base: 'a', acute: 'á', grave: 'à', hook: 'ả', tilde: 'ã', dot: 'ạ',
                circumflex: { base: 'â', acute: 'ấ', grave: 'ầ', hook: 'ẩ', tilde: 'ẫ', dot: 'ậ' },
                breve: { base: 'ă', acute: 'ắ', grave: 'ằ', hook: 'ẳ', tilde: 'ẵ', dot: 'ặ' }
            },
            e: {
                base: 'e', acute: 'é', grave: 'è', hook: 'ẻ', tilde: 'ẽ', dot: 'ẹ',
                circumflex: { base: 'ê', acute: 'ế', grave: 'ề', hook: 'ể', tilde: 'ễ', dot: 'ệ' }
            },
            i: { base: 'i', acute: 'í', grave: 'ì', hook: 'ỉ', tilde: 'ĩ', dot: 'ị' },
            o: {
                base: 'o', acute: 'ó', grave: 'ò', hook: 'ỏ', tilde: 'õ', dot: 'ọ',
                circumflex: { base: 'ô', acute: 'ố', grave: 'ồ', hook: 'ổ', tilde: 'ỗ', dot: 'ộ' },
                horn: { base: 'ơ', acute: 'ớ', grave: 'ờ', hook: 'ở', tilde: 'ỡ', dot: 'ợ' }
            },
            u: {
                base: 'u', acute: 'ú', grave: 'ù', hook: 'ủ', tilde: 'ũ', dot: 'ụ',
                horn: { base: 'ư', acute: 'ứ', grave: 'ừ', hook: 'ử', tilde: 'ữ', dot: 'ự' }
            },
            y: { base: 'y', acute: 'ý', grave: 'ỳ', hook: 'ỷ', tilde: 'ỹ', dot: 'ỵ' },
            d: { base: 'd', stroke: 'đ' }
        };
    }

    /**
     * Initialize Telex mappings and tone maps
     */
    initializeTelexMappings() {
        this.telexMappings = {
            // Vowel modifications
            'aa': 'â', 'aw': 'ă', 'ee': 'ê', 'oo': 'ô', 'ow': 'ơ', 'uw': 'ư', 'dd': 'đ',
            // Tone marks
            's': 'acute', 'f': 'grave', 'r': 'hook', 'x': 'tilde', 'j': 'dot'
        };

        // Comprehensive tone mapping for all Vietnamese characters
        this.toneMap = {
            's': { // sắc (acute)
                'a': 'á', 'â': 'ấ', 'ă': 'ắ', 'e': 'é', 'ê': 'ế', 'i': 'í',
                'o': 'ó', 'ô': 'ố', 'ơ': 'ớ', 'u': 'ú', 'ư': 'ứ', 'y': 'ý'
            },
            'f': { // huyền (grave)
                'a': 'à', 'â': 'ầ', 'ă': 'ằ', 'e': 'è', 'ê': 'ề', 'i': 'ì',
                'o': 'ò', 'ô': 'ồ', 'ơ': 'ờ', 'u': 'ù', 'ư': 'ừ', 'y': 'ỳ'
            },
            'r': { // hỏi (hook)
                'a': 'ả', 'â': 'ẩ', 'ă': 'ẳ', 'e': 'ẻ', 'ê': 'ể', 'i': 'ỉ',
                'o': 'ỏ', 'ô': 'ổ', 'ơ': 'ở', 'u': 'ủ', 'ư': 'ử', 'y': 'ỷ'
            },
            'x': { // ngã (tilde)
                'a': 'ã', 'â': 'ẫ', 'ă': 'ẵ', 'e': 'ẽ', 'ê': 'ễ', 'i': 'ĩ',
                'o': 'õ', 'ô': 'ỗ', 'ơ': 'ỡ', 'u': 'ũ', 'ư': 'ữ', 'y': 'ỹ'
            },
            'j': { // nặng (dot below)
                'a': 'ạ', 'â': 'ậ', 'ă': 'ặ', 'e': 'ẹ', 'ê': 'ệ', 'i': 'ị',
                'o': 'ọ', 'ô': 'ộ', 'ơ': 'ợ', 'u': 'ụ', 'ư': 'ự', 'y': 'ỵ'
            }
        };

        // Special keys constants
        this.SPECIAL_KEYS = {
            SPACE: 32,
            BACKSPACE: 8,
            ENTER: 13
        };

        // Character sets
        this.VIETNAMESE_VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
        this.TONE_MARKS = new Set(['s', 'f', 'r', 'x', 'j']);
        this.MODIFICATION_CHARS = new Set(['w']);
        this.SPECIAL_CONSONANTS = new Set(['d']);
    }

    /**
     * Initialize the Vietnamese input system
     */
    async init() {
        try {
            await this.waitForDOMReady();
            this.setupEventListeners();
            console.log('Vietnamese Input System initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Vietnamese Input System:', error);
        }
    }

    /**
     * Wait for DOM to be ready and required elements to be available
     */
    waitForDOMReady() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        this.createVietnameseModeToggle();
        this.setupKeyboardHandler();
    }

    /**
     * Create the Vietnamese mode toggle UI
     */
    createVietnameseModeToggle() {
        const container = this.waitForElement('vietnamese-controls-container');

        container.then(element => {
            const vietnameseSection = this.createToggleElement();
            element.appendChild(vietnameseSection);
            this.bindToggleEvents();
        }).catch(error => {
            console.warn('Vietnamese controls container not found:', error);
        });
    }

    /**
     * Wait for a specific element to be available in DOM
     */
    waitForElement(id, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.getElementById(id);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations) => {
                const element = document.getElementById(id);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // Timeout fallback
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element with id '${id}' not found within ${timeout}ms`));
            }, timeout);
        });
    }

    /**
     * Create the toggle UI element
     */
    createToggleElement() {
        const vietnameseSection = document.createElement('div');
        vietnameseSection.innerHTML = `
            <div class="tp-control-item">
                <label class="tp-checkbox-label">
                    <input type="checkbox" id="toggle-vietnamese" class="tp-checkbox" aria-label="Toggle Vietnamese input mode">
                    <span class="tp-checkbox-mark"></span>
                    <span class="tp-checkbox-text">Vietnamese Input</span>
                </label>
                <div class="tp-hint">Enable Vietnamese typing with diacritics and tone marks (Telex method)</div>
            </div>
        `;
        return vietnameseSection;
    }

    /**
     * Bind events for the toggle
     */
    bindToggleEvents() {
        const vietnameseToggle = document.getElementById('toggle-vietnamese');
        if (!vietnameseToggle) return;

        vietnameseToggle.addEventListener('change', (e) => {
            this.toggleVietnameseMode(e.target.checked);
        });
    }

    /**
     * Toggle Vietnamese input mode
     */
    toggleVietnameseMode(enabled) {
        this.isVietnameseMode = enabled;
        this.resetPending();
        window.vietnameseInputActive = enabled;

        console.log(`Vietnamese mode: ${enabled ? 'ON' : 'OFF'}`);
    }

    /**
     * Set up keyboard event handler
     */
    setupKeyboardHandler() {
        // Remove existing handler if present
        this.removeKeyboardHandler();

        // Create and bind new handler
        this.vietnameseHandler = this.handleKeydown.bind(this);
        window.addEventListener("keydown", this.vietnameseHandler, true);
    }

    /**
     * Remove keyboard event handler
     */
    removeKeyboardHandler() {
        if (this.vietnameseHandler) {
            window.removeEventListener("keydown", this.vietnameseHandler, true);
            this.vietnameseHandler = null;
        }
        window.vietnameseInputActive = false;
    }

    /**
     * Main keyboard event handler
     */
    handleKeydown(event) {
        // Allow AI typing to bypass keyboard input toggle
        if (window.aiTypingInProgress) {
            // AI typing should be allowed regardless of keyboard toggle
        } else {
            // Check if keyboard input is disabled for manual typing
            if (window.directTypingDisabled || window.directTypingEnabled === false) {
                window.vietnameseInputActive = false;
                return;
            }
        }

        if (!this.isVietnameseMode) {
            window.vietnameseInputActive = false;
            return;
        }

        window.vietnameseInputActive = true;
        event.preventDefault();
        event.stopPropagation();

        const key = event.key.toLowerCase();
        const keyCode = event.keyCode;

        // Handle special keys
        if (this.handleSpecialKeys(keyCode)) {
            return;
        }

        // Handle Vietnamese input
        if (this.isValidInputChar(key)) {
            this.processVietnameseInput(key);
        } else {
            // Handle non-Vietnamese characters (numbers, etc.)
            this.handleNonVietnameseInput(event);
        }
    }

    /**
     * Handle special keys (space, backspace, enter)
     */
    handleSpecialKeys(keyCode) {
        switch (keyCode) {
            case this.SPECIAL_KEYS.SPACE:
                // this.commitPendingChar();
                this.createNewWord();
                return true;

            case this.SPECIAL_KEYS.BACKSPACE:
                this.handleBackspace();
                return true;

            case this.SPECIAL_KEYS.ENTER:
                this.handleEnter();
                return true;

            default:
                return false;
        }
    }

    /**
     * Handle backspace key
     */
    handleBackspace() {
        this.commitPendingChar();

        if (!window.currentWord?.lastChild) return;

        window.currentWord.removeChild(window.currentWord.lastChild);
        window.updateWordFlex?.(window.currentWord);

        if (window.currentWord.childNodes.length === 0) {
            window.currentWord.parentNode?.removeChild(window.currentWord);
            const words = document.querySelectorAll('#wrapper .word');
            window.currentWord = words[words.length - 1] || null;
        }
    }

    /**
     * Handle enter key
     */
    handleEnter() {
        this.commitPendingChar();
        const wrapper = document.getElementById("wrapper");
        if (wrapper) {
            wrapper.innerHTML = "";
        }
        window.setTheme?.();
        window.currentWord = null;
    }

    /**
     * Create a new word container
     */
    createNewWord() {
        if (window.createWordContainer) {
            // Tạo word mới chỉ khi currentWord có content
            if (window.currentWord && window.currentWord.childNodes.length > 0) {
                window.currentWord = window.createWordContainer();
            } else if (!window.currentWord) {
                // Đảm bảo luôn có một word container
                window.currentWord = window.createWordContainer();
            }
        }
    }

    /**
     * Check if character is valid for Vietnamese input
     */
    isValidInputChar(char) {
        return /^[a-z]$/.test(char);
    }

    /**
     * Process Vietnamese character input using Telex method
     */
    processVietnameseInput(char) {
        const isToneMark = this.TONE_MARKS.has(char);
        const isModificationChar = this.MODIFICATION_CHARS.has(char);

        if (this.pendingBase && isToneMark) {
            // Apply tone to pending character
            const result = this.applyTone(this.pendingBase, char);
            this.updateLastCharacter(result);
            this.resetPending();
        } else if (this.pendingBase === char && this.canDouble(char)) {
            // Handle double character modifications (aa -> â, etc.)
            const result = this.getDoubledChar(char);
            this.updateLastCharacter(result);
            this.pendingBase = result;
        } else if (this.pendingBase && isModificationChar) {
            // Handle w modifications (aw -> ă, ow -> ơ, uw -> ư)
            const result = this.applyWModification(this.pendingBase);
            this.updateLastCharacter(result);
            this.pendingBase = result;
        } else {
            // Start new character or commit previous
            this.commitPendingChar();
            if (this.isBaseChar(char)) {
                this.pendingBase = char;
            }
            this.displayCharacter(char.toUpperCase());
        }
    }

    /**
     * Check if character can be doubled for modification
     */
    canDouble(char) {
        return ['a', 'e', 'o', 'd'].includes(char);
    }

    /**
     * Get doubled character result
     */
    getDoubledChar(char) {
        const doubleMap = { 'a': 'â', 'e': 'ê', 'o': 'ô', 'd': 'đ' };
        return doubleMap[char] || char;
    }

    /**
     * Apply w modification to character
     */
    applyWModification(baseChar) {
        const wMap = { 'a': 'ă', 'o': 'ơ', 'u': 'ư' };
        return wMap[baseChar] || baseChar;
    }

    /**
     * Check if character is a base character that can accept modifications
     */
    isBaseChar(char) {
        return this.VIETNAMESE_VOWELS.has(char) || this.SPECIAL_CONSONANTS.has(char);
    }

    /**
     * Apply tone mark to character
     */
    applyTone(baseChar, toneMark) {
        return this.toneMap[toneMark]?.[baseChar] || baseChar;
    }

    /**
     * Update the last character in the current word
     */
    updateLastCharacter(newChar) {
        if (!window.currentWord?.lastChild) {
            this.displayCharacter(newChar);
            return;
        }

        const lastLetter = window.currentWord.lastChild;
        const svgPath = this.getSVGPath(newChar);

        lastLetter.style.backgroundImage = `url('${svgPath}')`;
        this.updateCharacterWidth(lastLetter, svgPath);
    }

    /**
     * Update character width based on SVG
     */
    async updateCharacterWidth(element, svgPath) {
        try {
            if (window.getSVGWidth) {
                const width = await window.getSVGWidth(svgPath);
                element.style.flex = (width / 17.21).toFixed(2);
            } else {
                element.style.flex = "1";
            }
            window.updateWordFlex?.(window.currentWord);
        } catch (error) {
            element.style.flex = "1";
            window.updateWordFlex?.(window.currentWord);
            console.warn('SVG width calculation failed:', error);
        }
    }

    /**
     * Display a character on screen
     */
    displayCharacter(char) {
        if (!window.currentWord) {
            this.createNewWord();
        }

        const newLetter = this.createLetterElement(char);
        window.currentWord.appendChild(newLetter);
    }

    /**
     * Create a new letter element
     */
    createLetterElement(char) {
        const newLetter = document.createElement("div");
        newLetter.classList.add('letter', 'vietnamese');

        const svgPath = this.getSVGPath(char);
        newLetter.style.backgroundImage = `url('${svgPath}')`;

        this.updateCharacterWidth(newLetter, svgPath);

        return newLetter;
    }

    /**
     * Get SVG path for character
     */
    getSVGPath(char) {
        return `chars/${char.toUpperCase()}.svg`;
    }

    /**
     * Handle non-Vietnamese input (numbers, symbols, etc.)
     */
    handleNonVietnameseInput(event) {
        this.commitPendingChar();

        const keyCode = event.keyCode;

        // Handle alphabet
        if (keyCode >= 65 && keyCode <= 90) {
            const letter = String.fromCharCode(keyCode);
            this.displayCharacter(letter);
            return;
        }

        // Handle numbers (0-9)
        if (keyCode >= 48 && keyCode <= 57 && !event.shiftKey) {
            const number = String.fromCharCode(keyCode);
            this.displayCharacter(number);
            return;
        }
    }

    /**
     * Commit pending character and reset state
     */
    commitPendingChar() {
        if (this.pendingBase) {
            // Character is already displayed, just reset pending state
            this.resetPending();
        }
    }

    /**
     * Reset pending character state
     */
    resetPending() {
        this.pendingBase = '';
        this.pendingDiacritics = [];
    }

    /**
     * Clean up resources and event listeners
     */
    destroy() {
        this.removeKeyboardHandler();
        const toggle = document.getElementById('toggle-vietnamese');
        if (toggle) {
            toggle.removeEventListener('change', this.toggleVietnameseMode);
        }
    }
}

// Enhanced initialization with better error handling
class VietnameseInputInitializer {
    static instance = null;

    static initialize() {
        if (this.instance) {
            return this.instance;
        }

        try {
            this.instance = new VietnameseInput();
            window.vietnameseInput = this.instance;

            // Cleanup on page unload
            window.addEventListener('beforeunload', () => {
                if (this.instance) {
                    this.instance.destroy();
                }
            });

            return this.instance;
        } catch (error) {
            console.error('Failed to initialize Vietnamese Input:', error);
            return null;
        }
    }
}

// Initialize Vietnamese input system
document.addEventListener('DOMContentLoaded', () => {
    VietnameseInputInitializer.initialize();
});

// Handle case where DOM is already loaded
if (document.readyState !== 'loading') {
    VietnameseInputInitializer.initialize();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VietnameseInput, VietnameseInputInitializer };
}