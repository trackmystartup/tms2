// Lightweight local API server
import express from "express";
import fetch from "node-fetch";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { createClient } from '@supabase/supabase-js';

// Load environment variables from default .env (for local testing)
dotenv.config();
const loadedEnvPath = ".env";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);
console.log("[Startup] Loaded env from:", loadedEnvPath);

// --------------------
// Health Check Routes
// --------------------
app.get("/", (req, res) => res.status(200).send("OK"));
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// --------------------
// Supabase Diagnostics
// --------------------
app.get('/api/diagnostics/supabase', async (req, res) => {
  try {
    const startedAt = new Date().toISOString();

    return res.json({
      ok: true,
      startedAt,
      supabaseUrlPresent: Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      serviceRolePresent: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY)
    });
  } catch (e) {
    console.error('Supabase diagnostics error:', e);
    return res.status(500).json({ ok: false, error: 'Diagnostics failed' });
  }
});

// (Invite email route removed - handled by Vercel /api/send-invite)

// Payment gateway routes removed - all payment functionality has been removed from the platform

// --------------------
// Start Server
// --------------------
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Local API running on http://localhost:${port}`));
