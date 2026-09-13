# Contributing to HyprWall

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Style Guides](#style-guides)
- [Commit Messages](#commit-messages)

## Code of Conduct

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## I Have a Question

Before you ask a question, it is best to search for existing [Issues](https://github.com/yourusername/hyprwall/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue.

If you then still feel the need to ask a question and need clarification:

- Open an [Issue](https://github.com/yourusername/hyprwall/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

## I Want To Contribute

> ### Legal Notice
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions.
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/yourusername/hyprwall/issues?q=label%3Abug).
- Collect information about the bug:
  - Stack trace (Traceback)
  - OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
  - Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
  - Possibly your input and the output
  - Can you reliably reproduce the issue?

#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to <your-email@example.com>.

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/yourusername/hyprwall/issues/new). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to recreate the issue on their own.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for HyprWall, **including completely new features and minor improvements to existing functionality**.

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Perform a [search](https://github.com/yourusername/hyprwall/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature.

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/yourusername/hyprwall/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- **Explain why this enhancement would be useful** to most HyprWall users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

### Your First Code Contribution

#### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/hyprwall.git
cd hyprwall

# Install Node.js dependencies
npm install

# Install Python dependencies (if any)
pip install -r requirements.txt

# Build the UI
npm run build

# Run the daemon in development mode
make dev
```

#### Development Workflow

1. Create a branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Submit a pull request

## Style Guides

### Code Style

- **Python**: Follow PEP 8, use type hints where possible
- **TypeScript/React**: Follow the existing code style, use functional components
- **Bash**: Use `set -euo pipefail`, quote variables
- **Indentation**: 2 spaces for JS/TS/CSS, 4 spaces for Python

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Examples:
```
feat(backend): add smart GPU detection
fix(ui): resolve monitor layout rendering issue
docs(readme): update installation instructions
perf(daemon): optimize wallpaper caching
```

### Pull Request Process

1. Update the README.md with details of changes if applicable.
2. Update the CHANGELOG.md with notes on your changes.
3. The PR may be merged after review and approval from at least one maintainer.

## Community

- Join the discussion in [GitHub Discussions](https://github.com/yourusername/hyprwall/discussions)
- Follow [@yourusername](https://twitter.com/yourusername) on Twitter for updates

---

Thanks for contributing to HyprWall! 🎉
