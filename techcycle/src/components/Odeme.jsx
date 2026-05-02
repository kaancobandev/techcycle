import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft, CreditCard, Building2, Truck, ShieldCheck,
  Check, Loader2, AlertCircle, CheckCircle, Package, Lock,
  MapPin, User, Phone, Bookmark, BookmarkCheck, RefreshCw,
} from 'lucide-react';

const CITIES = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya',
  'Ardahan','Artvin','Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik',
  'Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum',
  'Denizli','Diyarbakır','Düzce','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir',
  'Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Iğdır','Isparta','İstanbul',
  'İzmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kırıkkale',
  'Kırklareli','Kırşehir','Kilis','Kocaeli','Konya','Kütahya','Malatya','Manisa',
  'Mardin','Mersin','Muğla','Muş','Nevşehir','Niğde','Ordu','Osmaniye','Rize',
  'Sakarya','Samsun','Siirt','Sinop','Sivas','Şanlıurfa','Şırnak','Tekirdağ',
  'Tokat','Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak',
];

const PAYMENT_METHODS = [
  { id: 'card',     label: 'Kredi / Banka Kartı',  icon: CreditCard, desc: 'Visa, Mastercard, Troy'              },
  { id: 'transfer', label: 'Havale / EFT',          icon: Building2,  desc: 'Banka havalesi ile güvenli ödeme'    },
  { id: 'door',     label: 'Kapıda Ödeme',          icon: Truck,      desc: 'Nakit veya kart ile kapıda öde (+₺29)' },
];

const BANK_INFO = {
  name: 'TechCycle Teknoloji A.Ş.',
  iban: 'TR00 0000 0000 0000 0000 0000 00',
  bank: 'TechBank',
};

const formatPrice  = (p) => `₺${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(p)}`;
const formatCardNo = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = (val) => { const d = val.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? `${d.slice(0,2)}/${d.slice(2)}` : d; };

// ── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
export default function Odeme({ cart, cartTotal, currentUser, onSuccess, setCurrentView }) {

  const [address, setAddress] = useState({
    fullName: currentUser?.user_metadata?.full_name || '',
    phone: '', city: '', district: '', addressLine: '', postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [card, setCard]                   = useState({ number: '', name: '', expiry: '', cvc: '' });

  // Kayıtlı bilgi
  const [savedInfo, setSavedInfo]         = useState(null);
  const [useSavedCard, setUseSavedCard]   = useState(false);
  const [saveForLater, setSaveForLater]   = useState(true);
  const [infoLoading, setInfoLoading]     = useState(true);

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  const doorFee      = paymentMethod === 'door' ? 29 : 0;
  const totalPayable = cartTotal + doorFee;

  // ── Kayıtlı bilgileri yükle ──────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) { setInfoLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('user_saved_info').select('*').eq('user_id', currentUser.id).maybeSingle();
      if (data) {
        setSavedInfo(data);
        if (data.address) setAddress(data.address);
        if (data.payment_method) setPaymentMethod(data.payment_method);
        if (data.card_last4) {
          setCard(c => ({ ...c, name: data.card_name || '', expiry: data.card_expiry || '' }));
          setUseSavedCard(true);
        }
      }
      setInfoLoading(false);
    })();
  }, [currentUser?.id]);

  // ── Bilgileri kaydet ─────────────────────────────────────────────────────
  const saveUserInfo = async () => {
    if (!saveForLater || !currentUser) return;
    const last4   = useSavedCard ? savedInfo?.card_last4   : card.number.replace(/\s/g,'').slice(-4);
    const cName   = useSavedCard ? savedInfo?.card_name    : card.name;
    const expiry  = useSavedCard ? savedInfo?.card_expiry  : card.expiry;
    await supabase.from('user_saved_info').upsert({
      user_id: currentUser.id,
      address,
      payment_method: paymentMethod,
      card_last4:  paymentMethod === 'card' ? last4  : null,
      card_name:   paymentMethod === 'card' ? cName  : null,
      card_expiry: paymentMethod === 'card' ? expiry : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  };

  // ── Doğrulama ────────────────────────────────────────────────────────────
  const validate = () => {
    if (!address.fullName.trim())    return 'Ad Soyad zorunludur.';
    if (!address.phone.trim())       return 'Telefon numarası zorunludur.';
    if (!address.city)               return 'İl seçiniz.';
    if (!address.district.trim())    return 'İlçe zorunludur.';
    if (!address.addressLine.trim()) return 'Açık adres zorunludur.';
    if (paymentMethod === 'card') {
      if (!useSavedCard && card.number.replace(/\s/g,'').length < 16) return 'Geçerli bir kart numarası girin.';
      if (!useSavedCard && !card.name.trim())                          return 'Kart üzerindeki isim zorunludur.';
      if (!useSavedCard && card.expiry.length < 5)                     return 'Son kullanma tarihi giriniz (AA/YY).';
      if (card.cvc.length < 3)                                         return 'CVV / CVC kodu giriniz.';
    }
    return null;
  };

  // ── Siparişi onayla ──────────────────────────────────────────────────────
  const handleConfirm = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      await supabase.from('orders').insert({
        user_id: currentUser?.id ?? null,
        items: cart,
        total: totalPayable,
        status: 'pending',
        shipping_address: address,
        payment_method: paymentMethod,
      });
      await saveUserInfo();
      setSuccess(true);
      onSuccess();
    } catch (e) {
      setError(`Hata: ${e?.message || 'Sipariş oluşturulamadı.'}`);
    } finally {
      setLoading(false);
    }
  };

  const hasSavedAddr = savedInfo?.address?.city;
  const hasSavedCard = savedInfo?.card_last4;

  // ── Başarı ekranı ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Siparişiniz Alındı!</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Siparişiniz başarıyla oluşturuldu. Kargo sürecini <strong>Hesabım → Siparişlerim</strong> üzerinden takip edebilirsiniz.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => setCurrentView('account')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              Siparişlerimi Görüntüle
            </button>
            <button onClick={() => setCurrentView('home')}
              className="text-gray-500 text-sm hover:text-indigo-600 transition-colors">
              Alışverişe Devam Et
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (infoLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  // ── Ödeme sayfası ────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => setCurrentView('home')}
        className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
        <ArrowLeft className="h-5 w-5 mr-1" /> Alışverişe Dön
      </button>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── SOL: FORM ── */}
        <div className="flex-1 space-y-5">

          {/* Teslimat Adresi */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="font-bold text-gray-900">Teslimat Adresi</h2>
              </div>
              {hasSavedAddr && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <BookmarkCheck className="h-3.5 w-3.5" /> Kayıtlı adres
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" value={address.fullName}
                      onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))}
                      placeholder="Adınız Soyadınız"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="tel" value={address.phone}
                      onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                      placeholder="0532 000 00 00"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İl <span className="text-red-400">*</span></label>
                  <select value={address.city}
                    onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                    <option value="">İl seçin...</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İlçe <span className="text-red-400">*</span></label>
                  <input type="text" value={address.district}
                    onChange={e => setAddress(a => ({ ...a, district: e.target.value }))}
                    placeholder="İlçe adı"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açık Adres <span className="text-red-400">*</span></label>
                <textarea rows={3} value={address.addressLine}
                  onChange={e => setAddress(a => ({ ...a, addressLine: e.target.value }))}
                  placeholder="Mahalle, sokak, bina no, daire no..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>

              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
                <input type="text" maxLength={5} value={address.postalCode}
                  onChange={e => setAddress(a => ({ ...a, postalCode: e.target.value.replace(/\D/g,'') }))}
                  placeholder="00000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>

          {/* Ödeme Yöntemi */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-indigo-600" />
              </div>
              <h2 className="font-bold text-gray-900">Iyzico ile Ödeme</h2>
            </div>

            <div className="space-y-3 mb-5">
              {PAYMENT_METHODS.map(method => {
                const Icon     = method.icon;
                const isActive = paymentMethod === method.id;
                return (
                  <button key={method.id} onClick={() => { setPaymentMethod(method.id); if (method.id !== 'card') setUseSavedCard(false); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${isActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${isActive ? 'text-indigo-900' : 'text-gray-800'}`}>{method.label}</p>
                      <p className="text-xs text-gray-400">{method.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isActive ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                      {isActive && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Kart bilgileri ── */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-4 border-t border-gray-100">

                {/* Kayıtlı kart görünümü */}
                {useSavedCard && hasSavedCard ? (
                  <>
                    <div className="bg-gradient-to-br from-slate-800 to-indigo-900 text-white rounded-2xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-5">
                          <span className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold">
                            <BookmarkCheck className="h-3.5 w-3.5" /> Kayıtlı Kart
                          </span>
                          <CreditCard className="h-6 w-6 text-indigo-300 opacity-60" />
                        </div>
                        <p className="font-mono text-xl tracking-widest mb-4 text-white/90">
                          **** **** **** {savedInfo.card_last4}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <p className="font-semibold tracking-wider">{savedInfo.card_name}</p>
                          <p className="text-indigo-300">{savedInfo.card_expiry}</p>
                        </div>
                      </div>
                    </div>

                    {/* Sadece CVV iste */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV / CVC <span className="text-red-400">*</span>
                        <span className="text-xs text-gray-400 font-normal ml-2">Güvenlik için her seferinde girilmesi gerekir</span>
                      </label>
                      <div className="relative w-40">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="password" inputMode="numeric" maxLength={4} value={card.cvc}
                          onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g,'') }))}
                          placeholder="•••"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setUseSavedCard(false); setCard({ number:'', name:'', expiry:'', cvc:'' }); }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Farklı kart kullan
                    </button>
                  </>
                ) : (
                  /* Tam kart formu */
                  <>
                    {hasSavedCard && (
                      <button
                        type="button"
                        onClick={() => { setUseSavedCard(true); setCard(c => ({ ...c, cvc: '' })); }}
                        className="w-full flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-sm hover:bg-indigo-100 transition-colors"
                      >
                        <span className="flex items-center gap-2 text-indigo-700 font-semibold">
                          <BookmarkCheck className="h-4 w-4" />
                          Kayıtlı kartı kullan (**** {savedInfo.card_last4})
                        </span>
                        <Check className="h-4 w-4 text-indigo-400" />
                      </button>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" inputMode="numeric" value={card.number}
                          onChange={e => setCard(c => ({ ...c, number: formatCardNo(e.target.value) }))}
                          placeholder="0000 0000 0000 0000"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kart Üzerindeki İsim</label>
                      <input type="text" value={card.name}
                        onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                        placeholder="AD SOYAD"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wider" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma (AA/YY)</label>
                        <input type="text" inputMode="numeric" value={card.expiry}
                          onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                          placeholder="AA/YY"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV / CVC</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input type="password" inputMode="numeric" maxLength={4} value={card.cvc}
                            onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g,'') }))}
                            placeholder="•••"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl text-xs text-gray-500">
                  <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Kart bilgileriniz 256-bit SSL şifrelemesiyle korunmaktadır.
                </div>
              </div>
            )}

            {/* Havale bilgileri */}
            {paymentMethod === 'transfer' && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <p className="text-sm text-gray-500">Aşağıdaki hesaba açıklama kısmına sipariş numaranızı yazarak havale yapın.</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Alıcı</span><span className="font-semibold text-gray-900">{BANK_INFO.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Banka</span><span className="font-semibold text-gray-900">{BANK_INFO.bank}</span></div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-500 flex-shrink-0">IBAN</span>
                    <span className="font-mono font-semibold text-gray-900 text-xs">{BANK_INFO.iban}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2.5 rounded-xl text-xs text-amber-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  Ödeme teyit edildikten sonra siparişiniz hazırlanmaya başlanır.
                </div>
              </div>
            )}

            {/* Kapıda ödeme */}
            {paymentMethod === 'door' && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-start gap-3 bg-blue-50 px-4 py-3 rounded-xl text-sm text-blue-700">
                  <Truck className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>Kurye geldiğinde nakit veya mobil ödeme ile ödeyebilirsiniz. Kapıda ödeme ücreti <strong>+₺29</strong> olarak eklenir.</p>
                </div>
              </div>
            )}
          </div>

          {/* Bilgileri kaydet checkbox */}
          {currentUser && (
            <label className="flex items-center gap-3 cursor-pointer bg-white rounded-xl border border-gray-100 px-4 py-3 hover:border-indigo-100 transition-colors">
              <div
                onClick={() => setSaveForLater(v => !v)}
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${saveForLater ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}
              >
                {saveForLater && <Check className="h-3 w-3 text-white" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                  <Bookmark className="h-4 w-4 text-indigo-500" />
                  Adres ve ödeme bilgilerimi kaydet
                </p>
                <p className="text-xs text-gray-400">Bir sonraki alışverişinde otomatik doldurulur</p>
              </div>
            </label>
          )}

          {/* Hata */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
            </div>
          )}
        </div>

        {/* ── SAĞ: SİPARİŞ ÖZETİ ── */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:sticky lg:top-28">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-500" />
              <h3 className="font-bold text-gray-900">Sipariş Özeti</h3>
            </div>

            <ul className="space-y-3 mb-4">
              {cart.map(item => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#f8f9fa] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 pt-4 space-y-2 mb-5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Ara Toplam</span><span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Kargo</span>
                <span className={doorFee ? 'text-gray-900' : 'text-emerald-600 font-medium'}>
                  {doorFee ? formatPrice(doorFee) : 'Ücretsiz'}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                <span>Toplam</span><span>{formatPrice(totalPayable)}</span>
              </div>
            </div>

            <button onClick={handleConfirm} disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {loading ? 'İşleniyor...' : (useSavedCard && hasSavedCard ? 'Tek Tıkla Onayla' : 'Siparişi Onayla')}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400">
              <Lock className="h-3 w-3" />
              256-bit SSL ile güvenli bağlantı
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
