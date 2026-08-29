# Contributing to OpenOcean

Thank you for your interest in contributing to OpenOcean! We welcome contributions from the community and appreciate your efforts to help improve this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

Be respectful and inclusive. We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our values of respect and professionalism.

## How to Contribute

There are many ways to contribute to OpenOcean:

- **Bug Reports**: Report issues you find
- **Feature Requests**: Suggest new features or improvements
- **Code**: Submit pull requests with bug fixes or new features
- **Documentation**: Improve or clarify documentation
- **Testing**: Test releases and report findings
- **Design**: Contribute UI/UX improvements

## Development Setup

### 1. Fork the Repository
Click the "Fork" button on the repository page to create your own copy.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR-USERNAME/openOcean.git
cd openOcean
```

### 3. Add Upstream Remote
```bash
git remote add upstream https://github.com/PiyushKhurana17/openOcean.git
```

### 4. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Make Your Changes
Edit the files as needed to implement your feature or fix.

### 7. Test Your Changes
```bash
# Start local DFX
dfx start --clean

# In another terminal
npm start

# Run tests
npm test
```

## Coding Standards

### Motoko (Backend)
- Follow [Motoko naming conventions](https://internetcomputer.org/docs/current/developer-docs/build/languages/motoko)
- Use descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Handle errors appropriately with Result types

### JavaScript/React (Frontend)
- Use ES6+ syntax and features
- Follow React best practices
- Use meaningful component names
- Add PropTypes or TypeScript types
- Keep components focused on a single responsibility
- Use functional components and hooks
- Format code consistently (we use standard formatting)

### General Guidelines
- Write clean, readable code
- Avoid commented-out code blocks
- Use meaningful variable names
- Keep functions small and testable
- Add comments for non-obvious logic
- No console errors or warnings

## Commit Messages

Follow these guidelines for commit messages:

- Use the imperative mood ("add feature" not "added feature")
- Limit the first line to 50 characters
- Reference issues and pull requests liberally after the first line
- Use a blank line between the summary and body

### Examples
```
Add NFT gallery filtering feature

Implements advanced filtering by price range and owner.
Fixes #123
```

```
Fix marketplace listing display bug

The price was not updating correctly after purchase.
Resolves #456
```

## Pull Request Process

1. **Update your branch**: Ensure your branch is up-to-date with main
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes**: Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**: Go to the repository and click "New Pull Request"

4. **Fill in the PR description**:
   - Describe what changes you made and why
   - Reference any related issues with `#issue_number`
   - Include screenshots for UI changes
   - List any breaking changes

5. **PR Title Format**:
   - Feature: `[FEATURE] Add NFT gallery filtering`
   - Bug Fix: `[FIX] Resolve marketplace listing display issue`
   - Docs: `[DOCS] Update installation instructions`

6. **Wait for Review**: A maintainer will review your PR
   - Address any feedback or requested changes
   - Be patient and professional in discussions

7. **Merge**: Once approved, your PR will be merged

## Reporting Issues

### Bug Reports
When reporting a bug, include:

- **Title**: Clear, concise summary
- **Description**: What happened and what you expected
- **Steps to Reproduce**: Exact steps to reproduce the issue
- **Environment**: Node version, OS, browser (if applicable)
- **Screenshots**: Images/videos if applicable
- **Code Samples**: Minimal code example if relevant

### Feature Requests
When suggesting a feature:

- **Title**: Clear description of the feature
- **Motivation**: Why is this feature needed?
- **Example Use Case**: How would it be used?
- **Possible Implementation**: If you have ideas

## Questions?

- Check existing [issues](https://github.com/PiyushKhurana17/openOcean/issues)
- Search [discussions](https://github.com/PiyushKhurana17/openOcean/discussions)
- Create a new discussion if needed

## Review Criteria

PRs will be reviewed based on:

- ✅ Code quality and style consistency
- ✅ Testing completeness
- ✅ Documentation updates
- ✅ No breaking changes (unless discussed)
- ✅ Clear commit history
- ✅ Proper attribution for external sources

## License

By contributing to OpenOcean, you agree that your contributions will be licensed under its Apache License 2.0.

---

**Thank you for contributing to OpenOcean!** 🌊

We appreciate your time and effort in making this project better for everyone.
