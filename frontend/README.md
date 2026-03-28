# LucidLink File Manager - Frontend

React frontend for the LucidLink File API Demo.

## 🚀 Quick Start

### Install Dependencies
```bash
cd frontend
npm install
```

### Start Development Server
```bash
npm run dev
```

The app will be available at: http://localhost:5173

### Build for Production
```bash
npm run build
```

## 📋 Prerequisites

- Node.js 16+ installed
- Backend API running on http://localhost:3000

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Styling (no framework needed)

## 🎯 Features

- ✅ Upload files with metadata
- ✅ View all uploaded files
- ✅ Delete files
- ✅ Real-time storage statistics
- ✅ Responsive design
- ✅ Beautiful gradient UI
- ✅ Error handling
- ✅ Loading states

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── FileList.jsx       # File listing component
│   │   ├── UploadForm.jsx     # File upload form
│   │   └── StorageStats.jsx   # Storage statistics
│   ├── api/
│   │   └── client.js          # API client
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
└── package.json               # Dependencies
```

## 🔧 Configuration

### API URL

The frontend connects to the backend API. By default, it uses:
- Development: `http://localhost:3000`
- Can be configured via `VITE_API_URL` environment variable

### Vite Proxy

The Vite dev server is configured to proxy `/api` requests to the backend:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

## 🎨 UI Components

### UploadForm
- File name input
- File size input (in MB)
- File type selector
- Owner field
- Upload button with loading state

### FileList
- Displays all uploaded files
- Shows file metadata (size, type, date, owner)
- Delete button for each file
- Empty state when no files
- Loading state

### StorageStats
- Total files count
- Total storage used
- Average file size
- Gradient card design

## 🌐 API Integration

All API calls are handled through `src/api/client.js`:

```javascript
import { fileAPI } from './api/client';

// Get all files
const files = await fileAPI.getFiles();

// Upload file
await fileAPI.uploadFile(fileData);

// Delete file
await fileAPI.deleteFile(fileId);

// Get storage stats
const stats = await fileAPI.getStorageStats();
```

## 🎭 Demo Usage

### For LucidLink Presentation:

1. **Start Backend**:
   ```bash
   cd ..
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Browser**: http://localhost:5173

4. **Demo Flow**:
   - Show the beautiful UI
   - Upload a file (e.g., "presentation.pdf", 5 MB)
   - Watch it appear in the list
   - Show storage stats update
   - Delete a file
   - Show responsive design (resize browser)

## 📱 Responsive Design

The UI is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Color Scheme

- Primary Gradient: `#667eea` → `#764ba2`
- Background: Gradient purple
- Cards: White with shadow
- Text: Dark gray (#212529)
- Accents: Purple gradient

## 🔍 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js or use:
PORT=5174 npm run dev
```

### API Connection Failed
- Ensure backend is running on port 3000
- Check CORS is enabled in backend
- Verify proxy configuration in vite.config.js

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development Notes

### Adding New Features

1. Create component in `src/components/`
2. Add API method in `src/api/client.js`
3. Import and use in `App.jsx`
4. Update this README

### Styling

- Global styles in `src/index.css`
- Component-specific styles inline or in CSS
- Uses CSS custom properties for theming

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Deploy to Netlify/Vercel
1. Build the project
2. Deploy the `dist/` folder
3. Set environment variable: `VITE_API_URL=your-api-url`

## 📊 Performance

- Fast dev server with HMR (Hot Module Replacement)
- Optimized production build
- Code splitting
- Lazy loading ready

## 🎯 Future Enhancements

Potential features to add (great for Bob demo issues):
- [ ] File search/filter
- [ ] Drag & drop upload
- [ ] File preview
- [ ] Bulk operations
- [ ] Dark mode
- [ ] File sharing
- [ ] Upload progress bar
- [ ] File versioning UI

---

**Built with ❤️ by Bob AI Developer**