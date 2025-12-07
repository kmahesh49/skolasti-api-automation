# GitHub-ready: ReqRes API Framework

Commit the files created in this folder to a GitHub repository.

After push:
- GitHub Actions will run the CI workflow on push/PR to main
- Tests use Playwright test runner and produce Allure-compatible results

Notes:
- Ensure `allure` command-line is installed locally if you want to open reports locally.
- CI uploads `allure-results` as an artifact; you can download and view them locally.
