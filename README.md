# LucidLink File API Demo

A demonstration file management API showcasing AI-powered development workflow with Bob.

## 🎯 Purpose

This project demonstrates how Bob (AI Developer) can autonomously:
- Implement features from GitHub issues
- Write comprehensive tests
- Follow consistent code patterns
- Maintain documentation
- Create pull requests

## 🚀 Features

### Backend API
- **File Management**: Upload, list, retrieve, and delete files
- **Storage Statistics**: Track total storage usage and file counts
- **Validation**: File size, type, and name validation
- **RESTful API**: Clean, well-documented endpoints
- **Comprehensive Testing**: Unit and integration tests with 92% coverage

### Frontend UI
- **React Application**: Modern, responsive web interface
- **Beautiful Design**: Gradient UI with smooth animations
- **Real-time Updates**: Instant feedback on all operations
- **File Upload**: Easy-to-use upload form with validation
- **Storage Dashboard**: Visual statistics and file management

## 📋 API Endpoints

### Files
- `GET /api/files` - List all files
- `POST /api/files/upload` - Upload a new file
- `GET /api/files/:id` - Get file by ID
- `DELETE /api/files/:id` - Delete file by ID

### Statistics
- `GET /api/files/stats/storage` - Get storage statistics

### Health
- `GET /health` - Health check endpoint

## 🛠️ Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/lucidlink-file-api-demo.git
cd lucidlink-file-api-demo

# Install backend dependencies
npm install

# Start the backend server
npm start
```

The backend API will start on `http://localhost:3000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

The frontend UI will start on `http://localhost:5173`

### Running Both (Full Stack)

**Terminal 1 - Backend:**
```bash
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open your browser to `http://localhost:5173`

## 🧪 Testing

```bash
# Run all tests
npm test
## 🎨 Frontend UI

The project includes a beautiful React frontend for interacting with the API.

### Features
- 📁 Upload files with metadata
- 📋 View all files with details
- 🗑️ Delete files
- 📊 Real-time storage statistics
- 🎨 Beautiful gradient design
- 📱 Fully responsive

### Access the UI
After starting both backend and frontend:
- Backend API: http://localhost:3000
- Frontend UI: http://localhost:5173

See [frontend/README.md](frontend/README.md) for detailed frontend documentation.


# Run tests with coverage
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📖 Usage Examples

### Upload a File

```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Content-Type: application/json" \
  -d '{
    "name": "document.pdf",
    "size": 1048576,
    "type": "application/pdf"
  }'
```

### List All Files

```bash
curl http://localhost:3000/api/files
```

### Get Storage Statistics

```bash
curl http://localhost:3000/api/files/stats/storage
```

### Delete a File

```bash
curl -X DELETE http://localhost:3000/api/files/1234567890
```

## 🏗️ Project Structure

```
lucidlink-file-api-demo/
├── backend/
│   ├── server.js              # Express server setup
│   ├── routes/
│   │   └── files.js           # File API routes
│   ├── services/
│   │   └── fileService.js     # Business logic
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   └── utils/
│       └── validator.js       # Validation utilities
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── FileList.jsx
│   │   │   ├── UploadForm.jsx
│   │   │   └── StorageStats.jsx
│   │   ├── api/
│   │   │   └── client.js      # API client
│   │   ├── App.jsx            # Main app
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── tests/
│   ├── files.test.js          # API endpoint tests
│   └── validator.test.js      # Validation tests
├── .env.example               # Environment template
├── package.json               # Backend dependencies
└── README.md
```

## 🔒 Validation Rules

- **File Size**: Maximum 100MB
- **File Types**: jpeg, png, gif, pdf, txt, json, mp4
- **File Name**: Max 255 characters, no special characters

## 🤖 Bob AI Developer

This project is maintained by Bob, an AI developer that:
- Monitors GitHub issues
- Implements features autonomously
- Writes tests automatically
- Maintains code quality standards
- Creates detailed pull requests

### How Bob Works

1. **Issue Detection**: Bob polls the repository for new issues
2. **Analysis**: Understands requirements and existing codebase
3. **Implementation**: Writes code following project patterns
4. **Testing**: Creates comprehensive test coverage
5. **Documentation**: Updates README and inline comments
6. **Pull Request**: Creates PR with detailed description

## 📊 Code Quality

- ✅ Consistent code style
- ✅ Comprehensive error handling
- ✅ High test coverage
- ✅ Clear documentation
- ✅ RESTful API design

## 🔄 Development Workflow

1. Create a GitHub issue with feature requirements
2. Bob detects the issue and analyzes it
3. Bob implements the feature across multiple files
4. Bob writes tests and updates documentation
5. Bob creates a pull request
6. Review and merge

## 📝 License

MIT

## 🤝 Contributing

This is a demo project. For the LucidLink presentation, Bob handles all contributions autonomously.

---

**Built with ❤️ by Bob AI Developer**