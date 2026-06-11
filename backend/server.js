import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AzureOpenAI } from 'openai';
import sdk from 'microsoft-cognitiveservices-speech-sdk';
import { scrapeTargetPage } from './utils/scraper.js'; // Import our new scraping engine

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Expand payload limits to handle large HTML blocks safely

const aiClient = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', agent: 'SentientRA Operational' });
});

/**
 * Primary Audit Endpoint: Ingests URL, fires headless extraction engine, 
 * and returns verified structural assets.
 */
app.post('/api/audit', async (req, res) => {
const { targetUrl } = req.body || {};

  if (!targetUrl) {
    return res.status(400).json({ 
      error: 'Target URL is required. Please ensure content-type is application/json.' 
    });
  }
  try {
    console.log(`\nReceived audit request for tracking path: ${targetUrl}`);
    
    // Fire Phase 1: Browser automation layer
    console.log(`Launching Headless Chromium context...`);
    const extractionResult = await scrapeTargetPage(targetUrl);
    console.log(`DOM layout extracted successfully. Size: ${extractionResult.html.length} characters.`);

    // Return the response payloads directly back to the pipeline runner
    res.json({
      message: "Phase 1 Extraction Complete",
      targetUrl,
      htmlSnippetLength: extractionResult.html.length,
      screenshotPreview: `data:image/png;base64,${extractionResult.screenshotBase64.substring(0, 50)}... [truncated]`
    });

  } catch (error) {
    console.error('Audit Pipeline Failure:', error.message);
    res.status(500).json({ 
      error: 'An error occurred during extraction reasoning execution.',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`SentientRA backend running structural streams on port ${PORT}`);
});