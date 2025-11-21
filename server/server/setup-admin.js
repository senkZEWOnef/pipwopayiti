import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin system...');
    
    // Drop existing admin tables if they exist
    await sql`DROP TABLE IF EXISTS admin_sessions CASCADE`;
    await sql`DROP TABLE IF EXISTS admin_users CASCADE`;
    
    // Create admin table
    await sql`
      CREATE TABLE admin_users (
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
    
    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('Poesie509$', saltRounds);
    
    // Insert admin user
    await sql`
      INSERT INTO admin_users (username, password_hash, user_role, email)
      VALUES ('zewo', ${hashedPassword}, 'super_admin', 'admin@pipwop.com')
    `;
    
    // Create admin sessions table
    await sql`
      CREATE TABLE admin_sessions (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create additional admin tables needed for the dashboard
    await sql`
      CREATE TABLE IF NOT EXISTS job_positions (
        id SERIAL PRIMARY KEY,
        position_id VARCHAR(100) UNIQUE NOT NULL,
        title_ht TEXT NOT NULL,
        title_fr TEXT NOT NULL,
        description_ht TEXT NOT NULL,
        description_fr TEXT NOT NULL,
        requirements_ht TEXT NOT NULL,
        requirements_fr TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Add read_status column to contacts if it doesn't exist
    try {
      await sql`ALTER TABLE contacts ADD COLUMN read_status BOOLEAN DEFAULT false`;
      console.log('✅ Added read_status column to contacts');
    } catch (e) {
      console.log('ℹ️ read_status column already exists in contacts');
    }

    // Add status column to applications if it doesn't exist
    try {
      await sql`ALTER TABLE applications ADD COLUMN status VARCHAR(50) DEFAULT 'pending'`;
      console.log('✅ Added status column to applications');
    } catch (e) {
      console.log('ℹ️ status column already exists in applications');
    }

    // Update products table to include profit calculations
    try {
      await sql`
        ALTER TABLE products 
        ADD COLUMN profit_amount NUMERIC(10,2),
        ADD COLUMN profit_margin NUMERIC(5,2)
      `;
      console.log('✅ Added profit columns to products');
    } catch (e) {
      console.log('ℹ️ profit columns already exist in products');
    }

    // Update profit calculations for existing products
    await sql`
      UPDATE products 
      SET 
        profit_amount = selling_price - cost_price,
        profit_margin = CASE 
          WHEN cost_price > 0 THEN ((selling_price - cost_price) / cost_price) * 100
          ELSE 0
        END
      WHERE profit_amount IS NULL OR profit_margin IS NULL
    `;
    
    console.log('✅ Admin system setup complete!');
    console.log('   Username: zewo');
    console.log('   Password: Poesie509$');
    console.log('   Role: super_admin');
    console.log('   Admin portal: http://localhost:4000/admin (after starting admin server)');
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
  }
}

setupAdmin();