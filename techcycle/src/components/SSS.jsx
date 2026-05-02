import { useState } from 'react';
import { ChevronDown, ChevronLeft, Search } from 'lucide-react';

const FAQ_DATA = [
  {
    category: '🛍️ Genel',
    questions: [
      {
        q: 'TechCycle nedir?',
        a: 'TechCycle, Apple ve Samsung ürünlerini satın alabileceğiniz, kiralayabileceğiniz ve ikinci el alıp-satabileceğiniz bir teknoloji platformudur. Telefon, tablet, bilgisayar ve giyilebilir kategorilerinde yüzlerce ürün sunmaktayız.',
      },
      {
        q: 'Hangi markalar ve ürünler satılıyor?',
        a: 'Şu anda Apple (iPhone, iPad, MacBook, Apple Watch, AirPods) ve Samsung (Galaxy S/A/Z serisi telefonlar, Galaxy Tab, Galaxy Book, Galaxy Watch, Galaxy Buds) ürünleri satılmaktadır. Ürün yelpazemizi sürekli genişletiyoruz.',
      },
      {
        q: 'Üye olmadan alışveriş yapabilir miyim?',
        a: 'Ürünleri inceleyebilir ve sepete ekleyebilirsiniz; ancak ödeme yapmak için üye olmanız gerekmektedir. Üyelik tamamen ücretsizdir ve yalnızca birkaç dakika sürer.',
      },
      {
        q: 'Hesabımı nasıl oluşturabilirim?',
        a: 'Sağ üstteki "Hesabım" butonuna tıklayarak e-posta adresinizle kayıt olabilirsiniz. Kayıt sonrasında e-posta adresinize bir doğrulama bağlantısı gönderilir.',
      },
      {
        q: 'Şifremi unuttum, ne yapmalıyım?',
        a: 'Giriş ekranındaki "Şifremi Unuttum" seçeneğine tıklayın. Kayıtlı e-posta adresinize şifre sıfırlama bağlantısı gönderilecektir.',
      },
    ],
  },
  {
    category: '📦 Siparişler',
    questions: [
      {
        q: 'Sipariş nasıl verilir?',
        a: 'İstediğiniz ürünü seçin, sepete ekleyin ve "Güvenli Ödeme Yap" butonuna tıklayın. Teslimat adresinizi ve ödeme yönteminizi girdikten sonra siparişiniz onaylanır.',
      },
      {
        q: 'Siparişimi nasıl takip edebilirim?',
        a: '"Hesabım" sayfasındaki "Siparişlerim" sekmesinden tüm siparişlerinizi ve güncel kargo durumlarını görebilirsiniz. Ayrıca her sipariş güncellemesinde e-posta bildirimi alırsınız.',
      },
      {
        q: 'Siparişimi iptal edebilir miyim?',
        a: 'Sipariş kargoya verilmeden önce "Siparişlerim" sayfasından iptal talebinde bulunabilirsiniz. Kargoya verildikten sonra ürünü teslim aldığınızda iade sürecini başlatabilirsiniz.',
      },
      {
        q: 'Aynı anda birden fazla ürün sipariş edebilir miyim?',
        a: 'Evet, sepetinize istediğiniz kadar ürün ekleyerek tek seferde sipariş verebilirsiniz. Her ürün ayrı ayrı da değil, tek bir paket halinde gönderilir.',
      },
    ],
  },
  {
    category: '🚚 Kargo ve Teslimat',
    questions: [
      {
        q: 'Kargo ücreti ne kadar?',
        a: '₺500 ve üzeri siparişlerde kargo tamamen ücretsizdir. ₺500 altındaki siparişlerde sabit ₺49,90 kargo ücreti uygulanır. Pro ve Elite üyeler tüm siparişlerinde ücretsiz kargo avantajından yararlanır.',
      },
      {
        q: 'Siparişim kaç günde teslim edilir?',
        a: 'Standart teslimat 2–4 iş günüdür. Elite üyeler aynı gün (şehir içi) veya ertesi gün teslimat avantajından yararlanabilir. Resmi tatil günleri teslimat süresine dahil edilmez.',
      },
      {
        q: 'Yurt dışına gönderim yapılıyor mu?',
        a: 'Şu anda yalnızca Türkiye genelinde teslimat yapılmaktadır. Yurt dışı gönderim seçeneği yakın zamanda eklenecektir.',
      },
      {
        q: 'Ürün teslim edilirken evde değilsem ne olur?',
        a: 'Kargo görevlisi, komşunuza bırakabilir veya size ulaşarak tekrar teslimat planlar. Bunun yanı sıra kargo şubesinden teslim alabilirsiniz. Teslimat bildirimi SMS ve e-posta ile yapılır.',
      },
    ],
  },
  {
    category: '💳 Ödeme',
    questions: [
      {
        q: 'Hangi ödeme yöntemleri kabul edilir?',
        a: 'Tüm Visa, Mastercard ve American Express kredi/banka kartlarıyla ödeme yapabilirsiniz. Ayrıca havale/EFT seçeneği de mevcuttur.',
      },
      {
        q: 'Taksit imkânı var mı?',
        a: 'Seçili bankaların kredi kartlarıyla 3, 6, 9 ve 12 taksit yapabilirsiniz. Pro üyeler 18 taksit, Elite üyeler 24 taksit avantajından yararlanır. Taksit seçenekleri ödeme ekranında gösterilir.',
      },
      {
        q: 'Ödeme bilgilerim güvende mi?',
        a: 'Ödeme işlemleriniz 256-bit SSL şifreleme ile korunmaktadır. Kart bilgileriniz sunucularımızda saklanmaz; PCI-DSS uyumlu ödeme altyapısı kullanılmaktadır.',
      },
      {
        q: 'Faturamı nereden alabilirim?',
        a: 'Sipariş onayının ardından faturanız e-posta adresinize otomatik olarak gönderilir. Ayrıca "Siparişlerim" sayfasından PDF olarak indirebilirsiniz.',
      },
    ],
  },
  {
    category: '🔄 İade ve Garanti',
    questions: [
      {
        q: 'Ürünü iade edebilir miyim?',
        a: 'Ürünü teslim aldığınız tarihten itibaren 30 gün içinde iade edebilirsiniz. Ürünün orijinal ambalajında ve kullanılmamış durumda olması gerekmektedir. "Hesabım → İade Talebi" bölümünden başvurabilirsiniz.',
      },
      {
        q: 'İade sürecim ne kadar sürer?',
        a: 'İade talebiniz onaylandıktan sonra ürünü kargolayın. Ürün bize ulaşıp incelendikten sonra 3–5 iş günü içinde ödemeniz iade edilir.',
      },
      {
        q: 'Garanti süresi ne kadar?',
        a: 'Tüm ürünler resmi distribütör garantisi kapsamındadır: Apple ve Samsung ürünleri 1 yıl garanti içermektedir.',
      },
      {
        q: 'Hasarlı veya arızalı ürün gelirse ne yapmalıyım?',
        a: 'Ürünü teslim aldığınızda paket açılışını kayıt altına almanızı öneririz. Hasar ya da arıza tespit etmeniz durumunda 48 saat içinde destek ekibimize fotoğraf ve sipariş numarasıyla ulaşın; ücretsiz değişim veya iade işlemi başlatılacaktır.',
      },
    ],
  },
  {
    category: '👑 Pro & Elite Abonelik',
    questions: [
      {
        q: 'Pro ve Elite abonelik arasındaki fark nedir?',
        a: 'Pro abonelik; ücretsiz kargo, 18 taksit ve öncelikli destek gibi avantajlar sunar. Elite abonelik ise tüm Pro avantajlarına ek olarak aynı gün teslimat, 24 taksit, ek garanti yılı ve özel müşteri temsilcisi gibi premium ayrıcalıklar içerir.',
      },
      {
        q: 'AI Öneri özelliği nedir?',
        a: 'AI Öneri, yaşınızı, gelir durumunuzu, kullanım amacınızı ve önceliklerinizi analiz ederek size en uygun telefon, tablet, bilgisayar ve giyilebilir ürünleri öneren kişisel asistanınızdır. Yalnızca Pro ve Elite üyelere özeldir.',
      },
      {
        q: 'Aboneliğimi nasıl iptal edebilirim?',
        a: '"Hesabım → Abonelikler" sayfasından istediğiniz zaman aboneliğinizi iptal edebilirsiniz. İptal sonrasında mevcut dönem sona erene kadar avantajlarınızdan yararlanmaya devam edersiniz.',
      },
      {
        q: 'Abonelik ücretleri ne zaman alınır?',
        a: 'Abonelik ücreti, kayıt tarihinden itibaren her ay aynı günde otomatik olarak alınır. Ödeme öncesinde e-posta ile bildirim gönderilir.',
      },
    ],
  },
  {
    category: '🏢 Kiralama',
    questions: [
      {
        q: 'Kiralama nasıl çalışır?',
        a: 'Kiralama sayfasından istediğiniz ürünü seçin, kullanım sürenizi belirtin ve başvurunuzu gönderin. Ekibimiz 24 saat içinde onay sürecini tamamlar ve ürün belirttiğiniz adrese teslim edilir.',
      },
      {
        q: 'Kiralama süresi ne kadar olabilir?',
        a: 'Minimum 1 hafta, maksimum 24 ay kiralama yapabilirsiniz. Uzun dönem kiralamada fiyat avantajı uygulanır. Kiralama sürenizi uzatmak için hesabınızdan kolayca talep oluşturabilirsiniz.',
      },
      {
        q: 'Kiralanan ürün hasar görürse ne olur?',
        a: 'Teslim öncesinde ürünün durumu fotoğraflanarak kayıt altına alınır. Olası hasarlar için kiralama sözleşmesinde belirtilen güvence bedeli uygulanır. Kendi kusurunuz olmayan arızalarda bakım ve onarım tarafımızca karşılanır.',
      },
      {
        q: 'Kiralama süresi bitmeden ürünü satın alabilir miyim?',
        a: 'Evet! Kiralama süreniz içinde "Kiralama → Aktif Kiralamalar" sayfasından ürünü satın alma talebinde bulunabilirsiniz. Ödediğiniz kira bedelinin bir kısmı satın alma fiyatından düşülür.',
      },
    ],
  },
  {
    category: '🤝 Pazar (İkinci El)',
    questions: [
      {
        q: 'Pazar nedir?',
        a: 'Pazar, kullanıcıların kendi Apple ve Samsung ürünlerini birbirlerine satabileceği güvenli bir ikinci el platformudur. Her ilan TechCycle ekibi tarafından incelenerek onaylanır.',
      },
      {
        q: 'Ürün satmak için ne yapmalıyım?',
        a: '"Pazar" sayfasından "İlan Ver" butonuna tıklayın. Ürünün fotoğraflarını ekleyin, durumunu ve fiyatını belirtin. İlanınız incelendikten sonra yayınlanır ve ilgilenen alıcılar sizinle iletişime geçer.',
      },
      {
        q: 'İkinci el ürün satın almak güvenli mi?',
        a: 'Evet. Tüm satıcılar kimlik doğrulamasından geçer ve her ilan incelenir. Ürün alındıktan sonra 48 saat içinde sorun bildirme hakkınız vardır. Ödeme güvence sistemi sayesinde para, satıcıya ürünü teslim ettiği doğrulanana kadar bekletilir.',
      },
      {
        q: 'Pazarda satış komisyonu var mı?',
        a: 'Hayır, komisyon alınmaz.',
      },
    ],
  },
];

