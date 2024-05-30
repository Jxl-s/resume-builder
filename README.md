# AI Resume Builder

A resume builder website made using Next.JS, React, and Tailwind CSS, making use of AI to enhance and generate bullet points.

This project is composed of two parts:

-   A web application using Next.JS
-   A small Flask server to handle LLM requests

## Demo

A limited demo is available on Vercel. Features requiring the LLM and the headless browser are disabled. For downloading resumes, you can print the page as PDF, and it'll work just fine.

https://resume-builder-green-five.vercel.app

Locally hosting the project is recommended for the full experience.

## Installation

Here are the steps to run the project locally.

### Requirements

-   Node.JS
-   Python
-   Yarn (npm i -g yarn)

### Instructions

Clone the repository

```bash
git clone https://github.com/Jxl-s/resume-builder
```

Create a file `.env.local`, contaning the following environment variables

```bash
# Choose Meta, or Ollama for the LLM
LLM=meta

# Host for Ollama (can be left as is if not used)
OLLAMA_HOST="http://127.0.0.1:11434"
OLLAMA_MODEL="llama3"

# Python application
META_HOST=http://0.0.0.0:5001

# chrome or firefox
PUPPETEER_PRODUCT=chrome

# Set to true if running locally
NEXT_PUBLIC_IS_LOCAL=true
```

Install dependencies

```bash
yarn install
pip install -r requirements.txt
npx puppeteer browsers install chrome # or firefox
```

Start the Flask server

```bash
python meta.py
```

Start the Next.JS application in a separate terminal

```bash
yarn dev
```
