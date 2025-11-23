# Deployment Guide - E-Commerce Website

## 🚀 Quick Deploy to Render (Recommended)

### Prerequisites
- GitHub account
- Render account (free at render.com)

### Step-by-Step Deployment

#### 1. Prepare Your Code

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - E-commerce website"
```

#### 2. Push to GitHub

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

#### 3. Deploy on Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: ecommerce-app
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   DB_HOST=<your-mysql-host>
   DB_USER=<your-mysql-user>
   DB_PASSWORD=<your-mysql-password>
   DB_NAME=online_store_db
   JWT_SECRET=<generate-random-string>
   PORT=3000
   ```

#### 4. Create MySQL Database on Render

1. Click "New +" → "MySQL"
2. Name: ecommerce-db
3. Plan: Free
4. Create Database
5. Copy connection details to your Web Service environment variables

#### 5. Setup Database

After deployment, run these commands in Render Shell:

```bash
# Access your web service shell in Render dashboard
npm run setup-db
npm run setup-products
npm run generate-images
npm run update-local-images
```

---

## 🌐 Alternative: Deploy to Railway

### Steps:

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add MySQL plugin
6. Add environment variables
7. Deploy!

**Environment Variables:**
```
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
JWT_SECRET=your_secret_key_here
PORT=3000
```

---

## 🔧 Alternative: Deploy to Vercel + PlanetScale

### 1. Deploy Database to PlanetScale

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create new database: `ecommerce-db`
3. Get connection string
4. Run migrations locally pointing to PlanetScale

### 2. Deploy App to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] `.env` file in `.gitignore`
- [ ] `node_modules` in `.gitignore`
- [ ] Database schema uploaded
- [ ] Sample products added
- [ ] Admin user created
- [ ] Images generated and uploaded
- [ ] Test all API endpoints
- [ ] Test authentication
- [ ] Test cart and checkout

---

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS (automatic on Render/Vercel)
- [ ] Set secure database password
- [ ] Don't commit `.env` file
- [ ] Enable CORS properly
- [ ] Rate limiting (optional)

---

## 🌍 After Deployment

1. **Test your live site**:
   - Register a new user
   - Browse products
   - Add items to cart
   - Complete checkout
   - Login to admin panel
   - Add/edit products

2. **Update DNS** (if using custom domain):
   - Point your domain to Render/Railway/Vercel
   - Wait for DNS propagation (up to 48 hours)

3. **Monitor**:
   - Check logs in dashboard
   - Monitor database usage
   - Track errors

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| **Render** | ✅ 750 hours/month | $7/month | Beginners |
| **Railway** | $5 credit/month | $5+/month | Modern apps |
| **Vercel** | ✅ Unlimited | $20/month | Scalability |
| **Heroku** | ❌ None | $5/month | Traditional |
| **DigitalOcean** | ❌ None | $6/month | Full control |

---

## 🆘 Troubleshooting

### Database Connection Failed
- Check environment variables
- Verify database host/port
- Check firewall rules
- Ensure database is running

### Images Not Loading
- Check if images folder is deployed
- Verify image paths in database
- Check static file serving in Express

### Port Issues
- Use `process.env.PORT` in server.js
- Don't hardcode port 3000

### Build Fails
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs for errors

---

## 📞 Support

- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs

---

## 🎉 Success!

Once deployed, your e-commerce website will be live at:
- Render: `https://your-app-name.onrender.com`
- Railway: `https://your-app-name.up.railway.app`
- Vercel: `https://your-app-name.vercel.app`

Share your live URL and start selling! 🛍️