export default function SSS({ onBack }) {
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const toggle = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filtered = FAQ_DATA.map((cat, ci) => ({
    ...cat,
    catIdx: ci,
    questions: cat.questions.filter(
      item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat =>
    (activeCategory === null || cat.category === activeCategory) &&
    cat.questions.length > 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Ana Sayfaya Dön
          </button>
          <h1 className="text-4xl font-black mb-3">Sıkça Sorulan Sorular</h1>
          <p className="text-indigo-200 text-lg mb-8">Aklınızdaki her şeyin cevabı burada.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Soru ara..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setActiveCategory(null); }}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Kategori filtreleri */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === null ? 'bg-indigo-600 text-white shadow' : 'bg-white text-gray-600 border hover:border-indigo-300 hover:text-indigo-600'}`}
            >
              Tümü
            </button>
            {FAQ_DATA.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat.category ? 'bg-indigo-600 text-white shadow' : 'bg-white text-gray-600 border hover:border-indigo-300 hover:text-indigo-600'}`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        )}

        {/* SSS listesi */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-medium">"{searchQuery}" için sonuç bulunamadı.</p>
            <p className="text-sm mt-2">Farklı bir kelime deneyin.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map(cat => (
              <div key={cat.category}>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  {cat.category}
                  <span className="text-xs font-normal text-gray-400">({cat.questions.length} soru)</span>
                </h2>
                <div className="space-y-3">
                  {cat.questions.map((item, qi) => {
                    const key = `${cat.catIdx}-${qi}`;
                    const isOpen = !!openItems[key];
                    return (
                      <div
                        key={qi}
                        className={`bg-white rounded-2xl border overflow-hidden transition-all ${isOpen ? 'border-indigo-200 shadow-sm' : 'border-gray-200'}`}
                      >
                        <button
                          onClick={() => toggle(cat.catIdx, qi)}
                          className="w-full flex items-center justify-between px-6 py-4 text-left"
                        >
                          <span className="font-semibold text-gray-900 text-sm pr-4">{item.q}</span>
                          <ChevronDown className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hâlâ sorunuz mu var */}
        <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-8 text-center">
          <p className="text-2xl mb-2">💬</p>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aradığınız cevabı bulamadınız mı?</h3>
          <p className="text-sm text-gray-500 mb-5">Destek ekibimiz 7/24 size yardımcı olmaya hazır.</p>
          <a
            href="mailto:destek@techcycle.com"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            Bize Yazın
          </a>
        </div>
      </div>
    </div>
  );
}
