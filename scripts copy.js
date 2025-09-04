// COLOR
function setTheme() {
  // Check if background color is already set by user selection
  const currentBgColor = document.body.style.backgroundColor;
  const backgroundSelect = document.getElementById('background-color-select');

  // Only set random background if no background is currently set
  if (!currentBgColor || currentBgColor === '' || currentBgColor === 'rgba(0, 0, 0, 0)') {
    var backgrounds = ["#FF0000", "#FFFF00", "#0000FF"]; // red, yellow, blue
    var background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    document.body.style.backgroundColor = background;

    // Update the select dropdown to match the random color
    if (backgroundSelect) {
      backgroundSelect.value = background;
    }
  } else {
    // Keep the current background color (user selected)
    // Just ensure the select dropdown matches
    if (backgroundSelect && currentBgColor) {
      // Convert rgb() to hex for comparison
      const rgbToHex = (rgb) => {
        const result = rgb.match(/\d+/g);
        if (result) {
          const r = parseInt(result[0]);
          const g = parseInt(result[1]);
          const b = parseInt(result[2]);
          return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        }
        return rgb;
      };

      const hexColor = rgbToHex(currentBgColor);
      if (backgroundSelect.querySelector(`option[value="${hexColor}"]`)) {
        backgroundSelect.value = hexColor;
      }
    }
  }

  // Always set foreground color (this doesn't interfere with background)
  var foregrounds = ["#000000", "#FFFFFF"]; // black, white
  var foreground = foregrounds[Math.floor(Math.random() * foregrounds.length)];
  document.documentElement.style.setProperty('--foreground', foreground);
}

let currentWord = null;

// Function to delete all characters sequentially
function deleteAllCharacters() {
  const wrapper = document.getElementById("wrapper");
  const words = wrapper.querySelectorAll('.word');

  if (words.length === 0) {
    return; // Nothing to delete
  }

  // Calculate total characters to delete
  let totalChars = 0;
  words.forEach(word => {
    totalChars += word.childNodes.length;
  });

  if (totalChars === 0) {
    return; // No characters to delete
  }

  // Delete characters one by one with delay
  let deletedCount = 0;
  const deleteInterval = setInterval(() => {
    if (currentWord && currentWord.lastChild) {
      // Delete last character in current word
      currentWord.removeChild(currentWord.lastChild);
      updateWordFlex(currentWord);

      // If word is empty, remove it and move to previous word
      if (currentWord.childNodes.length === 0) {
        currentWord.parentNode.removeChild(currentWord);
        const remainingWords = document.querySelectorAll('#wrapper .word');
        currentWord = remainingWords[remainingWords.length - 1] || null;
      }

      deletedCount++;

      // Stop when all characters are deleted
      if (deletedCount >= totalChars) {
        clearInterval(deleteInterval);
        // Ensure we have at least one empty word container
        if (!currentWord) {
          currentWord = createWordContainer();
        }
        setTheme();
      }
    } else {
      // No more characters to delete
      clearInterval(deleteInterval);
      if (!currentWord) {
        currentWord = createWordContainer();
      }
      setTheme();
    }
  }, 50); // 50ms delay between deletions for visual effect
}

// Make function available globally for Vietnamese input
window.deleteAllCharacters = deleteAllCharacters;

// Initialize with first word container when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  if (!currentWord) {
    currentWord = createWordContainer();
  }
});

function createWordContainer() {
  const word = document.createElement('div');
  word.classList.add('word');

  // Set initial flex values for empty word container
  word.style.flex = "1";
  word.style.setProperty('--word-flex', "1");

  document.getElementById('wrapper').appendChild(word);
  return word;
}

function updateWordFlex(word) {
  // Tổng flex các .letter bên trong
  let totalFlex = 0;
  word.querySelectorAll('.letter').forEach(l => {
    const flex = parseFloat(l.style.flex) || 0;
    totalFlex += flex;
  });

  // Fix: Prevent division by zero when word is empty
  if (totalFlex > 0) {
    word.style.flex = 10000000 / totalFlex.toFixed(2);
    word.style.setProperty('--word-flex', totalFlex.toFixed(2));
  } else {
    // Default flex for empty word containers
    word.style.flex = "1";
    word.style.setProperty('--word-flex', "1");
  }
}

