#!/bin/bash
# Git Commands Cheat Sheet for Skolasti API Automation
# Copy and paste these commands as needed

# ==============================================
# INITIAL SETUP (One Time Only)
# ==============================================

# Navigate to project directory
cd "d:\Skolasti API Automation"

# Initialize git
git init

# Configure git (replace with your details)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "chore: initial commit - Skolasti API automation framework"

# Rename branch to main
git branch -M main

# Add remote repository (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/skolasti-api-automation.git

# Push to main
git push -u origin main

# Create and push develop branch
git checkout -b develop
git push -u origin develop

# ==============================================
# DAILY DEVELOPMENT WORKFLOW
# ==============================================

# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Make changes, then commit
git add .
git commit -m "feat(module): description of feature"

# Push feature branch
git push origin feature/your-feature-name

# After PR is merged, update develop and cleanup
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name

# ==============================================
# BUG FIX WORKFLOW
# ==============================================

# Create bugfix branch
git checkout develop
git pull origin develop
git checkout -b bugfix/fix-description

# Make fix and commit
git add .
git commit -m "fix(module): description of fix"

# Push bugfix
git push origin bugfix/fix-description

# ==============================================
# HOTFIX WORKFLOW (Emergency Production Fix)
# ==============================================

# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# Make fix
git add .
git commit -m "hotfix: description of critical fix"

# Push hotfix
git push origin hotfix/critical-fix

# After merging to main, also merge to develop
git checkout develop
git merge hotfix/critical-fix
git push origin develop

# ==============================================
# USEFUL GIT COMMANDS
# ==============================================

# Check current status
git status

# View commit history
git log --oneline

# View branches
git branch -a

# Switch branches
git checkout branch-name

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View remote URLs
git remote -v

# Update from remote
git pull origin branch-name

# Sync with upstream
git fetch origin
git merge origin/develop

# ==============================================
# TEST COMMANDS
# ==============================================

# Run all tests
npm test

# Run specific test file
npx playwright test tests/Course/CourseCrud.spec.js

# Run with UI mode
npm run test:ui

# Debug mode
npm run test:debug

# View HTML report
npm run test:report

# ==============================================
# ALLURE REPORT COMMANDS
# ==============================================

# Generate Allure report
npm run allure:generate

# Open Allure report
npm run allure:open

# Generate and open
npm run allure:report

# Clean reports
npm run allure:clean

# Run tests with Allure
npm run allure:test

# ==============================================
# GITHUB WORKFLOW COMMANDS
# ==============================================

# View workflow runs
gh run list

# View workflow details
gh run view

# Trigger workflow manually
gh workflow run api-tests.yml

# ==============================================
# COMMON SCENARIOS
# ==============================================

# Scenario 1: Start working on new feature
git checkout develop && git pull origin develop && git checkout -b feature/my-feature

# Scenario 2: Commit and push changes
git add . && git commit -m "feat: my feature" && git push origin $(git branch --show-current)

# Scenario 3: Update current branch with latest develop
git fetch origin && git rebase origin/develop

# Scenario 4: Squash last 3 commits
git reset --soft HEAD~3 && git commit -m "feat: combined feature"

# Scenario 5: View changes before commit
git diff

# Scenario 6: View changes after staging
git diff --staged

# ==============================================
# TROUBLESHOOTING
# ==============================================

# If push is rejected (conflicts)
git pull origin main --rebase
git push origin main

# If you need to change last commit message
git commit --amend -m "new commit message"
git push --force-with-lease origin branch-name

# If you accidentally committed to wrong branch
git log  # Note the commit hash
git checkout correct-branch
git cherry-pick COMMIT_HASH

# If you need to unstage files
git reset HEAD file-name

# If you need to discard local changes
git checkout -- file-name

# If you need to stash changes temporarily
git stash
git stash pop

# ==============================================
# BEST PRACTICES
# ==============================================

# Always pull before creating new branch
git checkout develop && git pull origin develop

# Always work on feature branches, never on main/develop directly

# Commit often with clear messages

# Push your branch daily to backup

# Keep commits small and focused

# Write descriptive commit messages

# Review changes before committing
git diff

# ==============================================
# COMMIT MESSAGE EXAMPLES
# ==============================================

# Feature
git commit -m "feat(quiz): add CRUD operations for quiz module"

# Bug fix
git commit -m "fix(course): resolve null pointer in payload generation"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Test
git commit -m "test(student): add validation test cases"

# Refactor
git commit -m "refactor(utils): improve API helper methods"

# Chore
git commit -m "chore(deps): update playwright to v1.40.0"

# Style
git commit -m "style: format code according to eslint rules"

# Performance
git commit -m "perf(api): optimize payload generation"

# ==============================================
# END OF CHEAT SHEET
# ==============================================
