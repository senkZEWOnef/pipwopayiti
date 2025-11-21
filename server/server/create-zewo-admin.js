import { pool } from "./db.js";
import bcrypt from "bcryptjs";

async function createZewoAdmin() {
  try {
    console.log('🔧 Creating admin user...');

    // Create admin_users table if it doesn't exist
    await pool.query(`
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
    `);

    // Check if zewo admin already exists
    const existingAdmin = await pool.query(
      "SELECT id FROM admin_users WHERE username = $1",
      ['zewo']
    );

    if (existingAdmin.rows.length > 0) {
      console.log('ℹ️ Admin user "zewo" already exists');
      
      // Update password
      const hashedPassword = await bcrypt.hash('Poesie509$', 12);
      await pool.query(
        "UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE username = $2",
        [hashedPassword, 'zewo']
      );
      console.log('✅ Admin password updated');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('Poesie509$', 12);
      await pool.query(
        "INSERT INTO admin_users (username, password_hash, user_role, email) VALUES ($1, $2, $3, $4)",
        ['zewo', hashedPassword, 'super_admin', 'admin@pipwop.com']
      );
      console.log('✅ Admin user "zewo" created successfully');
    }

    // Update read_status column to contacts if it doesn't exist
    try {
      await pool.query("ALTER TABLE contacts ADD COLUMN read_status BOOLEAN DEFAULT false");
      console.log('✅ Added read_status column to contacts');
    } catch (e) {
      console.log('ℹ️ read_status column already exists in contacts');
    }

    // Update status column to applications if it doesn't exist
    try {
      await pool.query("ALTER TABLE applications ADD COLUMN status VARCHAR(50) DEFAULT 'pending'");
      console.log('✅ Added status column to applications');
    } catch (e) {
      console.log('ℹ️ status column already exists in applications');
    }

    console.log('🎉 Admin setup complete!');
    console.log('   Username: zewo');
    console.log('   Password: Poesie509$');
    console.log('   Access at: http://localhost:4000/admin (through the footer link)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createZewoAdmin();