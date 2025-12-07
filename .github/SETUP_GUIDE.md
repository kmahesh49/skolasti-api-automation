# 🚀 Step-by-Step GitHub Repository Setup Guide

This guide will walk you through creating a GitHub repository and pushing your Skolasti API Automation project.

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] GitHub account created
- [ ] Git installed on your machine
- [ ] Project files ready to push
- [ ] GitHub Desktop or Git CLI configured

## 🎯 Step 1: Create GitHub Repository

### Option A: Using GitHub Website

1. **Go to GitHub**
   - Navigate to [github.com](https://github.com)
   - Click the "+" icon in top-right corner
   - Select "New repository"

2. **Configure Repository**
   - **Repository name**: `skolasti-api-automation`
   - **Description**: `API Test Automation for Skolasti Platform using Playwright`
   - **Visibility**: Choose Private or Public
   - **Initialize repository**: 
     - ❌ DO NOT check "Add a README file"
     - ❌ DO NOT add .gitignore (we already have one)
     - ❌ DO NOT add license (optional)
   - Click "Create repository"

3. **Copy Repository URL**
   - You'll see the repository URL (e.g., `https://github.com/YOUR_USERNAME/skolasti-api-automation.git`)
   - Keep this page open - you'll need these commands

### Option B: Using GitHub CLI (Advanced)

```bash
gh repo create skolasti-api-automation --private --description "API Test Automation for Skolasti Platform"
```

## 🔧 Step 2: Initialize Git Locally

Open terminal in your project directory and run:

```powershell
# Navigate to project directory
cd "d:\Skolasti API Automation"

# Initialize git repository
git init

# Check status
git status
```

## 📝 Step 3: Configure Git (First Time Only)

If you haven't configured Git before:

```powershell
# Set your name
git config --global user.name "Your Name"

# Set your email (use GitHub email)
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

## 🌿 Step 4: Create Initial Commit on Main Branch

```powershell
# Add all files to staging
git add .

# Check what will be committed
git status

# Create initial commit
git commit -m "chore: initial commit - Skolasti API automation framework"

# Rename branch to main (if needed)
git branch -M main
```

## 🔗 Step 5: Connect to GitHub Repository

Replace `YOUR_USERNAME` with your actual GitHub username:

```powershell
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/skolasti-api-automation.git

# Verify remote
git remote -v
```

## 📤 Step 6: Push to GitHub

```powershell
# Push main branch to GitHub
git push -u origin main
```

### If you get authentication errors:

**For HTTPS (Recommended):**
1. Use Personal Access Token instead of password
2. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
3. Generate new token with `repo` scope
4. Use token as password when prompted

**For SSH (Alternative):**
```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Then change remote to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/skolasti-api-automation.git
```

## 🌳 Step 7: Create Develop Branch

```powershell
# Create and switch to develop branch
git checkout -b develop

# Push develop branch
git push -u origin develop
```

## 🔒 Step 8: Set Up Branch Protection Rules

1. **Go to Repository Settings**
   - Navigate to your repository on GitHub
   - Click "Settings" tab
   - Click "Branches" in left sidebar

2. **Protect Main Branch**
   - Click "Add branch protection rule"
   - Branch name pattern: `main`
   - Enable:
     - ✅ Require a pull request before merging
     - ✅ Require approvals (set to 1)
     - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - ✅ Do not allow bypassing the above settings
   - Click "Create"

3. **Protect Develop Branch**
   - Repeat for `develop` branch with similar settings

## 🔐 Step 9: Configure GitHub Secrets

For automated email notifications:

1. **Go to Settings → Secrets and variables → Actions**
2. **Click "New repository secret"**
3. **Add these secrets:**

   **MAIL_USERNAME**
   - Name: `MAIL_USERNAME`
   - Secret: Your email address (e.g., `your-email@gmail.com`)

   **MAIL_PASSWORD**
   - Name: `MAIL_PASSWORD`
   - Secret: Your email app password
   - For Gmail:
     1. Go to Google Account → Security
     2. Enable 2-Step Verification
     3. Go to App Passwords
     4. Generate password for "Mail"
     5. Copy the 16-character password

   **MAIL_TO**
   - Name: `MAIL_TO`
   - Secret: Recipient emails (comma-separated)
   - Example: `manager@company.com,qa-lead@company.com,team@company.com`

4. **Click "Add secret" for each**

## ✅ Step 10: Verify Setup

### Test GitHub Actions

1. **Go to Actions tab** in your repository
2. **Click "Skolasti API Test Automation" workflow**
3. **Click "Run workflow" dropdown**
4. **Select branch** (main or develop)
5. **Click "Run workflow" button**
6. **Wait for execution** and check results
7. **Verify email** was received

### Verify Branch Protection

1. Try to push directly to main:
   ```powershell
   git checkout main
   echo "test" > test.txt
   git add test.txt
   git commit -m "test"
   git push
   ```
   Should be blocked if protection is working correctly!

2. Clean up:
   ```powershell
   git reset --hard HEAD~1
   ```

## 📊 Step 11: Enable GitHub Pages (Optional)

For hosting Allure reports:

1. **Go to Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: Select `gh-pages` (will be created by workflow)
4. **Folder**: `/ (root)`
5. **Save**

After first test run, reports will be available at:
`https://YOUR_USERNAME.github.io/skolasti-api-automation/reports/RUN_NUMBER/`

## 🎨 Step 12: Add Topics to Repository

1. **Go to repository main page**
2. **Click gear icon** next to "About"
3. **Add topics**:
   - `playwright`
   - `api-testing`
   - `test-automation`
   - `javascript`
   - `allure-report`
   - `ci-cd`
   - `github-actions`
4. **Save changes**

## 📚 Step 13: Update README Badge

In `README.md`, update the badge URL with your actual username:

```markdown
[![Playwright Tests](https://github.com/YOUR_USERNAME/skolasti-api-automation/actions/workflows/api-tests.yml/badge.svg)](https://github.com/YOUR_USERNAME/skolasti-api-automation/actions/workflows/api-tests.yml)
```

Commit and push this change:

```powershell
git checkout develop
git add README.md
git commit -m "docs: update GitHub Actions badge URL"
git push origin develop
```

## 🎯 Daily Workflow

### Creating a New Feature

```powershell
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and commit
git add .
git commit -m "feat(module): add your feature"

# 4. Push to GitHub
git push origin feature/your-feature-name

# 5. Create Pull Request on GitHub
# 6. After review and merge, delete branch
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name
```

## 🔍 Troubleshooting

### Issue: Push rejected
**Solution**: Pull latest changes first
```powershell
git pull origin main --rebase
git push origin main
```

### Issue: Authentication failed
**Solution**: Use Personal Access Token
- Generate token at: github.com/settings/tokens
- Use token as password

### Issue: Email not sending
**Solution**: Verify secrets
- Check MAIL_USERNAME, MAIL_PASSWORD, MAIL_TO
- For Gmail, use App Password
- Check workflow logs in Actions tab

### Issue: Tests not running
**Solution**: Check workflow file
- Verify `.github/workflows/api-tests.yml` exists
- Check syntax using YAML validator
- Review Actions tab for errors

## 📞 Need Help?

- Check [GitHub Docs](https://docs.github.com/)
- See [CONTRIBUTING.md](.github/CONTRIBUTING.md)
- Review [BRANCHING_STRATEGY.md](.github/BRANCHING_STRATEGY.md)
- Ask in GitHub Discussions

## ✅ Success Checklist

After completing all steps, verify:

- [ ] Repository created on GitHub
- [ ] Code pushed to `main` branch
- [ ] `develop` branch created and pushed
- [ ] Branch protection rules configured
- [ ] GitHub Secrets configured (email)
- [ ] GitHub Actions workflow running successfully
- [ ] Email notifications working
- [ ] README badge updated
- [ ] All documentation reviewed

## 🎉 You're All Set!

Your Skolasti API Automation is now:
- ✅ Stored in GitHub with version control
- ✅ Running automated tests daily at 6:00 AM
- ✅ Sending email reports automatically
- ✅ Following industry-standard GitFlow branching
- ✅ Ready for team collaboration

---

**Next Steps:**
1. Invite team members as collaborators
2. Set up project board for task tracking
3. Create first feature branch and start developing
4. Monitor daily test runs and reports

**Happy Testing! 🚀**
