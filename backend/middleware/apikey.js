// middleware/apiKey.js

// This middleware checks every incoming request for a valid API key
export default function apiKeyMiddleware(req, res, next) {
  // Read the key from the request headers
  const apiKey = req.headers['x-api-key'];

  // Compare it to the key stored in your environment variables
  if (!apiKey || apiKey !== process.env.API_KEY) {
    // If the key is missing or invalid, block the request
    return res.status(401).json({ message: "Unauthorized" });
  }

  // If the key is correct, allow the request to continue
  next();
}
