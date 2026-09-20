# Pi Pwòp Shipping - Complete Business Management Platform

🚢 **Pi Pwòp Shipping** is a business management platform for a Haitian shipping company: container shipping and receiving from the United States to Haiti (the main focus), alongside cleaning products and PVC kitchen/closet installation. Built with modern web technologies and featuring bilingual support (Haitian Creole & French).

![Pi Pwòp Shipping Banner](https://via.placeholder.com/800x200/10243d/ffffff?text=Pi+Pw%C3%B2p+Shipping)

## 🌟 Features

### 🌐 **Public Website**
- **Multilingual Support**: Full Haitian Creole and French translations
- **Modern Design**: Responsive design with custom color scheme
- **Product Carousel**: Dynamic product showcase in hero section
- **Shipping Section**: Main landing focus — US → Haiti container shipping (`/shipping`)
- **Service Pages**: Detailed service offerings and descriptions
- **Contact Forms**: Customer inquiry and service request forms
- **Job Applications**: Career opportunities and application system
- **Mobile Responsive**: Optimized for all device sizes

### 🔐 **Admin Dashboard**
- **Secure Authentication**: JWT-based login system
- **Product Management**: Complete CRUD operations for inventory
- **Staff Management**: Cleaner applications and approval system
- **Customer Communications**: Contact message management
- **Job Management**: Service job tracking and assignment
- **Analytics & Reporting**: Sales performance and business insights
- **Stock Management**: Inventory tracking with low-stock alerts
- **Bilingual Content Management**: Job positions in both languages

### 📊 **Key Business Features**
- **Real-time Analytics**: Sales, profit, and performance metrics
- **Inventory Control**: Stock levels, supplier management, profit calculations
- **Customer Relationship**: Message tracking and response management
- **Staff Coordination**: Application processing and job assignments
- **Financial Tracking**: Revenue reporting and profit analysis

## 🚢 Shipping module (US → Haiti)

- `/shipping` overview · `/shipping/request` request form (returns a tracking number `PPS-XXXXXX`) · `/shipping/track/:number` live tracking + online payment · `/shipping/call` callback request
- Live chat widget on every public page. When the admin is "available" (chat tab, page open) messages go to the admin; otherwise an AI assistant answers.
- Admin: **Shipments** (approve/reject, quote, tracking updates, payments), **Chat**, **Callbacks**.
- Tables are created automatically on server start (`server/shipping.js`, `server/chat.js`).
- Payment options (each can be switched on/off in Admin → Shipping): Cash (admin confirms), Card (Stripe), PayPal, MonCash (HTG, needs a USD→HTG rate).
- Optional keys in `server/.env` (see `server/.env.example`): `ANTHROPIC_API_KEY` (AI assistant), `STRIPE_*`, `PAYPAL_*`, `MONCASH_*`.

## 🛠️ Technology Stack

### **Frontend**
- **React 18**: Modern component-based UI
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **React i18next**: Internationalization framework
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Design System**: Pi Pwòp Shipping brand colors and components

### **Backend**
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **PostgreSQL**: Robust relational database
- **Neon Database**: Serverless PostgreSQL hosting
- **JWT Authentication**: Secure token-based auth
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

### **Database Schema**
- **Products**: Inventory management with pricing and stock
- **Contact Messages**: Customer inquiries and communications
- **Cleaner Applications**: Staff hiring and management
- **Jobs**: Service requests and job tracking
- **Job Positions**: Bilingual job posting management
- **Analytics**: Website and business performance tracking
- **Admin Users**: Secure administrative access

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database (or Neon account)
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pipwopayiti.git
cd pipwopayiti
```

2. **Setup Backend**
```bash
cd server
npm install

# Create .env file
echo "PORT=4000" > .env
echo "DATABASE_URL=your_postgresql_connection_string" >> .env
echo "JWT_SECRET=your_jwt_secret_key" >> .env

# Setup database and admin user
node setup-db.js

# Start backend server
npm run dev
```

3. **Setup Frontend**
```bash
cd ../client
npm install

# Start development server
npm run dev
```

4. **Access the Application**
- **Public Site**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin

### **Default Admin Credentials**
- **Username**: `zewo`
- **Password**: `Poesie509$$$`

## 📁 Project Structure

```
pipwopayiti/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── locales/       # Translation files (HT/FR)
│   │   └── assets/        # Static assets
│   ├── public/            # Public static files
│   └── package.json       # Frontend dependencies
│
├── server/                # Express.js backend
│   ├── db.js             # Database connection
│   ├── index.js          # Main server file
│   ├── setup-db.js       # Database setup script
│   └── package.json      # Backend dependencies
│
└── README.md             # This file
```

## 🌍 Internationalization

The platform supports two languages:

### **Haitian Creole (HT)**
- Primary language for local market
- Complete UI translation
- Business terminology adaptation

### **French (FR)**
- Secondary language support
- Professional business communication
- Administrative interface

### **Adding Translations**
1. Edit translation files in `client/src/locales/`
2. Use translation keys in components: `{t('key.name')}`
3. Language switcher available in UI

## 🔧 API Endpoints

### **Public APIs**
- `GET /api/products/best-sellers` - Product carousel data
- `POST /api/contact/submit` - Contact form submission
- `POST /api/cleaners/apply` - Job application submission
- `POST /api/analytics/visit` - Page visit tracking

### **Admin APIs (Protected)**
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/products` - Product management
- `GET /api/admin/messages` - Customer messages
- `GET /api/admin/cleaners` - Staff applications
- `GET /api/admin/analytics` - Business analytics

## 🎨 Design System

### **Color Palette**
```css
:root {
  --pp-navy: #1e3a8a;      /* Primary dark blue */
  --pp-deep: #1e40af;      /* Deep blue */
  --pp-blue: #2563eb;      /* Main blue */
  --pp-sky: #0ea5e9;       /* Accent sky blue */
  --pp-gray: #f8fafc;      /* Light gray backgrounds */
}
```

### **Typography**
- Modern sans-serif fonts
- Responsive text sizing
- Accessibility-focused contrast ratios

### **Components**
- Consistent button styles and interactions
- Form components with validation
- Card layouts and modals
- Navigation and layout systems

## 📊 Business Metrics

The platform tracks comprehensive business analytics:

- **Sales Performance**: Revenue, profit margins, top products
- **Inventory Management**: Stock levels, reorder alerts
- **Customer Engagement**: Contact form submissions, page views
- **Staff Management**: Application tracking, approval rates
- **Financial Reporting**: Monthly revenue, profit analysis

## 🔒 Security Features

- **JWT Authentication**: Secure token-based login
- **Password Hashing**: bcrypt protection for user passwords
- **CORS Protection**: Configured cross-origin policies
- **Input Validation**: Server-side request validation
- **SQL Injection Protection**: Parameterized queries
- **Session Management**: Secure token storage and expiration

## 🚀 Deployment

### **Frontend Deployment (Vercel/Netlify)**
```bash
cd client
npm run build
# Deploy dist/ folder
```

### **Backend Deployment (Railway/Render)**
```bash
cd server
# Set environment variables
# Deploy with auto-scaling
```

### **Environment Variables**
```env
# Server
PORT=4000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key

# Client (if needed)
VITE_API_URL=https://your-api-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- 📧 Email: support@pipwop.com
- 📱 Phone: +509 1234 5678
- 💬 Create an issue in this repository

## 🙏 Acknowledgments

- Built for the Haitian business community
- Inspired by modern business management needs
- Designed with accessibility and multilingual support in mind

---

**Pi Pwòp Shipping** - Empowering Haitian businesses with modern technology 🇭🇹

*"Pi pwòp, pi bon, pi solid"* - Cleaner, better, stronger