import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Pi Pwòp API" });
});

// Example: services list (could come from Neon later)
app.get("/api/services", async (_req, res) => {
  try {
    // Example Neon query (optional for now)
    // const { rows } = await pool.query("SELECT * FROM services");
    const rows = [
      { id: 1, name: "Pwodwi netwayaj", slug: "cleaning-products" },
      { id: 2, name: "Kwizin & Vanity PVC", slug: "kitchens-vanities" },
      { id: 3, name: "Gadrob & Closets", slug: "closets" },
      { id: 4, name: "Livrezon & Enstalasyon", slug: "delivery-install" }
    ];
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Pi Pwòp API running on http://localhost:${PORT}`);
});