# 🐘 PostgreSQL Setup Guide for Render

## ✅ Your Project is Now PostgreSQL Compatible!

I've converted your project from MySQL to PostgreSQL because Render's free tier only supports PostgreSQL.

---

## 📋 Quick Setup Steps

### 1. Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `ecommerce-db`
   - **Database**: `online_store_db`
   - **User**: `ecommerce_user` (or leave default)
   - **Region**: Same as your web service
   - **Plan**: **Free**
4. Click **"Create Database"**
5. Wait 2-3 minutes (status will show "Available")

### 2. Get Database Connection Details

1. Click on your PostgreSQL database
2. Scroll to **"Connections"** section
3. Copy these values:
   - **Hostname** (Internal)
   - **Port** (usually 5432)
   - **Database**
   - **Username**
   - **Password**

### 3. Add Environment Variables to Web Service

1. Go to your **Web Service** (ecommerce-app)
2. Click **"Environment"**
3. Add these variables:

```
DB_HOST=<hostname-from-step-2>
DB_PORT=5432
DB_USER=<username-from-step-2>
DB_PASSWORD=<password-from-step-2>
DB_NAME=online_store_db
JWT_SECRET=my_super_secret_jwt_key_2024
PORT=10000
NODE_ENV=production
```

4. Click **"Save Changes"**
5. Wait for auto-redeploy (2-3 minutes)

### 4. Setup Database (Run in Shell)

After deployment completes:

1. Click **"Shell"** tab in your web service
2. Run these commands **one by one**:

```bash
# Install dependencies (if needed)
npm install

# Setup database tables
npm run setup-db

# Add all 52 products
npm run setup-products

# Generate product images
npm run generate-images
```

### 5. Test Your Website!

Visit your Render URL and you should see:
- ✅ 52 products displayed
- ✅ Can register/login
- ✅ Can add to cart
- ✅ Admin panel works at `/admin`
- ✅ Login: admin@example.com / password

---

## 🔄 What Changed?

### Files Updated:
- ✅ `package.json` - Changed from `mysql2` to `pg`
- ✅ `config/database.js` - PostgreSQL connection
- ✅ `database/schema.sql` - PostgreSQL syntax
- ✅ `setup-postgres.js` - New setup script
- ✅ `setup-products-postgres.js` - Products with PostgreSQL

### Key Differences:
- MySQL uses `?` placeholders → PostgreSQL uses `$1, $2, $3`
- MySQL `AUTO_INCREMENT` → PostgreSQL `SERIAL`
- MySQL `ENUM` → PostgreSQL `VARCHAR with CHECK`
- MySQL port 3306 → PostgreSQL port 5432

---

## 🆘 Troubleshooting

### Issue: Connection failed
**Solution:**
- Make sure PostgreSQL database status is "Available"
- Use **Internal** connection details (not External)
- Check all environment variables are set
- Verify DB_PORT is 5432

### Issue: SSL error
**Solution:**
- Already handled! SSL is enabled in production automatically

### Issue: Products not showing
**Solution:**
- Run `npm run setup-products` in Shell
- Check logs for errors
- Verify database tables exist

### Issue: Can't register users
**Solution:**
- Run `npm run setup-db` first
- Check if users table exists
- Verify database connection

---

## ✅ Success Checklist

- [ ] PostgreSQL database created on Render
- [ ] Database status: "Available" (green)
- [ ] All environment variables added to web service
- [ ] Service redeployed successfully
- [ ] Ran `npm run setup-db` in Shell
- [ ] Ran `npm run setup-products` in Shell
- [ ] Ran `npm run generate-images` in Shell
- [ ] Website shows 52 products
- [ ] Can register new user
- [ ] Can login
- [ ] Cart works
- [ ] Admin panel accessible

---

## 🎉 You're Done!

Your e-commerce website is now running on:
- ✅ Render (free hosting)
- ✅ PostgreSQL (free database)
- ✅ 52 realistic Indian products
- ✅ Full e-commerce functionality

**Your website is live and ready to use!** 🚀