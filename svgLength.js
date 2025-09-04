// Hàm lấy giá trị width thực tế của file SVG
// Sử dụng: getSVGWidth('chars/A.svg').then(width => { ... })

let SVG_width = 0;

async function getSVGWidth(svgPath) {
  try {
    const response = await fetch(svgPath);
    if (!response.ok) throw new Error('Không thể tải file SVG');
    const text = await response.text();
    // Parse SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(text, 'image/svg+xml');
    const svgElem = svgDoc.querySelector('svg');
    let width = 0;
    if (svgElem) {
      // Ưu tiên thuộc tính width
      if (svgElem.hasAttribute('width')) {
        width = parseFloat(svgElem.getAttribute('width'));
      } else if (svgElem.hasAttribute('viewBox')) {
        // Nếu không có width, lấy từ viewBox
        const viewBox = svgElem.getAttribute('viewBox').split(/\s+/);
        if (viewBox.length === 4) {
          width = parseFloat(viewBox[2]);
        }
      }
    }
    SVG_width = width;
    return SVG_width;
  } catch (e) {
    console.error(e);
    SVG_width = 0;
    return 0;
  }
}

// Ví dụ sử dụng:
// getSVGWidth('chars/A.svg').then(width => console.log('SVG width:', width)); 