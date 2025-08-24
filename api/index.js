// api/index.js
import app from './app.js';
import connectDB from './database/server.js';

// Vercel serverless handler
export default async function handler(req, res) {
  try {
    await connectDB();   // ensure DB connected per-invocation (cached)
    return app(req, res); // Express is a request handler (req, res)
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
