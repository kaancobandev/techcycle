import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, Menu, X, Plus, Minus, Trash2, Star, Zap, Shield, Truck } from 'lucide-react';


// --- SAHTE VERİ (MOCK DATA) ---
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "AstroPhone 15 Pro Max",
    category: "Telefonlar",
    price: 64999,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800",
    description: "Yeni nesil işlemci ve titanyum kasa ile sınırları zorlayın.",
    badge: "Yeni"
  },
  {
    id: 2,
    name: "GamerBook Xtreme 16",
    category: "Bilgisayarlar",
    price: 45000,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800",
    description: "RTX 4080 ekran kartı ile oyunlarda maksimum performans.",
    badge: "Çok Satan"
  },
  {
    id: 3,
    name: "SonicBuds Pro ANC",
    category: "Aksesuarlar",
    price: 4599,
    rating: 4.5,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800",
    description: "Aktif gürültü engelleme teknolojisiyle sadece müziğe odaklanın.",
    badge: null
  },
  {
    id: 4,
    name: "SmartWatch Ultra X",
    category: "Giyilebilir",
    price: 12500,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=800",
    description: "Titanyum gövde ve 3 haftaya varan pil ömrü.",
    badge: "İndirim"
  },
  {
    id: 5,
    name: "UltraVision 65\" 4K OLED TV",
    category: "Ev Elektroniği",
    price: 52000,
    rating: 4.6,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
    description: "Gerçek siyahlar ve kusursuz renklerle sinema evinizde.",
    badge: null
  },
  {
    id: 6,
    name: "PowerBrick 20000mAh",
    category: "Aksesuarlar",
    price: 1299,
    rating: 4.3,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=800",
    description: "Hızlı şarj destekli yüksek kapasiteli taşınabilir batarya.",
    badge: null
  },
  {
    id: 7,
    name: "AstroTab 11\" Pro",
    category: "Bilgisayarlar",
    price: 24500,
    rating: 4.8,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800",
    description: "Çizim yapmak ve ofis işleri için mükemmel tablet.",
    badge: null
  },
  {
    id: 8,
    name: "FotoMaster Z7",
    category: "Ev Elektroniği",
    price: 78000,
    rating: 4.9,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    description: "Tam kare (full-frame) aynasız kamera ile profesyonel çekimler.",
    badge: "Profesyonel"
  }
];

const CATEGORIES = ["Tümü", "Telefonlar", "Bilgisayarlar", "Giyilebilir", "Aksesuarlar", "Ev Elektroniği"];

