import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const sql = neon(process.env.DATABASE_URL);

// Middleware
app.use(cors());
app.use(express.json());

// Create tables and admin user on startup
async function initializeAdmin() {
  try {
    console.log('🔧 Initializing admin system...');

    // Create admin table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255),
        password_hash TEXT NOT NULL,
        user_role VARCHAR(50) DEFAULT 'admin',
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create admin sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Check if admin user exists
    const existingAdmin = await sql`SELECT id FROM admin_users WHERE username = 'zewo'`;
    
    if (existingAdmin.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('Poesie509$', 12);
      await sql`
        INSERT INTO admin_users (username, password_hash, user_role, email)
        VALUES ('zewo', ${hashedPassword}, 'super_admin', 'admin@pipwop.com')
      `;
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Ensure contact read_status column exists
    try {
      await sql`ALTER TABLE contacts ADD COLUMN read_status BOOLEAN DEFAULT false`;
    } catch (e) {
      // Column exists
    }

    // Ensure applications status column exists
    try {
      await sql`ALTER TABLE applications ADD COLUMN status VARCHAR(50) DEFAULT 'pending'`;
    } catch (e) {
      // Column exists
    }

    // Ensure products profit columns exist
    try {
      await sql`ALTER TABLE products ADD COLUMN profit_amount NUMERIC(10,2)`;
    } catch (e) {
      // Column exists
    }

    try {
      await sql`ALTER TABLE products ADD COLUMN profit_margin NUMERIC(5,2)`;
    } catch (e) {
      // Column exists
    }

    console.log('✅ Admin system initialized');
  } catch (error) {
    console.error('❌ Admin initialization error:', error.message);
  }
}

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await sql`SELECT * FROM admin_users WHERE id = ${decoded.userId}`;
    
    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await sql`SELECT * FROM admin_users WHERE username = ${username}`;
    
    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user[0].password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await sql`UPDATE admin_users SET last_login = NOW() WHERE id = ${user[0].id}`;

    // Create JWT token
    const token = jwt.sign(
      { userId: user[0].id, username: user[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      success: true, 
      token,
      user: {
        id: user[0].id,
        username: user[0].username,
        role: user[0].user_role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Create tables endpoint
app.post('/api/admin/create-tables', authenticateToken, async (req, res) => {
  try {
    // This endpoint is called by the frontend - just return success
    res.json({ success: true });
  } catch (error) {
    console.error('Create tables error:', error);
    res.status(500).json({ error: 'Failed to create tables' });
  }
});

// Dashboard stats endpoint
app.get('/api/admin/dashboard-stats', authenticateToken, async (req, res) => {
  try {
    const stats = {};

    // Total messages
    const totalMessages = await sql`SELECT COUNT(*) as count FROM contacts`;
    stats.totalMessages = parseInt(totalMessages[0].count);

    // Unread messages
    const unreadMessages = await sql`SELECT COUNT(*) as count FROM contacts WHERE read_status = false`;
    stats.unreadMessages = parseInt(unreadMessages[0].count);

    // Total applications (cleaners)
    const totalCleaners = await sql`SELECT COUNT(*) as count FROM applications`;
    stats.totalCleaners = parseInt(totalCleaners[0].count);

    // Approved cleaners
    const approvedCleaners = await sql`SELECT COUNT(*) as count FROM applications WHERE status = 'approved'`;
    stats.approvedCleaners = parseInt(approvedCleaners[0].count);

    // Total jobs (bookings)
    const totalJobs = await sql`SELECT COUNT(*) as count FROM bookings`;
    stats.totalJobs = parseInt(totalJobs[0].count);

    // Monthly revenue (mock data for now)
    stats.monthlyRevenue = 15750;
    stats.completedJobs = Math.floor(stats.totalJobs * 0.8);

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Messages endpoint
app.get('/api/admin/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await sql`
      SELECT id, name, phone, email, service as service_type, message, created_at, read_status
      FROM contacts 
      ORDER BY created_at DESC
    `;
    res.json(messages);
  } catch (error) {
    console.error('Messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark message as read
app.put('/api/admin/messages/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await sql`UPDATE contacts SET read_status = true WHERE id = ${id}`;
    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// Cleaners endpoint (applications)
app.get('/api/admin/cleaners', authenticateToken, async (req, res) => {
  try {
    const cleaners = await sql`
      SELECT 
        id, full_name, phone_number as phone, email, position, 
        experience_years, has_transportation as transportation,
        has_own_tools as own_tools, status, created_at as applied_at
      FROM applications 
      ORDER BY created_at DESC
    `;
    res.json(cleaners);
  } catch (error) {
    console.error('Cleaners error:', error);
    res.status(500).json({ error: 'Failed to fetch cleaners' });
  }
});

// Update cleaner status
app.put('/api/admin/cleaners/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await sql`UPDATE applications SET status = ${status} WHERE id = ${id}`;
    res.json({ success: true });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Jobs endpoint (bookings)
app.get('/api/admin/jobs', authenticateToken, async (req, res) => {
  try {
    const jobs = await sql`
      SELECT 
        id, name as client_name, service as service_type,
        preferred_date, preferred_time, notes,
        'pending' as status, null as estimated_price, null as cleaner_name,
        created_at
      FROM bookings 
      ORDER BY created_at DESC
    `;
    res.json(jobs);
  } catch (error) {
    console.error('Jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Products endpoint
app.get('/api/admin/products', authenticateToken, async (req, res) => {
  try {
    // Update profit calculations first
    await sql`
      UPDATE products 
      SET 
        profit_amount = selling_price - cost_price,
        profit_margin = CASE 
          WHEN cost_price > 0 THEN ((selling_price - cost_price) / cost_price) * 100
          ELSE 0
        END
    `;

    const products = await sql`
      SELECT * FROM products 
      ORDER BY created_at DESC
    `;
    res.json(products);
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add product
app.post('/api/admin/products', authenticateToken, async (req, res) => {
  try {
    const { 
      name, description, category, supplier, supplier_contact,
      cost_price, selling_price, current_stock, min_stock_level,
      max_stock_level, unit, barcode, notes
    } = req.body;

    const profit_amount = parseFloat(selling_price) - parseFloat(cost_price);
    const profit_margin = parseFloat(cost_price) > 0 
      ? ((parseFloat(selling_price) - parseFloat(cost_price)) / parseFloat(cost_price)) * 100 
      : 0;

    const result = await sql`
      INSERT INTO products (
        name, description, category, supplier, supplier_contact,
        cost_price, selling_price, current_stock, min_stock_level,
        max_stock_level, unit, barcode, notes, profit_amount, profit_margin,
        created_at
      ) VALUES (
        ${name}, ${description}, ${category}, ${supplier}, ${supplier_contact},
        ${cost_price}, ${selling_price}, ${current_stock}, ${min_stock_level},
        ${max_stock_level}, ${unit}, ${barcode}, ${notes}, ${profit_amount}, ${profit_margin},
        NOW()
      )
      RETURNING id
    `;

    res.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product
app.put('/api/admin/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, description, category, supplier, supplier_contact,
      cost_price, selling_price, current_stock, min_stock_level,
      max_stock_level, unit, barcode, notes
    } = req.body;

    const profit_amount = parseFloat(selling_price) - parseFloat(cost_price);
    const profit_margin = parseFloat(cost_price) > 0 
      ? ((parseFloat(selling_price) - parseFloat(cost_price)) / parseFloat(cost_price)) * 100 
      : 0;

    await sql`
      UPDATE products SET
        name = ${name}, description = ${description}, category = ${category},
        supplier = ${supplier}, supplier_contact = ${supplier_contact},
        cost_price = ${cost_price}, selling_price = ${selling_price},
        current_stock = ${current_stock}, min_stock_level = ${min_stock_level},
        max_stock_level = ${max_stock_level}, unit = ${unit},
        barcode = ${barcode}, notes = ${notes},
        profit_amount = ${profit_amount}, profit_margin = ${profit_margin},
        updated_at = NOW()
      WHERE id = ${id}
    `;

    res.json({ success: true });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Product analytics
app.get('/api/admin/products/analytics', authenticateToken, async (req, res) => {
  try {
    // Low stock alert
    const lowStockAlert = await sql`
      SELECT id, name, current_stock, min_stock_level
      FROM products 
      WHERE current_stock <= min_stock_level
      ORDER BY (current_stock::float / min_stock_level::float) ASC
    `;

    // Top profitable products
    const topProfitable = await sql`
      SELECT id, name, cost_price, selling_price, profit_amount, profit_margin
      FROM products 
      WHERE profit_margin > 0
      ORDER BY profit_margin DESC
      LIMIT 10
    `;

    // Mock profit analysis (would need sales data)
    const profitAnalysis = await sql`
      SELECT 
        id, name, current_stock, min_stock_level,
        0 as total_sold,
        0 as total_revenue,
        0 as total_profit
      FROM products
      ORDER BY profit_margin DESC
    `;

    res.json({
      lowStockAlert,
      topProfitable,
      profitAnalysis
    });
  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Analytics endpoint
app.get('/api/admin/analytics', authenticateToken, async (req, res) => {
  try {
    // Mock analytics data - in a real system, you'd track page views
    const analytics = [
      { id: 1, page_path: '/', visitor_count: 245, date_recorded: new Date() },
      { id: 2, page_path: '/products', visitor_count: 189, date_recorded: new Date() },
      { id: 3, page_path: '/services', visitor_count: 156, date_recorded: new Date() },
      { id: 4, page_path: '/apply', visitor_count: 89, date_recorded: new Date() },
      { id: 5, page_path: '/contact', visitor_count: 67, date_recorded: new Date() }
    ];
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Job positions endpoints
app.get('/api/admin/job-positions', authenticateToken, async (req, res) => {
  try {
    const positions = await sql`
      SELECT * FROM job_positions 
      ORDER BY created_at DESC
    `;
    res.json(positions);
  } catch (error) {
    console.error('Job positions error:', error);
    res.status(500).json({ error: 'Failed to fetch job positions' });
  }
});

app.post('/api/admin/job-positions', authenticateToken, async (req, res) => {
  try {
    const { 
      position_id, title_ht, title_fr, description_ht, description_fr,
      requirements_ht, requirements_fr, is_active
    } = req.body;

    const result = await sql`
      INSERT INTO job_positions (
        position_id, title_ht, title_fr, description_ht, description_fr,
        requirements_ht, requirements_fr, is_active, created_at
      ) VALUES (
        ${position_id}, ${title_ht}, ${title_fr}, ${description_ht}, ${description_fr},
        ${requirements_ht}, ${requirements_fr}, ${is_active}, NOW()
      )
      RETURNING id
    `;

    res.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Add job position error:', error);
    res.status(500).json({ error: 'Failed to add job position' });
  }
});

app.put('/api/admin/job-positions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      position_id, title_ht, title_fr, description_ht, description_fr,
      requirements_ht, requirements_fr, is_active
    } = req.body;

    await sql`
      UPDATE job_positions SET
        position_id = ${position_id}, title_ht = ${title_ht}, title_fr = ${title_fr},
        description_ht = ${description_ht}, description_fr = ${description_fr},
        requirements_ht = ${requirements_ht}, requirements_fr = ${requirements_fr},
        is_active = ${is_active}, updated_at = NOW()
      WHERE id = ${id}
    `;

    res.json({ success: true });
  } catch (error) {
    console.error('Update job position error:', error);
    res.status(500).json({ error: 'Failed to update job position' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Admin Server running on port ${PORT}`);
  await initializeAdmin();
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`🔐 Login: zewo / Poesie509$`);
});