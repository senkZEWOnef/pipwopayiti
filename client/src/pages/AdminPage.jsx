import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function AdminPage() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Dashboard data states
  const [stats, setStats] = useState({});
  const [messages, setMessages] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);
  const [products, setProducts] = useState([]);
  const [productAnalytics, setProductAnalytics] = useState({});
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '', description: '', category: '', supplier: '', supplier_contact: '',
    cost_price: '', selling_price: '', current_stock: '', min_stock_level: '',
    max_stock_level: '', unit: 'piece', barcode: '', notes: ''
  });
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [positionFormData, setPositionFormData] = useState({
    position_id: '', title_ht: '', title_fr: '', description_ht: '', description_fr: '', 
    requirements_ht: '', requirements_fr: '', is_active: true
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
    setIsLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      console.log('Attempting login with:', loginData.username);
      const response = await fetch('http://localhost:4000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      
      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setStats({});
    setMessages([]);
    setCleaners([]);
    setJobs([]);
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      // Create tables first
      await fetch('http://localhost:4000/api/admin/create-tables', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Fetch dashboard stats
      const statsResponse = await fetch('http://localhost:4000/api/admin/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch messages if on messages tab
      if (activeTab === "messages") {
        fetchMessages();
      }
      // Fetch cleaners if on cleaners tab
      if (activeTab === "cleaners") {
        fetchCleaners();
      }
      // Fetch jobs if on jobs tab
      if (activeTab === "jobs") {
        fetchJobs();
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch('http://localhost:4000/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchCleaners = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch('http://localhost:4000/api/admin/cleaners', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCleaners(data);
      }
    } catch (error) {
      console.error('Error fetching cleaners:', error);
    }
  };

  const fetchJobs = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch('http://localhost:4000/api/admin/jobs', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const markMessageAsRead = async (messageId) => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`http://localhost:4000/api/admin/messages/${messageId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        fetchMessages();
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const updateCleanerStatus = async (cleanerId, status) => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`http://localhost:4000/api/admin/cleaners/${cleanerId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchCleaners();
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating cleaner status:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      if (activeTab === "products") {
        fetchProducts();
      }
      if (activeTab === "job-positions") {
        fetchJobPositions();
      }
      if (activeTab === "analytics") {
        fetchAnalytics();
        fetchProductAnalytics();
      }
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch('http://localhost:4000/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchJobPositions = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch('http://localhost:4000/api/admin/job-positions', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setJobPositions(data);
      }
    } catch (error) {
      console.error('Error fetching job positions:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    try {
      const url = editingProduct 
        ? `http://localhost:4000/api/admin/products/${editingProduct.id}`
        : 'http://localhost:4000/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productFormData),
      });
      
      if (response.ok) {
        setShowProductForm(false);
        setEditingProduct(null);
        fetchProducts();
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handlePositionSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    try {
      const url = editingPosition 
        ? `http://localhost:4000/api/admin/job-positions/${editingPosition.id}`
        : 'http://localhost:4000/api/admin/job-positions';
      
      const method = editingPosition ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(positionFormData),
      });
      
      if (response.ok) {
        setShowPositionForm(false);
        setEditingPosition(null);
        fetchJobPositions();
      }
    } catch (error) {
      console.error('Error saving position:', error);
    }
  };

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch('http://localhost:4000/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchProductAnalytics = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch('http://localhost:4000/api/admin/products/analytics', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProductAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching product analytics:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pp-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pp-blue mx-auto mb-4"></div>
          <p className="text-pp-deep">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pp-blue via-pp-deep to-pp-navy flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Pi Pwòp Admin</h1>
            <p className="text-white/70">Admin dashboard access</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Username</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/70 outline-none focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30 transition-all"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-3 text-white placeholder-white/70 outline-none focus:border-pp-sky focus:ring-2 focus:ring-pp-sky/30 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
            
            {loginError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-pp-sky text-pp-deep py-3 rounded-xl font-semibold hover:bg-white hover:text-pp-deep transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Login to Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pp-gray">
      {/* Header */}
      <div className="bg-gradient-to-r from-pp-navy to-pp-deep text-white py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Pi Pwòp Admin Dashboard</h1>
              <p className="text-white/70">Jesyon kompani an ak sistèm administrasyon</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white/70">Connected as Admin</p>
                <p className="font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
              <Link
                to="/"
                className="bg-pp-sky/20 hover:bg-pp-sky/30 border border-pp-sky/30 px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center space-x-2"
              >
                <span>🏠</span>
                <span>Back to Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              >
                Logout
              </button>
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
              { id: "messages", label: "Mesaj yo", icon: "📧" },
              { id: "cleaners", label: "Travayè yo", icon: "👥" },
              { id: "jobs", label: "Travay yo", icon: "💼" },
              { id: "products", label: "Pwodwi yo", icon: "📦" },
              { id: "job-positions", label: "Pozisyon Travay", icon: "💼" },
              { id: "analytics", label: "Analytics", icon: "📈" },
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
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-pp-deep/70 mb-1">Total Messages</p>
                    <p className="text-2xl font-bold text-pp-deep">{stats.totalMessages || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">📧</div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-pp-deep/70 mb-1">Unread Messages</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.unreadMessages || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">⚠️</div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-pp-deep/70 mb-1">Total Cleaners</p>
                    <p className="text-2xl font-bold text-pp-deep">{stats.totalCleaners || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">👥</div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-pp-deep/70 mb-1">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-green-600">${stats.monthlyRevenue || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xl">💰</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-pp-deep mb-6">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-pp-deep/70">Total Jobs</span>
                    <span className="font-semibold">{stats.totalJobs || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-pp-deep/70">Completed Jobs</span>
                    <span className="font-semibold">{stats.completedJobs || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-pp-deep/70">Approved Cleaners</span>
                    <span className="font-semibold">{stats.approvedCleaners || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-pp-deep mb-6">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-pp-deep/70">Database</span>
                    <span className="text-green-600 font-semibold">✅ Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-pp-deep/70">API Services</span>
                    <span className="text-green-600 font-semibold">✅ Running</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-pp-deep/70">Last Update</span>
                    <span className="font-semibold">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-pp-deep">Contact Messages</h2>
              <button 
                onClick={fetchMessages}
                className="bg-pp-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-pp-deep transition-colors"
              >
                Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-pp-gray">
                    <th className="text-left p-4 font-semibold text-pp-deep">Name</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Phone</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Email</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Service</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Message</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Date</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Status</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(message => (
                    <tr key={message.id} className={`border-b border-pp-gray/50 hover:bg-pp-gray/30 ${!message.read_status ? 'bg-blue-50' : ''}`}>
                      <td className="p-4 font-semibold text-pp-deep">{message.name}</td>
                      <td className="p-4 text-pp-deep/70">{message.phone}</td>
                      <td className="p-4 text-pp-deep/70">{message.email || 'N/A'}</td>
                      <td className="p-4 text-pp-deep/70">{message.service_type}</td>
                      <td className="p-4 text-pp-deep/70 max-w-xs truncate">{message.message}</td>
                      <td className="p-4 text-pp-deep/70">{new Date(message.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          message.read_status ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {message.read_status ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="p-4">
                        {!message.read_status && (
                          <button 
                            onClick={() => markMessageAsRead(message.id)}
                            className="text-pp-blue hover:text-pp-deep text-sm"
                          >
                            Mark Read
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {messages.length === 0 && (
                <div className="text-center py-8 text-pp-deep/70">
                  No messages found. Contact forms will appear here when submitted.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cleaners Tab */}
        {activeTab === "cleaners" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-pp-deep">Cleaner Applications</h2>
              <button 
                onClick={fetchCleaners}
                className="bg-pp-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-pp-deep transition-colors"
              >
                Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-pp-gray">
                    <th className="text-left p-4 font-semibold text-pp-deep">Name</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Position</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Phone</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Experience</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Transport</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Tools</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Status</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Applied</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cleaners.map(cleaner => (
                    <tr key={cleaner.id} className="border-b border-pp-gray/50 hover:bg-pp-gray/30">
                      <td className="p-4 font-semibold text-pp-deep">{cleaner.full_name}</td>
                      <td className="p-4 text-pp-deep/70">
                        <span className="px-2 py-1 rounded-full text-xs bg-pp-blue/20 text-pp-blue">
                          {cleaner.position?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-pp-deep/70">{cleaner.phone}</td>
                      <td className="p-4 text-pp-deep/70">{cleaner.experience_years}</td>
                      <td className="p-4 text-pp-deep/70">{cleaner.transportation ? '✅' : '❌'}</td>
                      <td className="p-4 text-pp-deep/70">{cleaner.own_tools ? '✅' : '❌'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cleaner.status === 'approved' ? "bg-green-100 text-green-800" : 
                          cleaner.status === 'rejected' ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {cleaner.status}
                        </span>
                      </td>
                      <td className="p-4 text-pp-deep/70">{new Date(cleaner.applied_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {cleaner.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => updateCleanerStatus(cleaner.id, 'approved')}
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => updateCleanerStatus(cleaner.id, 'rejected')}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {cleaners.length === 0 && (
                <div className="text-center py-8 text-pp-deep/70">
                  No cleaner applications found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-pp-deep">Service Jobs</h2>
              <button 
                onClick={fetchJobs}
                className="bg-pp-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-pp-deep transition-colors"
              >
                Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-pp-gray">
                    <th className="text-left p-4 font-semibold text-pp-deep">Client</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Service</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Date</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Status</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Price</th>
                    <th className="text-left p-4 font-semibold text-pp-deep">Cleaner</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id} className="border-b border-pp-gray/50 hover:bg-pp-gray/30">
                      <td className="p-4 font-semibold text-pp-deep">{job.client_name}</td>
                      <td className="p-4 text-pp-deep/70">{job.service_type}</td>
                      <td className="p-4 text-pp-deep/70">{job.preferred_date || 'TBD'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'completed' ? "bg-green-100 text-green-800" : 
                          job.status === 'assigned' ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-4 text-pp-deep/70">${job.estimated_price || 'TBD'}</td>
                      <td className="p-4 text-pp-deep/70">{job.cleaner_name || 'Unassigned'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {jobs.length === 0 && (
                <div className="text-center py-8 text-pp-deep/70">
                  No jobs found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-8">
            {/* Products Header */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-pp-deep">Jesyon Pwodwi</h2>
                <button 
                  onClick={() => {
                    setShowProductForm(true);
                    setEditingProduct(null);
                    setProductFormData({
                      name: '', description: '', category: '', supplier: '', supplier_contact: '',
                      cost_price: '', selling_price: '', current_stock: '', min_stock_level: '',
                      max_stock_level: '', unit: 'piece', barcode: '', notes: ''
                    });
                  }}
                  className="bg-pp-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-pp-deep transition-colors"
                >
                  + Ajoute Nouvo Pwodwi
                </button>
              </div>

              {/* Product Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-pp-gray p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-pp-blue">{products.length}</div>
                  <div className="text-sm text-pp-deep/70">Total Pwodwi</div>
                </div>
                <div className="bg-pp-gray p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {products.filter(p => p.current_stock > p.min_stock_level).length}
                  </div>
                  <div className="text-sm text-pp-deep/70">Stock OK</div>
                </div>
                <div className="bg-pp-gray p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {products.filter(p => p.current_stock <= p.min_stock_level).length}
                  </div>
                  <div className="text-sm text-pp-deep/70">Stock Ba</div>
                </div>
                <div className="bg-pp-gray p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ${products.reduce((sum, p) => sum + (p.profit_amount || 0) * p.current_stock, 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-pp-deep/70">Pofit Total</div>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-pp-gray">
                      <th className="text-left p-4 font-semibold text-pp-deep">Pwodwi</th>
                      <th className="text-left p-4 font-semibold text-pp-deep">Kategori</th>
                      <th className="text-left p-4 font-semibold text-pp-deep">Stock</th>
                      <th className="text-left p-4 font-semibold text-pp-deep">Pri Achte</th>
                      <th className="text-left p-4 font-semibold text-pp-deep">Pri Vann</th>
                      <th className="text-left p-4 font-semibold text-pp-deep">Pofit</th>
                      <th className="text-left p-4 font-semibold text-pp-deep">Fournisè</th>
                      <th className="text-left p-4 font-semibold text-pp-deep">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className={`border-b border-pp-gray/50 hover:bg-pp-gray/30 ${
                        product.current_stock <= product.min_stock_level ? 'bg-red-50' : ''
                      }`}>
                        <td className="p-4">
                          <div>
                            <div className="font-semibold text-pp-deep">{product.name}</div>
                            {product.description && (
                              <div className="text-sm text-pp-deep/70">{product.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-pp-deep/70 capitalize">{product.category}</td>
                        <td className="p-4">
                          <div className={`font-semibold ${
                            product.current_stock <= product.min_stock_level ? 'text-red-600' : 'text-pp-deep'
                          }`}>
                            {product.current_stock} {product.unit}
                          </div>
                          <div className="text-xs text-pp-deep/70">Min: {product.min_stock_level}</div>
                        </td>
                        <td className="p-4 text-pp-deep/70">${product.cost_price}</td>
                        <td className="p-4 text-pp-deep/70">${product.selling_price}</td>
                        <td className="p-4">
                          <div className="text-green-600 font-semibold">
                            ${product.profit_amount?.toFixed(2)} ({product.profit_margin?.toFixed(1)}%)
                          </div>
                        </td>
                        <td className="p-4 text-pp-deep/70">{product.supplier}</td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingProduct(product);
                                setProductFormData(product);
                                setShowProductForm(true);
                              }}
                              className="text-pp-blue hover:text-pp-deep text-sm"
                            >
                              Modifye
                            </button>
                            <button className="text-green-600 hover:text-green-800 text-sm">
                              Stock
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && (
                  <div className="text-center py-8 text-pp-deep/70">
                    Pa gen pwodwi nan depo a ankò.
                  </div>
                )}
              </div>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-pp-deep">
                      {editingProduct ? 'Modifye Pwodwi' : 'Ajoute Nouvo Pwodwi'}
                    </h3>
                    <button
                      onClick={() => setShowProductForm(false)}
                      className="text-pp-deep/70 hover:text-pp-deep text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Non Pwodwi
                        </label>
                        <input
                          type="text"
                          value={productFormData.name}
                          onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Kategori
                        </label>
                        <select
                          value={productFormData.category}
                          onChange={(e) => setProductFormData({...productFormData, category: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          required
                        >
                          <option value="">Chwazi Kategori</option>
                          <option value="cleaning">Netwayaj</option>
                          <option value="kitchen">Kwizin</option>
                          <option value="organization">Òganizasyon</option>
                          <option value="delivery">Livrezon</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-pp-deep mb-2">
                        Deskripsyon
                      </label>
                      <textarea
                        value={productFormData.description}
                        onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                        className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Pri Achte ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={productFormData.cost_price}
                          onChange={(e) => setProductFormData({...productFormData, cost_price: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Pri Vann ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={productFormData.selling_price}
                          onChange={(e) => setProductFormData({...productFormData, selling_price: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Stock Aktyèl
                        </label>
                        <input
                          type="number"
                          value={productFormData.current_stock}
                          onChange={(e) => setProductFormData({...productFormData, current_stock: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Stock Min
                        </label>
                        <input
                          type="number"
                          value={productFormData.min_stock_level}
                          onChange={(e) => setProductFormData({...productFormData, min_stock_level: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Stock Max
                        </label>
                        <input
                          type="number"
                          value={productFormData.max_stock_level}
                          onChange={(e) => setProductFormData({...productFormData, max_stock_level: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Fournisè
                        </label>
                        <input
                          type="text"
                          value={productFormData.supplier}
                          onChange={(e) => setProductFormData({...productFormData, supplier: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Kontak Fournisè
                        </label>
                        <input
                          type="text"
                          value={productFormData.supplier_contact}
                          onChange={(e) => setProductFormData({...productFormData, supplier_contact: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-pp-deep mb-2">
                        Nòt
                      </label>
                      <textarea
                        value={productFormData.notes}
                        onChange={(e) => setProductFormData({...productFormData, notes: e.target.value})}
                        className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                        rows={2}
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-pp-blue text-white py-3 rounded-xl font-semibold hover:bg-pp-deep transition-colors"
                      >
                        {editingProduct ? 'Modifye Pwodwi' : 'Ajoute Pwodwi'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProductForm(false)}
                        className="flex-1 bg-pp-gray text-pp-deep py-3 rounded-xl font-semibold hover:bg-pp-gray/80 transition-colors"
                      >
                        Anile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Job Positions Management Tab */}
        {activeTab === "job-positions" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-pp-deep">Jesyon Pozisyon Travay</h2>
              <button 
                onClick={() => {
                  setShowPositionForm(true);
                  setEditingPosition(null);
                  setPositionFormData({
                    position_id: '', title_ht: '', title_fr: '', description_ht: '', description_fr: '', 
                    requirements_ht: '', requirements_fr: '', is_active: true
                  });
                }}
                className="bg-pp-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-pp-deep transition-colors"
              >
                + Ajoute Nouvo Pozisyon
              </button>
            </div>
            
            <div className="space-y-4">
              {jobPositions.map(position => (
                <div key={position.id} className="border border-pp-gray rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-pp-deep mb-2">
                        {position.title_ht} / {position.title_fr}
                      </h3>
                      <p className="text-pp-deep/70 mb-4">{position.description_ht}</p>
                      <div>
                        <h4 className="font-semibold text-pp-deep mb-2">Kondisyon yo:</h4>
                        <ul className="list-disc list-inside text-pp-deep/70 space-y-1">
                          {position.requirements_ht?.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="ml-6 flex space-x-2">
                      <button 
                        onClick={() => {
                          setEditingPosition(position);
                          setPositionFormData(position);
                          setShowPositionForm(true);
                        }}
                        className="text-pp-blue hover:text-pp-deep text-sm"
                      >
                        Modifye
                      </button>
                      <button 
                        onClick={async () => {
                          const token = localStorage.getItem('admin_token');
                          try {
                            await fetch(`http://localhost:4000/api/admin/job-positions/${position.id}`, {
                              method: 'PUT',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({...position, is_active: !position.is_active}),
                            });
                            fetchJobPositions();
                          } catch (error) {
                            console.error('Error toggling position:', error);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        {position.is_active ? 'Deaktive' : 'Aktive'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Position Form Modal */}
            {showPositionForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-pp-deep">
                      {editingPosition ? 'Modifye Pozisyon' : 'Ajoute Nouvo Pozisyon'}
                    </h3>
                    <button
                      onClick={() => setShowPositionForm(false)}
                      className="text-pp-deep/70 hover:text-pp-deep text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handlePositionSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-pp-deep mb-2">
                        ID Pozisyon
                      </label>
                      <input
                        type="text"
                        value={positionFormData.position_id}
                        onChange={(e) => setPositionFormData({...positionFormData, position_id: e.target.value})}
                        className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                        placeholder="e.g. cleaner, kitchen_installer, delivery_driver"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Tit nan Kreyòl
                        </label>
                        <input
                          type="text"
                          value={positionFormData.title_ht}
                          onChange={(e) => setPositionFormData({...positionFormData, title_ht: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Titre en Français
                        </label>
                        <input
                          type="text"
                          value={positionFormData.title_fr}
                          onChange={(e) => setPositionFormData({...positionFormData, title_fr: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Deskripsyon nan Kreyòl
                        </label>
                        <textarea
                          value={positionFormData.description_ht}
                          onChange={(e) => setPositionFormData({...positionFormData, description_ht: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          rows={4}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Description en Français
                        </label>
                        <textarea
                          value={positionFormData.description_fr}
                          onChange={(e) => setPositionFormData({...positionFormData, description_fr: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Kondisyon yo nan Kreyòl
                        </label>
                        <textarea
                          value={positionFormData.requirements_ht}
                          onChange={(e) => setPositionFormData({...positionFormData, requirements_ht: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          rows={4}
                          placeholder="Chak kondisyon nan yon liy"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-pp-deep mb-2">
                          Exigences en Français
                        </label>
                        <textarea
                          value={positionFormData.requirements_fr}
                          onChange={(e) => setPositionFormData({...positionFormData, requirements_fr: e.target.value})}
                          className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                          rows={4}
                          placeholder="Chaque exigence sur une ligne"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={positionFormData.is_active}
                        onChange={(e) => setPositionFormData({...positionFormData, is_active: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="is_active" className="text-sm font-semibold text-pp-deep">
                        Pozisyon aktif
                      </label>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-pp-blue text-white py-3 rounded-xl font-semibold hover:bg-pp-deep transition-colors"
                      >
                        {editingPosition ? 'Modifye Pozisyon' : 'Ajoute Pozisyon'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPositionForm(false)}
                        className="flex-1 bg-pp-gray text-pp-deep py-3 rounded-xl font-semibold hover:bg-pp-gray/80 transition-colors"
                      >
                        Anile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Product Analytics */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-pp-deep mb-6">Analytics ak Rapò yo</h2>
              
              {/* Top Level Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold">{productAnalytics.profitAnalysis?.length || 0}</div>
                  <div className="text-sm opacity-90">Total Pwodwi</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold">
                    ${productAnalytics.profitAnalysis?.reduce((sum, p) => sum + (parseFloat(p.total_revenue) || 0), 0).toFixed(0) || 0}
                  </div>
                  <div className="text-sm opacity-90">Total Vann</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold">
                    ${productAnalytics.profitAnalysis?.reduce((sum, p) => sum + (parseFloat(p.total_profit) || 0), 0).toFixed(0) || 0}
                  </div>
                  <div className="text-sm opacity-90">Total Pofit</div>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold">{productAnalytics.lowStockAlert?.length || 0}</div>
                  <div className="text-sm opacity-90">Stock Ba</div>
                </div>
              </div>

              {/* Low Stock Alerts */}
              {productAnalytics.lowStockAlert?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-pp-deep mb-4">🚨 Pwodwi ak Stock Ba</h3>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="grid gap-2">
                      {productAnalytics.lowStockAlert.slice(0, 5).map(product => (
                        <div key={product.id} className="flex justify-between items-center">
                          <span className="font-semibold text-red-800">{product.name}</span>
                          <span className="text-red-600">{product.current_stock} / {product.min_stock_level} min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Top Profitable Products */}
              {productAnalytics.topProfitable?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-pp-deep mb-4">💰 Pi Bon Pofit yo</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {productAnalytics.topProfitable.slice(0, 6).map(product => (
                      <div key={product.id} className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-green-800">{product.name}</div>
                            <div className="text-sm text-green-600">
                              ${product.cost_price} → ${product.selling_price}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-700">{product.profit_margin?.toFixed(1)}%</div>
                            <div className="text-sm text-green-600">${product.profit_amount?.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sales Performance */}
              {productAnalytics.profitAnalysis?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-pp-deep mb-4">📊 Pèfòmans Vann yo (30 jou ki sot pase yo)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-pp-gray">
                          <th className="text-left p-4 font-semibold text-pp-deep">Pwodwi</th>
                          <th className="text-left p-4 font-semibold text-pp-deep">Yo Vann</th>
                          <th className="text-left p-4 font-semibold text-pp-deep">Kòb Vann</th>
                          <th className="text-left p-4 font-semibold text-pp-deep">Pofit</th>
                          <th className="text-left p-4 font-semibold text-pp-deep">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productAnalytics.profitAnalysis.slice(0, 10).map(product => (
                          <tr key={product.id} className="border-b border-pp-gray/50 hover:bg-pp-gray/30">
                            <td className="p-4 font-semibold text-pp-deep">{product.name}</td>
                            <td className="p-4 text-pp-deep/70">{product.total_sold}</td>
                            <td className="p-4 text-pp-deep/70">${parseFloat(product.total_revenue || 0).toFixed(2)}</td>
                            <td className="p-4 text-green-600 font-semibold">
                              ${parseFloat(product.total_profit || 0).toFixed(2)}
                            </td>
                            <td className={`p-4 font-semibold ${
                              product.current_stock <= product.min_stock_level ? 'text-red-600' : 'text-pp-deep'
                            }`}>
                              {product.current_stock}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Website Analytics */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-pp-deep mb-4">🌐 Analytics Sit la</h3>
              {analytics.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-pp-gray">
                        <th className="text-left p-4 font-semibold text-pp-deep">Paj</th>
                        <th className="text-left p-4 font-semibold text-pp-deep">Vizitè</th>
                        <th className="text-left p-4 font-semibold text-pp-deep">Dat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.map(entry => (
                        <tr key={entry.id} className="border-b border-pp-gray/50 hover:bg-pp-gray/30">
                          <td className="p-4 font-semibold text-pp-deep">{entry.page_path}</td>
                          <td className="p-4 text-pp-deep/70">{entry.visitor_count}</td>
                          <td className="p-4 text-pp-deep/70">{new Date(entry.date_recorded).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-pp-deep/70">
                  Pa gen done analytics ankò.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-pp-deep mb-6">System Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-pp-deep mb-2">
                  Company Name
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
                    Contact Email
                  </label>
                  <input
                    type="email"
                    defaultValue="info@pipwop.com"
                    className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-pp-deep mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+509 1234 5678"
                    className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                  />
                </div>
              </div>

              <button className="bg-pp-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-pp-deep transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}