window.addEventListener("keydown", event => {
  // Allow AI typing to bypass keyboard input toggle
  if (window.aiTypingInProgress) {
    // AI typing should be allowed regardless of keyboard toggle
  } else {
    // Check if keyboard input is disabled for manual typing
    if (window.directTypingDisabled || window.directTypingEnabled === false) {
      return;
    }
  }

  // Check if Vietnamese input is active
  if (window.vietnameseInputActive) {
    return;
  }

  if (!currentWord) {
    currentWord = createWordContainer();
  }
  // ALPHABET
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for (let i = 0; i < alphabet.length; i++) {
    let letterKeycode = i + 65;
    if (letterKeycode == event.keyCode) {
      var letterLoop = alphabet[i];
      var newLetter = document.createElement("div");
      newLetter.classList.add('letter');
      var svgPath = "chars/" + letterLoop + ".svg";
      newLetter.style.backgroundImage = "url('" + svgPath + "')";
      // Add letter to word immediately
      currentWord.appendChild(newLetter);
      newLetter.style.flex = "1"; // Default flex while loading SVG
      updateWordFlex(currentWord);

      // Update flex when SVG loads
      getSVGWidth(svgPath).then(width => {
        newLetter.style.flex = (width / 17.21).toFixed(2); // *H 17.21 is the width of the letter "I" in the SVG
        updateWordFlex(currentWord);
        console.log('SVG width:', width);
      }).catch(() => {
        // Keep default flex if SVG fails to load
        newLetter.style.flex = "1";
        updateWordFlex(currentWord);
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
      newLetter.classList.add('letter');
      var svgPath = "chars/" + letterLoop + ".svg";
      newLetter.style.backgroundImage = "url('" + svgPath + "')";
      // Add letter to word immediately
      currentWord.appendChild(newLetter);
      newLetter.style.flex = "1"; // Default flex while loading SVG
      updateWordFlex(currentWord);

      // Update flex when SVG loads
      getSVGWidth(svgPath).then(width => {
        newLetter.style.flex = (width / 17.21).toFixed(2);
        updateWordFlex(currentWord);
      }).catch(() => {
        // Keep default flex if SVG fails to load
        newLetter.style.flex = "1";
        updateWordFlex(currentWord);
      });
      return;
    }
  }
  // SYMBOLS
  const shiftSymbols = [
    ["(", "l-parentheses", 57],
    [")", "r-parentheses", 48],
    ["!", "exclaimation", 49],
    ["@", "at", 50],
    ["#", "num", 51],
    ["$", "dollar", 52],
    ["%", "percent", 53],
    ["^", "caret", 54],
    ["&", "ampersand", 55],
    ["*", "asterisk", 56],
    ["?", "questionmark", 191],
    [":", "colon", 186],
    ["+", "plus", 187],
    ["_", "underscore", 189],
    [">", "greaterthan", 190],
    ["<", "lessthan", 188],
    ["", "quote", 222],
  ];
  for (let i = 0; i < shiftSymbols.length; i++) {
    let symbolKeycode = shiftSymbols[i][2];
    if (symbolKeycode == event.keyCode && event.shiftKey == true) {
      var newSymbol = document.createElement("div");
      newSymbol.classList.add('letter');
      var svgPath = "chars/" + shiftSymbols[i][1] + ".svg";
      newSymbol.style.backgroundImage = "url('" + svgPath + "')";

      // Add symbol to word immediately
      currentWord.appendChild(newSymbol);
      newSymbol.style.flex = "1"; // Default flex while loading SVG
      updateWordFlex(currentWord);

      // Update flex when SVG loads
      getSVGWidth(svgPath).then(width => {
        newSymbol.style.flex = (width / 17.21).toFixed(2);
        updateWordFlex(currentWord);
      }).catch(() => {
        // Keep default flex if SVG fails to load
        newSymbol.style.flex = "1";
        updateWordFlex(currentWord);
      });
      return;
    }
  }
  const symbols = [
    [".", "period", 190],
    ["-", "dash", 189],
    ["/", "slash", 191],
    [`\\`, "backslash", 220],
    ["=", "equals", 187],
    ["", "singlequote", 222],
  ];
  for (let i = 0; i < symbols.length; i++) {
    let symbolKeycode = symbols[i][2];
    if (symbolKeycode == event.keyCode && event.shiftKey == false) {
      var newSymbol = document.createElement("div");
      newSymbol.classList.add('letter');
      var svgPath = "chars/" + symbols[i][1] + ".svg";
      newSymbol.style.backgroundImage = "url('" + svgPath + "')";

      // Add symbol to word immediately
      currentWord.appendChild(newSymbol);
      newSymbol.style.flex = "1"; // Default flex while loading SVG
      updateWordFlex(currentWord);

      // Update flex when SVG loads
      getSVGWidth(svgPath).then(width => {
        newSymbol.style.flex = (width / 17.21).toFixed(2);
        updateWordFlex(currentWord);
      }).catch(() => {
        // Keep default flex if SVG fails to load
        newSymbol.style.flex = "1";
        updateWordFlex(currentWord);
      });
      return;
    }
  }
  // SPACE
  if (event.keyCode == 32) {
    // Tạo .word mới chỉ khi currentWord có content
    if (currentWord && currentWord.childNodes.length > 0) {
      currentWord = createWordContainer();
    } else if (!currentWord) {
      // Đảm bảo luôn có một word container
      currentWord = createWordContainer();
    }
    return;
  }
  // DELETE
  if (event.keyCode == 8) {
    // Xóa ký tự cuối cùng trong .word hiện tại, nếu rỗng thì xóa .word
    if (currentWord && currentWord.lastChild) {
      currentWord.removeChild(currentWord.lastChild);
      updateWordFlex(currentWord);
      if (currentWord.childNodes.length === 0) {
        currentWord.parentNode.removeChild(currentWord);
        // Tìm .word trước đó để làm currentWord
        const words = document.querySelectorAll('#wrapper .word');
        currentWord = words[words.length - 1] || null;
      }
    }
    return;
  }
  // ENTER - Delete all characters sequentially like pressing Delete multiple times
  if (event.keyCode == 13) {
    deleteAllCharacters();
    return;
  }
});