// --- ANA BİLEŞEN ---
export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  // --- SEPET İŞLEMLERİ ---
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Sepete ekleyince sepeti aç
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // --- FİLTRELEME İŞLEMLERİ ---
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === "Tümü" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // --- PARA BİRİMİ FORMATI ---
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <div className="bg-indigo-600 text-white p-2 rounded-lg mr-2">
                <Zap className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-indigo-950">Astro<span className="text-indigo-600">Tech</span></span>
            </div>

            {/* Masaüstü Arama Çubuğu */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="Ürün, kategori veya marka ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Sağ Menü İkonları */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button 
                className="md:hidden p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobil Menü (Arama çubuğu) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4">
             <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
          </div>
        )}
      </nav>

      {/* SEPET SİDEBAR (DRAWER) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md transform transition-transform ease-in-out duration-300 shadow-2xl bg-white flex flex-col h-full">
              
              {/* Sepet Başlık */}
              <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-xl font-bold text-gray-900">Alışveriş Sepeti</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Sepet İçeriği */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <ShoppingCart className="h-16 w-16 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Sepetiniz şu an boş.</p>
                    <p className="text-sm mt-1">Hemen harika ürünleri keşfetmeye başlayın!</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition"
                    >
                      Alışverişe Dön
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {cart.map((item) => (
                      <li key={item.id} className="flex py-2">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3 className="line-clamp-2 leading-tight pr-4">{item.name}</h3>
                              <p className="ml-4 whitespace-nowrap text-indigo-600">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-200 rounded-l-lg transition">
                                <Minus className="h-4 w-4 text-gray-600" />
                              </button>
                              <span className="px-3 text-sm font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-200 rounded-r-lg transition">
                                <Plus className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="font-medium text-red-500 hover:text-red-700 p-1 flex items-center"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sepet Alt Kısım (Toplam ve Checkout) */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
                  <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
                    <p>Ara Toplam</p>
                    <p>{formatPrice(cartTotal)}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">Kargo ve vergiler ödeme adımında hesaplanacaktır.</p>
                  <button className="w-full flex items-center justify-center rounded-xl border border-transparent bg-indigo-600 px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all">
                    Güvenli Ödeme Yap
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ANA İÇERİK */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Banner */}
        {!searchQuery && selectedCategory === "Tümü" && (
          <div className="relative rounded-2xl overflow-hidden bg-indigo-900 text-white mb-12 shadow-xl">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=2000" 
                alt="Hero Background" 
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              />
            </div>
            <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col items-start max-w-2xl">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-500 text-white mb-4">
                Bahar İndirimi %20'ye Varan Avantajlar
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Geleceğin Teknolojisi, Bugün Sizinle.
              </h1>
              <p className="text-lg text-indigo-100 mb-8 max-w-lg">
                En yeni akıllı telefonlar, güçlü dizüstü bilgisayarlar ve giyilebilir teknolojilerde benzersiz fırsatları keşfedin.
              </p>
              <button 
                onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Ürünleri Keşfet
              </button>
            </div>
          </div>
        )}

        {/* Bilgi Kartları */}
        {!searchQuery && selectedCategory === "Tümü" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Ücretsiz Kargo</h3>
                <p className="text-sm text-gray-500">1000 TL üzeri siparişlerde</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">2 Yıl Garanti</h3>
                <p className="text-sm text-gray-500">Tüm elektronik ürünlerde</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hızlı Teslimat</h3>
                <p className="text-sm text-gray-500">Aynı gün kargoya teslim</p>
              </div>
            </div>
          </div>
        )}

        {/* Ürünler Bölümü */}
        <div id="products-section">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `"${searchQuery}" için sonuçlar` : selectedCategory === "Tümü" ? "Popüler Ürünler" : selectedCategory}
            </h2>
            
            {/* Kategori Filtreleri */}
            <div className="flex overflow-x-auto hide-scrollbar space-x-2 pb-2 md:pb-0">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchQuery(""); // Kategori değiştiğinde aramayı temizle
                  }}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Ürün Izgarası */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-gray-400 mb-4 flex justify-center">
                <Search className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Ürün bulunamadı</h3>
              <p className="text-gray-500 mt-2">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Tümü");
                }}
                className="mt-4 text-indigo-600 font-medium hover:underline"
              >
                Tüm ürünleri göster
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group">
                  {/* Resim Alanı */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100 p-4">
                    {product.badge && (
                      <span className="absolute top-4 left-4 z-10 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {product.badge}
                      </span>
                    )}
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Ürün Detayları */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs text-gray-500 mb-1 font-medium tracking-wide uppercase">{product.category}</div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                    
                    {/* Yıldızlar */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-bold text-gray-700">{product.rating}</span>
                      </div>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{product.reviews} Değerlendirme</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{product.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        title="Sepete Ekle"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                 <div className="bg-indigo-600 text-white p-1.5 rounded-lg mr-2">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">Astro<span className="text-indigo-400">Tech</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                En yeni ve en kaliteli elektronik ürünleri uygun fiyatlarla size ulaştırıyoruz. Teknoloji alışverişinin güvenilir adresi.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Kategoriler</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {CATEGORIES.filter(c => c !== "Tümü").map(cat => (
                  <li key={cat}><a href="#" className="hover:text-indigo-400 transition">{cat}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Müşteri Hizmetleri</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-indigo-400 transition">Sıkça Sorulan Sorular</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Kargo ve Teslimat</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">İade Koşulları</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Garanti Kapsamı</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Bize Ulaşın</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Bültene Katılın</h4>
              <p className="text-gray-400 text-sm mb-4">Yeni ürünlerden ve indirimlerden anında haberdar olun.</p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="E-posta adresiniz" 
                  className="px-4 py-2 w-full rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="bg-indigo-600 px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition font-medium">
                  Abone Ol
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2026 AstroTech Elektronik A.Ş. Tüm Hakları Saklıdır.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Gizlilik Politikası</a>
              <a href="#" className="hover:text-white transition">Kullanım Şartları</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}