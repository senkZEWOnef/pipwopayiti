import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const PRODUCT_DATA_HT = [
  { id: 1, name: "Detèjan Likid Premium", category: "cleaning", price: "$8.99", rating: 4.8, image: "🧴", description: "Detèjan ki efikas pou machin ak men", inStock: true },
  { id: 2, name: "Savon Plat Ultra", category: "cleaning", price: "$3.49", rating: 4.9, image: "🧽", description: "Savon ki koupe grès ak sal", inStock: true },
  { id: 3, name: "Netwayan Multi-Sifas", category: "cleaning", price: "$5.99", rating: 4.7, image: "🧼", description: "Bon pou kwizin ak biwo", inStock: false },
  { id: 4, name: "Kwizin Modèn PVC", category: "kitchen", price: "$1,200", rating: 4.9, image: "🏠", description: "Kwizin konplè ak kabinè ak comptoir", inStock: true },
  { id: 5, name: "Vanity Banyè", category: "kitchen", price: "$450", rating: 4.6, image: "🚿", description: "Vanity ak glasi ak tiroir", inStock: true },
  { id: 6, name: "Closet Organiser", category: "closets", price: "$350", rating: 4.8, image: "👔", description: "Sistèm òganizasyon pou rad", inStock: true },
  { id: 7, name: "Gadrob Walk-in", category: "closets", price: "$800", rating: 4.9, image: "🏘️", description: "Gadrob konplè ak limyè", inStock: true },
  { id: 8, name: "Panel Solè 100W", category: "electronics", price: "$120", rating: 4.7, image: "☀️", description: "Panel solè ki bon pou lakay ak biznisè", inStock: true },
  { id: 9, name: "Batri Solè 12V", category: "electronics", price: "$85", rating: 4.8, image: "🔋", description: "Batri ki ka rechaje pou sistèm solè", inStock: true },
  { id: 10, name: "Pwotèj Telefòn", category: "electronics", price: "$15", rating: 4.6, image: "📱", description: "Kèk ak pwotèj ekran pou telefòn", inStock: true },
  { id: 11, name: "Chajè san Fil", category: "electronics", price: "$25", rating: 4.9, image: "⚡", description: "Chajè rapid san fil pou telefòn ak tablèt", inStock: true },
  { id: 12, name: "Sistèm Solè Konplè", category: "electronics", price: "$450", rating: 4.9, image: "🏡", description: "Sistèm solè konplè ak panel, batri ak envertè", inStock: true },
  { id: 13, name: "Prodwi Jeneral", category: "other", price: "$25", rating: 4.5, image: "📦", description: "Lòt pwodwi ak sèvis", inStock: true }
];

