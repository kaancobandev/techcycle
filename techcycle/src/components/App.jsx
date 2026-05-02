import { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Plus, Minus, Trash2, Star, Smartphone, Laptop, Watch, Tablet, User, Users, Building2, ChevronLeft, Truck, Shield, Crown, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import HesapAbonelikler from './HesapAbonelikler';
import Pazar from './Pazar';
import Kiralama from './Kiralama';
import Odeme from './Odeme';
import SSS from './SSS';
import IadeKosullari from './IadeKosullari';
import SertifikaKapsami from './SertifikaKapsami';
import AcikArtirma from './AcikArtirma';
import { supabase } from '../lib/supabase';

// --- SAHTE VERİ (MOCK DATA) ---
const MOCK_PRODUCTS = [
  // ── iPHONE TELEFONLAR — her ürün benzersiz görsel ──────────────────────────
  { id: 1,  name: "Apple iPhone 16 Pro Max",    category: "Telefonlar",   price: 89999,  rating: 4.9, reviews: 312, badge: "YENİ",      image: "https://images.unsplash.com/photo-1726587912121-ea21fcc57ff8?auto=format&fit=crop&q=80&w=800", description: "6.9 inç ekran, A18 Pro çip ve titanyum kasa ile iPhone'un zirvesi." },
  { id: 2,  name: "Apple iPhone 16 Pro",        category: "Telefonlar",   price: 79999,  rating: 4.9, reviews: 287, badge: "YENİ",      image: "https://images.unsplash.com/photo-1726828537956-61ae115d7d7a?auto=format&fit=crop&q=80&w=800", description: "6.3 inç Super Retina XDR, A18 Pro çip ve Camera Control butonu." },
  { id: 3,  name: "Apple iPhone 16 Plus",       category: "Telefonlar",   price: 69999,  rating: 4.8, reviews: 198, badge: "YENİ",      image: "https://images.unsplash.com/photo-1726732946451-98690db97aae?auto=format&fit=crop&q=80&w=800", description: "6.7 inç büyük ekran ve A18 çip ile güçlü performans." },
  { id: 4,  name: "Apple iPhone 16",            category: "Telefonlar",   price: 59999,  rating: 4.8, reviews: 415, badge: "YENİ",      image: "https://images.unsplash.com/photo-1726828497839-5a9c238326b2?auto=format&fit=crop&q=80&w=800", description: "A18 çip ve Camera Control ile yeni nesil iPhone deneyimi." },
  { id: 5,  name: "Apple iPhone 15 Pro Max",    category: "Telefonlar",   price: 74999,  rating: 4.8, reviews: 524, badge: null,        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800", description: "Titanyum tasarım ve 5× optik zoom ile profesyonel fotoğrafçılık." },
  { id: 6,  name: "Apple iPhone 15 Pro",        category: "Telefonlar",   price: 64999,  rating: 4.8, reviews: 489, badge: null,        image: "https://images.unsplash.com/photo-1737190292587-603e3857876f?auto=format&fit=crop&q=80&w=800", description: "A17 Pro çip ve titanyum kasa ile üstün güç." },
  { id: 7,  name: "Apple iPhone 15",            category: "Telefonlar",   price: 44999,  rating: 4.7, reviews: 632, badge: "ÇOK SATAN", image: "https://images.unsplash.com/photo-1705037282052-f6b776980f8d?auto=format&fit=crop&q=80&w=800", description: "Dynamic Island ve 48 MP kamera ile ana seride yeni standart." },
  { id: 8,  name: "Apple iPhone 14 Pro Max",    category: "Telefonlar",   price: 59999,  rating: 4.7, reviews: 701, badge: "İNDİRİM",   image: "https://images.unsplash.com/photo-1632667827539-a54a9e0061a1?auto=format&fit=crop&q=80&w=800", description: "Always-On ekran ve A16 Bionic çip ile fark yaratan deneyim." },
  { id: 9,  name: "Apple iPhone 14 Plus",       category: "Telefonlar",   price: 39999,  rating: 4.6, reviews: 385, badge: "İNDİRİM",   image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800", description: "Büyük ekran ve uzun pil ömrüyle günlük kullanımda ideal." },
  { id: 10, name: "Apple iPhone 14",            category: "Telefonlar",   price: 34999,  rating: 4.6, reviews: 891, badge: null,        image: "https://images.unsplash.com/photo-1726839662758-e3b5da59b0fb?auto=format&fit=crop&q=80&w=800", description: "A15 Bionic çip ve güvenilir kamera sistemi ile güçlü değer." },

  // ── iPAD ──────────────────────────────────────────────────────────────────
  { id: 11, name: "Apple iPad Pro 13\" M4",     category: "Tabletler",    price: 79999,  rating: 4.9, reviews: 154, badge: "YENİ",      image: "https://images.unsplash.com/photo-1669691177924-f12fcc3cc540?auto=format&fit=crop&q=80&w=800", description: "Ultra ince OLED ekran ve M4 çip ile profesyonel tablet deneyimi." },
  { id: 12, name: "Apple iPad Pro 11\" M4",     category: "Tabletler",    price: 59999,  rating: 4.9, reviews: 189, badge: "YENİ",      image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80&w=800", description: "M4 çip gücü kompakt formda, Apple Pencil Pro desteği." },
  { id: 13, name: "Apple iPad Air 13\" M2",     category: "Tabletler",    price: 49999,  rating: 4.8, reviews: 212, badge: "YENİ",      image: "https://images.unsplash.com/photo-1630331528526-7d04c6eb463f?auto=format&fit=crop&q=80&w=800", description: "M2 çip ve geniş 13 inç ekranla yaratıcı işler için ideal." },
  { id: 14, name: "Apple iPad Air 11\" M2",     category: "Tabletler",    price: 39999,  rating: 4.8, reviews: 278, badge: null,        image: "https://images.unsplash.com/photo-1585790051609-09928c362a42?auto=format&fit=crop&q=80&w=800", description: "Hafif yapısı ve M2 çip ile her yerde verimli çalışın." },
  { id: 15, name: "Apple iPad mini 7",          category: "Tabletler",    price: 29999,  rating: 4.7, reviews: 198, badge: "YENİ",      image: "https://images.unsplash.com/photo-1648806030599-c963fd14a22f?auto=format&fit=crop&q=80&w=800", description: "Cep boyutunda güç, 8.3 inç Liquid Retina ekran." },
  { id: 16, name: "Apple iPad 10. Nesil",       category: "Tabletler",    price: 19999,  rating: 4.6, reviews: 445, badge: "ÇOK SATAN", image: "https://images.unsplash.com/photo-1607452258545-943d7243463c?auto=format&fit=crop&q=80&w=800", description: "USB-C, 10.9 inç ekran ve çok yönlü kullanım ile modern iPad." },

  // ── MacBook ────────────────────────────────────────────────────────────────
  { id: 17, name: "Apple MacBook Pro 16\" M4 Pro", category: "Bilgisayarlar", price: 149999, rating: 4.9, reviews: 98,  badge: "YENİ",      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800", description: "M4 Pro çip, Liquid Retina XDR ekran ve 24 saate varan pil ömrü." },
  { id: 18, name: "Apple MacBook Pro 14\" M4",  category: "Bilgisayarlar", price: 109999, rating: 4.9, reviews: 124, badge: "YENİ",      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800", description: "Kompakt MacBook Pro, M4 çip ile profesyonel iş akışları için." },
  { id: 19, name: "Apple MacBook Air 15\" M3",  category: "Bilgisayarlar", price: 79999,  rating: 4.8, reviews: 215, badge: null,        image: "https://images.unsplash.com/photo-1737947640001-54765a2b0287?auto=format&fit=crop&q=80&w=800", description: "Fan gerektirmeyen tasarım, M3 gücü ve büyük 15 inç ekran." },
  { id: 20, name: "Apple MacBook Air 13\" M3",  category: "Bilgisayarlar", price: 64999,  rating: 4.8, reviews: 312, badge: "ÇOK SATAN", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800", description: "En popüler MacBook, M3 çip ve ultra ince yapısıyla her yerde yanınızda." },

  // ── Apple Giyilebilir ──────────────────────────────────────────────────────
  { id: 21, name: "Apple Watch Ultra 2",        category: "Giyilebilir",  price: 39999,  rating: 4.9, reviews: 87,  badge: "YENİ",      image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=800", description: "Titanyum kasa ve 3000 nit parlaklık ile ekstrem koşullar için." },
  { id: 22, name: "Apple Watch Series 10 46mm", category: "Giyilebilir",  price: 24999,  rating: 4.8, reviews: 198, badge: "YENİ",      image: "https://images.unsplash.com/photo-1713056878930-c5604da9acfd?auto=format&fit=crop&q=80&w=800", description: "En ince Apple Watch, gelişmiş sağlık sensörleri ve geniş ekran." },
  { id: 23, name: "Apple Watch Series 10 42mm", category: "Giyilebilir",  price: 22999,  rating: 4.8, reviews: 165, badge: "YENİ",      image: "https://images.unsplash.com/photo-1679436204470-87dc7da1e8be?auto=format&fit=crop&q=80&w=800", description: "Kompakt boyutta tüm Series 10 özellikleri." },
  { id: 24, name: "Apple AirPods Pro 2. Nesil", category: "Giyilebilir",  price: 14999,  rating: 4.8, reviews: 542, badge: "ÇOK SATAN", image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?auto=format&fit=crop&q=80&w=800", description: "H2 çip ve aktif gürültü engelleme ile en iyi AirPods deneyimi." },
  { id: 25, name: "Apple AirPods 4",            category: "Giyilebilir",  price: 9999,   rating: 4.7, reviews: 387, badge: "YENİ",      image: "https://images.unsplash.com/photo-1571832975147-30ff45ad16e1?auto=format&fit=crop&q=80&w=800", description: "Yeniden tasarlanan AirPods, aktif gürültü engelleme ve H2 çip." },

  // ── Samsung Telefonlar — her ürün benzersiz görsel ─────────────────────────
  { id: 26, name: "Samsung Galaxy S25 Ultra",   category: "Telefonlar",   price: 84999,  rating: 4.9, reviews: 298, badge: "YENİ",      image: "https://images.unsplash.com/photo-1738830251513-a7bfef4b53c6?auto=format&fit=crop&q=80&w=800", description: "Snapdragon 8 Elite, S Pen ve 200 MP kamera ile Android zirvesi." },
  { id: 27, name: "Samsung Galaxy S25+",        category: "Telefonlar",   price: 69999,  rating: 4.8, reviews: 245, badge: "YENİ",      image: "https://images.unsplash.com/photo-1738830234395-a351829a1c7b?auto=format&fit=crop&q=80&w=800", description: "6.7 inç Dynamic AMOLED ve Snapdragon 8 Elite ile mükemmel denge." },
  { id: 28, name: "Samsung Galaxy S25",         category: "Telefonlar",   price: 54999,  rating: 4.8, reviews: 389, badge: "YENİ",      image: "https://images.unsplash.com/photo-1738830274216-20f63b8a0c02?auto=format&fit=crop&q=80&w=800", description: "Kompakt S25, Galaxy AI özellikleri ve üstün kamera kalitesiyle." },
  { id: 29, name: "Samsung Galaxy S24 Ultra",   category: "Telefonlar",   price: 74999,  rating: 4.8, reviews: 467, badge: "İNDİRİM",   image: "https://images.unsplash.com/photo-1738830246146-599b67d009db?auto=format&fit=crop&q=80&w=800", description: "Galaxy AI, S Pen ve titanyum kasa ile üstün akıllı telefon." },
  { id: 30, name: "Samsung Galaxy S24+",        category: "Telefonlar",   price: 59999,  rating: 4.7, reviews: 356, badge: "İNDİRİM",   image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&q=80&w=800", description: "Galaxy AI ve Snapdragon 8 Gen 3 ile güçlü S serisi deneyimi." },
  { id: 31, name: "Samsung Galaxy S24",         category: "Telefonlar",   price: 44999,  rating: 4.7, reviews: 521, badge: null,        image: "https://images.unsplash.com/photo-1704018453307-d563498b585b?auto=format&fit=crop&q=80&w=800", description: "AI fotoğrafçılık ve 7 yıl güncelleme garantisi." },
  { id: 32, name: "Samsung Galaxy Z Fold 6",    category: "Telefonlar",   price: 99999,  rating: 4.8, reviews: 134, badge: "YENİ",      image: "https://images.unsplash.com/photo-1568378711447-f5eef04d85b5?auto=format&fit=crop&q=80&w=800", description: "Galaxy AI ile güçlendirilmiş, ince katlanabilir akıllı telefon." },
  { id: 33, name: "Samsung Galaxy Z Flip 6",    category: "Telefonlar",   price: 59999,  rating: 4.7, reviews: 198, badge: "YENİ",      image: "https://images.unsplash.com/photo-1724149258788-d9cb3c888c0b?auto=format&fit=crop&q=80&w=800", description: "FlexWindow ile akıllı kullanım ve şık flip tasarım." },
  { id: 34, name: "Samsung Galaxy A55",         category: "Telefonlar",   price: 19999,  rating: 4.5, reviews: 687, badge: "ÇOK SATAN", image: "https://images.unsplash.com/photo-1591122947157-26bad3a117d2?auto=format&fit=crop&q=80&w=800", description: "50 MP kamera ve IP67 su direnci ile uygun fiyatlı orta sınıf." },
  { id: 35, name: "Samsung Galaxy A35",         category: "Telefonlar",   price: 14999,  rating: 4.4, reviews: 823, badge: null,        image: "https://images.unsplash.com/photo-1620490306292-81a9c5e6c70c?auto=format&fit=crop&q=80&w=800", description: "Geniş batarya ve çoklu kamera ile ekonomik seçenek." },

  // ── Samsung Tabletler ──────────────────────────────────────────────────────
  { id: 36, name: "Samsung Galaxy Tab S10 Ultra", category: "Tabletler",  price: 54999,  rating: 4.9, reviews: 112, badge: "YENİ",      image: "https://images.unsplash.com/photo-1654852360714-3899af1f5be7?auto=format&fit=crop&q=80&w=800", description: "14.6 inç AMOLED ekran ve Snapdragon 8 Gen 3 ile tablet zirvesi." },
  { id: 37, name: "Samsung Galaxy Tab S10+",    category: "Tabletler",    price: 44999,  rating: 4.8, reviews: 156, badge: "YENİ",      image: "https://images.unsplash.com/photo-1620288650879-20db0eb38c05?auto=format&fit=crop&q=80&w=800", description: "12.4 inç AMOLED ekran ve Galaxy AI ile premium tablet." },
  { id: 38, name: "Samsung Galaxy Tab S10",     category: "Tabletler",    price: 34999,  rating: 4.8, reviews: 198, badge: "YENİ",      image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&q=80&w=800", description: "11 inç Dinamik AMOLED 2X ve S Pen dahil." },
  { id: 39, name: "Samsung Galaxy Tab S9 FE",   category: "Tabletler",    price: 19999,  rating: 4.6, reviews: 287, badge: "ÇOK SATAN", image: "https://images.unsplash.com/photo-1661595676971-9c756771792a?auto=format&fit=crop&q=80&w=800", description: "S Pen dahil, IP68 ve geniş ekranla değer odaklı Galaxy Tab." },
  { id: 40, name: "Samsung Galaxy Tab A9+",     category: "Tabletler",    price: 12999,  rating: 4.4, reviews: 412, badge: null,        image: "https://images.unsplash.com/photo-1661595676830-2a0a1ccab283?auto=format&fit=crop&q=80&w=800", description: "11 inç ekran ve Dolby Atmos ses ile eğlence tableti." },

  // ── Samsung Bilgisayarlar ──────────────────────────────────────────────────
  { id: 41, name: "Samsung Galaxy Book4 Ultra",    category: "Bilgisayarlar", price: 84999,  rating: 4.8, reviews: 78,  badge: "YENİ", image: "https://images.unsplash.com/photo-1522202222206-b75023c48f4f?auto=format&fit=crop&q=80&w=800", description: "Intel Core Ultra 9 ve RTX 4070 ile üst segment Galaxy dizüstü." },
  { id: 42, name: "Samsung Galaxy Book4 Pro 16\"", category: "Bilgisayarlar", price: 64999,  rating: 4.7, reviews: 92,  badge: null,   image: "https://images.unsplash.com/photo-1652105425436-69c6ff3b77bd?auto=format&fit=crop&q=80&w=800", description: "16 inç AMOLED ekran ve Intel Core Ultra 7 ile profesyonel performans." },
  { id: 43, name: "Samsung Galaxy Book4 Pro 14\"", category: "Bilgisayarlar", price: 54999,  rating: 4.7, reviews: 108, badge: null,   image: "https://images.unsplash.com/photo-1706469980815-e2c54ace4560?auto=format&fit=crop&q=80&w=800", description: "Kompakt AMOLED dizüstü, Intel Core Ultra 5 ve uzun pil ömrü." },
  { id: 44, name: "Samsung Galaxy Book4 360 15\"", category: "Bilgisayarlar", price: 44999,  rating: 4.6, reviews: 134, badge: "YENİ", image: "https://images.unsplash.com/photo-1706469980850-8b8ec8da19fe?auto=format&fit=crop&q=80&w=800", description: "360° dönen ekran ve S Pen desteği ile 2-in-1 dizüstü." },
  { id: 45, name: "Samsung Galaxy Book4 360 13\"", category: "Bilgisayarlar", price: 34999,  rating: 4.5, reviews: 167, badge: null,   image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800", description: "İnce yapı, 360° ekran ve S Pen ile kompakt 2-in-1." },

  // ── Samsung Giyilebilir ────────────────────────────────────────────────────
  { id: 46, name: "Samsung Galaxy Watch Ultra",  category: "Giyilebilir", price: 29999,  rating: 4.8, reviews: 134, badge: "YENİ",      image: "https://images.unsplash.com/photo-1722153105551-cfea928e80de?auto=format&fit=crop&q=80&w=800", description: "Titanyum kasa ve 60 saate varan pil ömrüyle premium akıllı saat." },
  { id: 47, name: "Samsung Galaxy Watch 7 44mm", category: "Giyilebilir", price: 19999,  rating: 4.7, reviews: 245, badge: "YENİ",      image: "https://images.unsplash.com/photo-1722152909289-89d345b9c9a0?auto=format&fit=crop&q=80&w=800", description: "Gelişmiş sağlık izleme ve Galaxy AI ile akıllı saat deneyimi." },
  { id: 48, name: "Samsung Galaxy Watch 7 40mm", category: "Giyilebilir", price: 17999,  rating: 4.7, reviews: 198, badge: "YENİ",      image: "https://images.unsplash.com/photo-1553545204-4f7d339aa06a?auto=format&fit=crop&q=80&w=800", description: "Kompakt boyut, tam Galaxy Watch 7 özellikleri." },
  { id: 49, name: "Samsung Galaxy Buds3 Pro",    category: "Giyilebilir", price: 9999,   rating: 4.7, reviews: 312, badge: "YENİ",      image: "https://images.unsplash.com/photo-1618213520536-ce37aabcd9e5?auto=format&fit=crop&q=80&w=800", description: "Aktif gürültü engelleme ve 360 Ses ile premium kulaklık." },
  { id: 50, name: "Samsung Galaxy Buds3",        category: "Giyilebilir", price: 6999,   rating: 4.5, reviews: 487, badge: "ÇOK SATAN", image: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?auto=format&fit=crop&q=80&w=800", description: "Açık form faktörü ve temiz ses kalitesiyle günlük kulaklık." },
];

// CO2 tasarrufu (kg) — yeni üretim yerine mevcut cihaz kullanımıyla önlenen emisyon
const CO2_KG = {
  1:84,  2:80,  3:75,  4:70,  5:82,  6:78,  7:68,  8:79,  9:65,  10:62,
  11:130,12:110,13:118,14:98, 15:78, 16:88,
  17:420,18:360,19:310,20:280,
  21:52, 22:38, 23:35, 24:18, 25:14,
  26:85, 27:76, 28:70, 29:83, 30:74, 31:68, 32:90, 33:72, 34:55, 35:48,
  36:125,37:112,38:100,39:85, 40:72,
  41:395,42:340,43:300,44:265,45:230,
  46:48, 47:35, 48:32, 49:12, 50:10,
};
MOCK_PRODUCTS.forEach(p => { p.co2 = CO2_KG[p.id] ?? 50; });

const CATEGORIES = ["Tümü", "Telefonlar", "Tabletler", "Bilgisayarlar", "Giyilebilir"];


// --- ANA BİLEŞEN ---
export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedProduct, setSelectedProduct] = useState(null); // Seçilen ürünü tutar
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewsByProduct, setReviewsByProduct] = useState({});
  const [reviewForm, setReviewForm] = useState({ rating: 0, hoverRating: 0, name: '', comment: '' });

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiStep, setAiStep] = useState(1);
  const [aiForm, setAiForm] = useState({ device: '', age: '', income: '', usages: [], priorities: [] });
  const [aiResults, setAiResults] = useState([]);

  const fetchReviews = async (productId) => {
    const { data } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    if (data) {
      setReviewsByProduct(prev => ({
        ...prev,
        [productId]: data.map(r => ({
          id: r.id,
          name: r.name,
          rating: r.rating,
          comment: r.comment,
          user_id: r.user_id,
          date: new Date(r.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        })),
      }));
    }
  };

  useEffect(() => {
    setReviewForm({ rating: 0, hoverRating: 0, name: '', comment: '' });
    if (selectedProduct?.id) fetchReviews(selectedProduct.id);
  }, [selectedProduct?.id]);

  const [currentUser, setCurrentUser] = useState(null);
  const [currentSub, setCurrentSub] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => authListener.unsubscribe();
  }, []);

  const fetchCurrentSub = async () => {
    if (!currentUser) { setCurrentSub(null); return; }
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1);
    setCurrentSub(data?.[0] ?? null);
  };

  useEffect(() => {
    fetchCurrentSub();
  }, [currentUser?.id]);

  const handleCheckout = () => {
    if (!currentUser) {
      setIsCartOpen(false);
      setCurrentView('account');
      return;
    }
    setIsCartOpen(false);
    setCurrentView('odeme');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating || !reviewForm.name.trim() || !reviewForm.comment.trim()) return;
    await supabase.from('product_reviews').insert({
      product_id: selectedProduct.id,
      user_id: currentUser?.id ?? null,
      name: reviewForm.name.trim(),
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
    });
    setReviewForm({ rating: 0, hoverRating: 0, name: '', comment: '' });
    await fetchReviews(selectedProduct.id);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const updateQuantity = (id, delta) => setCart(prev => prev.map(item => {
    if (item.id === id) {
      const newQ = item.quantity + delta;
      return newQ > 0 ? { ...item, quantity: newQ } : item;
    }
    return item;
  }));

  const cartTotal = cart.reduce((t, item) => t + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((c, item) => c + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchCat = selectedCategory === "Tümü" || product.category === selectedCategory;
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Fiyat formatı görseldeki gibi (₺64.999,00)
  const formatPrice = (price) => {
    const formattedNumber = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
    return `₺${formattedNumber}`;
  };

  const tier = currentSub?.plan_type === 'elite' ? 'elite'
             : currentSub?.plan_type === 'pro' ? 'pro'
             : null;
  const isElite = tier === 'elite';
  const isPro = tier === 'pro';

  // Tema renkleri
  const cardHoverBorder = isElite ? 'hover:border-amber-300 hover:shadow-amber-50' : isPro ? 'hover:border-purple-200 hover:shadow-purple-50' : '';

  const AI_USAGES = [
    { id: 'gunluk',   label: 'Günlük Kullanım', emoji: '📱' },
    { id: 'is',       label: 'İş & Üretkenlik', emoji: '💼' },
    { id: 'ogrenci',  label: 'Öğrenci',          emoji: '🎓' },
    { id: 'oyun',     label: 'Oyun & Eğlence',   emoji: '🎮' },
    { id: 'fotograf', label: 'Fotoğrafçılık',    emoji: '📸' },
    { id: 'muzik',    label: 'Müzik & Podcast',  emoji: '🎵' },
    { id: 'seyahat',  label: 'Seyahat',           emoji: '✈️' },
    { id: 'saglik',   label: 'Sağlık & Spor',    emoji: '🏃' },
  ];

  const AI_PRIORITIES = [
    { id: 'kamera',     label: 'Kamera',        emoji: '📷' },
    { id: 'batarya',    label: 'Batarya',        emoji: '🔋' },
    { id: 'performans', label: 'Performans',     emoji: '⚡' },
    { id: 'tasarim',    label: 'Tasarım',        emoji: '✨' },
    { id: 'deger',      label: 'Fiyat / Değer',  emoji: '💎' },
    { id: 'ekran',      label: 'Ekran',          emoji: '🖥️' },
  ];

  const DEVICE_MAP = {
    telefon:    'Telefonlar',
    tablet:     'Tabletler',
    bilgisayar: 'Bilgisayarlar',
    giyilebilir:'Giyilebilir',
    kararsiz:   null,
  };

  const getAiRecommendations = () => {
    const age = parseInt(aiForm.age) || 25;
    const income = aiForm.income;
    const usages = aiForm.usages;
    const priorities = aiForm.priorities;
    const deviceCat = DEVICE_MAP[aiForm.device];

    const maxPrice = income === 'dusuk' ? 22000 : income === 'orta' ? 65000 : Infinity;

    const MAX_SCORE = 10;

    const scored = MOCK_PRODUCTS
      .filter(p => p.price <= maxPrice && (deviceCat ? p.category === deviceCat : true))
      .map(p => {
      let score = (p.rating - 4) * 0.5;

      // Kullanım amacı skorları
      if (usages.includes('oyun') && p.category === 'Bilgisayarlar') score += 3;
      if (usages.includes('oyun') && p.category === 'Telefonlar') score += 2;
      if (usages.includes('is') && p.category === 'Bilgisayarlar') score += 3;
      if (usages.includes('is') && p.category === 'Tabletler') score += 2;
      if (usages.includes('fotograf') && p.category === 'Telefonlar') score += 3;
      if (usages.includes('ogrenci') && p.category === 'Bilgisayarlar') score += 2;
      if (usages.includes('ogrenci') && p.category === 'Tabletler') score += 2;
      if (usages.includes('muzik') && p.category === 'Giyilebilir') score += 3;
      if (usages.includes('gunluk') && p.category === 'Telefonlar') score += 2;
      if (usages.includes('gunluk') && p.category === 'Giyilebilir') score += 1;
      if (usages.includes('seyahat') && p.category === 'Telefonlar') score += 1.5;
      if (usages.includes('seyahat') && p.category === 'Tabletler') score += 1;
      if (usages.includes('saglik') && p.category === 'Giyilebilir') score += 3;
      if (usages.includes('saglik') && p.category === 'Telefonlar') score += 1;

      // Öncelik skorları
      if (priorities.includes('kamera') && p.category === 'Telefonlar') score += 2;
      if (priorities.includes('kamera') && p.name.toLowerCase().includes('pro')) score += 1;
      if (priorities.includes('kamera') && p.name.toLowerCase().includes('ultra')) score += 1;
      if (priorities.includes('batarya') && p.category === 'Giyilebilir') score += 1;
      if (priorities.includes('batarya') && (p.name.includes('Plus') || p.name.includes('Ultra'))) score += 1;
      if (priorities.includes('performans') && (p.name.toLowerCase().includes('pro') || p.name.toLowerCase().includes('ultra'))) score += 2;
      if (priorities.includes('tasarim') && p.badge === 'YENİ') score += 1;
      if (priorities.includes('deger') && income === 'dusuk') score += (maxPrice - p.price) / maxPrice * 2;
      if (priorities.includes('deger') && p.badge === 'İNDİRİM') score += 1.5;
      if (priorities.includes('ekran') && p.category === 'Tabletler') score += 2;
      if (priorities.includes('ekran') && p.name.includes('Ultra')) score += 1;

      // Yaş faktörü
      if (age < 22 && p.badge === 'YENİ') score += 0.5;
      if (age < 22 && p.badge === 'ÇOK SATAN') score += 0.3;
      if (age >= 35 && p.category === 'Bilgisayarlar') score += 0.5;
      if (age >= 50) score += (p.rating - 4.5) * 2;

      // Uyum yüzdesi (0–100)
      const match = Math.min(100, Math.round((score / MAX_SCORE) * 100));

      // Neden önerildi etiketleri
      const reasons = [];
      if (priorities.includes('kamera') && p.category === 'Telefonlar') reasons.push('Kamera odaklı');
      if (priorities.includes('deger') && p.badge === 'İNDİRİM') reasons.push('İndirimli');
      if (priorities.includes('performans') && p.name.toLowerCase().includes('pro')) reasons.push('Yüksek performans');
      if (usages.includes('saglik') && p.category === 'Giyilebilir') reasons.push('Sağlık takibi');
      if (usages.includes('ogrenci') && p.category === 'Tabletler') reasons.push('Öğrenci dostu');
      if (usages.includes('is') && p.category === 'Bilgisayarlar') reasons.push('İş için ideal');
      if (usages.includes('muzik') && p.category === 'Giyilebilir') reasons.push('Ses kalitesi');
      if (usages.includes('oyun') && p.category === 'Bilgisayarlar') reasons.push('Oyun performansı');
      if (usages.includes('fotograf') && p.category === 'Telefonlar') reasons.push('Fotoğrafçılık');
      if (p.badge === 'ÇOK SATAN') reasons.push('Çok satan');
      if (p.badge === 'YENİ') reasons.push('En yeni model');

      return { ...p, score, match, reasons: reasons.slice(0, 2) };
    });

    if (deviceCat) {
      // Belirli kategori seçilmişse en iyi 3 ürünü göster
      return scored.sort((a, b) => b.score - a.score).slice(0, 3);
    }
    // Kararsızsa her kategoriden 1 tane
    const cats = ['Telefonlar', 'Tabletler', 'Giyilebilir', 'Bilgisayarlar'];
    return cats
      .map(cat => scored.filter(p => p.category === cat).sort((a, b) => b.score - a.score)[0])
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* NAVBAR */}
      <nav className={`border-b sticky top-0 z-40 transition-colors duration-500 ${isElite ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
        {tier && (
          <div className={`h-1 bg-gradient-to-r ${isElite ? 'from-amber-400 via-yellow-300 to-amber-500' : 'from-violet-500 to-purple-600'}`} />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* LOGO ALANI */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setCurrentView('home')}>
              <img src="/logo.png" alt="Mağaza Logo" className="h-10 w-auto" />
              <span className={`ml-2 text-xl font-bold ${isElite ? 'text-white' : 'text-gray-900'}`}>Tech Cycle</span>
            </div>

            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 ${isElite ? 'text-slate-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-full focus:ring-1 sm:text-sm ${isElite ? 'border-slate-600 bg-slate-800 text-white placeholder-slate-400 focus:ring-amber-500' : 'border-gray-300 bg-gray-50 focus:ring-indigo-500'}`}
                  placeholder="Ürün, kategori veya marka ara..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); if(currentView !== 'home') setCurrentView('home'); }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentView('pazar')}
                className={`hidden md:flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-xl ${
                  currentView === 'pazar'
                    ? (isElite ? 'text-amber-400 bg-amber-500/10' : 'text-indigo-600 bg-indigo-50')
                    : (isElite ? 'text-slate-300 hover:text-amber-400' : 'text-gray-600 hover:text-indigo-600')
                }`}
              >
                <Users className="h-4 w-4" />
                Pazar
              </button>

              <button
                onClick={() => setCurrentView('kiralama')}
                className={`hidden md:flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-xl ${
                  currentView === 'kiralama'
                    ? (isElite ? 'text-amber-400 bg-amber-500/10' : 'text-indigo-600 bg-indigo-50')
                    : (isElite ? 'text-slate-300 hover:text-amber-400' : 'text-gray-600 hover:text-indigo-600')
                }`}
              >
                <Building2 className="h-4 w-4" />
                Kiralama
              </button>

              {tier && (
                <button
                  onClick={() => setCurrentView('artirma')}
                  className={`hidden md:flex items-center gap-1.5 text-sm font-bold transition-all px-3 py-2 rounded-xl ${
                    currentView === 'artirma'
                      ? (isElite ? 'text-amber-400 bg-amber-500/10' : 'text-violet-600 bg-violet-50')
                      : (isElite ? 'text-amber-300 hover:text-amber-400' : 'text-violet-600 hover:bg-violet-50')
                  }`}
                >
                  <Crown className="h-4 w-4" />
                  Açık Arttırma
                </button>
              )}

              <button
                onClick={() => setCurrentView('account')}
                className={`hidden md:flex items-center space-x-2 transition-colors mr-2 ${
                  currentView === 'account'
                    ? (isElite ? 'text-amber-400' : isPro ? 'text-purple-600' : 'text-indigo-600')
                    : (isElite ? 'text-slate-300 hover:text-amber-400' : isPro ? 'text-gray-600 hover:text-purple-600' : 'text-gray-600 hover:text-indigo-600')
                }`}
              >
                <div className={`p-2 rounded-full ${
                  currentView === 'account'
                    ? (isElite ? 'bg-amber-500/20' : isPro ? 'bg-purple-100' : 'bg-indigo-100')
                    : (isElite ? 'bg-slate-700' : 'bg-gray-100')
                }`}><User className="h-5 w-5" /></div>
                <div className="text-left hidden lg:block">
                  <p className={`text-[11px] font-medium mb-0.5 ${isElite ? 'text-slate-400' : 'text-gray-500'}`}>
                    Merhaba, {currentUser ? (currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]) : 'Misafir'}
                  </p>
                  <p className="text-sm font-bold">Hesabım</p>
                </div>
              </button>

              {tier && (
                <div className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${isElite ? 'bg-amber-500 text-white' : 'bg-purple-600 text-white'}`}>
                  <Crown className="h-3 w-3" />
                  {isElite ? 'ELİT VIP' : 'PRO'}
                </div>
              )}

              <button onClick={() => setIsCartOpen(true)} className={`relative p-2 ${isElite ? 'text-slate-300 hover:text-amber-400' : 'text-gray-600 hover:text-indigo-600'}`}>
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">{cartItemCount}</span>}
              </button>
              <button className={`md:hidden p-2 ${isElite ? 'text-slate-300' : 'text-gray-600'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBİL MENÜ PANELİ */}
      {isMobileMenuOpen && (
        <div className={`md:hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex flex-col ${isElite ? 'bg-slate-900' : 'bg-white'}`}>
          <div className={`flex items-center justify-between px-4 py-5 border-b ${isElite ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex items-center cursor-pointer" onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}>
              <img src="/logo.png" alt="Mağaza Logo" className="h-8 w-auto" />
              <span className={`ml-2 text-lg font-bold ${isElite ? 'text-white' : 'text-gray-900'}`}>Tech Cycle</span>
            </div>
            <button className={`p-2 ${isElite ? 'text-slate-300' : 'text-gray-600'}`} onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 ${isElite ? 'text-slate-400' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                className={`block w-full pl-10 pr-3 py-3 border rounded-full focus:ring-1 text-sm ${isElite ? 'border-slate-600 bg-slate-800 text-white placeholder-slate-400 focus:ring-amber-500' : 'border-gray-300 bg-gray-50 focus:ring-indigo-500'}`}
                placeholder="Ürün, kategori veya marka ara..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); if(currentView !== 'home') setCurrentView('home'); }}
              />
            </div>
            <button
              onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-base font-medium ${currentView === 'home' ? (isElite ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-50 text-indigo-600') : (isElite ? 'text-slate-200 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-100')}`}
            >
              Ana Sayfa
            </button>
            <button
              onClick={() => { setCurrentView('pazar'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-base font-medium ${currentView === 'pazar' ? (isElite ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-50 text-indigo-600') : (isElite ? 'text-slate-200 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-100')}`}
            >
              <Users className="h-5 w-5" />
              Pazar
            </button>
            <button
              onClick={() => { setCurrentView('kiralama'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-base font-medium ${currentView === 'kiralama' ? (isElite ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-50 text-indigo-600') : (isElite ? 'text-slate-200 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-100')}`}
            >
              <Building2 className="h-5 w-5" />
              Kiralama
            </button>
            <button
              onClick={() => { setCurrentView('account'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-base font-medium ${currentView === 'account' ? (isElite ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-50 text-indigo-600') : (isElite ? 'text-slate-200 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-100')}`}
            >
              <User className="h-5 w-5" />
              Hesabım
            </button>
            {tier && (
              <button
                onClick={() => { setCurrentView('artirma'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-base font-bold ${currentView === 'artirma' ? (isElite ? 'bg-amber-500/10 text-amber-400' : 'bg-violet-50 text-violet-600') : (isElite ? 'text-amber-300 hover:bg-slate-800' : 'text-violet-600 hover:bg-violet-50')}`}
              >
                <Crown className="h-5 w-5" />
                Açık Arttırma
              </button>
            )}
          </div>
        </div>
      )}

      {/* AI ASİSTAN BUTONU — sadece premium üyeler */}
      {isElite && currentView === 'home' && (
        <button
          onClick={() => { setIsAiOpen(true); setAiStep(1); setAiForm({ device: '', age: '', income: '', usages: [], priorities: [] }); setAiResults([]); }}
          className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-2xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 ${isElite ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900' : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'}`}
        >
          <Sparkles className="h-5 w-5" />
          AI Öneri
        </button>
      )}

      {/* AI MODAL */}
      {isAiOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAiOpen(false)} />
          <div className={`relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden ${isElite ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`} style={{ maxHeight: '92vh' }}>

            {/* Modal başlık */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${isElite ? 'border-slate-700' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isElite ? 'bg-amber-400/20 text-amber-400' : 'bg-violet-100 text-violet-600'}`}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className={`text-xs font-medium ${isElite ? 'text-amber-400' : 'text-violet-600'}`}>TechCycle AI</p>
                  <h3 className="font-bold text-base leading-tight">Kişisel Ürün Önerisi</h3>
                </div>
              </div>
              <button onClick={() => setIsAiOpen(false)} className={`p-2 rounded-xl ${isElite ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-400'}`}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Adım göstergesi */}
            {aiStep < 6 && (
              <div className="flex items-center gap-2 px-6 pt-4">
                {[1,2,3,4,5].map(s => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= aiStep ? (isElite ? 'bg-amber-400' : 'bg-violet-600') : (isElite ? 'bg-slate-700' : 'bg-gray-200')}`} />
                ))}
              </div>
            )}

            {/* İçerik */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6">

              {/* ADIM 1 — Cihaz seçimi */}
              {aiStep === 1 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${isElite ? 'text-amber-400' : 'text-violet-600'}`}>Adım 1 / 5</p>
                    <h4 className="text-xl font-bold mb-1">Ne almak istiyorsunuz?</h4>
                    <p className={`text-sm ${isElite ? 'text-slate-400' : 'text-gray-500'}`}>Hangi kategoriyi düşündüğünüzü seçin, kararsızsanız AI sizin için karar versin.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'telefon',     label: 'Telefon',         emoji: '📱', wide: false },
                      { id: 'tablet',      label: 'Tablet',           emoji: '🖥️', wide: false },
                      { id: 'bilgisayar',  label: 'Bilgisayar',       emoji: '💻', wide: false },
                      { id: 'giyilebilir', label: 'Kulaklık / Saat', emoji: '🎧', wide: false },
                      { id: 'kararsiz',    label: 'Karar Vermedim',   emoji: '🤔', wide: true  },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setAiForm(f => ({ ...f, device: opt.id }))}
                        className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all ${opt.wide ? 'col-span-2 flex-row justify-center gap-3' : ''} ${aiForm.device === opt.id ? (isElite ? 'border-amber-400 bg-amber-400/10' : 'border-violet-500 bg-violet-50') : (isElite ? 'border-slate-700 hover:border-slate-500' : 'border-gray-200 hover:border-gray-300')}`}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="text-xs font-semibold text-center leading-tight">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ADIM 2 — Yaş */}
              {aiStep === 2 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${isElite ? 'text-amber-400' : 'text-violet-600'}`}>Adım 2 / 5</p>
                    <h4 className="text-xl font-bold mb-1">Yaşınız kaç?</h4>
                    <p className={`text-sm ${isElite ? 'text-slate-400' : 'text-gray-500'}`}>Size en uygun cihazı önerebilmemiz için yaşınızı girin.</p>
                  </div>
                  <input
                    type="number"
                    min="10"
                    max="99"
                    placeholder="Örn: 24"
                    value={aiForm.age}
                    onChange={e => setAiForm(f => ({ ...f, age: e.target.value }))}
                    className={`w-full text-3xl font-bold text-center py-4 rounded-2xl border-2 focus:outline-none transition-colors ${isElite ? 'bg-slate-800 border-slate-600 text-white focus:border-amber-400 placeholder-slate-600' : 'bg-gray-50 border-gray-200 focus:border-violet-500 placeholder-gray-300'}`}
                  />
                </div>
              )}

              {/* ADIM 3 — Gelir */}
              {aiStep === 3 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${isElite ? 'text-amber-400' : 'text-violet-600'}`}>Adım 3 / 5</p>
                    <h4 className="text-xl font-bold mb-1">Gelir durumunuz?</h4>
                    <p className={`text-sm ${isElite ? 'text-slate-400' : 'text-gray-500'}`}>Bütçenize uygun seçenekler sunalım.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      { id: 'dusuk',  label: 'Ekonomik',  sub: '~₺22.000 altı',     emoji: '💰' },
                      { id: 'orta',   label: 'Orta',      sub: '₺22.000 – ₺65.000', emoji: '💳' },
                      { id: 'yuksek', label: 'Yüksek',    sub: '₺65.000 üzeri',     emoji: '🏆' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setAiForm(f => ({ ...f, income: opt.id }))}
                        className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl border-2 text-left transition-all ${aiForm.income === opt.id ? (isElite ? 'border-amber-400 bg-amber-400/10' : 'border-violet-500 bg-violet-50') : (isElite ? 'border-slate-700 hover:border-slate-500' : 'border-gray-200 hover:border-gray-300')}`}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{opt.label}</p>
                          <p className={`text-xs ${isElite ? 'text-slate-400' : 'text-gray-500'}`}>{opt.sub}</p>
                        </div>
                        {aiForm.income === opt.id && <CheckCircle2 className={`h-5 w-5 ${isElite ? 'text-amber-400' : 'text-violet-600'}`} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ADIM 4 — Kullanım */}
              {aiStep === 4 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${isElite ? 'text-amber-400' : 'text-violet-600'}`}>Adım 4 / 5</p>
                    <h4 className="text-xl font-bold mb-1">Ne için kullanacaksınız?</h4>
                    <p className={`text-sm ${isElite ? 'text-slate-400' : 'text-gray-500'}`}>Birden fazla seçebilirsiniz.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {AI_USAGES.map(u => {
                      const sel = aiForm.usages.includes(u.id);
                      return (
                        <button
                          key={u.id}
                          onClick={() => setAiForm(f => ({ ...f, usages: sel ? f.usages.filter(x => x !== u.id) : [...f.usages, u.id] }))}
                          className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all ${sel ? (isElite ? 'border-amber-400 bg-amber-400/10' : 'border-violet-500 bg-violet-50') : (isElite ? 'border-slate-700 hover:border-slate-500' : 'border-gray-200 hover:border-gray-300')}`}
                        >
                          <span className="text-2xl">{u.emoji}</span>
                          <span className="text-xs font-semibold text-center leading-tight">{u.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ADIM 5 — Öncelikler */}
              {aiStep === 5 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${isElite ? 'text-amber-400' : 'text-violet-600'}`}>Adım 5 / 5</p>
                    <h4 className="text-xl font-bold mb-1">En çok neye önem veriyorsunuz?</h4>
                    <p className={`text-sm ${isElite ? 'text-slate-400' : 'text-gray-500'}`}>Birden fazla seçebilirsiniz.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {AI_PRIORITIES.map(pr => {
                      const sel = aiForm.priorities.includes(pr.id);
                      return (
                        <button
                          key={pr.id}
                          onClick={() => setAiForm(f => ({ ...f, priorities: sel ? f.priorities.filter(x => x !== pr.id) : [...f.priorities, pr.id] }))}
                          className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all ${sel ? (isElite ? 'border-amber-400 bg-amber-400/10' : 'border-violet-500 bg-violet-50') : (isElite ? 'border-slate-700 hover:border-slate-500' : 'border-gray-200 hover:border-gray-300')}`}
                        >
                          <span className="text-2xl">{pr.emoji}</span>
                          <span className="text-xs font-semibold text-center leading-tight">{pr.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ADIM 6 — Sonuçlar */}
              {aiStep === 6 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${isElite ? 'bg-amber-400/20 text-amber-400' : 'bg-violet-100 text-violet-700'}`}>
                      <Sparkles className="h-3.5 w-3.5" /> AI Analizi Tamamlandı
                    </div>
                    <h4 className="text-xl font-bold mb-1">Size Özel Seçimler</h4>
                    <p className={`text-sm ${isElite ? 'text-slate-400' : 'text-gray-500'}`}>Profilinize göre her kategoriden en iyi ürünü seçtik.</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    {aiResults.map(p => (
                      <div
                        key={p.id}
                        className={`rounded-2xl border overflow-hidden ${isElite ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'}`}
                      >
                        {/* Ürün satırı */}
                        <button
                          onClick={() => { setSelectedProduct(p); setCurrentView('productDetail'); setIsAiOpen(false); }}
                          className="flex items-center gap-4 w-full p-4 text-left hover:opacity-80 transition-opacity"
                        >
                          <img src={p.image} alt={p.name} className="h-14 w-14 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] font-semibold uppercase tracking-wider mb-0.5 ${isElite ? 'text-amber-400' : 'text-violet-600'}`}>{p.category}</p>
                            <p className="font-bold text-sm leading-tight line-clamp-1">{p.name}</p>
                            <p className="font-black text-base mt-0.5">{formatPrice(p.price)}</p>
                          </div>
                          {/* Eşleşme yüzdesi */}
                          <div className="flex flex-col items-center flex-shrink-0">
                            <span className={`text-lg font-black ${isElite ? 'text-amber-400' : 'text-violet-600'}`}>{p.match}%</span>
                            <span className={`text-[10px] font-medium ${isElite ? 'text-slate-500' : 'text-gray-400'}`}>uyum</span>
                          </div>
                        </button>

                        {/* Neden etiketleri + Sepete Ekle */}
                        <div className={`flex items-center justify-between px-4 pb-3 gap-2 border-t ${isElite ? 'border-slate-700' : 'border-gray-100'}`}>
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {p.reasons.map((r, i) => (
                              <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isElite ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>{r}</span>
                            ))}
                          </div>
                          <button
                            onClick={() => { addToCart(p); setIsAiOpen(false); }}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all mt-2 ${isElite ? 'bg-amber-400 text-slate-900 hover:bg-amber-300' : 'bg-violet-600 text-white hover:bg-violet-700'}`}
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            Sepete Ekle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => { setAiStep(1); setAiForm({ device: '', age: '', income: '', usages: [], priorities: [] }); setAiResults([]); }}
                    className={`text-sm font-medium underline underline-offset-4 text-center ${isElite ? 'text-slate-400' : 'text-gray-400'}`}
                  >
                    Yeniden Başla
                  </button>
                </div>
              )}
            </div>

            {/* Alt butonlar */}
            {aiStep < 6 && (
              <div className={`flex gap-3 px-6 py-5 border-t ${isElite ? 'border-slate-700' : 'border-gray-100'}`}>
                {aiStep > 1 && (
                  <button
                    onClick={() => setAiStep(s => s - 1)}
                    className={`px-5 py-4 rounded-2xl font-bold text-sm transition-all ${isElite ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Geri
                  </button>
                )}
                <button
                  disabled={
                    (aiStep === 1 && !aiForm.device) ||
                    (aiStep === 2 && !aiForm.age) ||
                    (aiStep === 3 && !aiForm.income) ||
                    (aiStep === 4 && aiForm.usages.length === 0) ||
                    (aiStep === 5 && aiForm.priorities.length === 0)
                  }
                  onClick={() => {
                    if (aiStep < 5) { setAiStep(s => s + 1); }
                    else { setAiResults(getAiRecommendations()); setAiStep(6); }
                  }}
                  className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isElite ? 'bg-amber-400 text-slate-900 hover:bg-amber-300' : 'bg-violet-600 text-white hover:bg-violet-700'}`}
                >
                  {aiStep === 5 ? (
                    <><Sparkles className="h-4 w-4" /> Önerileri Göster</>
                  ) : (
                    <><span>Devam Et</span> <ChevronRight className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEPET ÇEKMECESİ */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md transform transition-transform shadow-2xl bg-white flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-5 border-b"><h2 className="text-xl font-bold">Alışveriş Sepeti</h2><button onClick={() => setIsCartOpen(false)}><X className="h-6 w-6" /></button></div>
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ShoppingCart className="h-16 w-16 mb-4 text-gray-300" />
                    <p className="text-lg">Sepetiniz boş.</p>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {cart.map(item => (
                      <li key={item.id} className="flex py-2">
                        <img src={item.image} alt={item.name} className="h-24 w-24 rounded-md border object-cover" />
                        <div className="ml-4 flex flex-1 flex-col">
                          <div className="flex justify-between font-medium"><h3>{item.name}</h3><p>{formatPrice(item.price * item.quantity)}</p></div>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center border rounded-lg bg-gray-50">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus className="h-4 w-4" /></button>
                              <span className="px-3 text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus className="h-4 w-4" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-1"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t bg-gray-50">
                  {/* CO2 tasarrufu özeti */}
                  {(() => {
                    const totalCo2 = cart.reduce((sum, item) => sum + (item.co2 ?? 0) * item.quantity, 0);
                    const trees = Math.round(totalCo2 / 21);
                    const km = Math.round(totalCo2 / 0.21);
                    return (
                      <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🌍</span>
                          <p className="text-emerald-800 font-bold text-sm">Sepetinizin Doğaya Katkısı</p>
                        </div>
                        <p className="text-emerald-700 text-xs leading-relaxed mb-3">
                          Bu alışverişle yaklaşık
                          <span className="font-black text-emerald-800 text-base mx-1">{totalCo2} kg</span>
                          CO₂ emisyonunun önüne geçilmesine katkı sağlıyorsunuz.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white rounded-xl px-3 py-2 text-center border border-emerald-100">
                            <p className="text-lg font-black text-emerald-700">🌳 {trees}</p>
                            <p className="text-[10px] text-emerald-500 font-medium">ağacın yıllık emdiği CO₂</p>
                          </div>
                          <div className="bg-white rounded-xl px-3 py-2 text-center border border-emerald-100">
                            <p className="text-lg font-black text-emerald-700">🚗 {km.toLocaleString('tr-TR')}</p>
                            <p className="text-[10px] text-emerald-500 font-medium">km araba yolculuğuna eşdeğer</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="px-4 py-5">
                    <div className="flex justify-between font-bold text-lg mb-4"><p>Ara Toplam</p><p>{formatPrice(cartTotal)}</p></div>
                    <button onClick={handleCheckout} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium">
                      {currentUser ? 'Güvenli Ödeme Yap' : 'Giriş Yap ve Ödeme Yap'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ANA İÇERİK ALANI */}
      <main className={`flex-1 w-full max-w-7xl mx-auto px-4 py-8 ${currentView === 'artirma' ? 'hidden' : ''}`}>
        
        {/* === ANA SAYFA (MAĞAZA) GÖRÜNÜMÜ === */}
        {currentView === 'home' && (
          <>
            {!searchQuery && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <button onClick={() => { setSelectedCategory('Telefonlar'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }} className={`bg-white p-4 rounded-2xl shadow-sm border flex flex-col items-center transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-xl group ${selectedCategory === 'Telefonlar' ? (isElite ? 'border-amber-400 shadow-amber-50' : 'border-indigo-400') : (cardHoverBorder || 'hover:border-indigo-200')}`}>
                  <div className={`p-3 rounded-full mb-2.5 transition-all duration-300 group-hover:scale-110 ${selectedCategory === 'Telefonlar' ? (isElite ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white') : (isElite ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' : isPro ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white')}`}><Smartphone className="h-7 w-7" /></div>
                  <h3 className="font-bold text-sm">Telefon</h3>
                </button>
                <button onClick={() => { setSelectedCategory('Bilgisayarlar'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }} className={`bg-white p-4 rounded-2xl shadow-sm border flex flex-col items-center transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-xl group ${selectedCategory === 'Bilgisayarlar' ? (isElite ? 'border-amber-400 shadow-amber-50' : 'border-blue-400') : (cardHoverBorder || 'hover:border-blue-200')}`}>
                  <div className={`p-3 rounded-full mb-2.5 transition-all duration-300 group-hover:scale-110 ${selectedCategory === 'Bilgisayarlar' ? (isElite ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white') : (isElite ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' : isPro ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white')}`}><Laptop className="h-7 w-7" /></div>
                  <h3 className="font-bold text-sm">Laptop</h3>
                </button>
                <button onClick={() => { setSelectedCategory('Giyilebilir'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }} className={`bg-white p-4 rounded-2xl shadow-sm border flex flex-col items-center transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-xl group ${selectedCategory === 'Giyilebilir' ? (isElite ? 'border-amber-400 shadow-amber-50' : 'border-purple-400') : (cardHoverBorder || 'hover:border-purple-200')}`}>
                  <div className={`p-3 rounded-full mb-2.5 transition-all duration-300 group-hover:scale-110 ${selectedCategory === 'Giyilebilir' ? (isElite ? 'bg-amber-500 text-white' : 'bg-purple-600 text-white') : (isElite ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' : isPro ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white')}`}><Watch className="h-7 w-7" /></div>
                  <h3 className="font-bold text-sm">Wearables</h3>
                </button>
                <button onClick={() => { setSelectedCategory('Tabletler'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }} className={`bg-white p-4 rounded-2xl shadow-sm border flex flex-col items-center transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-xl group ${selectedCategory === 'Tabletler' ? (isElite ? 'border-amber-400 shadow-amber-50' : 'border-green-400') : (cardHoverBorder || 'hover:border-green-200')}`}>
                  <div className={`p-3 rounded-full mb-2.5 transition-all duration-300 group-hover:scale-110 ${selectedCategory === 'Tabletler' ? (isElite ? 'bg-amber-500 text-white' : 'bg-green-600 text-white') : (isElite ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' : isPro ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' : 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white')}`}><Tablet className="h-7 w-7" /></div>
                  <h3 className="font-bold text-sm">Tablet</h3>
                </button>
              </div>
            )}

            <div id="products-section">
              <h2 className="text-2xl font-bold mb-8">{searchQuery ? `"${searchQuery}" için sonuçlar` : "Popüler Ürünler"}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col h-full group transition-all duration-300 cursor-pointer ${isElite ? 'border-amber-100 hover:shadow-lg hover:border-amber-300' : isPro ? 'border-purple-100 hover:shadow-md hover:border-purple-200' : 'border-gray-100 hover:shadow-md'}`}
                    onClick={() => { setSelectedProduct(product); setCurrentView('productDetail'); }}
                  >
                    
                    <div className="relative h-[220px] w-full bg-[#f8f9fa] p-6 flex items-center justify-center flex-shrink-0">
                      {product.badge && (
                        <span className="absolute top-4 left-4 z-10 bg-[#5b4eff] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider leading-none">
                          {product.badge}
                        </span>
                      )}
                      <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-darken group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">{product.category}</div>
                      <h3 className="font-bold text-[16px] text-gray-900 mb-2 leading-tight">{product.name}</h3>
                      
                      <div className="flex items-center text-[13px] mb-3">
                        <Star className="h-4 w-4 fill-current text-[#ffc107] mr-1.5" />
                        <span className="font-bold text-gray-900">{product.rating}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-gray-500">{product.reviews} Değerlendirme</span>
                      </div>

                      <p className="text-[13px] text-gray-500 mb-6 line-clamp-2 leading-relaxed flex-1">{product.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[20px] font-black text-gray-900">{formatPrice(product.price)}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }} 
                          className="bg-[#0f172a] text-white p-3 rounded-xl hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 flex items-center justify-center"
                        >
                          <ShoppingCart className="h-5 w-5" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* === ÜRÜN DETAY GÖRÜNÜMÜ === */}
        {currentView === 'productDetail' && selectedProduct && (
          <div className="animate-in fade-in duration-300">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Alışverişe Dön
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-col md:flex-row">

                {/* Sol: Ürün Görseli */}
                <div className="md:w-1/2 p-8 md:p-16 bg-[#f8f9fa] flex items-center justify-center relative min-h-[400px]">
                  {selectedProduct.badge && (
                    <span className="absolute top-6 left-6 z-10 bg-[#5b4eff] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                      {selectedProduct.badge}
                    </span>
                  )}
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="max-w-full h-auto max-h-[500px] object-contain mix-blend-darken hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Sağ: Ürün Bilgileri */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">{selectedProduct.category}</div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{selectedProduct.name}</h1>

                  <div className="flex items-center text-sm mb-6">
                    <Star className="h-5 w-5 fill-current text-[#ffc107] mr-1.5" />
                    <span className="font-bold text-gray-900 text-lg">{selectedProduct.rating}</span>
                    <span className="mx-3 text-gray-300">•</span>
                    <span className="text-gray-500 cursor-pointer hover:text-indigo-600 transition">{selectedProduct.reviews} Değerlendirme</span>
                  </div>

                  <div className="text-4xl font-black text-gray-900 mb-6">{formatPrice(selectedProduct.price)}</div>

                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    {selectedProduct.description}
                    <br /><br />
                    Üstün teknolojisi, şık tasarımı ve dayanıklı malzemesiyle günlük hayatınızı kolaylaştırmak için özenle üretildi. Şimdi sipariş verin ve teknolojik ayrıcalıkları anında keşfetmeye başlayın.
                  </p>

                  <div className="mt-auto">
                    <button
                      onClick={() => addToCart(selectedProduct)}
                      className="w-full bg-[#5b4eff] text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200/50 flex items-center justify-center"
                    >
                      <ShoppingCart className="h-6 w-6 mr-2" />
                      Sepete Ekle
                    </button>
                  </div>

                  {/* CO2 Tasarrufu */}
                  <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-5 py-4 flex items-center gap-4">
                    <div className="text-3xl select-none">🌱</div>
                    <div className="flex-1">
                      <p className="text-emerald-800 font-bold text-sm">Bu cihazı tercih ederek</p>
                      <p className="text-emerald-600 text-xs leading-relaxed mt-0.5">
                        Yeni bir cihaz üretilmesine kıyasla yaklaşık
                        <span className="text-emerald-800 font-black text-base mx-1">{selectedProduct.co2} kg</span>
                        CO₂ emisyonunun önüne geçilmesine katkı sağlıyorsunuz.
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-black text-emerald-700">{selectedProduct.co2}<span className="text-sm font-semibold"> kg</span></p>
                      <p className="text-[10px] text-emerald-500 font-medium">CO₂ tasarrufu</p>
                    </div>
                  </div>

                  {/* Ekstra Bilgiler */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center text-gray-700 text-sm font-medium">
                      <div className="bg-green-100 text-green-600 p-2.5 rounded-full mr-3">
                        <Truck className="h-4 w-4" />
                      </div>
                      Ücretsiz Kargo
                    </div>
                    <div className="flex items-center text-gray-700 text-sm font-medium">
                      <div className="bg-blue-100 text-blue-600 p-2.5 rounded-full mr-3">
                        <Shield className="h-4 w-4" />
                      </div>
                      2 Yıl Garanti
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* ÜRÜN DEĞERLENDİRMELERİ */}
            {(() => {
              const productReviews = reviewsByProduct[selectedProduct.id] || [];
              const userAlreadyReviewed = currentUser && productReviews.some(r => r.user_id === currentUser.id);
              const avgRating = productReviews.length
                ? (productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length).toFixed(1)
                : null;
              return (
                <div className="mt-10 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <h2 className="text-xl font-bold text-gray-900">Ürün Değerlendirmeleri</h2>
                    {avgRating && (
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-black text-gray-900">{avgRating}</span>
                        <div>
                          <div className="flex">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`h-5 w-5 fill-current ${s <= Math.round(Number(avgRating)) ? 'text-[#ffc107]' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">{productReviews.length} değerlendirme</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {productReviews.length === 0 && (
                    <p className="text-gray-400 text-sm mb-8">Henüz değerlendirme yok. İlk değerlendiren sen ol!</p>
                  )}

                  {productReviews.length > 0 && (
                    <ul className="space-y-6 mb-10">
                      {productReviews.map(review => (
                        <li key={review.id} className="flex gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                            {review.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm text-gray-900">{review.name}</span>
                              <span className="text-xs text-gray-400">{review.date}</span>
                            </div>
                            <div className="flex mb-2">
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} className={`h-4 w-4 fill-current ${s <= review.rating ? 'text-[#ffc107]' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="border-t border-gray-100 pt-8">
                    <h3 className="font-bold text-gray-900 mb-5">Değerlendirme Yaz</h3>
                    {!currentUser ? (
                      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm text-gray-600">
                        <Star className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        Değerlendirme yapmak için <button onClick={() => setCurrentView('account')} className="text-indigo-600 font-semibold hover:underline">giriş yapın</button>.
                      </div>
                    ) : userAlreadyReviewed ? (
                      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-sm text-green-700">
                        <Star className="h-5 w-5 text-green-500 fill-current flex-shrink-0" />
                        Bu ürün için zaten bir değerlendirme yaptınız.
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Puanınız</label>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => (
                              <button
                                key={s}
                                type="button"
                                onMouseEnter={() => setReviewForm(f => ({ ...f, hoverRating: s }))}
                                onMouseLeave={() => setReviewForm(f => ({ ...f, hoverRating: 0 }))}
                                onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                              >
                                <Star className={`h-8 w-8 fill-current transition-colors ${s <= (reviewForm.hoverRating || reviewForm.rating) ? 'text-[#ffc107]' : 'text-gray-200'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Adınız</label>
                          <input
                            type="text"
                            value={reviewForm.name}
                            onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="Adınızı girin"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Yorumunuz</label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                            placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
                            rows={4}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!reviewForm.rating || !reviewForm.name.trim() || !reviewForm.comment.trim()}
                          className="bg-[#5b4eff] text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Değerlendirimi Gönder
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ÖNERI KAROSELİ */}
            {(() => {
              const suggestions = MOCK_PRODUCTS.filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category);
              const fallback = MOCK_PRODUCTS.filter(p => p.id !== selectedProduct.id && p.category !== selectedProduct.category).slice(0, 4);
              const carouselItems = suggestions.length >= 2 ? suggestions : [...suggestions, ...fallback].slice(0, 4);
              if (carouselItems.length === 0) return null;
              return (
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Bu ürünü alanlar bunları da aldı</h2>
                  <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
                    {carouselItems.map(product => (
                      <div
                        key={product.id}
                        className="flex-shrink-0 w-56 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow duration-300 group"
                        onClick={() => { setSelectedProduct(product); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      >
                        <div className="relative h-40 bg-[#f8f9fa] p-4 flex items-center justify-center flex-shrink-0">
                          {product.badge && (
                            <span className="absolute top-3 left-3 z-10 bg-[#5b4eff] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider leading-none">
                              {product.badge}
                            </span>
                          )}
                          <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-darken group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">{product.category}</div>
                          <h3 className="font-bold text-sm text-gray-900 mb-2 leading-tight line-clamp-2">{product.name}</h3>
                          <div className="flex items-center text-xs mb-3">
                            <Star className="h-3 w-3 fill-current text-[#ffc107] mr-1" />
                            <span className="font-bold text-gray-900">{product.rating}</span>
                            <span className="mx-1.5 text-gray-300">•</span>
                            <span className="text-gray-500">{product.reviews}</span>
                          </div>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-base font-black text-gray-900">{formatPrice(product.price)}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                              className="bg-[#0f172a] text-white p-2 rounded-xl hover:bg-indigo-600 transition-colors flex items-center justify-center"
                            >
                              <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* PAZAR GÖRÜNÜMÜ */}
        {currentView === 'pazar' && <Pazar currentUser={currentUser} onGoToAccount={() => setCurrentView('account')} />}

        {/* KİRALAMA GÖRÜNÜMÜ */}
        {currentView === 'kiralama' && <Kiralama currentUser={currentUser} />}

        {/* ÖDEME GÖRÜNÜMÜ */}
        {currentView === 'odeme' && (
          <Odeme
            cart={cart}
            cartTotal={cartTotal}
            currentUser={currentUser}
            onSuccess={() => setCart([])}
            setCurrentView={setCurrentView}
          />
        )}

        {/* HESAP GÖRÜNÜMÜ */}
        {currentView === 'account' && <HesapAbonelikler setCurrentView={setCurrentView} addToCart={addToCart} currentUser={currentUser} currentSub={currentSub} onSubChange={fetchCurrentSub} />}

        {/* SSS GÖRÜNÜMÜ */}
        {currentView === 'sss' && <SSS onBack={() => setCurrentView('home')} />}

        {/* İADE KOŞULLARI GÖRÜNÜMÜ */}
        {currentView === 'iade' && <IadeKosullari onBack={() => setCurrentView('home')} />}

        {/* SERTİFİKA KAPSAMI GÖRÜNÜMÜ */}
        {currentView === 'sertifika' && <SertifikaKapsami onBack={() => setCurrentView('home')} />}

      </main>

      {/* AÇIK ARTTIRMA GÖRÜNÜMÜ — tam genişlik, main dışında */}
      {currentView === 'artirma' && (
        <AcikArtirma
          currentUser={currentUser}
          tier={tier}
          isElite={isElite}
          isPro={isPro}
          onGoToAccount={() => setCurrentView('account')}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4 cursor-pointer" onClick={() => setCurrentView('home')}>
                 <img src="/logo.png" alt="Mağaza Logo" className="h-8 w-auto mr-2" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                En yeni ve en kaliteli elektronik ürünleri uygun fiyatlarla size ulaştırıyoruz. Teknoloji alışverişinin güvenilir adresi.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 text-white border-b border-gray-700 pb-2 inline-block">Kategoriler</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {CATEGORIES.filter(c => c !== "Tümü").map(cat => (
                  <li key={cat}><button onClick={() => { setCurrentView('home'); setSelectedCategory(cat); }} className="hover:text-indigo-400 transition">{cat}</button></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-white border-b border-gray-700 pb-2 inline-block">Destek</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button onClick={() => setCurrentView('sss')} className="hover:text-indigo-400 transition flex items-center"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>Sıkça Sorulan Sorular</button></li>
                <li><a href="#" className="hover:text-indigo-400 transition flex items-center"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>Kargo ve Teslimat</a></li>
                <li><button onClick={() => setCurrentView('iade')} className="hover:text-indigo-400 transition flex items-center"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>İade Koşulları</button></li>
                <li><button onClick={() => setCurrentView('sertifika')} className="hover:text-indigo-400 transition flex items-center"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>Sertifika Kapsamı</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-white border-b border-gray-700 pb-2 inline-block">Bültene Katılın</h4>
              <p className="text-gray-400 text-sm mb-4">Yeni ürünlerden ve indirimlerden anında haberdar olun.</p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="E-posta adresiniz" className="px-4 py-2 w-full rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <button type="submit" className="bg-indigo-600 px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition font-medium">Abone Ol</button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2026 Tüm Hakları Saklıdır.</p>
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
