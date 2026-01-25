# GreenShift Deployment Guide

This guide explains how to deploy your GreenShift application to the web for free using **Render** (for the app) and **MongoDB Atlas** (for the database).

## Prerequisites (Completed ✅)
- [x] **MongoDB Atlas** set up (Database)
- [x] **Cloudinary** set up (Images)
- [x] **Git** configured to ignore data files (`.gitignore`)
- [x] **Environment Variables** prepared (`.env.local`)

---

## Step 1: Push Code to GitHub
Ensure all your latest changes are committed and pushed to GitHub.
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Create Web Service on Render
1. Go to [Render.com](https://render.com) and log in.
2. Click **"New +"** -> **"Web Service"**.
3. Select **"Build and deploy from a Git repository"**.
4. Connect your GitHub account and select your `greenshift` repository.

## Step 3: Configure Service Details
Fill in the following settings:
- **Name:** `greenshift-app` (or similar)
- **Region:** Closest to you (e.g., Frankfurt, Oregon)
- **Branch:** `main`
- **Root Directory:** `.` (Leave blank)
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:server`
  - *Note:* We run the server `start:server` command because your Express server serves *both* the API and the React frontend (via static files in `dist` if configured, or you might need to adjust `server.js` to serve `dist` for production. *See "Important Note below"*).

## Step 4: Add Environment Variables
Scroll down to the **"Environment Variables"** section on Render. Add these exactly as they appear in your `.env.local` file:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://...` (Your full connection string) |
| `CLOUDINARY_CLOUD_NAME` | `drwpqcvea` |
| `CLOUDINARY_API_KEY` | `165954557383336` |
| `CLOUDINARY_API_SECRET` | `EDVaD7PIz4pH0o0efXzdFbd-lC0` |
| `GEMINI_API_KEY` | `AIzaSyDOZ9C0Q0...` |

*(Copy the full values from your local file)*

## Step 5: Deploy
Click **"Create Web Service"**.
- Render will start building your app.
- Watch the logs. You should see "Connected to MongoDB" when it starts.

---

## ⚠️ Important Note on "Build"
Currently, your `package.json` has `start:server` which runs `server/server.js`.
By default, this runs the **API**, but it doesn't automatically serve the **Frontend** unless we build the frontend and tell Express to serve it.

**For a simple 1-service deployment:**
You need to ensure your `server.js` serves the built React files.
1. `npm run build` creates a `dist` folder.
2. Your `server.js` should have:
   ```javascript
   app.use(express.static(path.join(__dirname, '../dist')));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../dist/index.html'));
   });
   ```
   *(Place this at the bottom of routes, before `app.listen`)*

If you haven't added this yet, the deployed site might only show the API, not the UI.

## Troubleshooting
- **"Application Error"**: Check the "Logs" tab in Render.
- **"MongoTimeoutError"**: Check your "Network Access" in MongoDB Atlas. Ensure IP address `0.0.0.0/0` (Allow Access from Anywhere) is whitelisted so Render can connect.
