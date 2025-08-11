# Study Buddy - AI-Powered Learning Platform

A professional AI-powered learning platform that creates personalized study experiences using advanced language models.

## Overview

Study Buddy is an enterprise-grade learning application that generates dynamic educational content, intelligent assessments, and comprehensive feedback. Built for professionals and organizations who need scalable, AI-driven learning solutions.

## Features

### Core Functionality
- AI-generated lessons tailored to any topic
- Multiple choice and essay question generation
- Intelligent answer evaluation with detailed feedback
- Adaptive difficulty levels (Beginner, Intermediate, Advanced)
- Real-time progress tracking and analytics

### Learning Modes
- **Custom Topics**: Study any subject you choose
- **Random Discovery**: AI-suggested topics for exploration
- **Quick Assessment**: Multiple choice questions with instant feedback
- **In-Depth Analysis**: Essay questions with comprehensive evaluation
- **Mixed Assessment**: Combination of question types

### Professional Design
- Clean, corporate-style interface
- Responsive design for all devices
- Professional color scheme and typography
- Accessibility compliant

## Quick Start

### Prerequisites
- Modern web browser
- Groq API key (free at console.groq.com)
- Web server or Docker (for deployment)

### Local Setup

1. Download the application files:
   ```
   study-buddy/
   ├── index.html
   ├── style.css
   ├── script.js
   ├── api.js
   └── config.js
   ```

2. Configure your API key in `config.js`:
   ```javascript
   const GROQ_API_KEY = 'your-groq-api-key-here';
   ```

3. Serve the application:
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js
   npx serve .
   ```

4. Access at http://localhost:8080

### Docker Deployment

1. Build and run:
   ```bash
   docker-compose build
   docker-compose up -d
   ```

2. Access at http://localhost:8080

## Configuration

### API Setup
The application uses the Groq API for AI functionality. Update `config.js` with your API credentials:

```javascript
window.APP_CONFIG = {
    version: '1.0.0',
    debug: false,
    maxQuestionsPerSession: 12,
    enableAnalytics: false
};

const GROQ_API_KEY = 'your-actual-api-key';
```

### Supported Models
- Primary: `llama-3.3-70b-versatile`
- Alternative: `llama-3.1-8b-instant`

## Usage

1. **Select Learning Mode**: Choose from custom topics, quick start options, or random discovery
2. **Set Difficulty**: Select your experience level with the topic
3. **Choose Assessment Type**: Pick your preferred question format
4. **Study**: Read the AI-generated lesson content
5. **Answer Questions**: Complete the personalized assessment
6. **Review Feedback**: Analyze your performance and improvement areas

## Technical Details

### Architecture
- Frontend: HTML5, CSS3, Vanilla JavaScript
- API Integration: Groq API for language model functionality
- Deployment: Docker with Nginx
- Security: CSP headers, CORS protection, input validation

### Performance
- Optimized for fast loading
- Efficient API usage
- Responsive across all devices
- Graceful degradation when offline

### Security
- Content Security Policy implementation
- API key protection
- Input sanitization
- HTTPS ready

## Docker Management

### Basic Commands
```bash
# Build application
make build

# Start application
make run

# Stop application  
make stop

# View logs
make logs

# Clean up
make clean
```

### Production Deployment
```bash
# Production mode
make prod

# Health check
make test

# Monitor resources
make stats
```

## File Structure

```
study-buddy/
├── index.html          # Main application page
├── style.css           # Professional styling
├── script.js           # Application logic
├── api.js              # AI integration
├── config.js           # Configuration settings
├── Dockerfile          # Container configuration
├── docker-compose.yml  # Orchestration
├── nginx.conf          # Web server config
├── .dockerignore       # Docker ignore rules
├── Makefile            # Deployment commands
└── README.md           # This file
```

## API Integration

The application integrates with the Groq API for:
- Lesson content generation
- Question creation
- Answer evaluation
- Hint generation

All AI features include fallback mechanisms for offline operation.

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

This is a corporate learning platform. For modifications or enhancements, ensure all changes maintain:
- Professional design standards
- Security best practices
- Cross-browser compatibility
- Accessibility compliance

## License

Private corporate application. All rights reserved.

## Support

For technical issues or deployment questions:
1. Check application logs
2. Verify API key configuration
3. Ensure all dependencies are installed
4. Test with basic HTTP server first

## Deployment Options

### Local Development
- Python HTTP server
- Node.js serve
- PHP built-in server

### Production
- Docker with Nginx
- Cloud platforms (AWS, GCP, Azure)
- VPS with reverse proxy
- CDN integration

The application is designed for scalable, professional deployment in corporate environments.