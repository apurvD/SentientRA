import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AzureOpenAI } from 'openai';
import { scrapeTargetPage } from './utils/scraper.js';
import { analyzeAccessibility } from './utils/analyzer.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const aiClient = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', agent: 'SentientRA Operational' });
});

app.post('/api/audit', async (req, res) => {
  const { targetUrl } = req.body || {};

  if (!targetUrl) {
    return res.status(400).json({ error: 'Target URL is required.' });
  }

  try {
    console.log(`\nIngesting live audit pathway target: ${targetUrl}`);
    
    // Phase 1: Fire extraction browser
    console.log(`Scraping structural layout...`);
    const { html, screenshotBase64 } = await scrapeTargetPage(targetUrl);
    
    // Phase 2: Send structured payloads directly to Azure OpenAI reasoning engine
    console.log(` Launching Azure OpenAI Cognitive Reasoning Engine...`);
    const designInsights = await analyzeAccessibility(aiClient, html);
    console.log(`Cognitive evaluation complete. Identified ${designInsights.length} remediation fields.`);

    // Return everything to the consumer
    res.json({
      message: "Audit Execution Successful",
      targetUrl,
      screenshot: `data:image/png;base64,${screenshotBase64}`,
      violations: designInsights // This holds our complete empathetic breakdown array!
    });

  } catch (error) {
    console.error('Audit Pipeline Failure:', error.message);
    res.status(500).json({ 
      error: 'An internal exception disrupted agent auditing.',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`SentientRA backend running structural streams on port ${PORT}`);
});