# GitHub Secrets Configuration Guide

This document explains how to set up GitHub Secrets for the Skolasti API Automation project.

## Required Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

### Email Notification Secrets

1. **MAIL_USERNAME**
   - Description: Email address used to send notifications
   - Example: `your-email@gmail.com`
   - For Gmail: Enable "App Passwords" in Google Account settings

2. **MAIL_PASSWORD**
   - Description: Email password or app-specific password
   - For Gmail: Use App Password (not your regular password)
   - How to create Gmail App Password:
     - Go to Google Account → Security
     - Enable 2-Step Verification
     - Go to App Passwords
     - Generate a new app password for "Mail"
     - Use this 16-character password

3. **MAIL_TO**
   - Description: Comma-separated list of recipient email addresses
   - Example: `manager@company.com,team-lead@company.com,qa-team@company.com`
   - Format: `email1@domain.com,email2@domain.com`

## Optional Secrets (for future use)

4. **API_BASE_URL** (if you want to override config)
   - Production API URL
   - Example: `https://api.skolasti.com`

5. **API_TOKEN** (if your API requires authentication)
   - API authentication token
   - Example: `Bearer xyz123...`

## How to Add Secrets

1. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`
2. Click "New repository secret"
3. Enter the name (e.g., MAIL_USERNAME)
4. Enter the value
5. Click "Add secret"
6. Repeat for all required secrets

## Security Best Practices

- ✅ Never commit secrets to the repository
- ✅ Use GitHub Secrets for all sensitive data
- ✅ Use App Passwords for Gmail (more secure)
- ✅ Limit access to repository secrets
- ✅ Rotate secrets periodically
- ❌ Never share secrets in chat, email, or documentation
- ❌ Don't hardcode secrets in workflow files

## Testing Email Configuration

After adding secrets, you can test by:
1. Go to Actions tab
2. Select "Skolasti API Test Automation" workflow
3. Click "Run workflow" button
4. Select branch and run
5. Check your email for the report

## Troubleshooting

### Email not sending?
- Verify all three email secrets are set correctly
- Check Gmail allows "Less secure app access" or use App Password
- Verify recipient email addresses in MAIL_TO are correct
- Check GitHub Actions logs for error messages

### Gmail specific issues?
- Enable 2-Step Verification
- Generate and use App Password
- Allow IMAP access in Gmail settings
