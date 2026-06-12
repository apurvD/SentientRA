# SentientRA: Multi-Modal AI Reasoning for Inclusive Web Engineering

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Azure](https://img.shields.io/badge/microsoft%20azure-0089D6?style=for-the-badge&logo=microsoft-azure&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> A multi-modal Reasoning Agent that bridges the gap between web compliance and human empathy. It audits web code, simulates the acoustic and visual friction experienced by users with disabilities, and delivers plain-English, context-aware code remediation.

## The Problem: Compliance Without Context
Automated accessibility checkers are broken. They treat accessibility as a rigid, text-based checklist, leaving developers buried under cryptic warning codes like *"Violation: WCAG 2.1 AA 1.1.1."* 

Developers cannot fix what they do not understand, and they cannot understand an experience they have never witnessed.

## The Solution
**SentientRA** acts as a cognitive bridge between raw source code and human sensation. By combining headless browser scraping with Azure's multi-modal AI capabilities, it transforms accessibility debugging into an educational experience.

* **Acoustic Empathy Sandbox:** Uses **Azure AI Speech** to generate real-time audio streams, forcing developers to *hear* what a screen reader user experiences when encountering a broken element.
* **Vision Deficit Simulator:** Applies mathematically accurate SVG color matrices to scraped viewport screenshots to simulate Deuteranomaly (red-green color blindness).
* **Cognitive Remediation:** Uses **Azure OpenAI** to semantically reason through the DOM, explain the human impact of a bug in plain English, and provide a 1-click copy-paste HTML fix.

## System Architecture

1. **Ingest & Scrape:** A Node.js/Puppeteer backend receives a URL, extracts the DOM layout, and captures a structural screenshot.
2. **Cognitive Core:** The payload is evaluated by `gpt-4o-mini` via Azure OpenAI, which outputs a structured JSON array containing empathetic explanations and code fixes.
3. **Acoustic Synthesis:** The screen reader text simulations are piped into the Azure AI Speech SDK, which generates and streams raw MP3 buffers to the client.
4. **Presentation:** A split-screen React/Vite dashboard renders the workspace and sensory sandboxes.

## How to Run Locally

### Prerequisites
* Node.js (v20+)
* An active Azure Subscription (Azure OpenAI & Azure AI Speech resources required)

### 1. Clone & Install Dependencies
```bash
git clone [https://github.com/apurvD/SentientRA.git]
(https://github.com/apurvD/SentientRA.git)
cd SentientRA

# Install Backend
cd backend
npm install

# Install Frontend
cd ../frontend
npm install
```

2. Configure Environment Variables
Create a .env file inside the /backend directory and add your Azure credentials:
```bash
PORT=5000

# Azure OpenAI Setup
AZURE_OPENAI_ENDPOINT=https://YOUR_RESOURCE_[NAME.openai.azure.com/](https://NAME.openai.azure.com/)
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
AZURE_OPENAI_API_VERSION=2024-10-21
AZURE_OPENAI_API_KEY=your_openai_key

# Azure AI Speech Setup
AZURE_SPEECH_KEY=your_speech_key
AZURE_SPEECH_REGION=eastus
``` 

3. Start the Application
You will need two terminal windows.
Terminal 1 (Backend Engine):
```bash
cd backend
node server.js
```
Terminal 2 (Frontend UI):
```bash
cd frontend
npm run dev
```
Open http://localhost:5173 in your browser to start auditing!

### SentientRA doesn't just scan tags; it cognitively evaluates the user experience to foster empathy-driven engineering.