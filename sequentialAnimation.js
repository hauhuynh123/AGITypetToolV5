// sequentialAnimation.js
// Animation theo thứ tự word 1, 2, 3...n

let animationActive = false;
let animationInterval = null;
let currentAnimationIndex = 0;

function highlightSequentialWord() {
  const words = document.querySelectorAll('.word');
  if (words.length === 0) return;

  // Reset word trước đó về trạng thái bình thường
  words.forEach(word => {
    const baseFlex = parseFloat(word.style.getPropertyValue('--word-flex')) || 1;
    word.style.transition = 'flex-grow 0.2s cubic-bezier(0.9, 0, 0, 1)';
    word.style.flex = baseFlex.toFixed(2);
  });

  // Highlight word hiện tại theo index
  if (currentAnimationIndex < words.length) {
    const currentWord = words[currentAnimationIndex];
    const baseFlex = parseFloat(currentWord.style.getPropertyValue('--word-flex')) || 1;
    currentWord.style.transition = 'flex-grow 0.2s cubic-bezier(0.9, 0, 0, 1)';
    currentWord.style.flex = (baseFlex * 60).toFixed(2);

    console.log(`Sequential animation: highlighting word ${currentAnimationIndex + 1}/${words.length}`);
  }

  // Chuyển sang word tiếp theo
  currentAnimationIndex++;

  // Reset về đầu nếu đã hết words
  if (currentAnimationIndex >= words.length) {
    currentAnimationIndex = 0;
  }
}

function startSequentialAnimation() {
  if (animationActive) return;
  animationActive = true;
  currentAnimationIndex = 0;

  // Highlight word đầu tiên ngay lập tức
  highlightSequentialWord();

  // Sau đó cứ 1 giây chuyển sang word tiếp theo
  animationInterval = setInterval(highlightSequentialWord, 1000); // 1000ms = 1s
}

function stopSequentialAnimation() {
  animationActive = false;
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }

  // Reset tất cả words về trạng thái bình thường
  const words = document.querySelectorAll('.word');
  words.forEach(word => {
    const baseFlex = parseFloat(word.style.getPropertyValue('--word-flex')) || 1;
    word.style.transition = 'flex-grow 0.2s cubic-bezier(0.9, 0, 0, 1) ';
    word.style.flex = baseFlex.toFixed(2);
  });

  // Sau khi animation hoàn thành, xóa transition để không ảnh hưởng hover effect
  setTimeout(() => {
    const words = document.querySelectorAll('.word');
    words.forEach(word => {
      word.style.transition = '';
    });
  }, 100); // 200ms = thời gian transition

  currentAnimationIndex = 0;
  console.log('Sequential animation stopped');
}

// Cho phép bật/tắt từ ngoài
window.toggleSequentialAnimation = function (enable) {
  if (enable) startSequentialAnimation();
  else stopSequentialAnimation();
};
