import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function ProductCarousel() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Sample products with more variety
  const sampleProducts = [
    {
      id: 1,
      name: i18n.language === 'fr' ? 'Détergent Liquide Premium' : 'Detèjan Likid Premium',
      description: i18n.language === 'fr' ? 'Le meilleur détergent pour toutes surfaces' : 'Detèjan ki pi bon pou tout sèvis yo',
      category: 'cleaning',
      selling_price: 75.00,
      total_sold: 150,
      image: '🧴'
    },
    {
      id: 2,
      name: i18n.language === 'fr' ? 'Cuisine PVC Moderne' : 'Kabinè Kwizin PVC Modèn',
      description: i18n.language === 'fr' ? 'Cuisine moderne design haut de gamme' : 'Kabinè kwizin ak design modèn ak kalite wo',
      category: 'kitchen',
      selling_price: 1200.00,
      total_sold: 25,
      image: '🏠'
    },
    {
      id: 3,
      name: i18n.language === 'fr' ? 'Savon Vaisselle Désinfectant' : 'Savon Plat Disinfektan',
      description: i18n.language === 'fr' ? 'Savon spécial pour nettoyer et désinfecter' : 'Savon espesyal pou netwaye ak disinfekte',
      category: 'cleaning', 
      selling_price: 45.00,
      total_sold: 200,
      image: '🧽'
    },
    {
      id: 4,
      name: i18n.language === 'fr' ? 'Organisateur Placard Premium' : 'Òganizè Closet Premium',
      description: i18n.language === 'fr' ? 'Système d\'organisation style et fonctionnel' : 'Sistèm òganizasyon ak style ak fonksyonalite',
      category: 'organization',
      selling_price: 350.00,
      total_sold: 75,
      image: '👔'
    },
    {
      id: 5,
      name: i18n.language === 'fr' ? 'Kit Nettoyage Complet' : 'Kit Netwayaj Konplè',
      description: i18n.language === 'fr' ? 'Tout ce dont vous avez besoin pour nettoyer' : 'Tout bagay ou bezwen pou netwaye kay la',
      category: 'cleaning',
      selling_price: 95.00,
      total_sold: 120,
      image: '🧹'
    },
    {
      id: 6,
      name: i18n.language === 'fr' ? 'Étagères Modulaires' : 'Etajè Modilè',
      description: i18n.language === 'fr' ? 'Étagères adaptables pour tous espaces' : 'Etajè ki ka adapte nan tout kote',
      category: 'organization',
      selling_price: 180.00,
      total_sold: 90,
      image: '📚'
    }
  ];

  useEffect(() => {
    fetchBestSellers();
  }, []);

  useEffect(() => {
    if (products.length > 1 && !isPaused) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }, 3000); // Change slide every 3 seconds
      return () => clearInterval(timer);
    }
  }, [products.length, isPaused]);

  const fetchBestSellers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products/best-sellers');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products data:', data);
        if (data.length > 0) {
          const productsWithImages = data.map(product => ({
            ...product,
            image: getCategoryIcon(product.category)
          }));
          console.log('Products with images:', productsWithImages);
          setProducts(productsWithImages);
        } else {
          console.log('No products returned, using sample data');
          setProducts(sampleProducts);
        }
      } else {
        setProducts(sampleProducts);
      }
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      setProducts(sampleProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'cleaning': return '🧴';
      case 'kitchen': return '🏠';
      case 'organization': return '👔';
      case 'delivery': return '🚚';
      default: return '📦';
    }
  };

  const getCategoryName = (category) => {
    const categories = {
      cleaning: i18n.language === 'fr' ? 'Nettoyage' : 'Netwayaj',
      kitchen: i18n.language === 'fr' ? 'Cuisine' : 'Kwizin', 
      organization: i18n.language === 'fr' ? 'Organisation' : 'Òganizasyon',
      delivery: i18n.language === 'fr' ? 'Livraison' : 'Livrezon'
    };
    return categories[category] || category;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse">
            <div className="w-12 h-12 bg-white/20 rounded-full mb-4"></div>
            <div className="w-3/4 h-4 bg-white/20 rounded mb-2"></div>
            <div className="w-full h-3 bg-white/20 rounded mb-4"></div>
            <div className="w-1/2 h-6 bg-white/20 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-white/70">
        <p>{i18n.language === 'fr' ? 'Aucun produit trouvé' : 'Pa gen pwodwi yo jwenn'}</p>
      </div>
    );
  }

  const slidesToShow = 4;
  const totalSlides = Math.ceil(products.length / slidesToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const currentProduct = products[currentIndex];

  return (
    <div className="relative">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          🏆 {i18n.language === 'fr' ? 'Nos Meilleurs Produits' : 'Pi bon Pwodwi Nou Yo'}
        </h3>
        <p className="text-white/70">
          {i18n.language === 'fr' ? 'Découvrez nos meilleures ventes avec prix' : 'Dekouvri pi bon vant nou yo ak pri'}
        </p>
      </div>

      {/* Main Carousel */}
      <div 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/20 min-h-[400px] flex items-center cursor-pointer hover:from-white/10 hover:to-white/15 transition-all duration-300"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => navigate('/products')}
      >
        {/* Single Product Display */}
        {currentProduct ? (
          <div className="w-full px-4 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
              
              {/* Product Image/Icon */}
              <div className="flex-shrink-0">
                <div className="w-36 h-36 lg:w-44 lg:h-44 bg-gradient-to-br from-pp-sky/20 to-pp-blue/20 rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                  <span className="text-6xl lg:text-8xl">{currentProduct.image}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 text-center max-w-3xl">
                <div className="mb-4">
                  {currentProduct.total_sold > 50 && (
                    <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-pp-deep px-4 py-2 rounded-full text-sm font-bold mb-3">
                      ⭐ {i18n.language === 'fr' ? 'BESTSELLER' : 'PI BON VANT'} ⭐
                    </span>
                  )}
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {currentProduct.name}
                </h2>
                
                <p className="text-lg text-white/90 mb-6 leading-relaxed">
                  {currentProduct.description}
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  {/* Price */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30 min-w-[140px]">
                    <div className="text-sm text-white/70 mb-1">
                      {i18n.language === 'fr' ? 'Prix' : 'Pri'}
                    </div>
                    <div className="text-3xl font-bold text-pp-sky">
                      ${currentProduct.selling_price}
                    </div>
                  </div>

                  {/* Sales Stats */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30 min-w-[140px]">
                    <div className="text-sm text-white/70 mb-1">
                      {i18n.language === 'fr' ? 'Vendus' : 'Yo Vann'}
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {currentProduct.total_sold}+
                    </div>
                  </div>

                  {/* Category */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30 min-w-[140px]">
                    <div className="text-sm text-white/70 mb-1">
                      {i18n.language === 'fr' ? 'Catégorie' : 'Kategori'}
                    </div>
                    <div className="text-lg font-semibold text-white capitalize">
                      {getCategoryName(currentProduct.category)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full px-4 py-8 text-center">
            <div className="text-white/70">
              <p>{i18n.language === 'fr' ? 'Chargement des produits...' : 'Ap chaje pwodwi yo...'}</p>
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-8 space-x-3">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-pp-sky scale-125 shadow-lg' 
                : 'bg-white/40 hover:bg-white/60 hover:scale-110'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 bg-white/20 rounded-full h-1 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-pp-sky to-pp-blue h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / products.length) * 100}%` }}
        />
      </div>
    </div>
  );
}