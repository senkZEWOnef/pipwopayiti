import { pool } from './db.js';

async function addSimpleData() {
  try {
    console.log('Adding simple sample data...');

    // Add sample products manually
    const products = [
      {
        name: 'Detèjan Likid Premium',
        description: 'Detèjan ki pi bon pou tout sèvis yo',
        category: 'cleaning',
        supplier: 'CleanPro Ltd',
        cost_price: 45.00,
        selling_price: 75.00,
        current_stock: 100
      },
      {
        name: 'Kabinè Kwizin PVC Modèn', 
        description: 'Kabinè kwizin ak design modèn ak kalite wo',
        category: 'kitchen',
        supplier: 'Kitchen Masters',
        cost_price: 850.00,
        selling_price: 1200.00,
        current_stock: 20
      },
      {
        name: 'Savon Plat Disinfektan',
        description: 'Savon espesyal pou netwaye ak disinfekte', 
        category: 'cleaning',
        supplier: 'CleanPro Ltd',
        cost_price: 28.00,
        selling_price: 45.00,
        current_stock: 150
      }
    ];

    for (const product of products) {
      try {
        await pool.query(`
          INSERT INTO products (name, description, category, supplier, cost_price, selling_price, current_stock, unit, min_stock_level, max_stock_level)
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'piece', 10, 200)
        `, [product.name, product.description, product.category, product.supplier, product.cost_price, product.selling_price, product.current_stock]);
        
        console.log(`✅ Added product: ${product.name}`);
      } catch (error) {
        console.log(`⚠️ Product may already exist: ${product.name}`);
      }
    }

    // Get product IDs and add sample sales
    const productResult = await pool.query("SELECT id, cost_price, selling_price, name FROM products LIMIT 3");
    
    for (const product of productResult.rows) {
      // Add some sample sales
      const salesData = [
        { quantity: 10, days_ago: 5 },
        { quantity: 15, days_ago: 10 },
        { quantity: 8, days_ago: 15 },
        { quantity: 20, days_ago: 20 },
        { quantity: 12, days_ago: 25 }
      ];

      for (const sale of salesData) {
        const saleDate = new Date();
        saleDate.setDate(saleDate.getDate() - sale.days_ago);
        
        const totalRevenue = product.selling_price * sale.quantity;
        const totalCost = product.cost_price * sale.quantity;
        
        try {
          await pool.query(`
            INSERT INTO stock_movements 
            (product_id, movement_type, quantity, unit_cost, unit_price, total_cost, total_revenue, reason, created_by, created_at)
            VALUES ($1, 'out', $2, $3, $4, $5, $6, 'sale', 'system', $7)
          `, [product.id, -Math.abs(sale.quantity), product.cost_price, product.selling_price, totalCost, totalRevenue, saleDate]);
        } catch (error) {
          console.log(`⚠️ Error adding sale for ${product.name}:`, error.message);
        }
      }
      
      console.log(`✅ Added sample sales for: ${product.name}`);
    }

    console.log('✅ Simple sample data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
}

addSimpleData();