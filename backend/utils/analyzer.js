/**
 * Cognitive Core Service: Evaluates DOM layout structural text strings 
 * using Azure OpenAI reasoning models.
 * @param {object} aiClient - The initialized AzureOpenAI client instance
 * @param {string} htmlContent - Raw or truncated HTML source string
 * @returns {Promise<Array>} Structured collection of accessibility remediations
 */
export async function analyzeAccessibility(aiClient, htmlContent) {
  // Truncate text context safely if it exceeds basic model window thresholds for hackathon speed
  const sampleDomContext = htmlContent.substring(0, 15000);

  const systemPrompt = `
    You are the specialized AI engine powering SentientRA, an empathy-driven accessibility reasoning agent.
    Your objective is to audit raw HTML code blocks for accessibility violations under WCAG 2.2 AA standards.
    
    Instead of acting like a dry automated checklist scanner, analyze the elements through a lens of human empathy. 
    Focus on how users with visual, motor, or cognitive impairments experience this layout friction.
    
    CRITICAL: You must return your analysis strictly as a valid JSON array. Do not include markdown code wrappers (like \`\`\`json) or conversational text outside the array.
    
    Each object inside the JSON array must follow this exact structure:
    {
      "element": "The raw HTML source string containing the bug",
      "impact": "Critical" | "Moderate" | "Low",
      "explanation": "An empathetic, clear explanation of how this specific bug hurts a human user's experience.",
      "remediation": "The complete, corrected HTML code block that safely fixes the problem",
      "screenReaderSimulation": "A literal text transcript simulating exactly what a screen reader or assistive voice would vocalize when striking this broken layout element (e.g., 'Button, unlabeled button, clickable item')."
    }
  `;

  try {
    const response = await aiClient.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this HTML payload for accessibility faults:\n\n${sampleDomContext}` }
      ],
      temperature: 0.2, // Low temperature ensures consistent structural JSON output
    });

    const cleanRawResponse = response.choices[0].message.content.trim();
    
    // Parse response into standard executable arrays
    return JSON.parse(cleanRawResponse);
    
  } catch (error) {
    console.error('[Cognitive Engine Failure] Failed to parse AI insights:', error);
    throw new Error(`Azure OpenAI reasoning pipeline failed: ${error.message}`);
  }
}