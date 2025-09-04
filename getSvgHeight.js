/**
 * Lấy giá trị Height của SVG
 * Hàm này có thể đọc file SVG và trích xuất thông tin về chiều cao
 */

// Hàm lấy height từ nội dung SVG string
function getSvgHeightFromString(svgContent) {
    try {
        // Tạo một DOM parser để parse SVG content
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (svgElement) {
            // Lấy height từ attribute
            const height = svgElement.getAttribute('height');
            if (height) {
                return parseFloat(height);
            }
            
            // Nếu không có height attribute, lấy từ viewBox
            const viewBox = svgElement.getAttribute('viewBox');
            if (viewBox) {
                const parts = viewBox.split(' ');
                if (parts.length >= 4) {
                    return parseFloat(parts[3]); // viewBox format: "x y width height"
                }
            }
        }
        return null;
    } catch (error) {
        console.error('Lỗi khi parse SVG:', error);
        return null;
    }
}

// Hàm đọc file SVG và lấy height
async function getSvgHeightFromFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const svgContent = await response.text();
        return getSvgHeightFromString(svgContent);
    } catch (error) {
        console.error('Lỗi khi đọc file SVG:', error);
        return null;
    }
}

// Hàm lấy height từ SVG element trong DOM
function getSvgHeightFromElement(svgElement) {
    if (!svgElement || svgElement.tagName !== 'svg') {
        console.error('Element không phải là SVG');
        return null;
    }
    
    // Lấy height từ attribute
    const height = svgElement.getAttribute('height');
    if (height) {
        return parseFloat(height);
    }
    
    // Lấy từ viewBox
    const viewBox = svgElement.getAttribute('viewBox');
    if (viewBox) {
        const parts = viewBox.split(' ');
        if (parts.length >= 4) {
            return parseFloat(parts[3]);
        }
    }
    
    // Lấy từ computed style
    const computedHeight = window.getComputedStyle(svgElement).height;
    if (computedHeight && computedHeight !== 'auto') {
        return parseFloat(computedHeight);
    }
    
    return null;
}

// Hàm lấy height từ tất cả SVG trong một thư mục
async function getAllSvgHeights(directoryPath) {
    const svgFiles = [
        'chars/A.svg', 'chars/B.svg', 'chars/C.svg', 'chars/D.svg', 'chars/E.svg',
        'chars/F.svg', 'chars/G.svg', 'chars/H.svg', 'chars/I.svg', 'chars/J.svg',
        'chars/K.svg', 'chars/L.svg', 'chars/M.svg', 'chars/N.svg', 'chars/O.svg',
        'chars/P.svg', 'chars/Q.svg', 'chars/R.svg', 'chars/S.svg', 'chars/T.svg',
        'chars/U.svg', 'chars/V.svg', 'chars/W.svg', 'chars/X.svg', 'chars/Y.svg',
        'chars/Z.svg', 'chars/0.svg', 'chars/1.svg', 'chars/9.svg'
    ];
    
    const results = {};
    
    for (const file of svgFiles) {
        const height = await getSvgHeightFromFile(file);
        if (height !== null) {
            results[file] = height;
        }
    }
    
    return results;
}

// Hàm hiển thị kết quả
function displaySvgHeights(heights) {
    console.log('=== Chiều cao của các file SVG ===');
    for (const [file, height] of Object.entries(heights)) {
        console.log(`${file}: ${height}px`);
    }
    
    // Tính toán thống kê
    const values = Object.values(heights);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    console.log('\n=== Thống kê ===');
    console.log(`Chiều cao trung bình: ${avg.toFixed(2)}px`);
    console.log(`Chiều cao nhỏ nhất: ${min}px`);
    console.log(`Chiều cao lớn nhất: ${max}px`);
}

// Hàm chính để chạy
async function main() {
    console.log('Đang lấy thông tin chiều cao của các file SVG...');
    
    try {
        const heights = await getAllSvgHeights('chars/');
        displaySvgHeights(heights);
        
        // Trả về kết quả để có thể sử dụng ở nơi khác
        return heights;
    } catch (error) {
        console.error('Lỗi:', error);
        return null;
    }
}

// Export các hàm để có thể sử dụng ở nơi khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getSvgHeightFromString,
        getSvgHeightFromFile,
        getSvgHeightFromElement,
        getAllSvgHeights,
        displaySvgHeights,
        main
    };
}

// Chạy hàm main nếu file được chạy trực tiếp
if (typeof window !== 'undefined') {
    // Trong browser environment
    window.getSvgHeight = {
        getSvgHeightFromString,
        getSvgHeightFromFile,
        getSvgHeightFromElement,
        getAllSvgHeights,
        displaySvgHeights,
        main
    };
} 