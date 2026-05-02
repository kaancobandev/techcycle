import { ChevronLeft, ShieldOff, AlertTriangle, FileText, Scale, Wrench, Zap, Droplets, User, Clock, CheckCircle, XCircle } from 'lucide-react';

const SECTIONS = [
  {
    icon: FileText,
    title: 'Sertifika Nedir?',
    content: [
      'TechCycle Sertifikası, platformumuz aracılığıyla satın alınan cihazların belirli teknik kontrol süreçlerinden geçtiğini belgeleyen resmi bir dokümandır.',
      'Sertifika; cihazın satış anındaki görsel durumunu, temel fonksiyonellik testlerinin sonuçlarını ve beyan edilen teknik özellikleri kapsar.',
      'Sertifika belgesi, satın alma işleminin tamamlanmasının ardından e-posta adresinize ve hesabınızdaki "Belgelerim" bölümüne otomatik olarak iletilir.',
      'Sertifika, üçüncü taraf kurum veya kuruluşlar nezdinde resmi bir garanti belgesi niteliği taşımaz; yalnızca TechCycle platformuna özgü bir durum tespiti belgesidir.',
      'Sertifikanın geçerliliği, cihazın teslim tarihi itibarıyla başlar ve sertifikada belirtilen süre boyunca devam eder.',
    ],
  },
  {
    icon: ShieldOff,
    title: 'Mesuliyet Reddi — Genel Hükümler',
    highlight: true,
    content: [
      'TechCycle, sertifikalı cihazlarda teslim sonrasında ortaya çıkan her türlü arıza, hasar, performans düşüklüğü veya işlevsel bozulma nedeniyle hiçbir koşulda hukuki, mali veya teknik sorumluluk kabul etmez.',
      'Sertifika belgesi, cihazın gelecekte arıza çıkarmayacağına dair bir taahhüt veya garanti niteliği taşımamaktadır. Teslim anındaki durumu belgelemekten ibarettir.',
      'Cihazın teslim edilmesinin ardından kullanıcı tarafından gerçekleştirilen her türlü işlem, müdahale veya kullanım sonucunda doğabilecek zararlardan TechCycle sorumlu tutulamaz.',
      'Sertifikalı ürünlerde doğan arızalar nedeniyle uğranılan dolaylı zararlar (veri kaybı, gelir kaybı, iş kesintisi vb.) TechCycle\'in tazminat yükümlülüğü kapsamı dışındadır.',
      'Kullanıcı, sertifika belgesini kabul etmekle birlikte bu mesuliyet reddi hükümlerini okuduğunu, anladığını ve onayladığını beyan etmiş sayılır.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Mesuliyet Kabul Edilmeyen Arıza Türleri',
    highlight: true,
    subsections: [
      {
        subtitle: 'Kullanıcı Kaynaklı Hasarlar',
        items: [
          'Düşme, çarpma veya ezilme sonucu oluşan kırık, çatlak veya ezik ekran/kasa hasarları.',
          'Sıvı teması, su baskını veya yüksek nem ortamına maruz kalma sonucu meydana gelen arızalar.',
          'Yetkisiz servis, tamir veya onarım girişimleri sonucunda oluşan her türlü hasar.',
          'Uyumsuz ya da onaysız aksesuar, şarj aleti veya kablo kullanımından kaynaklanan devre arızaları.',
          'Cihazın teknik özelliklerinin aşılması (aşırı ısıtma, izin verilmeyen voltaj vb.) sonucu oluşan hasarlar.',
        ],
      },
      {
        subtitle: 'Yazılım ve Veri Kaynaklı Sorunlar',
        items: [
          'Kullanıcı tarafından yüklenen üçüncü taraf uygulama, yazılım veya güncellemelerden kaynaklanan sistem arızaları.',
          'Yetkisiz işletim sistemi değişiklikleri (jailbreak, root vb.) sonucunda oluşan yazılımsal bozulmalar.',
          'Kötü amaçlı yazılım, virüs veya siber saldırı nedeniyle meydana gelen veri kaybı ve sistem hasarları.',
          'Fabrika ayarlarına sıfırlama, yanlış güncelleme veya yazılım silme işlemleri sonucu oluşan arızalar.',
          'Bulut hesabı erişim sorunları, uygulama uyumsuzlukları veya platform kaynaklı yazılım hataları.',
        ],
      },
      {
        subtitle: 'Çevresel ve Dış Etkenler',
        items: [
          'Deprem, sel, yangın, yıldırım düşmesi gibi doğal afetler veya mücbir sebep halleri.',
          'Ani voltaj dalgalanmaları, elektrik kesintisi veya statik elektrik nedeniyle oluşan hasar.',
          'Aşırı sıcak veya soğuk ortamda (üretici tarafından belirtilen çalışma sıcaklığı aralığı dışı) kullanım.',
          'Manyetik alan, radyasyon veya güçlü elektromanyetik etki altında oluşan devre arızaları.',
          'Uygun olmayan depolama koşulları (aşırı nem, ısı veya basınç) nedeniyle oluşan bozulmalar.',
        ],
      },
      {
        subtitle: 'Zamanla Oluşan Değişimler',
        items: [
          'Batarya kapasitesinin doğal kullanım yıpranmasıyla zamanla azalması; bu durum arıza sayılmaz.',
          'Ekran parlaklığının veya renk doğruluğunun kullanım süresince normalin ötesinde azalması.',
          'Hoparlör, mikrofon veya butonlardaki yıpranmadan kaynaklanan performans düşüklükleri.',
          'Dahili depolama biriminin uzun süreli kullanım sonucu yavaşlaması veya yazma hızının düşmesi.',
          'Kamera lensi üzerinde oluşan doğal çizikler veya lens kaplamasının bozulması.',
        ],
      },
    ],
  },
  {
    icon: Wrench,
    title: 'Yetkisiz Müdahale ve Servis',
    content: [
      'Cihazın TechCycle tarafından yetkilendirilmemiş bir servis tarafından onarılması veya herhangi bir parçasının değiştirilmesi durumunda sertifika tamamen geçersiz sayılır.',
      'Yetkisiz müdahale sonrası ortaya çıkan arızalar için TechCycle\'e başvurulması halinde talep reddedilir ve herhangi bir yükümlülük doğmaz.',
      'Üretici tarafından belirlenen orijinal parçalar dışında bileşen kullanılması da yetkisiz müdahale kapsamında değerlendirilir.',
      'Cihazın iç kısmının kullanıcı tarafından açılması, orijinal vida veya contaların bozulması sertifikayı otomatik olarak geçersiz kılar.',
      'Yetkisiz müdahale tespitine itiraz, cihazın incelenmesinin ardından teknik rapor sunularak yapılabilir; aksi halde itiraz değerlendirmeye alınmaz.',
    ],
  },
  {
    icon: Zap,
    title: 'Yazılım Güncellemeleri ve Uyumluluk',
    content: [
      'TechCycle, işletim sistemi güncellemelerinin mevcut donanımla uyumunu garanti etmez; üretici kararlarından kaynaklanan uyumsuzluklar mesuliyet kapsamı dışındadır.',
      'Üretici tarafından yayınlanan zorunlu yazılım güncellemelerinin ardından ortaya çıkan yavaşlama, uygulama kapanması veya özellik kaybından TechCycle sorumlu tutulamaz.',
      'Uygulama mağazası politikası değişiklikleri ya da üreticinin hizmet sonlandırması nedeniyle erişilemeyen uygulamalar veya özellikler sertifika kapsamı dışındadır.',
      'Kullanıcının bölgesel kısıtlamalar veya hesap sorunları nedeniyle yaşadığı yazılım erişim problemleri TechCycle\'in sorumluluğunda değildir.',
    ],
  },
  {
    icon: Droplets,
    title: 'Su ve Toz Direnci Hakkında Önemli Uyarı',
    highlight: true,
    content: [
      'IP67 veya IP68 gibi su ve toz direnç sertifikaları, üreticinin kontrollü laboratuvar koşullarında yaptığı testleri kapsar; gerçek dünya koşullarında aynı sonucu garanti etmez.',
      'Tuzlu su, klor içeren havuz suyu, deniz suyu veya basınçlı su ile temasta oluşan hasarlar su direnci kapsamı dışında değerlendirilir ve TechCycle mesuliyet kabul etmez.',
      'Su direncinin zamanla azalması doğal bir süreçtir; önceki düşme, çarpma veya tamirlerden sonra su direnci tamamen yok olmuş olabilir.',
      'Sıvı teması sonucu oluşan arıza, sertifika kapsamında değil; kullanıcı kaynaklı hasar olarak sınıflandırılır ve herhangi bir tazminat hakkı doğurmaz.',
    ],
  },
  {
    icon: User,
    title: 'Kullanıcının Yükümlülükleri',
    content: [
      'Kullanıcı, cihazı teslim aldıktan sonraki 48 saat içinde görsel ve işlevsel kontrolünü yaparak mevcut sorunları TechCycle\'e bildirmekle yükümlüdür; bu süre geçtikten sonra yapılan bildirimler teslim öncesi hasara dayandırılamaz.',
      'Cihazın üretici kullanım kılavuzuna uygun şekilde kullanılması kullanıcının sorumluluğundadır.',
      'Kişisel verilerin ve hesapların güvenliği tamamen kullanıcının sorumluluğundadır; veri kaybı veya hesap ihlali nedeniyle TechCycle herhangi bir sorumluluk üstlenmez.',
      'Kullanıcı, sertifika belgesini ve satın alma faturasını olası uyuşmazlıklarda ibraz edebilmek amacıyla saklamakla yükümlüdür.',
      'Sertifika devredilmez; cihazın üçüncü bir kişiye satılması ya da devredilmesi halinde sertifika hükümsüz hale gelir.',
    ],
  },
  {
    icon: Scale,
    title: 'Hukuki Uyarılar ve Uygulanacak Hukuk',
    content: [
      'İşbu sertifika kapsamı belgesi, Türk Borçlar Kanunu ve Tüketicinin Korunması Hakkında Kanun\'un ilgili hükümleri çerçevesinde hazırlanmıştır.',
      'Sertifika kapsamından doğan uyuşmazlıklarda Türkiye Cumhuriyeti mahkemeleri ve Türk hukuku esas alınır.',
      'Tüketici, Tüketici Sorunları Hakem Heyeti\'ne başvurma hakkını saklı tutar; ancak TechCycle\'in mesuliyet sınırları bu belgede belirtilen çerçevede geçerliliğini korur.',
      'TechCycle, bu belgede yer alan hükümleri önceden bildirimde bulunmak kaydıyla güncelleme hakkını saklı tutar. Güncel versiyon her zaman web sitesinde yayımlanır.',
      'Sertifika kapsamı belgesinin herhangi bir hükmünün geçersiz sayılması, diğer hükümlerin geçerliliğini etkilemez.',
    ],
  },
  {
    icon: Clock,
    title: 'Başvuru ve İtiraz Süreci',
    steps: [
      { step: '1', title: 'Arızayı Belgeleyin', desc: 'Cihazın arızalı durumunu fotoğraf veya video ile belgeleyin. Arızanın ne zaman ve nasıl başladığını not alın.' },
      { step: '2', title: 'Teknik Değerlendirme Talep Edin', desc: '"Hesabım → Teknik Destek" bölümünden başvurun. Sipariş numaranızı ve sertifika kodunuzu hazır bulundurun.' },
      { step: '3', title: 'Ön İnceleme', desc: 'Ekibimiz talebinizi 2 iş günü içinde değerlendirir. Gerekirse ek belge veya cihaz gönderimi talep edilebilir.' },
      { step: '4', title: 'Teknik Rapor', desc: 'Arızanın kaynağı ve sertifika kapsamında olup olmadığı teknik raporda detaylandırılır ve tarafınıza iletilir.' },
      { step: '5', title: 'Sonuç Bildirimi', desc: 'Kapsam dahilindeki arızalarda çözüm önerilir. Kapsam dışı arızalarda mesuliyet reddi gerekçesiyle bildirim yapılır; itiraz hakkınız saklıdır.' },
    ],
  },
];

export default function SertifikaKapsami({ onBack }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Ana Sayfaya Dön
          </button>
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <AlertTriangle className="h-3.5 w-3.5" />
            Önemli Yasal Belge — Lütfen Dikkatlice Okuyunuz
          </div>
          <h1 className="text-4xl font-black mb-3">Sertifika Kapsamı</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            TechCycle sertifikalı ürünlerde mesuliyet sınırları, kullanıcı yükümlülükleri ve kapsam dışı durumlar hakkında detaylı bilgi.
          </p>
          <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200 leading-relaxed">
              <strong>Yasal Uyarı:</strong> Sertifikalı cihazlarda teslim sonrasında meydana gelen arızalar, kullanıcı kaynaklı hasarlar, doğal yıpranma ve çevresel etkilerden kaynaklanan sorunlar için <strong>TechCycle hiçbir koşulda mesuliyet kabul etmemektedir.</strong> Satın alma işlemini tamamlamanız bu koşulları okuduğunuz ve kabul ettiğiniz anlamına gelir.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* İçindekiler */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600" />
            İçindekiler
          </h2>
          <ol className="space-y-2">
            {SECTIONS.map((s, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                {s.title}
              </li>
            ))}
          </ol>
        </div>

        {/* Bölümler */}
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className={`bg-white rounded-2xl border overflow-hidden ${section.highlight ? 'border-red-200' : 'border-gray-200'}`}
            >
              <div className={`flex items-center gap-3 px-6 py-5 border-b ${section.highlight ? 'border-red-100 bg-red-50' : 'border-gray-100'}`}>
                <div className={`p-2 rounded-xl ${section.highlight ? 'bg-red-100' : 'bg-slate-100'}`}>
                  <Icon className={`h-5 w-5 ${section.highlight ? 'text-red-600' : 'text-slate-600'}`} />
                </div>
                <h2 className="font-bold text-gray-900">{section.title}</h2>
                {section.highlight && (
                  <span className="ml-auto text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">MEDİCİYET REDDİ</span>
                )}
              </div>

              <div className="px-6 py-5">
                {section.content && (
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((sub) => (
                      <div key={sub.subtitle}>
                        <h3 className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-1 h-4 rounded-full bg-red-400 inline-block" />
                          {sub.subtitle}
                        </h3>
                        <ul className="space-y-2.5 pl-3">
                          {sub.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                              <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.steps && (
                  <ol className="space-y-4">
                    {section.steps.map((s) => (
                      <li key={s.step} className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                          {s.step}
                        </span>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{s.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          );
        })}

        {/* Onay kutusu */}
        <div className="bg-slate-800 rounded-3xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-bold mb-2">Kabul Beyanı</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                TechCycle'dan satın alma işlemi gerçekleştiren her kullanıcı, bu belgede yer alan sertifika kapsamı, mesuliyet reddi hükümleri ve kullanıcı yükümlülüklerini okuduğunu, anladığını ve tüm hükümleri kabul ettiğini beyan etmiş sayılır. Bu kabul, ayrıca imza veya onay gerekmeksizin satın alma işleminin tamamlanmasıyla hukuki geçerlilik kazanır.
              </p>
            </div>
          </div>
          <p className="text-slate-500 text-xs">Son güncelleme: Mayıs 2026 — TechCycle Hukuk Departmanı</p>
        </div>
      </div>
    </div>
  );
}
