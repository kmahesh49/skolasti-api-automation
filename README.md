# 🎓 Skolasti API Test Automation

[![Playwright Tests](https://github.com/YOUR_USERNAME/skolasti-api-automation/actions/workflows/api-tests.yml/badge.svg)](https://github.com/YOUR_USERNAME/skolasti-api-automation/actions/workflows/api-tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Professional API testing framework for Skolasti platform using Playwright and JavaScript with Allure reporting.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Reporting](#reporting)
- [CI/CD](#cicd)
- [Branching Strategy](#branching-strategy)
- [Contributing](#contributing)

## 🎯 Overview

This framework provides comprehensive API test automation for the Skolasti platform, covering:
- **Course Management**: CRUD operations for courses
- **Quiz & Assessment**: Complete quiz lifecycle testing
- **Student Management**: Student profile and data operations
- **Assignment Management**: Assignment creation, updates, and validation

## ✨ Features

- 🚀 **Playwright API Testing**: Fast and reliable API automation
- 📊 **Allure Reports**: Beautiful, detailed test reports
- 🔄 **Reusable Components**: Modular design with helper utilities
- 📝 **Payload Generation**: Dynamic test data creation
- ⚙️ **Centralized Configuration**: Single source for API config
- 🤖 **CI/CD Integration**: Automated daily runs via GitHub Actions
- 📧 **Email Notifications**: Automatic report delivery
- 🌳 **GitFlow Strategy**: Industry-standard branching model
- 🎨 **Clean Architecture**: Organized folder structure
- ✅ **Comprehensive Coverage**: Create, Read, Update, Delete operations

## 📁 Project Structure

```
skolasti-api-automation/
├── .github/
│   ├── workflows/
│   │   └── api-tests.yml          # GitHub Actions workflow
│   ├── BRANCHING_STRATEGY.md      # GitFlow documentation
│   └── SECRETS.md                 # Secrets configuration guide
├── config/
│   └── config.js                  # API base URL and headers
├── payloads/
│   ├── coursePayload.js           # Course test data
│   ├── quizPayload.js             # Quiz test data
│   ├── studentPayload.js          # Student test data
│   └── assignmentPayload.js       # Assignment test data
├── requests/
│   └── [API request helpers]      # HTTP request utilities
├── tests/
│   ├── Course/
│   │   └── CourseCrud.spec.js     # Course API tests
│   ├── Quiz/
│   │   └── QuizCrud.spec.js       # Quiz API tests
│   ├── Student/
│   │   └── StudentCrud.spec.js    # Student API tests
│   └── Assignment/
│       └── AssignmentCrud.spec.js # Assignment API tests
├── utils/
│   ├── ApiHelper.js               # Common API operations
│   └── PayloadGenerator.js        # Dynamic payload creation
├── allure-results/                # Test execution results
├── allure-report/                 # Generated HTML reports
├── playwright.config.js           # Playwright configuration
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🔧 Prerequisites

- **Node.js**: v16 or higher ([Download](https://nodejs.org/))
- **npm**: v8 or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Code Editor**: VS Code recommended

## 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/skolasti-api-automation.git
   cd skolasti-api-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright**
   ```bash
   npx playwright install
   ```

4. **Install Allure (for local reporting)**
   ```bash
   npm install -g allure-commandline
   ```

## ⚙️ Configuration

### API Configuration

Update `config/config.js` with your API details:

```javascript
module.exports = {
  baseURL: "https://api.skolasti.com",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "your-api-key-here"
  }
};
```

### Environment Variables

For sensitive data, create a `.env` file:

```env
API_BASE_URL=https://api.skolasti.com
API_KEY=your-api-key-here
```

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
# Course tests
npx playwright test tests/Course/CourseCrud.spec.js

# Quiz tests
npx playwright test tests/Quiz/QuizCrud.spec.js

# Student tests
npx playwright test tests/Student/StudentCrud.spec.js

# Assignment tests
npx playwright test tests/Assignment/AssignmentCrud.spec.js
```

### Run with Different Reporters
```bash
# HTML report
npm test -- --reporter=html

# List reporter
npm test -- --reporter=list

# Dot reporter
npm test -- --reporter=dot
```

### Debug Mode
```bash
npx playwright test --debug
```

## 📊 Reporting

### Playwright HTML Report
```bash
# Run tests
npm test

# View report
npx playwright show-report
```

### Allure Report

```bash
# Generate and open Allure report
npm run allure:generate
npm run allure:open

# Or combine both
npm run allure:report
```

**Available scripts in `package.json`:**
- `npm run allure:generate` - Generate Allure report
- `npm run allure:open` - Open Allure report in browser
- `npm run allure:report` - Generate and open report

## 🤖 CI/CD

### Automated Execution

Tests run automatically:
- **Daily at 6:00 AM** via GitHub Actions
- **On every push** to `main` or `develop`
- **On pull requests** to `main`
- **Manual trigger** from GitHub Actions tab

### Email Notifications

After each run, automated emails are sent with:
- Test execution status
- Run number and commit details
- Link to detailed Allure report
- Downloadable artifacts

### Setup GitHub Secrets

Configure these secrets in your repository (Settings → Secrets → Actions):

1. `MAIL_USERNAME` - Sender email address
2. `MAIL_PASSWORD` - Email app password
3. `MAIL_TO` - Recipient emails (comma-separated)

See `.github/SECRETS.md` for detailed setup instructions.

## 🌳 Branching Strategy

This project follows **GitFlow**:

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Emergency fixes
- `release/*` - Release preparation

See `.github/BRANCHING_STRATEGY.md` for complete workflow details.

### Quick Commands

```bash
# Create feature branch
git checkout -b feature/your-feature-name develop

# Create bugfix branch
git checkout -b bugfix/your-bugfix-name develop

# Create hotfix branch
git checkout -b hotfix/critical-fix main
```

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Create Pull Request to `develop`
6. Wait for review and approval

### Commit Message Format

Follow **Conventional Commits**:

```
feat(quiz): add validation for quiz creation
fix(course): resolve payload generation issue
docs(readme): update installation steps
test(student): add negative test cases
```

## 📝 Test Cases Covered

### Course Module
- ✅ Create course
- ✅ Get course details
- ✅ Update course
- ✅ Delete course
- ✅ Verify deletion

### Quiz Module
- ✅ Create quiz
- ✅ Get quiz details
- ✅ Update quiz
- ✅ Delete quiz
- ✅ Verify deletion

### Student Module
- ✅ Create student profile
- ✅ Get student details
- ✅ Update student information
- ✅ Delete student
- ✅ Verify deletion

### Assignment Module
- ✅ Create assignment
- ✅ Get assignment details
- ✅ Update assignment
- ✅ Delete assignment
- ✅ Verify deletion

## 🛠️ Tech Stack

- **Test Framework**: Playwright v1.40+
- **Language**: JavaScript (Node.js)
- **Reporting**: Allure, Playwright HTML
- **CI/CD**: GitHub Actions
- **Version Control**: Git (GitFlow)
- **Package Manager**: npm

## 📞 Support

For issues or questions:
1. Check existing [Issues](https://github.com/YOUR_USERNAME/skolasti-api-automation/issues)
2. Create a new issue with detailed description
3. Contact the QA team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **QA Team** - Skolasti Platform

## 🙏 Acknowledgments

- Playwright Team for excellent API testing capabilities
- Allure Framework for beautiful reporting
- GitHub Actions for seamless CI/CD

---

**Last Updated**: December 2025  
**Version**: 1.0.0
