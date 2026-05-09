import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/scan", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      const startTime = Date.now();
      const response = await axios.get(url, { 
        timeout: 10000,
        validateStatus: () => true 
      });
      const headers = response.headers;
      const duration = Date.now() - startTime;

      // Scanning Logic
      const securityHeaders = [
        "strict-transport-security",
        "content-security-policy",
        "x-frame-options",
        "x-content-type-options",
        "referrer-policy",
        "permissions-policy"
      ];

      const foundHeaders: Record<string, string | string[]> = {};
      const missingHeaders: string[] = [];

      securityHeaders.forEach(header => {
        if (headers[header]) {
          foundHeaders[header] = headers[header];
        } else {
          missingHeaders.push(header);
        }
      });

      // Simple risk score calculation
      let riskScore = 100;
      const vulnerabilities = [];

      if (missingHeaders.includes("content-security-policy")) {
        riskScore -= 20;
        vulnerabilities.push({
          id: "MISSING_CSP",
          severity: "high",
          title: "Missing Content Security Policy",
          description: "CSP helps prevent XSS and data injection attacks."
        });
      }

      if (missingHeaders.includes("x-frame-options")) {
        riskScore -= 15;
        vulnerabilities.push({
          id: "MISSING_XFO",
          severity: "medium",
          title: "Missing X-Frame-Options",
          description: "May allow clickjacking attacks."
        });
      }

      if (headers["server"]) {
        vulnerabilities.push({
          id: "SERVER_BANNER",
          severity: "low",
          title: "Server Information Leakage",
          description: `Server header found: ${headers["server"]}`
        });
      }

      // Check for SSL
      const isHttps = url.startsWith("https://");
      if (!isHttps) {
        riskScore -= 30;
        vulnerabilities.push({
          id: "INSECURE_HTTP",
          severity: "critical",
          title: "Insecure Protocol (HTTP)",
          description: "Data transmitted over HTTP is not encrypted."
        });
      }

      res.json({
        url,
        timestamp: new Date().toISOString(),
        duration,
        status: response.status,
        riskScore: Math.max(0, riskScore),
        vulnerabilities,
        headers: foundHeaders,
        missingHeaders
      });

    } catch (error: any) {
      console.error("Scan error:", error.message);
      res.status(500).json({ error: "Failed to scan website. Make sure the URL is accessible." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
