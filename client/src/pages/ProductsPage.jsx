import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const PRODUCT_DATA_HT = [
  { id: 1, name: "Detèjan Likid Premium", category: "cleaning", price: "$8.99", rating: 4.8, image: "🧴", description: "Detèjan ki efikas pou machin ak men", inStock: true },
  { id: 2, name: "Savon Plat Ultra", category: "cleaning", price: "$3.49", rating: 4.9, image: "🧽", description: "Savon ki koupe grès ak sal", inStock: true },
  { id: 3, name: "Netwayan Multi-Sifas", category: "cleaning", price: "$5.99", rating: 4.7, image: "🧼", description: "Bon pou kwizin ak biwo", inStock: false },
  { id: 4, name: "Kwizin Modèn PVC", category: "kitchen", price: "$1,200", rating: 4.9, image: "🏠", description: "Kwizin konplè ak kabinè ak comptoir", inStock: true },
  { id: 5, name: "Vanity Banyè", category: "kitchen", price: "$450", rating: 4.6, image: "🚿", description: "Vanity ak mirror ak tiroir", inStock: true },
  { id: 6, name: "Closet Organiser", category: "closets", price: "$350", rating: 4.8, image: "👔", description: "Sistèm òganizasyon pou rad", inStock: true },
  { id: 7, name: "Gadrob Walk-in", category: "closets", price: "$800", rating: 4.9, image: "🏘️", description: "Gadrob konplè ak éclairage", inStock: true },
  { id: 8, name: "Prodwi Jeneral", category: "other", price: "$25", rating: 4.5, image: "📦", description: "Lòt pwodwi ak sèvis", inStock: true }
];

const PRODUCT_DATA_FR = [
  { id: 1, name: "Détergent Liquide Premium", category: "cleaning", price: "$8.99", rating: 4.8, image: "🧴", description: "Détergent efficace pour machine et main", inStock: true },
  { id: 2, name: "Savon Vaisselle Ultra", category: "cleaning", price: "$3.49", rating: 4.9, image: "🧽", description: "Savon qui coupe la graisse et la saleté", inStock: true },
  { id: 3, name: "Nettoyant Multi-Surfaces", category: "cleaning", price: "$5.99", rating: 4.7, image: "🧼", description: "Bon pour cuisine et bureau", inStock: false },
  { id: 4, name: "Cuisine Moderne PVC", category: "kitchen", price: "$1,200", rating: 4.9, image: "🏠", description: "Cuisine complète avec armoires et comptoir", inStock: true },
  { id: 5, name: "Vanité de Salle de Bain", category: "kitchen", price: "$450", rating: 4.6, image: "🚿", description: "Vanité avec miroir et tiroirs", inStock: true },
  { id: 6, name: "Organisateur de Placard", category: "closets", price: "$350", rating: 4.8, image: "👔", description: "Système d'organisation pour vêtements", inStock: true },
  { id: 7, name: "Garde-robe Walk-in", category: "closets", price: "$800", rating: 4.9, image: "🏘️", description: "Garde-robe complète avec éclairage", inStock: true },
  { id: 8, name: "Produits Généraux", category: "other", price: "$25", rating: 4.5, image: "📦", description: "Autres produits et services", inStock: true }
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
    <div className="min-h-screen bg-pp-gray">
      {/* Header */}
      <div className="bg-pp-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">{t('products.title')}</h1>
          <p className="text-xl text-white/90">
            {t('products.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-soft-card sticky top-6 space-y-6">
              
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-pp-deep mb-2">
                  {t('products.search')}
                </label>
                <input
                  type="text"
                  placeholder={t('products.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-pp-gray rounded-xl focus:ring-2 focus:ring-pp-blue focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-pp-deep mb-4">{t('products.categories')}</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedCategory === category.id
                          ? "bg-pp-blue text-white"
                          : "text-pp-deep hover:bg-pp-gray"
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
                <h3 className="text-sm font-semibold text-pp-deep mb-4">{t('products.price')}</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-pp-blue"
                  />
                  <div className="flex justify-between text-sm text-pp-deep/70">
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
                  <span className="text-sm text-pp-deep">{t('products.stockOnly')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
              <p className="text-pp-deep">
                <span className="font-semibold">{filteredProducts.length}</span> {t('products.resultsFound')}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-pp-gray rounded-lg focus:ring-2 focus:ring-pp-blue focus:border-transparent"
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
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-soft-card hover:shadow-lg transition-all duration-300 hover:scale-105">
                  
                  {/* Product Image */}
                  <div className="h-48 bg-pp-gray flex items-center justify-center text-6xl">
                    {product.image}
                  </div>
                  
                  <div className="p-6">
                    {/* Stock Badge */}
                    <div className="mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.inStock 
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {product.inStock ? t('products.inStock') : t('products.outOfStock')}
                      </span>
                    </div>
                    
                    {/* Product Info */}
                    <h3 className="font-semibold text-pp-deep text-lg mb-2">{product.name}</h3>
                    <p className="text-pp-deep/70 text-sm mb-4">{product.description}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(product.rating) ? "★" : "☆"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-pp-deep/70">({product.rating})</span>
                    </div>
                    
                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-pp-blue">
                        {product.price}
                      </div>
                      <button 
                        className="bg-pp-blue text-white px-6 py-2 rounded-full hover:bg-pp-deep transition-colors duration-300 disabled:opacity-50"
                        disabled={!product.inStock}
                      >
                        {product.inStock ? t('products.add') : t('products.notAvailable')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-pp-deep mb-2">
                  {t('products.noResults')}
                </h3>
                <p className="text-pp-deep/70">
                  {t('products.noResultsDesc')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}