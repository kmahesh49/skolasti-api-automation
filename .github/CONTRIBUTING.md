# Contributing to Skolasti API Automation

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and encourage learning
- Focus on constructive feedback
- Maintain professional communication

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/skolasti-api-automation.git
   ```
3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/skolasti-api-automation.git
   ```
4. **Install dependencies**
   ```bash
   npm install
   npx playwright install
   ```

## 💻 Development Workflow

### 1. Create a Branch

Follow our [branching strategy](.github/BRANCHING_STRATEGY.md):

```bash
# For new features
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# For bug fixes
git checkout develop
git pull origin develop
git checkout -b bugfix/your-bugfix-name

# For hotfixes
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix
```

### 2. Make Changes

- Write clean, readable code
- Follow existing patterns and structure
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run specific test
npx playwright test tests/YourTest.spec.js

# Generate Allure report
npm run allure:report
```

### 4. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat(module): add new feature description"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Fill out the PR template
- Submit for review

## 📐 Coding Standards

### JavaScript Style Guide

#### File Naming
- Use PascalCase for class files: `ApiHelper.js`, `PayloadGenerator.js`
- Use camelCase for test files: `courseCrud.spec.js`
- Use lowercase for config files: `config.js`

#### Code Formatting

```javascript
// Good - Clear and descriptive
const createResponse = await api.create("/endpoint", payload, 200);
const courseId = createResponse.CourseId;

// Bad - Unclear naming
const res = await api.create("/endpoint", p, 200);
const id = res.CourseId;
```

#### Structure
```javascript
// 1. Imports
const { test } = require("@playwright/test");
const { ApiHelper } = require("../utils/ApiHelper.js");

// 2. Test suite
test("Descriptive test name", async ({ request }) => {
  // 3. Setup
  const api = new ApiHelper(request, baseURL, headers);
  
  // 4. Test steps with clear comments
  // ==================== CREATE ====================
  const createPayload = PayloadGenerator.generatePayload();
  const createResponse = await api.create("/endpoint", createPayload, 200);
  
  // 5. Assertions and validation
  expect(createResponse).toBeDefined();
});
```

### Test File Standards

1. **One test per file** for CRUD operations
2. **Clear section separators** using comments
3. **Meaningful variable names**
4. **Proper error handling**
5. **Console logs** for debugging

Example:
```javascript
test("Module CRUD: Create → Get → Update → Delete → Verify", async ({ request }) => {
  const api = new ApiHelper(request, baseURL, headers);

  // ==================== CREATE ====================
  const createPayload = PayloadGenerator.generatePayload();
  const createResponse = await api.create("/endpoint", createPayload, 200);
  const id = createResponse.Id;
  console.log("Created ID:", id);

  // ==================== GET ====================
  await api.get(`/endpoint?id=${id}`, 200);
  console.log("Retrieved successfully");

  // Continue with other operations...
});
```

## 🧪 Testing Guidelines

### Writing Tests

1. **Test Independence**: Each test should be self-contained
2. **Clean Up**: Always delete created resources
3. **Assertions**: Verify expected status codes and responses
4. **Edge Cases**: Test both happy and sad paths

### Test Structure

```javascript
// Good structure
test("Clear descriptive test name", async ({ request }) => {
  // Setup
  const api = new ApiHelper(request, baseURL, headers);
  
  // Action
  const response = await api.create("/endpoint", payload, 200);
  
  // Assertion
  expect(response.Id).toBeDefined();
  
  // Cleanup
  await api.delete(`/endpoint?id=${response.Id}`, 204);
});
```

### Before Submitting

- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] Code is properly formatted
- [ ] Documentation is updated
- [ ] Allure report generates successfully

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style/formatting
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvement

### Examples

```bash
# Feature
git commit -m "feat(quiz): add validation for quiz creation"

# Bug fix
git commit -m "fix(course): resolve null pointer in payload generation"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Test
git commit -m "test(student): add negative test cases for validation"

# Refactor
git commit -m "refactor(utils): improve API helper error handling"
```

### Commit Best Practices

- Use present tense: "add feature" not "added feature"
- Use imperative mood: "move cursor to..." not "moves cursor to..."
- Keep subject line under 50 characters
- Capitalize subject line
- Don't end subject with period
- Separate subject from body with blank line
- Wrap body at 72 characters
- Use body to explain what and why, not how

## 🔄 Pull Request Process

### Before Creating PR

1. **Update your branch**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout your-branch
   git rebase develop
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Review your changes**
   ```bash
   git diff develop
   ```

### Creating the PR

1. **Fill out the template completely**
2. **Link related issues**
3. **Add screenshots if applicable**
4. **Request reviewers**
5. **Add appropriate labels**

### PR Review Checklist

Your PR should:
- [ ] Have a clear, descriptive title
- [ ] Include all required information in PR template
- [ ] Pass all CI/CD checks
- [ ] Have no merge conflicts
- [ ] Be based on the correct branch (develop for features/bugfixes)
- [ ] Include tests for new functionality
- [ ] Update documentation if needed
- [ ] Follow coding standards

### After PR Approval

1. **Squash commits** if requested
2. **Merge** using appropriate method
3. **Delete branch** after merge
4. **Close related issues**

## 🐛 Reporting Bugs

### Before Reporting

- Check existing issues
- Verify it's reproducible
- Test on latest version

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Run '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 11]
- Node version: [e.g., 18.0.0]
- Playwright version: [e.g., 1.40.0]

**Screenshots**
If applicable

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

### Suggesting Features

1. Check if feature already exists or is planned
2. Create detailed feature request issue
3. Explain use case and benefits
4. Discuss with maintainers before implementing

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/docs/api-testing)
- [Allure Framework](https://docs.qameta.io/allure/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitFlow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

## ❓ Questions?

- Open a discussion in GitHub Discussions
- Contact the maintainers
- Check existing documentation

## 🙏 Thank You!

Your contributions make this project better. We appreciate your time and effort!

---

**Happy Contributing! 🚀**
