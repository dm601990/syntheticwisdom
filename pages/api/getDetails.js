import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Initialize Client (using 1.5 Pro for better streaming support) ---
const geminiApiKey = process.env.GEMINI_API_KEY;
let genAI;
let model;
if (geminiApiKey) {
  genAI = new GoogleGenerativeAI(geminiApiKey);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
  console.log("Details API: Gemini AI Client Initialized (using gemini-1.5-pro-latest for streaming).");
} else {
  console.warn("Details API: GEMINI_API_KEY not found.");
}

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (!model) {
    res.writeHead(503, { 'Content-Type': 'application/json' }); // Use writeHead before headers
    res.end(JSON.stringify({ error: 'AI Service not available.' }));
    return;
  }

  const { url, title, summary } = req.query;
  if (!url || !title || !summary) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing required article data.' }));
    return;
  }

  console.log(`Details API: STREAM Request for "${title}"`);

  // --- Set Headers for Server-Sent Events (SSE) ---
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Prevent nginx buffering
  res.flushHeaders(); // Send headers immediately
  // --- End Headers ---

  try {
    // Start with a thinking indicator
    res.write(`data: ${JSON.stringify({ 
      chunk: "Analyzing...",
      phase: "THINKING"
    })}\n\n`);
    
    // Check if res.flush exists before calling it
    if (typeof res.flush === 'function') {
      res.flush();
    }
    
    // Add thinking dots with small delays
    for (let i = 0; i < 3; i++) {
      await delay(150);
      res.write(`data: ${JSON.stringify({ 
        chunk: ".",
        phase: "THINKING"
      })}\n\n`);
      
      // Check if res.flush exists before calling it
      if (typeof res.flush === 'function') {
        res.flush();
      }
    }
    
    // Generate the actual content with streaming - using generateContentStream
    console.log(`Starting Gemini streaming for "${title}"...`);
    
    const prompt = `
      Act as a sharp, insightful commentator for "Synthetic Wisdom".
      Based ONLY on the following title and snippet, write a well-structured and detailed summary (approx 4-5 paragraphs, aiming for 250-300 words) in an engaging tone. Inject personality only if appropriate. Ground all statements firmly in the provided text.

      Input Text:
      Title: "${title}"
      Snippet: "${summary}"

      Detailed Summary:
      `;

    // Clear the thinking indicator before starting real content
    res.write(`data: ${JSON.stringify({ 
      action: "CLEAR_ALL_CONTENT",
      phase: "CONTENT_START"
    })}\n\n`);
    
    // Check if res.flush exists before calling it
    if (typeof res.flush === 'function') {
      res.flush();
    }
    
    // Small delay to ensure frontend has processed the clear command
    await delay(100);
    
    // Use the streaming API to get content in real-time
    const streamResult = await model.generateContentStream(prompt);
    
    console.log(`Gemini stream started for "${title}", sending chunks as they arrive...`);
    
    let fullText = "";
    
    // Process chunks as they arrive from the stream
    for await (const chunk of streamResult.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullText += chunkText;
        
        // Send each chunk as it arrives with minimal processing
        res.write(`data: ${JSON.stringify({ 
          chunk: chunkText,
          phase: "REAL_CONTENT"
        })}\n\n`);
        
        // Check if res.flush exists before calling it
        if (typeof res.flush === 'function') {
          res.flush();
        }
      }
    }
    
    console.log(`Streaming finished for "${title}", total length: ${fullText.length} chars`);

    // Send completion signal
    res.write(`data: ${JSON.stringify({ 
      phase: "CONTENT_COMPLETE",
      done: true
    })}\n\n`);
    
    // Check if res.flush exists before calling it
    if (typeof res.flush === 'function') {
      res.flush();
    }

  } catch (error) {
    console.error(`API Route /getDetails STREAM Error for "${title}":`, error);
    try {
      res.write(`data: ${JSON.stringify({ 
        error: 'Failed to generate summary stream.', 
        details: error.message
      })}\n\n`);
      
      // Check if res.flush exists before calling it
      if (typeof res.flush === 'function') {
        res.flush();
      }
    } catch (writeError) { /* Ignore */ }
  } finally {
    // --- End the response stream ---
    res.end();
    console.log(`Details API: Stream ended for "${title}"`);
  }
} 