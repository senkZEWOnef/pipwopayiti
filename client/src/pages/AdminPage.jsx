import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Mock data - replace with real API calls
const MOCK_STATS = {
  totalProducts: 156,
  totalServices: 4,
  pendingOrders: 12,
  completedOrders: 89,
  monthlyRevenue: 15420,
  activeCustomers: 234,
  inventoryAlerts: 8,
  newBookings: 5
};

const MOCK_RECENT_ORDERS = [
  { id: 1, customer: "Marie Joseph", service: "Netwayaj Kay", amount: "$120", status: "completed", date: "2024-11-14" },
  { id: 2, customer: "Jean Pierre", service: "Kwizin PVC", amount: "$1,500", status: "pending", date: "2024-11-13" },
  { id: 3, customer: "Anne Marie", service: "Closet Organiser", amount: "$350", status: "in-progress", date: "2024-11-12" },
  { id: 4, customer: "Paul Morin", service: "Livrezon", amount: "$45", status: "completed", date: "2024-11-12" },
];

const MOCK_INVENTORY_ALERTS = [
  { id: 1, product: "Detèjan Likid", stock: 5, minStock: 20, status: "critical" },
  { id: 2, product: "Savon Plat", stock: 15, minStock: 25, status: "low" },
  { id: 3, product: "Kwizin Kabinè PVC", stock: 2, minStock: 5, status: "critical" },
];

const MOCK_BOOKINGS = [
  { id: 1, customer: "Sofia Laurent", service: "Netwayaj Kay", date: "2024-11-15", time: "morning", phone: "+509 1234 5678", status: "confirmed" },
  { id: 2, customer: "Robert Charles", service: "Enstalasyon Kwizin", date: "2024-11-16", time: "afternoon", phone: "+509 8765 4321", status: "pending" },
  { id: 3, customer: "Linda Moreau", service: "Òganizasyon Closet", date: "2024-11-17", time: "morning", phone: "+509 5555 1234", status: "pending" },
];

