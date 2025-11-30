# Deploying Devsphere to Render

This guide walks you through deploying the Devsphere application to Render.

## Prerequisites

- A [Render account](https://render.com) (free tier available)
- Your GitHub repository: `https://github.com/Ayush0135/devsphere.git`
- Required API keys and credentials:
  - `GROQ_API_KEY` - Your Groq API key
  - `EMAIL_USER` - Your Zoho email (devspheresoln@zohomail.in)
  - `EMAIL_PASS` - Your Zoho email password

## Deployment Steps

### 1. Push Changes to GitHub

First, commit and push all the deployment configuration changes:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Create Web Service on Render

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button and select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select the repository: **`Ayush0135/devsphere`**
5. Click **"Connect"**

### 3. Configure the Service

Render should auto-detect the `render.yaml` file. If not, configure manually:

- **Name**: `devsphere` (or your preferred name)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Select **Free** (or your preferred plan)

### 4. Set Environment Variables

In the Render dashboard, scroll to **"Environment Variables"** section and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Auto-set by render.yaml |
| `GROQ_API_KEY` | `your-groq-api-key` | **Required** - Get from Groq console |
| `GROQ_MODEL` | `llama-3.1-8b-instant` | Optional, defaults to this |
| `EMAIL_USER` | `devspheresoln@zohomail.in` | **Required** - Your Zoho email |
| `EMAIL_PASS` | `your-zoho-password` | **Required** - Your Zoho app password |

> **Note**: For `EMAIL_PASS`, use a Zoho [App Password](https://www.zoho.com/mail/help/adminconsole/two-factor-authentication.html) instead of your regular password for better security.

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your application
3. Monitor the build logs for any errors
4. Once deployed, you'll get a URL like: `https://devsphere.onrender.com`

## Verifying the Deployment

After deployment completes, test the following:

1. **Homepage**: Visit your Render URL - should load the main page
2. **Navigation**: Test all navigation links (About, Services, Contact, etc.)
3. **Static Assets**: Verify CSS styles are applied correctly
4. **Contact Form**: Submit a test message to verify email functionality
5. **AI Service Details**: Click "Learn More" on any service to test the Groq API integration

## Troubleshooting

### Build Fails

- Check the build logs in Render dashboard
- Ensure all dependencies in `package.json` are correct
- Verify Node.js version compatibility (requires >=18.0.0)

### Application Crashes

- Check the application logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure `GROQ_API_KEY` is valid

### Email Not Sending

- Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- Use Zoho App Password instead of regular password
- Check Zoho SMTP settings are correct (smtp.zoho.in:587)

### Static Files Not Loading

- Ensure `express.static(__dirname)` is in `server.js`
- Check file paths are correct (relative to project root)
- Verify CORS settings if accessing from different domain

## Automatic Deploys

Render automatically deploys when you push to your GitHub repository's main branch. To trigger a new deployment:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

## Custom Domain (Optional)

To use a custom domain:

1. Go to your service in Render dashboard
2. Click **"Settings"** → **"Custom Domain"**
3. Follow the instructions to add your domain
4. Update DNS records as instructed

## Free Tier Limitations

The Render free tier includes:

- 750 hours/month of runtime
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to a paid plan for production use

## Support

For issues specific to Render, check:
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Render Status](https://status.render.com/)
