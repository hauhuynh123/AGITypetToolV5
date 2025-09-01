# AGI Type Tool with AI Image Analysis

A powerful typing tool that combines visual character creation with AI-powered image analysis. Upload an image, and the AI will automatically detect keywords and type them using beautiful SVG characters.

## 🚀 Features

### Core Type Tool
- **Visual Character Creation**: Type with beautiful SVG characters
- **Vietnamese Support**: Full Vietnamese character support with Telex input method
- **Multiple Font Styles**: Switch between different character styles
- **Export Options**: Export as SVG or PNG
- **Customizable Canvas**: Adjust size, background, and effects
- **Audio Feedback**: Typing sounds and effects
- **Animation Effects**: Sequential highlighting and hover effects

### AI Image Analysis
- **Image Upload**: Drag & drop or click to upload images
- **AI Analysis**: Uses ChatGPT (OpenAI) for image recognition
- **Automatic Typing**: AI-detected keywords are automatically typed
- **Demo Mode**: Test without API keys using simulated responses
- **Hardcoded API Key**: API key embedded directly in code for simplicity
- **Collapsible Panel**: Clean, non-intrusive interface

## 🎯 How to Use

### Basic Usage
1. Open `index.html` in your web browser
2. The AI panel appears in the top-left corner
3. Upload an image or use demo mode
4. Click "Analyze & Type" to process the image
5. Watch as the AI automatically types the detected keywords
6. Continue typing manually or upload another image

### AI Setup
1. **Get an API Key**:
   - [OpenAI (ChatGPT)](https://platform.openai.com/api-keys)

2. **Configure the AI**:
   - Open `ai-integration.js` and replace the API key on line 8
   - Upload an image and click "Run"

### Demo Mode
- No API key required
- Click "Demo Mode" to test the functionality
- Uses predefined Vietnamese keywords for testing

## 🛠️ Technical Details

### File Structure
```
AGI Type Tool V4/
├── index.html              # Main application
├── ai-integration.css      # AI panel styling
├── ai-integration.js       # AI functionality
├── scripts copy.js         # Core typing logic
├── vietnamese-input.js     # Vietnamese character support
├── style.css              # Main styling
├── settings-popup.css     # Settings panel styling
├── chars/                 # SVG character files
├── test-integration.html  # Integration test page
└── README.md             # This file
```

### AI Integration
- **Image Processing**: Converts images to base64 for API calls
- **API Support**: GPT-4 Vision (OpenAI)
- **Error Handling**: Comprehensive error messages and fallbacks
- **Typing Simulation**: Integrates with existing Vietnamese input system
- **API Key Management**: Hardcoded key for simplified setup

### Character System
- **SVG Characters**: High-quality vector graphics
- **Flexible Layout**: Characters adjust to their natural width
- **Vietnamese Support**: Complete diacritic character set with Telex input method
- **Multiple Styles**: Different character collections available

## 🎨 Customization

### Settings Panel
- **Text Direction**: Switch between layout styles
- **Background**: Change colors or upload images
- **Canvas Size**: Adjust dimensions or go fullscreen
- **Effects**: Toggle animations, sounds, and hover effects
- **Export**: Save your creations as SVG or PNG

### AI Panel
- **Collapsible**: Click header to minimize/maximize
- **Fixed to OpenAI**: Uses ChatGPT API only
- **Demo Mode**: Test without API keys
- **Error Feedback**: Clear error messages and suggestions

## 🔧 Development

### Adding New Characters
1. Create SVG files in the `chars/` directory
2. Name files with uppercase letters (e.g., `A.svg`, `Ế.svg`)
3. The system automatically detects and loads them

### Extending AI Functionality
- Modify `ai-integration.js` for custom AI prompts
- Add new AI providers in the `getDescriptionFrom*` methods
- Customize the typing simulation in `simulateTyping()`

### Styling
- Main styles: `style.css` and `style2.css`
- AI panel: `ai-integration.css`
- Settings: `settings-popup.css`

## 🐛 Troubleshooting

### Common Issues
1. **API Errors**: Check your API key and internet connection
2. **Character Display**: Ensure SVG files are in the `chars/` directory
3. **Vietnamese Characters**: Verify the character files exist
4. **Performance**: Large images may take longer to process

### Browser Compatibility
- Modern browsers with ES6+ support
- File API support for image uploads
- Fetch API for AI requests

## 📝 License

This project combines multiple tools and technologies. Please respect the original licenses of included components.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the tool.

---

**Enjoy creating beautiful text with AI-powered image analysis! 🎨🤖**
# AGITypetToolV5
