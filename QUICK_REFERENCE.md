# 📋 Quick Reference Guide

## 🚀 Common Commands

### Git Commands

```powershell
# Check status
git status

# Create feature branch
git checkout -b feature/feature-name develop

# Add and commit changes
git add .
git commit -m "feat(module): description"

# Push to GitHub
git push origin branch-name

# Switch branches
git checkout develop
git checkout main

# Update branch
git pull origin develop

# Delete branch (after merge)
git branch -d feature-name
```

### Test Commands

```powershell
# Run all tests
npm test

# Run specific test file
npx playwright test tests/Course/CourseCrud.spec.js

# Run with UI mode
npm run test:ui

# Debug tests
npm run test:debug

# View HTML report
npm run test:report
```

### Allure Report Commands

```powershell
# Generate Allure report
npm run allure:generate

# Open Allure report
npm run allure:open

# Generate and open (combined)
npm run allure:report

# Clean reports
npm run allure:clean

# Run tests with Allure
npm run allure:test
```

## 📧 GitHub Secrets Required

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `MAIL_USERNAME` | Sender email | `your-email@gmail.com` |
| `MAIL_PASSWORD` | Email app password | `abcd efgh ijkl mnop` |
| `MAIL_TO` | Recipient emails | `user1@test.com,user2@test.com` |

## 🌳 Branch Names

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/name` | `feature/add-student-tests` |
| Bugfix | `bugfix/name` | `bugfix/fix-quiz-validation` |
| Hotfix | `hotfix/name` | `hotfix/critical-api-fix` |
| Release | `release/version` | `release/v1.0.0` |

## 📝 Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(quiz): add CRUD operations` |
| `fix` | Bug fix | `fix(course): resolve null error` |
| `docs` | Documentation | `docs(readme): update setup guide` |
| `test` | Add/update tests | `test(student): add validation tests` |
| `refactor` | Code refactor | `refactor(utils): improve helper` |
| `chore` | Maintenance | `chore(deps): update playwright` |

## 📊 GitHub Actions Schedule

- **Daily Run**: 6:00 AM (UTC+0:00 at 12:30 AM)
- **On Push**: To `main` or `develop` branches
- **On PR**: To `main` branch
- **Manual**: Via Actions tab

## 🔗 Important URLs

After setup, replace `YOUR_USERNAME` with actual username:

- Repository: `https://github.com/YOUR_USERNAME/skolasti-api-automation`
- Actions: `https://github.com/YOUR_USERNAME/skolasti-api-automation/actions`
- Settings: `https://github.com/YOUR_USERNAME/skolasti-api-automation/settings`
- Secrets: `https://github.com/YOUR_USERNAME/skolasti-api-automation/settings/secrets/actions`

## 📂 Project Structure

```
skolasti-api-automation/
├── .github/              # GitHub configuration
│   ├── workflows/        # GitHub Actions
│   └── *.md             # Documentation
├── config/              # API configuration
├── payloads/            # Test data
├── tests/               # Test files
│   ├── Course/
│   ├── Quiz/
│   ├── Student/
│   └── Assignment/
├── utils/               # Helper utilities
├── allure-results/      # Test results (git ignored)
└── allure-report/       # HTML reports (git ignored)
```

## ✅ First Time Setup Checklist

- [ ] Create GitHub repository
- [ ] Initialize git locally
- [ ] Push to `main` branch
- [ ] Create `develop` branch
- [ ] Set branch protection rules
- [ ] Add GitHub Secrets (email)
- [ ] Test GitHub Actions workflow
- [ ] Verify email delivery
- [ ] Update README badge URL
- [ ] Invite team members

## 🎯 Daily Development Flow

1. Pull latest develop: `git pull origin develop`
2. Create feature branch: `git checkout -b feature/name develop`
3. Make changes and test: `npm test`
4. Commit: `git commit -m "feat: description"`
5. Push: `git push origin feature/name`
6. Create PR on GitHub
7. Wait for review and merge
8. Delete local branch: `git branch -d feature/name`

## 🐛 Troubleshooting

### Tests fail locally?
```powershell
npm install
npx playwright install
npm test
```

### Git push rejected?
```powershell
git pull origin main --rebase
git push origin main
```

### Email not working?
- Check GitHub Secrets are set correctly
- Use Gmail App Password (not regular password)
- Verify MAIL_TO has correct email addresses

### Workflow not running?
- Check `.github/workflows/api-tests.yml` exists
- Verify cron syntax
- Check Actions tab for errors

## 📞 Need Help?

Refer to detailed documentation:
- Setup: `.github/SETUP_GUIDE.md`
- Branching: `.github/BRANCHING_STRATEGY.md`
- Secrets: `.github/SECRETS.md`
- Contributing: `.github/CONTRIBUTING.md`

## 🎓 Learning Resources

- [Playwright Docs](https://playwright.dev/docs/api-testing)
- [Allure Framework](https://docs.qameta.io/allure/)
- [GitFlow Guide](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Keep this guide handy for quick reference!** 📚
