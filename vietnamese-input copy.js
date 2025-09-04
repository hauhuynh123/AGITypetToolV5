// Vietnamese Input Support
// Supports Telex input method

class VietnameseInput {
    constructor() {
        this.inputMethod = 'telex'; // default method
        this.isVietnameseMode = false;
        this.pendingBase = '';
        this.pendingDiacritics = [];

        // Vietnamese character mappings
        this.vietnameseChars = {
            // Base vowels with tones
            'a': {
                base: 'a',
                acute: 'á',     // á
                grave: 'à',     // à
                hook: 'ả',      // ả
                tilde: 'ã',     // ã
                dot: 'ạ',       // ạ
                circumflex: {
                    base: 'â',
                    acute: 'ấ',   // ấ
                    grave: 'ầ',   // ầ
                    hook: 'ẩ',    // ẩ
                    tilde: 'ẫ',   // ẫ
                    dot: 'ậ'      // ậ
                },
                breve: {
                    base: 'ă',
                    acute: 'ắ',   // ắ
                    grave: 'ằ',   // ằ
                    hook: 'ẳ',    // ẳ
                    tilde: 'ẵ',   // ẵ
                    dot: 'ặ'      // ặ
                }
            },
            'e': {
                base: 'e',
                acute: 'é',     // é
                grave: 'è',     // è
                hook: 'ẻ',      // ẻ
                tilde: 'ẽ',     // ẽ
                dot: 'ẹ',       // ẹ
                circumflex: {
                    base: 'ê',
                    acute: 'ế',   // ế
                    grave: 'ề',   // ề
                    hook: 'ể',    // ể
                    tilde: 'ễ',   // ễ
                    dot: 'ệ'      // ệ
                }
            },
            'i': {
                base: 'i',
                acute: 'í',     // í
                grave: 'ì',     // ì
                hook: 'ỉ',      // ỉ
                tilde: 'ĩ',     // ĩ
                dot: 'ị'        // ị
            },
            'o': {
                base: 'o',
                acute: 'ó',     // ó
                grave: 'ò',     // ò
                hook: 'ỏ',      // ỏ - wait, we need 'ở' for horn
                tilde: 'õ',     // õ
                dot: 'ọ',       // ọ
                circumflex: {
                    base: 'ô',
                    acute: 'ố',   // ố
                    grave: 'ồ',   // ồ
                    hook: 'ổ',    // ổ
                    tilde: 'ỗ',   // ỗ
                    dot: 'ộ'      // ộ
                },
                horn: {
                    base: 'ơ',
                    acute: 'ớ',   // ớ
                    grave: 'ờ',   // ờ
                    hook: 'ở',    // ở
                    tilde: 'ỡ',   // ỡ
                    dot: 'ợ'      // ợ
                }
            },
            'u': {
                base: 'u',
                acute: 'ú',     // ú
                grave: 'ù',     // ù
                hook: 'ủ',      // ủ
                tilde: 'ũ',     // ũ
                dot: 'ụ',       // ụ
                horn: {
                    base: 'ư',
                    acute: 'ứ',   // ứ
                    grave: 'ừ',   // ừ
                    hook: 'ử',    // ử
                    tilde: 'ữ',   // ữ
                    dot: 'ự'      // ự
                }
            },
            'y': {
                base: 'y',
                acute: 'ý',     // ý
                grave: 'ỳ',     // ỳ
                hook: 'ỷ',      // ỷ
                tilde: 'ỹ',     // ỹ
                dot: 'ỵ'        // ỵ
            },
            'd': {
                base: 'd',
                stroke: 'đ'     // đ
            }
        };

        // Telex input mappings
        this.telexMappings = {
            // Vowel modifications
            'aa': 'â', 'aw': 'ă', 'ee': 'ê', 'oo': 'ô', 'ow': 'ơ', 'uw': 'ư', 'dd': 'đ',
            // Tone marks
            's': 'acute',    // sắc
            'f': 'grave',    // huyền  
            'r': 'hook',     // hỏi
            'x': 'tilde',    // ngã
            'j': 'dot'       // nặng
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add Vietnamese mode toggle
        this.createVietnameseModeToggle();

        // Always add Vietnamese handler but it will only process when mode is on
        this.overrideKeydownHandler();
    }

    createVietnameseModeToggle() {
        // Wait for the container to be available
        const container = document.getElementById('vietnamese-controls-container');
        if (!container) {
            // If container not ready, wait and try again
            setTimeout(() => this.createVietnameseModeToggle(), 10);
            return;
        }

        // Create Vietnamese input controls
        const vietnameseSection = document.createElement('div');
        vietnameseSection.innerHTML = `
            <div class="setting-item vietnamese-setting">
                <div class="setting-info">
                    <strong>Vietnamese Input</strong>
                    <div class="description">Enable Vietnamese typing with diacritics and tone marks (Telex method)</div>
                </div>
                <input type="checkbox" id="toggle-vietnamese">
            </div>
        `;

        container.appendChild(vietnameseSection);

        // Add event listeners
        const vietnameseToggle = document.getElementById('toggle-vietnamese');

        vietnameseToggle.addEventListener('change', (e) => {
            this.isVietnameseMode = e.target.checked;

            // Clear any pending input when switching modes
            this.resetPending();

            // Set the global flag appropriately
            window.vietnameseInputActive = this.isVietnameseMode;

            console.log('Vietnamese mode:', this.isVietnameseMode ? 'ON' : 'OFF');
        });
    }



    overrideKeydownHandler() {
        // Remove any existing handler first
        if (this.vietnameseHandler) {
            window.removeEventListener("keydown", this.vietnameseHandler, true);
        }

        // Set global flag to signal original handler to stop
        window.vietnameseInputActive = true;
        // Add Vietnamese handler in capture phase to intercept first
        this.vietnameseHandler = this.handleVietnameseKeydown.bind(this);
        window.addEventListener("keydown", this.vietnameseHandler, true);
    }

    restoreOriginalKeydownHandler() {
        // Clear global flag to let original handler work
        window.vietnameseInputActive = false;
        if (this.vietnameseHandler) {
            window.removeEventListener("keydown", this.vietnameseHandler, true);
        }
    }

    handleVietnameseKeydown(event) {
        // If Vietnamese mode is not enabled, let the original handler take over
        if (!this.isVietnameseMode) {
            window.vietnameseInputActive = false;
            return; // Let the original handler process this
        }

        // Set flag to prevent original handler from running
        window.vietnameseInputActive = true;

        // Prevent any bubbling to other handlers
        event.preventDefault();
        event.stopPropagation();

        const key = event.key.toLowerCase();
        const char = String.fromCharCode(event.keyCode).toLowerCase();

        // Handle special keys first (space, backspace, enter)
        if (this.handleSpecialKeys(event)) {
            return;
        }

        // Handle Vietnamese input
        if (this.isVietnameseChar(char)) {
            this.processVietnameseInput(char, event);
            return;
        }

        // Fall back to original behavior for non-Vietnamese characters
        this.handleOriginalKeydown(event);
    }

    handleSpecialKeys(event) {
        // SPACE
        if (event.keyCode === 32) {
            this.commitPendingChar();
            if (!window.currentWord) {
                window.currentWord = window.createWordContainer();
            }
            window.currentWord = window.createWordContainer();
            return true;
        }

        // DELETE
        if (event.keyCode === 8) {
            this.commitPendingChar();
            if (window.currentWord && window.currentWord.lastChild) {
                window.currentWord.removeChild(window.currentWord.lastChild);
                window.updateWordFlex(window.currentWord);
                if (window.currentWord.childNodes.length === 0) {
                    window.currentWord.parentNode.removeChild(window.currentWord);
                    const words = document.querySelectorAll('#wrapper .word');
                    window.currentWord = words[words.length - 1] || null;
                }
            }
            return true;
        }

        // ENTER
        if (event.keyCode === 13) {
            this.commitPendingChar();
            document.getElementById("wrapper").innerHTML = "";
            window.setTheme();
            window.currentWord = null;
            return true;
        }

        return false;
    }

    isVietnameseChar(char) {
        return /[a-z0-9]/.test(char);
    }

    processVietnameseInput(char, event) {
        this.processTelex(char, event);
    }

    processTelex(char, event) {
        // Handle tone marks and modifications
        const isToneMark = ['s', 'f', 'r', 'x', 'j'].includes(char);

        if (this.pendingBase && isToneMark) {
            // Apply tone to pending character (could be modified already)
            const result = this.applyTelexTone(this.pendingBase, char);
            this.updateLastCharacter(result);
            this.resetPending();
        } else if (this.pendingBase === char && ['a', 'e', 'o', 'd'].includes(char)) {
            // Double character modification (aa -> â, ee -> ê, oo -> ô, dd -> đ)
            let result = this.pendingBase;
            if (char === 'a') result = 'â';
            else if (char === 'e') result = 'ê';
            else if (char === 'o') result = 'ô';
            else if (char === 'd') result = 'đ';

            this.updateLastCharacter(result);
            this.pendingBase = result; // Keep as pending for potential tone marks
        } else if (this.pendingBase && char === 'w') {
            // aw -> ă, ow -> ơ, uw -> ư
            let result = this.pendingBase;
            if (this.pendingBase === 'a') result = 'ă';
            else if (this.pendingBase === 'o') result = 'ơ';
            else if (this.pendingBase === 'u') result = 'ư';

            this.updateLastCharacter(result);
            this.pendingBase = result; // Keep as pending for potential tone marks
        } else {
            // Commit previous character and start new one
            this.commitPendingChar();
            if (['a', 'e', 'i', 'o', 'u', 'y', 'd'].includes(char)) {
                this.pendingBase = char;
                this.displayCharacter(char.toUpperCase());
            } else {
                this.displayCharacter(char.toUpperCase());
            }
        }
    }

    updateLastCharacter(newChar) {
        // Update the last character in the current word
        if (window.currentWord && window.currentWord.lastChild) {
            const lastLetter = window.currentWord.lastChild;
            const svgPath = this.findSVGPath(newChar);
            lastLetter.style.backgroundImage = "url('" + svgPath + "')";

            // Update flex based on new character width
            window.getSVGWidth(svgPath).then(width => {
                lastLetter.style.flex = (width / 17.21).toFixed(2);
                window.updateWordFlex(window.currentWord);
            }).catch(() => {
                lastLetter.style.flex = "1";
                window.updateWordFlex(window.currentWord);
            });
        } else {
            // No last character, display as new
            this.displayCharacter(newChar);
        }
    }

    applyTelexTone(baseChar, toneMark) {
        // Comprehensive tone application including modified vowels
        const toneMap = {
            's': { // sắc
                'a': 'á', 'â': 'ấ', 'ă': 'ắ',
                'e': 'é', 'ê': 'ế',
                'i': 'í',
                'o': 'ó', 'ô': 'ố', 'ơ': 'ớ',
                'u': 'ú', 'ư': 'ứ',
                'y': 'ý'
            },
            'f': { // huyền
                'a': 'à', 'â': 'ầ', 'ă': 'ằ',
                'e': 'è', 'ê': 'ề',
                'i': 'ì',
                'o': 'ò', 'ô': 'ồ', 'ơ': 'ờ',
                'u': 'ù', 'ư': 'ừ',
                'y': 'ỳ'
            },
            'r': { // hỏi
                'a': 'ả', 'â': 'ẩ', 'ă': 'ẳ',
                'e': 'ẻ', 'ê': 'ể',
                'i': 'ỉ',
                'o': 'ỏ', 'ô': 'ổ', 'ơ': 'ở',
                'u': 'ủ', 'ư': 'ử',
                'y': 'ỷ'
            },
            'x': { // ngã
                'a': 'ã', 'â': 'ẫ', 'ă': 'ẵ',
                'e': 'ẽ', 'ê': 'ễ',
                'i': 'ĩ',
                'o': 'õ', 'ô': 'ỗ', 'ơ': 'ỡ',
                'u': 'ũ', 'ư': 'ữ',
                'y': 'ỹ'
            },
            'j': { // nặng
                'a': 'ạ', 'â': 'ậ', 'ă': 'ặ',
                'e': 'ẹ', 'ê': 'ệ',
                'i': 'ị',
                'o': 'ọ', 'ô': 'ộ', 'ơ': 'ợ',
                'u': 'ụ', 'ư': 'ự',
                'y': 'ỵ'
            }
        };

        return toneMap[toneMark] && toneMap[toneMark][baseChar] ? toneMap[toneMark][baseChar] : baseChar;
    }





    displayCharacter(char) {
        if (!window.currentWord) {
            window.currentWord = window.createWordContainer();
        }

        const newLetter = document.createElement("div");
        newLetter.classList.add('letter', 'vietnamese');

        // Find the appropriate SVG file
        let svgPath = this.findSVGPath(char);
        newLetter.style.backgroundImage = "url('" + svgPath + "')";

        // Add the letter to the word immediately to prevent timing issues
        window.currentWord.appendChild(newLetter);

        window.getSVGWidth(svgPath).then(width => {
            newLetter.style.flex = (width / 17.21).toFixed(2);
            window.updateWordFlex(window.currentWord);
            console.log('Vietnamese SVG width:', char.toUpperCase(), '-', width, `(${svgPath})`);
        }).catch((error) => {
            // Fallback if SVG not found
            newLetter.style.flex = "1";
            window.updateWordFlex(window.currentWord);
            console.log('Vietnamese SVG not found:', char.toUpperCase(), `(${svgPath})`, error);
        });
    }

    findSVGPath(char) {
        // Check if the character SVG exists
        const upperChar = char.toUpperCase();
        return `chars/${upperChar}.svg`;
    }

    commitPendingChar() {
        if (this.pendingBase) {
            this.displayCharacter(this.pendingBase.toUpperCase());
            this.resetPending();
        }
    }

    resetPending() {
        this.pendingBase = '';
        this.pendingDiacritics = [];
    }

    handleOriginalKeydown(event) {
        // Ensure currentWord exists
        if (!window.currentWord) {
            window.currentWord = window.createWordContainer();
        }

        // ALPHABET
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        for (let i = 0; i < alphabet.length; i++) {
            let letterKeycode = i + 65;
            if (letterKeycode == event.keyCode) {
                var letterLoop = alphabet[i];
                var newLetter = document.createElement("div");
                newLetter.classList.add('letter', 'vietnamese');
                var svgPath = "chars/" + letterLoop + ".svg";
                newLetter.style.backgroundImage = "url('" + svgPath + "')";
                // Add letter immediately
                window.currentWord.appendChild(newLetter);
                window.getSVGWidth(svgPath).then(width => {
                    newLetter.style.flex = (width / 17.21).toFixed(2);
                    window.updateWordFlex(window.currentWord);
                    console.log('Vietnamese Letter SVG width:', letterLoop, '-', width);
                });
                return;
            }
        }

        // NUMBERS
        const numbers = "0123456789".split("");
        for (let i = 0; i < numbers.length; i++) {
            let letterKeycode = i + 48;
            if (letterKeycode == event.keyCode && event.shiftKey == false) {
                var letterLoop = numbers[i];
                var newLetter = document.createElement("div");
                newLetter.classList.add('letter', 'vietnamese');
                var svgPath = "chars/" + letterLoop + ".svg";
                newLetter.style.backgroundImage = "url('" + svgPath + "')";
                // Add letter immediately
                window.currentWord.appendChild(newLetter);
                window.getSVGWidth(svgPath).then(width => {
                    newLetter.style.flex = (width / 17.21).toFixed(2); // Same logic as letters
                    window.updateWordFlex(window.currentWord);
                    console.log('Vietnamese Number SVG width:', letterLoop, '-', width);
                });
                return;
            }
        }
    }
}

// Initialize Vietnamese input when the script loads
document.addEventListener('DOMContentLoaded', function () {
    window.vietnameseInput = new VietnameseInput();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        if (!window.vietnameseInput) {
            window.vietnameseInput = new VietnameseInput();
        }
    });
} else {
    window.vietnameseInput = new VietnameseInput();
}
