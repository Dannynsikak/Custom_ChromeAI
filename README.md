# AI Chatbox App

## Description

The **AI Chatbox App** is a web-based application that provides language translation, text summarization, and language detection functionalities using AI. The app presents these features in a chatbox UI for an interactive user experience.

## Features

- **Language Translation**: Translate text from English to various languages.
- **Text Summarization**: Generate concise summaries of long-form text.
- **Language Detection**: Identify the language of a given input text.
- **Chatbox UI**: Messages are displayed in a conversational format for an interactive experience.

## Tech Stack

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **State Management**: React Hooks
- **Backend/AI Services**: Browser's built-in AI capabilities (Chrome AI features)

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [NPM_usage & installation](https://docs.npmjs.com/cli/v9/commands/npm-install)

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/Dannynsikak/Custom_ChromeAI.git
   cd Custom_ChromeAI
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Project Structure

```
├── components/
│   ├── TranslationComponent.tsx
│   ├── SummarizerComponent.tsx
│   ├── LanguageDetection.tsx
├── pages/
│   ├── index.tsx
├── styles/
│   ├── globals.css
├── public/
├── README.md
├── tsconfig.json
├── package.json
```

## Usage

1. Open the application in your browser.
2. Type a message in the chatbox to interact with AI features:
   - Use `/translate` to translate text.
   - Use `/summarize` to summarize text.
   - Use `/detect` to detect language.
3. AI responses will be displayed within the chat interface.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any issues or feature requests, open an issue on the [Danny's_repo](https://github.com/Dannynsikak/Custom_ChromeAI.git).
