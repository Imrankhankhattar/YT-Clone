# Deployment Guide for YouTube Clone API

## Deploying Backend Server to Render

### 1. Environment Variables Required

Set these environment variables in your Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/youtube-clone
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-api.onrender.com/api/auth/google/redirect
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id
```

### 2. Build Configuration

- **Build Command**: `cd server && npm install`
- **Start Command**: `npm start`

**Important**: The root package.json now has a `start` script that uses `start-server.js` to properly launch the server from the server directory.

### 3. Important Notes

1. **MongoDB**: Use MongoDB Atlas for cloud database
2. **Google OAuth**: Set up OAuth 2.0 credentials in Google Cloud Console
3. **Google Drive**: Optional - for cloud file storage
4. **Port**: Render will automatically assign a port, but we set it to 10000 as default
5. **API Only**: This deployment is for the backend API only

### 4. Troubleshooting

If you get "Cannot find module 'express'" error:
1. Make sure all dependencies are listed in server/package.json
2. Check that the build command runs successfully
3. Verify that node_modules are being installed in the server directory

### 5. Local Testing

To test locally before deploying:
```bash
cd server
npm install
npm start
```

### 6. File Structure for Deployment

The server is structured as:
```
/
├── server/
│   ├── package.json (server dependencies)
│   ├── index.js (main server file)
│   ├── routes/ (API routes)
│   ├── models/ (database models)
│   └── config/ (configuration files)
├── render.yaml (Render configuration)
└── Procfile (process definition)
```

### 7. API Endpoints

The server provides these API endpoints:
- `GET /` - Health check
- `POST /api/auth/google` - Google OAuth login
- `GET /api/videos` - Get videos
- `POST /api/videos/upload` - Upload video
- `GET /api/videos/search` - Search videos
- `GET /api/channels` - Get channels
- `POST /api/subscriptions` - Manage subscriptions
- `GET /api/comments` - Get comments
- `POST /api/comments` - Add comments
- `POST /api/ratings` - Rate videos 