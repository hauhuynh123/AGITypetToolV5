// randomNoise.js
// Cứ 3s chọn ngẫu nhiên 1 .word và nhân flex với 20

let noiseActive = false;
let noiseInterval = null;
let currentHighlightedWord = null;

function resetAllWordsToOriginal() {
  const words = document.querySelectorAll('.word');
  words.forEach(word => {
    const baseFlex = parseFloat(word.style.getPropertyValue('--word-flex')) || 1;
    word.style.flex = baseFlex.toFixed(2);
    // Đảm bảo có transition khi reset
    word.style.transition = 'flex-grow 0.2s cubic-bezier(1, 0, 0, 1)';
  });
}

function highlightRandomWord() {
  const words = document.querySelectorAll('.word');
  if (words.length === 0) return;

  // Reset word trước đó về trạng thái bình thường với animation
  if (currentHighlightedWord) {
    const baseFlex = parseFloat(currentHighlightedWord.style.getPropertyValue('--word-flex')) || 1;
    currentHighlightedWord.style.transition = 'flex-grow 0.2s cubic-bezier(1, 0, 0, 1)';
    currentHighlightedWord.style.flex = baseFlex.toFixed(2);
  }

  // Chọn ngẫu nhiên 1 word mới
  const randomIndex = Math.floor(Math.random() * words.length);
  currentHighlightedWord = words[randomIndex];

  // Thêm animation cho word mới và nhân flex với 20
  const baseFlex = parseFloat(currentHighlightedWord.style.getPropertyValue('--word-flex')) || 1;
  currentHighlightedWord.style.transition = 'flex-grow 0.2s cubic-bezier(1, 0, 0, 1)';
  currentHighlightedWord.style.flex = (baseFlex * 20).toFixed(2);
}

function startRandomNoise() {
  if (noiseActive) return;
  noiseActive = true;

  // Highlight word đầu tiên ngay lập tức
  highlightRandomWord();

  // Sau đó cứ 3 giây đổi sang word khác
  noiseInterval = setInterval(highlightRandomWord, 1000); // 3000ms = 3s
}

function stopRandomNoise() {
  noiseActive = false;
  if (noiseInterval) {
    clearInterval(noiseInterval);
    noiseInterval = null;
  }

  // Reset tất cả words về trạng thái bình thường với animation
  resetAllWordsToOriginal();

  // Sau khi animation hoàn thành, xóa transition để không ảnh hưởng hover effect
  setTimeout(() => {
    const words = document.querySelectorAll('.word');
    words.forEach(word => {
      word.style.transition = '';
    });
  }, 200); // 200ms = thời gian transition

  currentHighlightedWord = null;
}

// Cho phép bật/tắt từ ngoài
window.toggleRandomNoise = function (enable) {
  if (enable) startRandomNoise();
  else stopRandomNoise();
}; 