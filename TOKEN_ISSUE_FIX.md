# 🔑 API Token Issue - How to Fix

## ❌ **Current Problem**

Your tests are failing because:
1. **Bearer token is expired** - The token in `config/config.js` has expired
2. **Error**: "Missing Authorization" from the API
3. Tests work only when you have a valid, fresh token

## ✅ **Solution: Get a Fresh Token**

### **Option 1: Get Token from Your Application (Recommended)**

1. **Login to Skolasti Application**
   - Go to your Skolasti dev environment
   - Open browser DevTools (F12)
   - Go to Network tab

2. **Make an API Call**
   - Perform any action that calls the API
   - Look for requests to `webapi-dev-g6bwgkg6d2hcdrb2.centralindia-01.azurewebsites.net`

3. **Copy the Token**
   - Click on any API request
   - Go to "Headers" tab
   - Find "Authorization" header
   - Copy the entire value (e.g., `bearer eyJhbGciO...`)

4. **Update config.js**
   - Open `d:\Skolasti API Automation\config\config.js`
   - Replace the Authorization value with your new token
   - Save the file

### **Option 2: Request New Token from Team**

Contact your dev team or auth service to generate a long-lived token for automation.

---

## 🔧 **After Getting Fresh Token**

### **Update Local Config**

```javascript
// In config/config.js, line 5
"Authorization": "bearer YOUR_NEW_FRESH_TOKEN_HERE",
```

### **Test Locally First**

```powershell
cd "d:\Skolasti API Automation"
npm test
```

✅ If tests pass locally, proceed to GitHub setup.

---

## 🌐 **For GitHub Actions (CI/CD)**

### **Add API Token as GitHub Secret**

1. **Go to GitHub Secrets Page**
   ```
   Settings → Secrets and variables → Actions → New repository secret
   ```

2. **Add New Secret: API_TOKEN**
   - **Name**: `API_TOKEN`
   - **Secret**: Your fresh bearer token (e.g., `bearer eyJhbGciO...`)
   - Click "Add secret"

Now you'll have **4 secrets** total:
- ✅ `MAIL_USERNAME`
- ✅ `MAIL_PASSWORD`
- ✅ `MAIL_TO`
- ✅ `API_TOKEN` (NEW)

### **Update Workflow to Use Token**

The workflow needs to pass the token to tests:

```yaml
- name: Run API tests
  env:
    API_TOKEN: ${{ secrets.API_TOKEN }}
  run: npm test
  continue-on-error: true
```

---

## 📝 **Token Expiration Handling**

Your current token expires at: **December 7, 2025** (based on the exp claim)

### **Long-term Solutions:**

1. **Use Refresh Tokens**
   - Request a refresh token from your auth service
   - Auto-refresh before each test run

2. **Service Account Token**
   - Create a dedicated service account
   - Generate a long-lived token (90 days+)

3. **Token Rotation Script**
   - Create a script to auto-generate fresh tokens
   - Run before test execution

---

## 🎯 **Quick Fix Steps (Now)**

1. ✅ **Get fresh token** from browser DevTools
2. ✅ **Update `config/config.js`** locally
3. ✅ **Test locally** with `npm test`
4. ✅ **Add `API_TOKEN` to GitHub Secrets**
5. ✅ **Update workflow** (see below)
6. ✅ **Commit and push changes**
7. ✅ **Re-run GitHub Actions**

---

## 🔄 **Workflow Update Needed**

I'll update the workflow file to use the API_TOKEN secret from GitHub.

---

## ⚠️ **Important Notes**

- **Never commit tokens** to Git (already in .gitignore)
- **Rotate tokens regularly** for security
- **Use environment variables** for CI/CD
- **Monitor token expiration** dates
- **Keep backup tokens** in secure location

---

## 💡 **How to Check Token Expiration**

Your token has a JWT format. Decode it at [jwt.io](https://jwt.io):

1. Copy your bearer token (without "bearer " prefix)
2. Paste at jwt.io
3. Look at `exp` field in payload
4. Convert Unix timestamp to date

Current token expires: **1765120998** = **December 7, 2025, 6:00 AM**

---

## 🆘 **Need Help Getting Token?**

**Ask your team:**
- Auth service team
- Backend developers
- DevOps team

**What to request:**
- Long-lived bearer token for test automation
- Service account credentials
- Refresh token for auto-renewal

---

**After you get a fresh token, update the config file and I'll help you update the workflow!** 🚀
