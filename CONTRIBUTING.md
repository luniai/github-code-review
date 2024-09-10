# Contributing

Thank you for considering contributing to the project. To make the process as easy and as effective as possible, please follow the guidelines below.

## Tools

Getting yourself familiar with the tools below will substantially ease your contribution experience.

- [TypeScript](https://www.typescriptlang.org/)
- [OpenAI GPT](https://beta.openai.com/docs/)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Vite](https://vitejs.dev/)

## Dependencies

The project uses the following dependencies:

| Library name                  | Purpose                                                                  |
| ----------------------------- | ------------------------------------------------------------------------ |
| [dexie](https://dexie.org/)   | Wrapper library for IndexedDB. It makes it easier to work with IndexedDB |
| [react](https://reactjs.org/) | JavaScript library for state management and virtual dom                  |

## Getting started

### Fork the repository

Please use the GitHub UI to fork this repository (_read more about [Forking a repository](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)_).

### Install

```bash
cd ai-pr-reviewer
npm install
```

Please use the node version specified in the `.nvmrc` file.

## Git workflow

```bash
# Checkout the default branch and ensure it's up-to-date
$ git checkout main
$ git pull --rebase

# Create a feature branch
$ git checkout -b feature/my-feature

# Commit the changes
$ git add .
$ git commit
# Follow the interactive prompt to compose a commit message

# Push
$ git push -u origin feature/my-feature
```

Try to use the [Conventional Commits](https://conventionalcommits.org/) naming convention. It helps us ensure clean and standardized commit tree. Please take a moment to read about the said convention before you name your commits.

> **Tip:** running `git commit` will open an interactive prompt in your terminal. Follow the prompt to compose a valid commit message.

Once you have pushed the changes to your remote feature branch, [create a pull request](https://github.com/open-draft/ai-pr-reviewer/compare) on GitHub. Undergo the process of code review, where the maintainers of the library will help you get the changes from good to great, and enjoy your implementation merged to the default branch.

> Please be respectful when requesting and going through the code review. Everyone on the team is interested in merging quality and well tested code, and we're hopeful that you have the same goal. It may take some time and iterations to get it right, and we will assist you throughout the process.

## Build

Build the library with the following command:

```bash
npm run build
```

## How to test the chrome extension

1. Open the Extension Management page by navigating to `chrome://extensions`.
   - The Extension Management page can also be opened by clicking on the Chrome menu, hovering over `More Tools` then selecting `Extensions`.
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the `Load unpacked` button and select the `dist` folder of this project.
4. The extension will be loaded and you will see the icon in the toolbar where you can click to open the extension.
   4.1 Also, when you open a pull request in Github, you will see a new button to generate the review comments.