const PRODUCT_DATA_FR = [
  { id: 1, name: "Détergent Liquide Premium", category: "cleaning", price: "$8.99", rating: 4.8, image: "🧴", description: "Détergent efficace pour machine et main", inStock: true },
  { id: 2, name: "Savon Vaisselle Ultra", category: "cleaning", price: "$3.49", rating: 4.9, image: "🧽", description: "Savon qui coupe la graisse et la saleté", inStock: true },
  { id: 3, name: "Nettoyant Multi-Surfaces", category: "cleaning", price: "$5.99", rating: 4.7, image: "🧼", description: "Bon pour cuisine et bureau", inStock: false },
  { id: 4, name: "Cuisine Moderne PVC", category: "kitchen", price: "$1,200", rating: 4.9, image: "🏠", description: "Cuisine complète avec armoires et comptoir", inStock: true },
  { id: 5, name: "Vanité de Salle de Bain", category: "kitchen", price: "$450", rating: 4.6, image: "🚿", description: "Vanité avec miroir et tiroirs", inStock: true },
  { id: 6, name: "Organisateur de Placard", category: "closets", price: "$350", rating: 4.8, image: "👔", description: "Système d'organisation pour vêtements", inStock: true },
  { id: 7, name: "Garde-robe Walk-in", category: "closets", price: "$800", rating: 4.9, image: "🏘️", description: "Garde-robe complète avec éclairage", inStock: true },
  { id: 8, name: "Panneau Solaire 100W", category: "electronics", price: "$120", rating: 4.7, image: "☀️", description: "Panneau solaire idéal pour maison et entreprise", inStock: true },
  { id: 9, name: "Batterie Solaire 12V", category: "electronics", price: "$85", rating: 4.8, image: "🔋", description: "Batterie rechargeable pour système solaire", inStock: true },
  { id: 10, name: "Protection Téléphone", category: "electronics", price: "$15", rating: 4.6, image: "📱", description: "Coque et protection d'écran pour téléphone", inStock: true },
  { id: 11, name: "Chargeur sans Fil", category: "electronics", price: "$25", rating: 4.9, image: "⚡", description: "Chargeur rapide sans fil pour téléphone et tablette", inStock: true },
  { id: 12, name: "Système Solaire Complet", category: "electronics", price: "$450", rating: 4.9, image: "🏡", description: "Système solaire complet avec panneaux, batterie et onduleur", inStock: true },
  { id: 13, name: "Produits Généraux", category: "other", price: "$25", rating: 4.5, image: "📦", description: "Autres produits et services", inStock: true }
];

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  
  // Get products based on current language
  const PRODUCT_DATA = i18n.language === 'fr' ? PRODUCT_DATA_FR : PRODUCT_DATA_HT;
  
  const CATEGORIES = [
    { id: "all", name: t('products.allProducts'), count: PRODUCT_DATA.length },
    { id: "cleaning", name: t('products.cleaningProducts'), count: PRODUCT_DATA.filter(p => p.category === "cleaning").length },
    { id: "kitchen", name: t('products.kitchensVanities'), count: PRODUCT_DATA.filter(p => p.category === "kitchen").length },
    { id: "closets", name: t('products.closetsWardrobes'), count: PRODUCT_DATA.filter(p => p.category === "closets").length },
    { id: "electronics", name: t('products.electronics'), count: PRODUCT_DATA.filter(p => p.category === "electronics").length },
    { id: "other", name: t('products.other'), count: PRODUCT_DATA.filter(p => p.category === "other").length }
  ];
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState("name");
  const [showInStock, setShowInStock] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = PRODUCT_DATA.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const price = parseFloat(product.price.replace(/[$,]/g, ""));
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const matchesStock = !showInStock || product.inStock;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesStock && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price.replace(/[$,]/g, "")) - parseFloat(b.price.replace(/[$,]/g, ""));
      case "price-high":
        return parseFloat(b.price.replace(/[$,]/g, "")) - parseFloat(a.price.replace(/[$,]/g, ""));
      case "rating":
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-pp-gray dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-br from-pp-navy via-pp-deep to-pp-blue dark:from-dark-surface dark:via-dark-card dark:to-dark-surface text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">{t('products.title')}</h1>
            <p className="text-xl text-white/90 leading-relaxed animate-slide-up">
              {t('products.subtitle')}
            </p>
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <span className="text-white/80">🎯</span>
                <span className="text-sm text-white/90">
                  {i18n.language === 'fr' ? 'Produits de qualité pour l\'avenir d\'Haïti' : 'Pwodwi kalite pou lavni Ayiti'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft-card dark:shadow-dark-card sticky top-6 space-y-6 border border-transparent dark:border-dark-border">
              
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-pp-deep dark:text-dark-text mb-2">
                  {t('products.search')}
                </label>
                <input
                  type="text"
                  placeholder={t('products.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-pp-gray dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface text-pp-deep dark:text-dark-text focus:ring-2 focus:ring-pp-blue dark:focus:ring-dark-accent-blue focus:border-transparent transition-colors"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-pp-deep dark:text-dark-text mb-4">{t('products.categories')}</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedCategory === category.id
                          ? "bg-pp-blue dark:bg-dark-accent-blue text-white"
                          : "text-pp-deep dark:text-dark-text hover:bg-pp-gray dark:hover:bg-dark-surface"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm opacity-70">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold text-pp-deep dark:text-dark-text mb-4">{t('products.price')}</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-pp-blue dark:accent-dark-accent-blue"
                  />
                  <div className="flex justify-between text-sm text-pp-deep/70 dark:text-dark-text-secondary">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={showInStock}
                    onChange={(e) => setShowInStock(e.target.checked)}
                    className="w-4 h-4 text-pp-blue bg-gray-100 border-gray-300 rounded focus:ring-pp-blue focus:ring-2"
                  />
                  <span className="text-sm text-pp-deep dark:text-dark-text">{t('products.stockOnly')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-8 bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm dark:shadow-dark-card border border-transparent dark:border-dark-border">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-pp-blue dark:bg-dark-accent-blue rounded-full animate-pulse"></div>
                <p className="text-pp-deep dark:text-dark-text">
                  <span className="font-bold text-lg">{filteredProducts.length}</span> 
                  <span className="text-pp-deep/70 dark:text-dark-text-secondary ml-2">{t('products.resultsFound')}</span>
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-pp-gray dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-pp-deep dark:text-dark-text focus:ring-2 focus:ring-pp-blue dark:focus:ring-dark-accent-blue focus:border-transparent transition-colors"
              >
                <option value="name">{t('products.sortByName')}</option>
                <option value="price-low">{t('products.sortByPriceLow')}</option>
                <option value="price-high">{t('products.sortByPriceHigh')}</option>
                <option value="rating">{t('products.sortByRating')}</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-soft-card dark:shadow-dark-card hover:shadow-glow dark:hover:shadow-glow transition-all duration-500 hover:scale-105 border border-transparent dark:border-dark-border hover:border-pp-blue/20 dark:hover:border-dark-accent-blue/20 animate-fade-in">
                  
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-pp-gray via-pp-gray/50 to-pp-sky/10 dark:from-dark-surface dark:via-dark-surface/50 dark:to-dark-accent-blue/10 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent dark:from-black/30"></div>
                    <span className="relative z-10 drop-shadow-lg group-hover:animate-pulse-slow">
                      {product.image}
                    </span>
                    {/* Floating stock indicator */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border ${
                        product.inStock 
                          ? "bg-green-500/90 text-white border-green-400/50 shadow-lg"
                          : "bg-red-500/90 text-white border-red-400/50"
                      }`}>
                        {product.inStock ? '✓' : '✕'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pp-blue/10 dark:bg-dark-accent-blue/20 text-pp-blue dark:text-dark-accent-blue border border-pp-blue/20 dark:border-dark-accent-blue/30">
                        {product.category === 'electronics' ? `⚡ ${t('products.electronics')}` : 
                         product.category === 'cleaning' ? `🧽 ${t('products.cleaningProducts')}` :
                         product.category === 'kitchen' ? `🏠 ${t('products.kitchensVanities')}` :
                         product.category === 'closets' ? `👔 ${t('products.closetsWardrobes')}` : `📦 ${t('products.other')}`}
                      </span>
                    </div>
                    
                    {/* Product Info */}
                    <h3 className="font-bold text-pp-deep dark:text-dark-text text-lg mb-2 group-hover:text-pp-blue dark:group-hover:text-dark-accent-blue transition-colors">{product.name}</h3>
                    <p className="text-pp-deep/70 dark:text-dark-text-secondary text-sm mb-4 line-clamp-2">{product.description}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm transition-all duration-300 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-pp-deep/70 dark:text-dark-text-secondary font-medium">({product.rating})</span>
                      </div>
                      
                      {/* Stock status */}
                      <span className={`text-xs font-semibold ${
                        product.inStock 
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {product.inStock ? t('products.inStock') : t('products.outOfStock')}
                      </span>
                    </div>
                    
                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-pp-gray/30 dark:border-dark-border">
                      <div>
                        <div className="text-2xl font-bold text-pp-blue dark:text-dark-accent-blue">
                          {product.price}
                        </div>
                        <div className="text-xs text-pp-deep/50 dark:text-dark-text-secondary">
                          USD
                        </div>
                      </div>
                      <button 
                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                          product.inStock
                            ? "bg-gradient-to-r from-pp-blue to-pp-deep dark:from-dark-accent-blue dark:to-blue-600 text-white hover:shadow-lg hover:scale-105 hover:from-pp-deep hover:to-pp-blue"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? (
                          <span className="flex items-center space-x-2">
                            <span>🛒</span>
                            <span>{t('products.add')}</span>
                          </span>
                        ) : t('products.notAvailable')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <div className="bg-white dark:bg-dark-card rounded-2xl p-12 shadow-soft-card dark:shadow-dark-card border border-transparent dark:border-dark-border">
                  <div className="text-8xl mb-6 animate-pulse">🔍</div>
                  <h3 className="text-2xl font-bold text-pp-deep dark:text-dark-text mb-4">
                    {t('products.noResults')}
                  </h3>
                  <p className="text-pp-deep/70 dark:text-dark-text-secondary text-lg max-w-md mx-auto">
                    {t('products.noResultsDesc')}
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchTerm("");
                      setShowInStock(false);
                      setPriceRange([0, 2000]);
                    }}
                    className="mt-6 bg-pp-blue dark:bg-dark-accent-blue text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    🔄 {t('products.resetFilters')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}