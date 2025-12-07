# Branching Strategy - GitFlow Model

This project follows the **GitFlow** branching strategy, which is an industry-standard approach for managing releases and features.

## Branch Structure

### Main Branches (Permanent)

#### 1. `main` (Production)
- **Purpose**: Production-ready code
- **Protection**: Requires pull request reviews
- **Deployment**: Automatically runs tests
- **Never commit directly**: Always merge via PR from `develop`

#### 2. `develop` (Integration)
- **Purpose**: Integration branch for features
- **Protection**: Requires PR reviews for merges
- **Deployment**: Runs tests on every push
- **Source**: Feature branches merge here

### Supporting Branches (Temporary)

#### 3. `feature/*` (Feature Development)
- **Naming**: `feature/feature-name` or `feature/TICKET-123-feature-name`
- **Purpose**: Develop new features or enhancements
- **Created from**: `develop`
- **Merged into**: `develop`
- **Examples**:
  - `feature/add-course-crud-tests`
  - `feature/SKO-456-quiz-validation`
  - `feature/email-notifications`

#### 4. `bugfix/*` (Bug Fixes)
- **Naming**: `bugfix/bug-description` or `bugfix/TICKET-123-bug-fix`
- **Purpose**: Fix bugs found in development
- **Created from**: `develop`
- **Merged into**: `develop`
- **Examples**:
  - `bugfix/fix-quiz-payload-generation`
  - `bugfix/SKO-789-api-timeout`

#### 5. `hotfix/*` (Emergency Production Fixes)
- **Naming**: `hotfix/critical-fix` or `hotfix/TICKET-123-fix`
- **Purpose**: Urgent fixes for production issues
- **Created from**: `main`
- **Merged into**: Both `main` AND `develop`
- **Examples**:
  - `hotfix/critical-auth-issue`
  - `hotfix/SKO-999-data-corruption`

#### 6. `release/*` (Release Preparation)
- **Naming**: `release/v1.0.0`
- **Purpose**: Prepare for production release
- **Created from**: `develop`
- **Merged into**: Both `main` AND `develop`
- **Examples**:
  - `release/v1.0.0`
  - `release/v2.1.0`

## Workflow Examples

### Feature Development

\`\`\`bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/add-student-crud-tests

# 2. Work on your feature
git add .
git commit -m "feat: add student CRUD test cases"

# 3. Push to remote
git push origin feature/add-student-crud-tests

# 4. Create Pull Request to develop on GitHub
# 5. After review and approval, merge to develop
# 6. Delete feature branch after merge
\`\`\`

### Bug Fix

\`\`\`bash
# 1. Create bugfix branch from develop
git checkout develop
git pull origin develop
git checkout -b bugfix/fix-payload-validation

# 2. Fix the bug
git add .
git commit -m "fix: correct payload validation in quiz tests"

# 3. Push and create PR to develop
git push origin bugfix/fix-payload-validation
\`\`\`

### Hotfix (Production Emergency)

\`\`\`bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-api-fix

# 2. Fix the issue
git add .
git commit -m "hotfix: resolve critical API endpoint issue"

# 3. Push and create PR to main
git push origin hotfix/critical-api-fix

# 4. After merging to main, also merge to develop
git checkout develop
git merge hotfix/critical-api-fix
git push origin develop
\`\`\`

### Release Process

\`\`\`bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# 2. Update version, changelog, final testing
git add .
git commit -m "chore: prepare release v1.0.0"

# 3. Push and create PR to main
git push origin release/v1.0.0

# 4. After merging to main, tag the release
git checkout main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 5. Merge back to develop
git checkout develop
git merge release/v1.0.0
git push origin develop
\`\`\`

## Commit Message Conventions

Follow **Conventional Commits** format:

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

### Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples:
\`\`\`
feat(quiz): add CRUD operations for quiz module
fix(course): resolve payload generation issue
docs(readme): update installation instructions
test(assignment): add validation test cases
refactor(utils): improve API helper methods
chore(deps): update playwright to v1.40.0
\`\`\`

## Pull Request Guidelines

### Before Creating PR:
1. ✅ Ensure all tests pass locally
2. ✅ Update relevant documentation
3. ✅ Follow coding standards
4. ✅ Rebase on latest develop/main
5. ✅ Write clear PR description

### PR Template:
\`\`\`markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] Added new tests
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code sections
- [ ] Updated documentation
- [ ] No breaking changes (or documented)
\`\`\`

## Branch Protection Rules

### For `main` branch:
- ✅ Require pull request reviews (minimum 1)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Do not allow force pushes
- ✅ Do not allow deletions

### For `develop` branch:
- ✅ Require pull request reviews (minimum 1)
- ✅ Require status checks to pass
- ⚠️ Allow force pushes (with care)

## Best Practices

1. **Keep branches small**: Focus on single feature/fix
2. **Regular commits**: Commit frequently with clear messages
3. **Pull before push**: Always pull latest changes first
4. **Delete merged branches**: Clean up after PR merge
5. **Sync develop regularly**: Keep develop updated with main
6. **Use descriptive names**: Clear branch and commit names
7. **Code reviews**: All PRs require review before merge
8. **CI/CD checks**: Never merge if tests fail

## Quick Reference

| Action | Command |
|--------|---------|
| Create feature | `git checkout -b feature/name develop` |
| Create bugfix | `git checkout -b bugfix/name develop` |
| Create hotfix | `git checkout -b hotfix/name main` |
| Update from develop | `git pull origin develop` |
| Push branch | `git push origin branch-name` |
| Delete local branch | `git branch -d branch-name` |
| Delete remote branch | `git push origin --delete branch-name` |

## Visual Flow

\`\`\`
main ────────────────●──────────●────────────→ (production)
                      ↑          ↑
                   hotfix     release
                      ↓          ↓
develop ─●─────●─────●──────────●────────────→ (integration)
         ↑     ↑
      feature bugfix
\`\`\`
