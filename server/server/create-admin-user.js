import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function createAdminUser() {
  try {
    console.log('🔧 Setting up admin system...');
    
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
    
    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('Poesie509$', saltRounds);
    
    // Insert admin user (using ON CONFLICT to avoid duplicates)
    await sql`
      INSERT INTO admin_users (username, password_hash, user_role, email)
      VALUES ('zewo', ${hashedPassword}, 'super_admin', 'admin@pipwop.com')
      ON CONFLICT (username) 
      DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW()
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
    
    console.log('✅ Admin user created successfully!');
    console.log('   Username: zewo');
    console.log('   Password: Poesie509$');
    console.log('   Role: super_admin');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
}

createAdminUser();