export default function AdminPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(MOCK_STATS);

  return (
    <div className="min-h-screen bg-pp-gray">
      
      {/* Header */}
      <div className="bg-pp-navy text-white py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
              <p className="text-white/70">{t('admin.subtitle')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">{t('admin.connectedAs')}</p>
              <p className="font-semibold">{new Date().toLocaleDateString('ht')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "orders", label: "Kòmand yo", icon: "📦" },
              { id: "bookings", label: "Randevou yo", icon: "📅" },
              { id: "inventory", label: "Enventè", icon: "📋" },
              { id: "customers", label: "Kliyan yo", icon: "👥" },
              { id: "settings", label: "Konfigirasyon", icon: "⚙️" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-pp-blue text-white"
                    : "text-pp-deep hover:bg-pp-gray"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Pwodwi", value: stats.totalProducts, icon: "📦", color: "bg-blue-500" },
                { title: "Kòmand Yo", value: stats.pendingOrders, icon: "⏳", color: "bg-yellow-500" },
                { title: "Vant Mwa Sa A", value: `$${stats.monthlyRevenue.toLocaleString()}`, icon: "💰", color: "bg-green-500" },
                { title: "Kliyan Aktif", value: stats.activeCustomers, icon: "👥", color: "bg-purple-500" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-soft-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-pp-deep/70 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-pp-deep">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Recent Orders */}
              <div className="bg-white rounded-2xl p-6 shadow-soft-card">
                <h3 className="text-xl font-semibold text-pp-deep mb-6">Kòmand Resan Yo</h3>
                <div className="space-y-4">
                  {MOCK_RECENT_ORDERS.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-pp-gray rounded-xl">
                      <div>
                        <p className="font-semibold text-pp-deep">{order.customer}</p>
                        <p className="text-sm text-pp-deep/70">{order.service}</p>
                        <p className="text-xs text-pp-deep/50">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pp-blue">{order.amount}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "completed" ? "bg-green-100 text-green-800" :
                          order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory Alerts */}
              <div className="bg-white rounded-2xl p-6 shadow-soft-card">
                <h3 className="text-xl font-semibold text-pp-deep mb-6">Alèt Enventè</h3>
                <div className="space-y-4">
                  {MOCK_INVENTORY_ALERTS.map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                      <div>
                        <p className="font-semibold text-pp-deep">{alert.product}</p>
                        <p className="text-sm text-pp-deep/70">Stock: {alert.stock} (Min: {alert.minStock})</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        alert.status === "critical" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {alert.status === "critical" ? "CRITICAL" : "LOW"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl p-6 shadow-soft-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-pp-deep">Randevou yo</h2>
              <button className="bg-pp-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-pp-deep transition-colors">
                Nouvo Randevou
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-pp-gray">
                    <th className="text-left p-4 font-semibold text-pp-deep">Kliyan</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Sèvis</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Dat</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Lè</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Telefòn</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Estati</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Aksyon</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_BOOKINGS.map(booking => (
                    <tr key={booking.id} className="border-b border-pp-gray/50 hover:bg-pp-gray/30">
                      <td className="p-4 font-semibold text-pp-deep">{booking.customer}</td>
                      <td className="p-4 text-pp-deep/70">{booking.service}</td>
                      <td className="p-4 text-pp-deep/70">{booking.date}</td>
                      <td className="p-4 text-pp-deep/70">{booking.time}</td>
                      <td className="p-4 text-pp-deep/70">{booking.phone}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button className="text-pp-blue hover:text-pp-deep text-sm">✏️</button>
                          <button className="text-red-500 hover:text-red-700 text-sm">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-2xl p-6 shadow-soft-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-pp-deep">Jesyon Enventè</h2>
              <div className="flex space-x-3">
                <button className="border border-pp-blue text-pp-blue px-4 py-2 rounded-full font-semibold hover:bg-pp-blue hover:text-white transition-all">
                  Ekspòte
                </button>
                <button className="bg-pp-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-pp-deep transition-colors">
                  Ajoute Pwodwi
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-pp-gray p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-pp-blue">{stats.totalProducts}</div>
                <div className="text-sm text-pp-deep/70">Total Pwodwi</div>
              </div>
              <div className="bg-pp-gray p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.inventoryAlerts}</div>
                <div className="text-sm text-pp-deep/70">Alèt Stock</div>
              </div>
              <div className="bg-pp-gray p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-600">142</div>
                <div className="text-sm text-pp-deep/70">Nan Stock</div>
              </div>
              <div className="bg-pp-gray p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-red-600">14</div>
                <div className="text-sm text-pp-deep/70">Stock Ba</div>
              </div>
            </div>

            <p className="text-pp-deep/70 text-center py-8">
              Jesyon detaye enventè ap vin kèk tan...
            </p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-soft-card">
              <h2 className="text-2xl font-bold text-pp-deep mb-6">Konfigirasyon Sit</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-pp-deep mb-2">
                    Non Konpani an
                  </label>
                  <input
                    type="text"
                    defaultValue="Pi Pwòp"
                    className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-pp-deep mb-2">
                      Email Kontak
                    </label>
                    <input
                      type="email"
                      defaultValue="info@pipwop.com"
                      className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-pp-deep mb-2">
                      Telefòn
                    </label>
                    <input
                      type="tel"
                      defaultValue="+509 1234 5678"
                      className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-pp-deep mb-2">
                    Adrès
                  </label>
                  <textarea
                    defaultValue="Port-au-Prince, Ayiti"
                    rows="3"
                    className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                  />
                </div>

                <button className="bg-pp-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-pp-deep transition-colors">
                  Sove Chanjman yo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {(activeTab === "orders" || activeTab === "customers") && (
          <div className="bg-white rounded-2xl p-6 shadow-soft-card">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold text-pp-deep mb-2">
                Seksyon {activeTab} ap vin kèk tan
              </h3>
              <p className="text-pp-deep/70">
                Nou ap travay sou fonksyon sa yo pou ba ou yon eksperyans ki pi bon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}