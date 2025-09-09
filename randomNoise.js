// randomNoise.js
// Cứ 1s highlight từng .word theo thứ tự và nhân flex với 20 (same logic as sequential animation)

let noiseActive = false;
let noiseInterval = null;
let currentNoiseIndex = 0;

function resetAllWordsToOriginal() {
  const words = document.querySelectorAll('.word');
  words.forEach(word => {
    const baseFlex = parseFloat(word.style.getPropertyValue('--word-flex')) || 1;
    word.style.flex = baseFlex.toFixed(2);
    // Đảm bảo có transition khi reset
    word.style.transition = 'flex-grow 0.2s cubic-bezier(1, 0, 0, 1)';
  });
}

function highlightSequentialNoiseWord() {
  const words = document.querySelectorAll('.word');
  if (words.length === 0) return;

  // Reset tất cả words về trạng thái bình thường
  words.forEach(word => {
    const baseFlex = parseFloat(word.style.getPropertyValue('--word-flex')) || 1;
    word.style.transition = 'flex-grow 0.2s cubic-bezier(0.9, 0, 0, 1)';
    word.style.flex = baseFlex.toFixed(2);
  });

  // Highlight word hiện tại theo index
  if (currentNoiseIndex < words.length) {
    const currentWord = words[currentNoiseIndex];
    const baseFlex = parseFloat(currentWord.style.getPropertyValue('--word-flex')) || 1;
    currentWord.style.transition = 'flex-grow 0.2s cubic-bezier(0.9, 0, 0, 1)';
    currentWord.style.flex = (baseFlex * 20).toFixed(2);

    console.log(`Sequential noise: highlighting word ${currentNoiseIndex + 1}/${words.length}`);
  }

  // Chuyển sang word tiếp theo
  currentNoiseIndex++;

  // Reset về đầu nếu đã hết words
  if (currentNoiseIndex >= words.length) {
    currentNoiseIndex = 0;
  }
}

function startRandomNoise() {
  if (noiseActive) return;
  noiseActive = true;
  currentNoiseIndex = 0;

  // Highlight word đầu tiên ngay lập tức
  highlightSequentialNoiseWord();

  // Sau đó cứ 1 giây chuyển sang word tiếp theo
  noiseInterval = setInterval(highlightSequentialNoiseWord, 1000); // 1000ms = 1s
}

function stopRandomNoise() {
  noiseActive = false;
  if (noiseInterval) {
    clearInterval(noiseInterval);
    noiseInterval = null;
  }

  // Reset tất cả words về trạng thái bình thường
  const words = document.querySelectorAll('.word');
  words.forEach(word => {
    const baseFlex = parseFloat(word.style.getPropertyValue('--word-flex')) || 1;
    word.style.transition = 'flex-grow 0.2s cubic-bezier(0.9, 0, 0, 1)';
    word.style.flex = baseFlex.toFixed(2);
  });

  // Sau khi animation hoàn thành, xóa transition để không ảnh hưởng hover effect
  setTimeout(() => {
    const words = document.querySelectorAll('.word');
    words.forEach(word => {
      word.style.transition = '';
    });
  }, 200); // 200ms = thời gian transition

  currentNoiseIndex = 0;
  console.log('Sequential noise animation stopped');
}

// Cho phép bật/tắt từ ngoài
window.toggleRandomNoise = function (enable) {
  if (enable) startRandomNoise();
  else stopRandomNoise();
}; 