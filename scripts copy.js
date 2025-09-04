// COLOR
function setTheme() {
  var backgrounds = ["#FF0000", "#FFFF00", "#0000FF"]; // red, yellow, blue
  var foregrounds = ["#000000", "#FFFFFF"]; // black, white

  var background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  var foreground = foregrounds[Math.floor(Math.random() * foregrounds.length)];

  document.body.style.backgroundColor = background;
  document.documentElement.style.setProperty('--foreground', foreground);
}

let currentWord = null;

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
  // ENTER
  if (event.keyCode == 13) {
    document.getElementById("wrapper").innerHTML = "";
    setTheme();
    currentWord = null;
    return;
  }
});
