import { ChevronLeft, RotateCcw, CheckCircle, XCircle, Clock, Package, CreditCard, Phone } from 'lucide-react';

const SECTIONS = [
  {
    icon: RotateCcw,
    title: 'İade Hakkı ve Süresi',
    content: [
      'Satın aldığınız ürünleri teslim tarihinden itibaren 30 gün içinde iade edebilirsiniz.',
      'İade talebinizi "Hesabım → İade Talebi" bölümünden oluşturabilirsiniz.',
      'İade kargo bedeli TechCycle tarafından karşılanır; size ücretsiz kargo kodu gönderilir.',
      'İade başvurusu yapıldıktan sonra ürünü en geç 3 iş günü içinde kargoya vermeniz gerekmektedir.',
    ],
  },
  {
    icon: CheckCircle,
    title: 'İade Kabul Koşulları',
    content: [
      'Ürün orijinal kutusunda ve tüm aksesuarlarıyla birlikte iade edilmelidir.',
      'Ürün kullanılmamış, çizilmemiş ve hasarsız olmalıdır.',
      'Fatura veya sipariş numarası iade paketine eklenmelidir.',
      'Ürün üzerindeki koruyucu film ve etiketler sökülmemiş olmalıdır.',
      'Yazılım veya kişisel veriler silinmiş olmalıdır (telefon/tablet için fabrika ayarlarına sıfırlama).',
    ],
  },
  {
    icon: XCircle,
    title: 'İade Kabul Edilmeyen Durumlar',
    content: [
      'Ürün açılmış, kullanılmış veya hasar görmüşse iade kabul edilmez.',
      '30 günlük iade süresi geçmişse talep işleme alınmaz.',
      'Orijinal ambalajı olmayan veya eksik aksesuar ile gönderilen ürünler reddedilir.',
      'Yazılımsal veya veriye bağlı sorunlar (uygulama hatası vb.) iade kapsamı dışındadır.',
      'Kullanıcı kaynaklı fiziksel hasar (düşme, kırılma, ıslatma) iade kapsamı dışındadır.',
    ],
  },
  {
    icon: Clock,
    title: 'İade Süreci ve Adımlar',
    steps: [
      { step: '1', title: 'Talep Oluşturun', desc: '"Hesabım → İade Talebi" sayfasından sipariş numaranızı seçerek iade talebinizi gönderin.' },
      { step: '2', title: 'Onay Bekleyin', desc: 'Ekibimiz talebinizi 1 iş günü içinde değerlendirir ve size e-posta ile bildirim gönderir.' },
      { step: '3', title: 'Kargolayın', desc: 'Onay e-postasındaki ücretsiz kargo koduyla ürünü en yakın kargo şubesine teslim edin.' },
      { step: '4', title: 'İnceleme', desc: 'Ürün bize ulaştıktan sonra 2 iş günü içinde kontrol edilir ve sonuç bildirilir.' },
      { step: '5', title: 'Geri Ödeme', desc: 'Onaylanan iadelerde ödeme 3–5 iş günü içinde orijinal ödeme yönteminize iade edilir.' },
    ],
  },
  {
    icon: CreditCard,
    title: 'Geri Ödeme Yöntemleri',
    content: [
      'Kredi/banka kartıyla yapılan ödemeler aynı karta iade edilir (banka işlem süresine bağlı olarak 3–5 iş günü).',
      'Havale/EFT ile yapılan ödemeler belirttiğiniz banka hesabına aktarılır.',
      'Taksitli alımlarda iade tutarı kart borcunuzdan düşülür; taksitler iptal edilir.',
      'Kargo ücreti ödenmiş ise iade tutarına dahil edilerek geri ödenir.',
    ],
  },
  {
    icon: Package,
    title: 'Hasarlı veya Yanlış Ürün',
    content: [
      'Teslimatta hasarlı veya yanlış ürün aldıysanız 48 saat içinde destek ekibimize bildirin.',
      'Ürünün fotoğraf veya videosunu sipariş numarasıyla birlikte gönderin.',
      'Hasarlı/yanlış ürünler için kargo dahil ücretsiz değişim veya tam iade sağlanır.',
      'Paket açılışını kamera ile kayıt altına almanızı tavsiye ederiz.',
    ],
  },
  {
    icon: Phone,
    title: 'Garanti Kapsamındaki Arızalar',
    content: [
      'Apple ve Samsung ürünleri 1 yıl resmi distribütör garantisi kapsamındadır.',
      'Garanti kapsamındaki arızalarda ücretsiz onarım veya değişim yapılır.',
      'Garanti başvurusu için "Hesabım → Garanti Talebi" bölümünü kullanabilirsiniz.',
      'Kullanıcı kaynaklı hasarlar (düşme, ıslatma, kırılma) garanti kapsamı dışındadır.',
      'Garanti süresi dolmadan önce e-posta ile hatırlatma gönderilir.',
    ],
  },
];

export default function IadeKosullari({ onBack }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-emerald-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Ana Sayfaya Dön
          </button>
          <h1 className="text-4xl font-black mb-3">İade Koşulları</h1>
          <p className="text-emerald-100 text-lg">Memnun kalmadığınız ürünleri kolayca iade edin.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { label: '30 Gün', sub: 'İade Süresi' },
              { label: 'Ücretsiz', sub: 'İade Kargo' },
              { label: '3–5 Gün', sub: 'Geri Ödeme' },
              { label: '1 Yıl', sub: 'Garanti' },
            ].map(item => (
              <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 text-center min-w-[90px]">
                <p className="text-xl font-black">{item.label}</p>
                <p className="text-xs text-emerald-200 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                <div className="p-2 rounded-xl bg-emerald-50">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>
                <h2 className="font-bold text-gray-900">{section.title}</h2>
              </div>

              <div className="px-6 py-5">
                {section.content && (
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.steps && (
                  <ol className="space-y-4">
                    {section.steps.map((s) => (
                      <li key={s.step} className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                          {s.step}
                        </span>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{s.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          );
        })}

        {/* Yardım kutusu */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-8 text-center">
          <p className="text-2xl mb-2">🤝</p>
          <h3 className="text-lg font-bold text-gray-900 mb-2">İade sürecinizde yardıma ihtiyaç mı var?</h3>
          <p className="text-sm text-gray-500 mb-5">Destek ekibimiz hafta içi 09:00–18:00 saatleri arasında hizmetinizdedir.</p>
          <a
            href="mailto:iade@techcycle.com"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors"
          >
            İade Desteği Al
          </a>
        </div>
      </div>
    </div>
  );
}
