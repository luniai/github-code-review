# GitHub Code Review

This is a simple Chrome extension that uses the [OpenAI GPT](https://beta.openai.com/docs/) API to generate review comments on a Github pull request page.

## There's a ton of Chrome extensions that do this, why create another one?

Most of the Chrome extensions that use the OpenAI API to generate review comments are paid or have a limit on the number of requests you can make. This extension is open-source and free to use. You can host your own instance of the extension and use it without any limitations. Also you can customize the prompts and responses as per your needs.

## Why create this? reviews should not be meant to be automated

With the current power of AI, teams are able to push code more frequently and faster. This is a good thing, but it also means that the code review process can be a bottleneck. This is where AI can help, by providing a supportive layer of review comments that can either help developers to improve their code before a human review or help developers to get a second opinion when submitting their reviews.

This is not, by any means, meant to replace human reviews, it's about leveraging the power of AI to help developers to boost the process of reviewing a code.

## Tech Stack

### React + Typescript

React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.

Source: [docs](https://reactjs.org/)

Typescript is a superset of JavaScript that adds optional types to the language. It is maintained by Microsoft.

Source: [docs](https://www.typescriptlang.org/)

### OpenAI GPT

GPT is a state-of-the-art language model developed by OpenAI. It is the third iteration of the Generative Pre-trained Transformer (GPT) series of models.

Source: [docs](https://beta.openai.com/docs/)

### IndexDB

IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs. This API uses indexes to enable high-performance searches of this data. While Web Storage is useful for storing smaller amounts of data, it is less useful for storing larger amounts of structured data.

Source: [docs](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

As we want to store all the prompts and apis responses in the browser, we are using IndexDB rather than local storage or session storage

#### Dexie

Dexie.js is a wrapper library for IndexedDB. It makes it easier to work with IndexedDB by providing a simple API to interact with the database.

Source: [docs](https://dexie.org/)

### Vite

Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.

Source: [docs](https://vitejs.dev/)

## Contributing

Thank you for considering contributing to the project. Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information before you start contributing.
