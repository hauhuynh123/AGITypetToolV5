// COLOR
function setTheme() {
  var foregrounds = ["#000000", "#FFFFFF"]; // black, white

  // Don't change background color randomly if user has set one manually
  const bgSelect = document.getElementById('background-color-select');
  if (!bgSelect || !bgSelect.value) {
    var backgrounds = ["#FF0000", "#FFFF00", "#0000FF"]; // red, yellow, blue
    var background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    document.body.style.backgroundColor = background;
    
    // Update the select if it exists
    if (bgSelect) {
      bgSelect.value = background === "#0000FF" ? "#00FF00" : background; // Map blue to green
    }
  }

  var foreground = foregrounds[Math.floor(Math.random() * foregrounds.length)];
  document.documentElement.style.setProperty('--foreground', foreground);
}

let currentWord = null;

function createWordContainer() {
  const word = document.createElement('div');
  word.classList.add('word');
  document.getElementById('wrapper').appendChild(word);
  return word;
}

function updateWordFlex(word) {
  // Tổng flex của tất cả character elements bên trong
  let totalFlex = 0;
  word.querySelectorAll('.letter, .number, .symbol, .vietnamese').forEach(element => {
    const flex = parseFloat(element.style.flex) || 0;
    totalFlex += flex;
  });
  word.style.flex = totalFlex.toFixed(2);
  word.style.setProperty('--word-flex', totalFlex.toFixed(2));
}

// UNIFIED CHARACTER MAPPING: [display_char, svg_filename, keycode, requires_shift, character_type]
const characterMap = [
  // ALPHABET (A-Z)
  ['A', 'A', 65, false, 'letter'], ['B', 'B', 66, false, 'letter'], ['C', 'C', 67, false, 'letter'],
  ['D', 'D', 68, false, 'letter'], ['E', 'E', 69, false, 'letter'], ['F', 'F', 70, false, 'letter'],
  ['G', 'G', 71, false, 'letter'], ['H', 'H', 72, false, 'letter'], ['I', 'I', 73, false, 'letter'],
  ['J', 'J', 74, false, 'letter'], ['K', 'K', 75, false, 'letter'], ['L', 'L', 76, false, 'letter'],
  ['M', 'M', 77, false, 'letter'], ['N', 'N', 78, false, 'letter'], ['O', 'O', 79, false, 'letter'],
  ['P', 'P', 80, false, 'letter'], ['Q', 'Q', 81, false, 'letter'], ['R', 'R', 82, false, 'letter'],
  ['S', 'S', 83, false, 'letter'], ['T', 'T', 84, false, 'letter'], ['U', 'U', 85, false, 'letter'],
  ['V', 'V', 86, false, 'letter'], ['W', 'W', 87, false, 'letter'], ['X', 'X', 88, false, 'letter'],
  ['Y', 'Y', 89, false, 'letter'], ['Z', 'Z', 90, false, 'letter'],
  
  // NUMBERS (0-9)
  ['0', '0', 48, false, 'number'], ['1', '1', 49, false, 'number'], ['2', '2', 50, false, 'number'],
  ['3', '3', 51, false, 'number'], ['4', '4', 52, false, 'number'], ['5', '5', 53, false, 'number'],
  ['6', '6', 54, false, 'number'], ['7', '7', 55, false, 'number'], ['8', '8', 56, false, 'number'],
  ['9', '9', 57, false, 'number'],
  
  // SYMBOLS WITH SHIFT
  ['!', 'exclaimation', 49, true, 'symbol'], ['@', 'at', 50, true, 'symbol'], ['#', '#', 51, true, 'symbol'],
  ['$', 'dollar', 52, true, 'symbol'], ['%', 'percent', 53, true, 'symbol'], ['^', 'caret', 54, true, 'symbol'],
  ['&', 'ampersand', 55, true, 'symbol'], ['*', '* ', 56, true, 'symbol'], ['(', 'l-parentheses', 57, true, 'symbol'],
  [')', 'r-parentheses', 48, true, 'symbol'], ['_', 'underscore', 189, true, 'symbol'], ['+', 'plus', 187, true, 'symbol'],
  ['?', 'questionmark', 191, true, 'symbol'], [':', 'colon', 186, true, 'symbol'], ['>', 'greaterthan', 190, true, 'symbol'],
  ['<', 'lessthan', 188, true, 'symbol'], ['"', 'quote', 222, true, 'symbol'],
  
  // SYMBOLS WITHOUT SHIFT
  ['.', 'period', 190, false, 'symbol'], ['-', 'dash', 189, false, 'symbol'], ['/', 'slash', 191, false, 'symbol'],
  ['\\', 'backslash', 220, false, 'symbol'], ['=', 'equals', 187, false, 'symbol'], ["'", 'singlequote', 222, false, 'symbol']
];

function createCharacterElement(displayChar, svgFilename, charType) {
  const newElement = document.createElement("div");
  // Add both generic 'letter' class and specific type class
  newElement.classList.add('letter', charType);
  const svgPath = "chars/" + svgFilename + ".svg";
  newElement.style.backgroundImage = "url('" + svgPath + "')";
  
  getSVGWidth(svgPath).then(width => {
    newElement.style.flex = 100/[(width / 17.21).toFixed(1)]; // Unified logic for all characters
    currentWord.appendChild(newElement);
    updateWordFlex(currentWord);
    console.log(`${charType.charAt(0).toUpperCase() + charType.slice(1)} SVG width:`, displayChar, '-', width, `(${svgPath})`);
  }).catch((error) => {
    // Fallback if SVG not found
    newElement.style.flex = "1000";
    currentWord.appendChild(newElement);
    updateWordFlex(currentWord);
    console.log(`${charType} SVG not found:`, displayChar, `(${svgPath})`, error);
  });
  
  return newElement;
}

window.addEventListener("keydown", event => {
  // Check if Vietnamese input is active and should handle this instead
  if (window.vietnameseInputActive && window.vietnameseInput && window.vietnameseInput.isVietnameseMode) {
    return; // Let Vietnamese handler take over
  }
  
  if (!currentWord) {
    currentWord = createWordContainer();
  }
  
  // Unified character handling
  for (const [displayChar, svgFilename, keycode, requiresShift, charType] of characterMap) {
    if (keycode === event.keyCode && event.shiftKey === requiresShift) {
      createCharacterElement(displayChar, svgFilename, charType);
      return;
    }
  }
  
  // SPACE
  if (event.keyCode == 32) {
    // Khi SPACE, tạo .word mới
    currentWord = createWordContainer();
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
  // ENTER
  if (event.keyCode == 13) {
    document.getElementById("wrapper").innerHTML = "";
    setTheme();
    currentWord = null;
    return;
  }
});
