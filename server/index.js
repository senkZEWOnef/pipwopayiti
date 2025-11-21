import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import session from "express-session";
import { pool } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "pipwop-admin-secret-key-2024";

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5176", "http://localhost:5177", "http://localhost:5175"],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Simple health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Pi Pwòp API" });
});

// Middleware for authentication
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ===== ADMIN AUTH ROUTES =====

// Admin login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if admin exists
    const result = await pool.query("SELECT * FROM admin_users WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== CONTACT MESSAGES ROUTES =====

// Submit contact form
app.post("/api/contact/submit", async (req, res) => {
  try {
    const { name, phone, email, serviceType, message } = req.body;
    
    await pool.query(
      "INSERT INTO contact_messages (name, phone, email, service_type, message) VALUES ($1, $2, $3, $4, $5)",
      [name, phone, email || null, serviceType, message]
    );
    
    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all messages (admin only)
app.get("/api/admin/messages", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Mark message as read (admin only)
app.put("/api/admin/messages/:id/read", authenticateAdmin, async (req, res) => {
  try {
    await pool.query(
      "UPDATE contact_messages SET read_status = true WHERE id = $1",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== CLEANER APPLICATIONS ROUTES =====

// Submit cleaner application
app.post("/api/cleaners/apply", async (req, res) => {
  try {
    const { 
      fullName, phone, email, address, position, experienceYears, 
      previousWork, availability, transportation, ownTools, references, 
      motivation, startDate 
    } = req.body;
    
    await pool.query(
      `INSERT INTO applications 
       (full_name, phone, email, address, position, experience_years, previous_work, availability, transportation, own_tools, "references", motivation, start_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [fullName, phone, email || null, address, position, experienceYears, previousWork, availability, transportation, ownTools, references, motivation, startDate || null]
    );
    
    res.json({ success: true, message: "Application submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all cleaner applications (admin only)
app.get("/api/admin/cleaners", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM applications ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update cleaner application status (admin only)
app.put("/api/admin/cleaners/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query(
      "UPDATE applications SET status = $1 WHERE id = $2",
      [status, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== JOBS ROUTES =====

// Create job/booking
app.post("/api/jobs/create", async (req, res) => {
  try {
    const { 
      clientName, clientPhone, clientEmail, clientAddress, 
      serviceType, jobDescription, preferredDate, preferredTime, estimatedPrice 
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO jobs 
       (client_name, client_phone, client_email, client_address, service_type, job_description, preferred_date, preferred_time, estimated_price) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [clientName, clientPhone, clientEmail || null, clientAddress, serviceType, jobDescription, preferredDate, preferredTime, estimatedPrice]
    );
    
    res.json({ success: true, jobId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all jobs (admin only)
app.get("/api/admin/jobs", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT j.*, ca.full_name as cleaner_name 
       FROM service_bookings j 
       LEFT JOIN cleaner_applications ca ON j.assigned_cleaner_id = ca.id 
       ORDER BY j.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Assign cleaner to job (admin only)
app.put("/api/admin/jobs/:id/assign", authenticateAdmin, async (req, res) => {
  try {
    const { cleanerId } = req.body;
    await pool.query(
      "UPDATE jobs SET assigned_cleaner_id = $1, status = 'assigned' WHERE id = $2",
      [cleanerId, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update job status (admin only)
app.put("/api/admin/jobs/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { status, actualPrice } = req.body;
    let query = "UPDATE jobs SET status = $1";
    let params = [status, req.params.id];
    
    if (status === 'completed' && actualPrice) {
      query += ", actual_price = $3, completed_at = CURRENT_TIMESTAMP WHERE id = $2";
      params = [status, req.params.id, actualPrice];
    } else {
      query += " WHERE id = $2";
    }
    
    await pool.query(query, params);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== JOB REVIEWS ROUTES (ADMIN INTERNAL) =====

// Add job review (admin only)
app.post("/api/admin/jobs/:id/review", authenticateAdmin, async (req, res) => {
  try {
    const { 
      cleanerId, clientSatisfaction, workQuality, punctuality, 
      professionalism, adminNotes, wouldRecommend 
    } = req.body;
    
    await pool.query(
      `INSERT INTO job_reviews 
       (job_id, cleaner_id, client_satisfaction, work_quality, punctuality, professionalism, admin_notes, would_recommend) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [req.params.id, cleanerId, clientSatisfaction, workQuality, punctuality, professionalism, adminNotes, wouldRecommend]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get cleaner performance reviews (admin only)
app.get("/api/admin/cleaners/:id/reviews", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT jr.*, j.client_name, j.service_type, j.completed_at 
       FROM job_reviews jr 
       JOIN jobs j ON jr.job_id = j.id 
       WHERE jr.cleaner_id = $1 
       ORDER BY jr.created_at DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== ANALYTICS ROUTES =====

// Record page visit
app.post("/api/analytics/visit", async (req, res) => {
  try {
    const { pagePath } = req.body;
    
    // Check if entry exists for today
    const today = new Date().toISOString().split('T')[0];
    const existing = await pool.query(
      "SELECT id, visitor_count FROM analytics_data WHERE page_path = $1 AND date_recorded = $2",
      [pagePath, today]
    );
    
    if (existing.rows.length > 0) {
      // Update existing entry
      await pool.query(
        "UPDATE analytics_data SET visitor_count = visitor_count + 1 WHERE id = $1",
        [existing.rows[0].id]
      );
    } else {
      // Create new entry
      await pool.query(
        "INSERT INTO analytics_data (page_path, visitor_count, date_recorded) VALUES ($1, 1, $2)",
        [pagePath, today]
      );
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get analytics data (admin only)
app.get("/api/admin/analytics", authenticateAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const result = await pool.query(
      `SELECT * FROM analytics_data 
       WHERE date_recorded >= CURRENT_DATE - INTERVAL '${days} days' 
       ORDER BY date_recorded DESC, page_path`
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create tables (admin only)
app.post("/api/admin/create-tables", authenticateAdmin, async (req, res) => {
  try {
    // Contact messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        service_type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        read_status BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Cleaner applications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        address TEXT NOT NULL,
        position VARCHAR(50) NOT NULL,
        experience_years VARCHAR(20) NOT NULL,
        previous_work TEXT,
        availability TEXT,
        transportation BOOLEAN DEFAULT FALSE,
        own_tools BOOLEAN DEFAULT FALSE,
        "references" TEXT,
        motivation TEXT,
        start_date DATE,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Jobs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(100) NOT NULL,
        client_phone VARCHAR(20) NOT NULL,
        client_email VARCHAR(100),
        client_address TEXT NOT NULL,
        service_type VARCHAR(50) NOT NULL,
        job_description TEXT,
        preferred_date DATE,
        preferred_time VARCHAR(20),
        assigned_cleaner_id INTEGER,
        status VARCHAR(20) DEFAULT 'pending',
        estimated_price DECIMAL(10,2),
        actual_price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);
    
    // Job reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_reviews (
        id SERIAL PRIMARY KEY,
        job_id INTEGER,
        cleaner_id INTEGER,
        client_satisfaction INTEGER CHECK (client_satisfaction >= 1 AND client_satisfaction <= 5),
        work_quality INTEGER CHECK (work_quality >= 1 AND work_quality <= 5),
        punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
        professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
        admin_notes TEXT,
        would_recommend BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert sample data if tables are empty
    const messageCount = await pool.query("SELECT COUNT(*) FROM contact_messages");
    if (parseInt(messageCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO contact_messages (name, phone, email, service_type, message) VALUES
        ('Jean Baptiste', '+509 1234 5678', 'jean@example.com', 'cleaning', 'M bezwen netwayaj kay la pou samdi a'),
        ('Marie Dupont', '+509 9876 5432', 'marie@example.com', 'kitchen', 'M vle yon kwizin PVC nouvo'),
        ('Pierre Joseph', '+509 5555 1234', NULL, 'delivery', 'Ki jan nou ka jwenn livrezon nan?')
      `);
    }
    
    const cleanerCount = await pool.query("SELECT COUNT(*) FROM applications");
    if (parseInt(cleanerCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO applications (full_name, phone, email, address, position, experience_years, previous_work, availability, transportation, own_tools, motivation) VALUES
        ('Sophia Laurent', '+509 1111 2222', 'sophia@example.com', 'Delmas 32, Port-au-Prince', 'cleaner', '2-3', 'Te travay nan yon konpani netwayaj pou 3 an', 'Lendi-Vandredi, 8am-5pm', true, false, 'M vle travay ak yon konpani serye'),
        ('Marcus Jean', '+509 3333 4444', 'marcus@example.com', 'Carrefour, Port-au-Prince', 'kitchen_installer', '4-5', 'Novice men renmen fè travay pwòp ak enstale kabinè', 'Disponib nenpòt lè', false, true, 'M gen eksperyans ak kabinè PVC'),
        ('Jennifer Pierre', '+509 5555 7777', 'jen@example.com', 'Pétion-Ville, Port-au-Prince', 'delivery_driver', '6-10', 'Chofè depi 8 an, konnen tout kote nan vil la', 'Disponib 24/7', true, false, 'M renmen sèvis kliyan ak livrezon rapid')
      `);
    }
    
    res.json({ success: true, message: "Tables created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== JOB POSITIONS MANAGEMENT ROUTES =====

// Get all job positions (admin only)
app.get("/api/admin/job-positions", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM job_positions ORDER BY title_ht"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create job position (admin only)
app.post("/api/admin/job-positions", authenticateAdmin, async (req, res) => {
  try {
    const { position_id, title_ht, title_fr, description_ht, description_fr, requirements_ht, requirements_fr } = req.body;
    
    await pool.query(
      `INSERT INTO job_positions (position_id, title_ht, title_fr, description_ht, description_fr, requirements_ht, requirements_fr)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [position_id, title_ht, title_fr, description_ht, description_fr, requirements_ht, requirements_fr]
    );
    
    res.json({ success: true, message: "Job position created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update job position (admin only)
app.put("/api/admin/job-positions/:id", authenticateAdmin, async (req, res) => {
  try {
    const { title_ht, title_fr, description_ht, description_fr, requirements_ht, requirements_fr, is_active } = req.body;
    
    await pool.query(
      `UPDATE job_positions SET 
       title_ht = $1, title_fr = $2, description_ht = $3, description_fr = $4, 
       requirements_ht = $5, requirements_fr = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $8`,
      [title_ht, title_fr, description_ht, description_fr, requirements_ht, requirements_fr, is_active, req.params.id]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== PRODUCTS MANAGEMENT ROUTES =====

// Get all products (admin only)
app.get("/api/admin/products", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create product (admin only)
app.post("/api/admin/products", authenticateAdmin, async (req, res) => {
  try {
    const { 
      name, description, category, supplier, supplier_contact,
      cost_price, selling_price, current_stock, min_stock_level, 
      max_stock_level, unit, barcode, notes 
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO products 
       (name, description, category, supplier, supplier_contact, cost_price, selling_price, 
        current_stock, min_stock_level, max_stock_level, unit, barcode, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [name, description, category, supplier, supplier_contact, cost_price, selling_price, 
       current_stock, min_stock_level, max_stock_level, unit, barcode, notes]
    );
    
    res.json({ success: true, message: "Product created successfully", id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update product (admin only)
app.put("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const { 
      name, description, category, supplier, supplier_contact,
      cost_price, selling_price, current_stock, min_stock_level, 
      max_stock_level, unit, barcode, notes, is_active 
    } = req.body;
    
    await pool.query(
      `UPDATE products SET 
       name = $1, description = $2, category = $3, supplier = $4, supplier_contact = $5,
       cost_price = $6, selling_price = $7, current_stock = $8, min_stock_level = $9,
       max_stock_level = $10, unit = $11, barcode = $12, notes = $13, is_active = $14,
       updated_at = CURRENT_TIMESTAMP 
       WHERE id = $15`,
      [name, description, category, supplier, supplier_contact, cost_price, selling_price, 
       current_stock, min_stock_level, max_stock_level, unit, barcode, notes, is_active, req.params.id]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get product analytics (admin only)
app.get("/api/admin/products/analytics", authenticateAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const profitAnalysis = await pool.query(`
      SELECT 
        p.id, p.name, p.cost_price, p.selling_price, p.profit_margin, p.profit_amount,
        p.current_stock, p.min_stock_level,
        COALESCE(SUM(sm.quantity), 0) as total_sold,
        COALESCE(SUM(sm.total_revenue), 0) as total_revenue,
        COALESCE(SUM(sm.total_revenue - sm.total_cost), 0) as total_profit
      FROM products p
      LEFT JOIN stock_movements sm ON p.id = sm.product_id 
        AND sm.movement_type = 'out' 
        AND sm.created_at >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY p.id, p.name, p.cost_price, p.selling_price, p.profit_margin, 
               p.profit_amount, p.current_stock, p.min_stock_level
      ORDER BY total_profit DESC
    `);
    
    const lowStockAlert = await pool.query(`
      SELECT * FROM products 
      WHERE current_stock <= min_stock_level AND is_active = true
      ORDER BY (current_stock::float / min_stock_level) ASC
    `);
    
    const topProfitable = await pool.query(`
      SELECT * FROM products 
      WHERE is_active = true
      ORDER BY profit_margin DESC
      LIMIT 10
    `);
    
    res.json({
      profitAnalysis: profitAnalysis.rows,
      lowStockAlert: lowStockAlert.rows,
      topProfitable: topProfitable.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Record stock movement (admin only)
app.post("/api/admin/products/:id/stock-movement", authenticateAdmin, async (req, res) => {
  try {
    const { movement_type, quantity, unit_cost, unit_price, reason, notes } = req.body;
    const productId = req.params.id;
    
    // Calculate totals
    const total_cost = unit_cost ? unit_cost * Math.abs(quantity) : null;
    const total_revenue = unit_price ? unit_price * Math.abs(quantity) : null;
    
    // Record movement
    await pool.query(
      `INSERT INTO stock_movements 
       (product_id, movement_type, quantity, unit_cost, unit_price, total_cost, total_revenue, reason, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'admin')`,
      [productId, movement_type, quantity, unit_cost, unit_price, total_cost, total_revenue, reason, notes]
    );
    
    // Update product stock
    const stockChange = movement_type === 'out' ? -Math.abs(quantity) : Math.abs(quantity);
    await pool.query(
      "UPDATE products SET current_stock = current_stock + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [stockChange, productId]
    );
    
    res.json({ success: true, message: "Stock movement recorded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get dashboard stats (admin only)
app.get("/api/admin/dashboard-stats", authenticateAdmin, async (req, res) => {
  try {
    const stats = {};
    
    try {
      // Total messages
      const messagesResult = await pool.query("SELECT COUNT(*) as count FROM contact_messages");
      stats.totalMessages = parseInt(messagesResult.rows[0].count);
      
      // Unread messages
      const unreadResult = await pool.query("SELECT COUNT(*) as count FROM contact_messages WHERE read_status = false");
      stats.unreadMessages = parseInt(unreadResult.rows[0].count);
    } catch (err) {
      stats.totalMessages = 0;
      stats.unreadMessages = 0;
    }
    
    try {
      // Total cleaners
      const cleanersResult = await pool.query("SELECT COUNT(*) as count FROM applications");
      stats.totalCleaners = parseInt(cleanersResult.rows[0].count);
      
      // Approved cleaners
      const approvedResult = await pool.query("SELECT COUNT(*) as count FROM applications WHERE status = 'approved'");
      stats.approvedCleaners = parseInt(approvedResult.rows[0].count);
    } catch (err) {
      stats.totalCleaners = 0;
      stats.approvedCleaners = 0;
    }
    
    try {
      // Total jobs
      const jobsResult = await pool.query("SELECT COUNT(*) as count FROM service_bookings");
      stats.totalJobs = parseInt(jobsResult.rows[0].count);
      
      // Completed jobs
      const completedResult = await pool.query("SELECT COUNT(*) as count FROM service_bookings WHERE status = 'completed'");
      stats.completedJobs = parseInt(completedResult.rows[0].count);
      
      // Monthly revenue (this month)
      const revenueResult = await pool.query(
        `SELECT COALESCE(SUM(actual_price), 0) as revenue 
         FROM service_bookings 
         WHERE status = 'completed' 
         AND EXTRACT(MONTH FROM completed_at) = EXTRACT(MONTH FROM CURRENT_DATE) 
         AND EXTRACT(YEAR FROM completed_at) = EXTRACT(YEAR FROM CURRENT_DATE)`
      );
      stats.monthlyRevenue = parseFloat(revenueResult.rows[0].revenue || 0);
    } catch (err) {
      stats.totalJobs = 0;
      stats.completedJobs = 0;
      stats.monthlyRevenue = 0;
    }
    
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get best-selling products for homepage carousel
app.get("/api/products/best-sellers", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id, p.name, p.description, p.category, p.selling_price,
        COALESCE(SUM(ABS(sm.quantity)), 0) as total_sold,
        COALESCE(SUM(sm.total_revenue), 0) as total_revenue
      FROM products p
      LEFT JOIN stock_movements sm ON p.id = sm.product_id 
        AND sm.movement_type = 'out'
        AND sm.created_at >= CURRENT_DATE - INTERVAL '90 days'
      WHERE p.is_active = true
      GROUP BY p.id, p.name, p.description, p.category, p.selling_price
      ORDER BY total_sold DESC, total_revenue DESC
      LIMIT 8
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Record product sale (for tracking best sellers)
app.post("/api/products/record-sale", async (req, res) => {
  try {
    const { product_id, quantity, unit_price, customer_info, notes } = req.body;
    
    const total_revenue = unit_price * quantity;
    
    // Get product cost to calculate total_cost
    const productResult = await pool.query(
      "SELECT cost_price FROM products WHERE id = $1", 
      [product_id]
    );
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    const cost_price = productResult.rows[0].cost_price;
    const total_cost = cost_price * quantity;
    
    // Record the sale in stock_movements
    await pool.query(
      `INSERT INTO stock_movements 
       (product_id, movement_type, quantity, unit_cost, unit_price, total_cost, total_revenue, reason, notes, created_by)
       VALUES ($1, 'out', $2, $3, $4, $5, $6, 'sale', $7, 'system')`,
      [product_id, -Math.abs(quantity), cost_price, unit_price, total_cost, total_revenue, notes || `Sale to: ${customer_info || 'customer'}`]
    );
    
    // Update product stock
    await pool.query(
      "UPDATE products SET current_stock = current_stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [Math.abs(quantity), product_id]
    );
    
    // Update daily analytics
    const today = new Date().toISOString().split('T')[0];
    await pool.query(
      `INSERT INTO product_analytics (product_id, date_recorded, units_sold, revenue, profit)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (product_id, date_recorded) 
       DO UPDATE SET 
         units_sold = product_analytics.units_sold + $3,
         revenue = product_analytics.revenue + $4,
         profit = product_analytics.profit + $5`,
      [product_id, today, quantity, total_revenue, total_revenue - total_cost]
    );
    
    res.json({ success: true, message: "Sale recorded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
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

// Public endpoint for products (for main website)
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, description, category, selling_price as price, 
             current_stock > 0 as "inStock", category as image
      FROM products 
      WHERE is_active = true 
      ORDER BY name
    `);
    
    // Map database products to frontend format
    const products = result.rows.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: `$${product.price}`,
      rating: 4.5, // Default rating
      image: getCategoryIcon(product.category),
      description: product.description || '',
      inStock: product.inStock
    }));
    
    res.json(products);
  } catch (err) {
    console.error('Error fetching public products:', err);
    res.status(500).json({ error: "Server error" });
  }
});

// Helper function for category icons
function getCategoryIcon(category) {
  const icons = {
    'cleaning': '🧴',
    'kitchen': '🏠',
    'organization': '👔',
    'electronics': '⚡',
    'delivery': '🚚'
  };
  return icons[category] || '📦';
}

app.listen(PORT, () => {
  console.log(`Pi Pwòp API running on http://localhost:${PORT}`);
});