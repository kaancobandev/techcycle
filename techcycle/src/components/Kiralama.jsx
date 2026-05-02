import { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Search, Building2, Smartphone, ArrowLeft, Calendar,
  Shield, Headphones, Truck, Check, Loader2, AlertCircle,
  CheckCircle, Tag, Clock, ChevronRight, Tablet,
} from 'lucide-react';

const DEVICES = [
  {
    id: 1, name: 'iPhone 15 Pro', category: 'Telefon',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
    specs: ['A17 Pro Chip', '6.1" OLED Ekran', '256 GB Depolama', 'iOS 17', 'USB-C'],
    dailyPrice: 150, stock: 30, badge: 'EN POPÜLER',
    desc: 'Pro kamera sistemi ve titanyum kasasıyla kurumsal kullanım için ideal.',
  },
  {
    id: 2, name: 'Samsung Galaxy S24 Ultra', category: 'Telefon',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
    specs: ['Snapdragon 8 Gen 3', '6.8" QHD+ Ekran', '256 GB Depolama', 'Android 14', 'S Pen'],
    dailyPrice: 140, stock: 20, badge: null,
    desc: 'S Pen desteği ve yapay zeka özellikleriyle iş verimliliğini artırın.',
  },
  {
    id: 3, name: 'iPhone 14', category: 'Telefon',
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&q=80&w=800',
    specs: ['A15 Bionic', '6.1" Super Retina', '128 GB Depolama', 'iOS 17', 'Lightning'],
    dailyPrice: 100, stock: 50, badge: 'UYGUN FİYAT',
    desc: 'Bütçe dostu seçeneğiyle büyük ekipler için ekonomik çözüm.',
  },
  {
    id: 4, name: 'iPad Pro 12.9" M2', category: 'Tablet',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
    specs: ['M2 Chip', '12.9" Liquid Retina XDR', '256 GB Depolama', 'iPadOS 17', 'USB-C / Thunderbolt'],
    dailyPrice: 200, stock: 15, badge: 'PRO',
    desc: 'Sunum, tasarım ve saha çalışmaları için profesyonel tablet çözümü.',
  },
  {
    id: 5, name: 'Samsung Galaxy Tab S9+', category: 'Tablet',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80&w=800',
    specs: ['Snapdragon 8 Gen 2', '12.4" AMOLED', '256 GB Depolama', 'Android 14', 'S Pen Dahil'],
    dailyPrice: 170, stock: 18, badge: null,
    desc: 'Geniş AMOLED ekran ve S Pen ile notlar ve sunumlar için mükemmel.',
  },
  {
    id: 6, name: 'iPad 10. Nesil', category: 'Tablet',
    image: 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?auto=format&fit=crop&q=80&w=800',
    specs: ['A14 Bionic', '10.9" Liquid Retina', '64 GB Depolama', 'iPadOS 17', 'USB-C'],
    dailyPrice: 110, stock: 40, badge: 'UYGUN FİYAT',
    desc: 'Eğitim ve saha operasyonları için ekonomik tablet tercih.',
  },
];

const PRICE_TIERS = [
  { id: 'daily',   label: 'Günlük',   days: 1,  discountPct: 0  },
  { id: 'weekly',  label: 'Haftalık', days: 7,  discountPct: 10 },
  { id: 'monthly', label: 'Aylık',    days: 30, discountPct: 25 },
];

const BENEFITS = [
  { icon: Shield,     title: 'Tam Sigorta',          desc: 'Tüm cihazlar hasar ve hırsızlığa karşı sigortalıdır.' },
  { icon: Truck,      title: 'Ücretsiz Kurye',        desc: 'Kapınıza teslim ve iade, ücretsiz kurye hizmeti.' },
  { icon: Headphones, title: '7/24 Teknik Destek',    desc: 'Kiralama süresince öncelikli teknik destek hattı.' },
  { icon: Clock,      title: 'Esnek Süre',            desc: '1 günden 12 aya kadar esnek kiralama süresi.' },
];

const formatPrice = (p) =>
  `₺${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(p)}`;

// ── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
export default function Kiralama({ currentUser }) {
  const [view, setView]                 = useState('home');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [search, setSearch]             = useState('');
  const [category, setCategory]         = useState('Tümü');
  const [priceTier, setPriceTier]       = useState('daily');
  const [quantity, setQuantity]         = useState(1);

  // Form state
  const [form, setForm] = useState({
    companyName: '', contactName: '', email: '', phone: '',
    quantity: 1, startDate: '', durationDays: '', notes: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]     = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const tierPrice = (device, tier) => {
    const t = PRICE_TIERS.find(p => p.id === tier);
    const total = device.dailyPrice * t.days;
    return Math.round(total * (1 - t.discountPct / 100));
  };

  const filtered = DEVICES.filter(d => {
    const matchCat = category === 'Tümü' || d.category === category;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Kiralama talebi gönder ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.email || !form.startDate || !form.durationDays) {
      setFormError('Lütfen zorunlu alanları doldurun.');
      return;
    }
    setFormLoading(true);
    setFormError('');
    try {
      await supabase.from('rental_requests').insert({
        user_id: currentUser?.id ?? null,
        device_id: selectedDevice.id,
        device_name: selectedDevice.name,
        company_name: form.companyName,
        contact_name: form.contactName,
        email: form.email,
        phone: form.phone,
        quantity: Number(form.quantity),
        start_date: form.startDate,
        duration_days: Number(form.durationDays),
        notes: form.notes,
        status: 'pending',
      });
      setFormSuccess(true);
    } catch (err) {
      setFormError(`Hata: ${err?.message || 'Talep gönderilemedi.'}`);
    } finally {
      setFormLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════════════
  // DETAIL VIEW
  // ════════════════════════════════════════════════════════════════════════
  if (view === 'detail' && selectedDevice) {
    const activeTier = PRICE_TIERS.find(t => t.id === priceTier);

    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => { setView('home'); setFormSuccess(false); setFormError(''); }}
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="h-5 w-5 mr-1" /> Kiralamaya Dön
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="flex flex-col md:flex-row">

            {/* Görsel */}
            <div className="md:w-2/5 bg-[#f8f9fa] flex items-center justify-center p-10 min-h-[280px]">
              <img src={selectedDevice.image} alt={selectedDevice.name}
                className="max-h-64 max-w-full object-contain" />
            </div>

            {/* Bilgiler */}
            <div className="md:w-3/5 p-8">
              {selectedDevice.badge && (
                <span className="inline-block bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                  {selectedDevice.badge}
                </span>
              )}
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{selectedDevice.name}</h1>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{selectedDevice.desc}</p>

              {/* Specs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedDevice.specs.map(s => (
                  <span key={s} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">{s}</span>
                ))}
              </div>

              {/* Fiyat seçimi */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Kiralama Süresi</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {PRICE_TIERS.map(tier => (
                  <button key={tier.id} onClick={() => setPriceTier(tier.id)}
                    className={`border-2 rounded-xl p-3 text-center transition-all ${priceTier === tier.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}`}>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">{tier.label}</p>
                    <p className="text-lg font-black text-gray-900">{formatPrice(tierPrice(selectedDevice, tier.id))}</p>
                    {tier.discountPct > 0 && (
                      <p className="text-[11px] text-emerald-600 font-semibold">%{tier.discountPct} indirim</p>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs px-4 py-2.5 rounded-xl">
                <Check className="h-4 w-4 flex-shrink-0" />
                <span><strong>{selectedDevice.stock} cihaz</strong> stokta mevcut · Sigortalı kurye teslimatı</span>
              </div>
            </div>
          </div>
        </div>

        {/* Talep Formu */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {formSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Talebiniz Alındı!</h3>
              <p className="text-gray-500 text-sm max-w-sm mb-6">
                Kiralama ekibimiz en geç 1 iş günü içinde <strong>{form.email}</strong> adresine dönüş yapacaktır.
              </p>
              <button onClick={() => { setView('home'); setFormSuccess(false); }}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                Başka Cihaz Kirala
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Kiralama Talebi Oluştur</h2>
              <p className="text-gray-500 text-sm mb-6">Formu doldurun, ekibimiz sizinle iletişime geçsin.</p>

              {formError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />{formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Adı <span className="text-red-400">*</span></label>
                    <input type="text" required value={form.companyName}
                      onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                      placeholder="TechCorp A.Ş."
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yetkili Adı</label>
                    <input type="text" value={form.contactName}
                      onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                      placeholder="Adınız Soyadınız"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta <span className="text-red-400">*</span></label>
                    <input type="email" required value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="yetkili@sirket.com"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input type="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="0532 000 00 00"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adet <span className="text-red-400">*</span></label>
                    <input type="number" required min="1" max={selectedDevice.stock} value={form.quantity}
                      onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi <span className="text-red-400">*</span></label>
                    <input type="date" required value={form.startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Süre (gün) <span className="text-red-400">*</span></label>
                    <input type="number" required min="1" value={form.durationDays}
                      onChange={e => setForm(f => ({ ...f, durationDays: e.target.value }))}
                      placeholder="ör. 30"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                {/* Tahmini fiyat */}
                {form.quantity && form.durationDays && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-indigo-700">
                      <Tag className="h-4 w-4" />
                      <span>Tahmini toplam ({form.quantity} cihaz × {form.durationDays} gün)</span>
                    </div>
                    <span className="text-lg font-black text-indigo-700">
                      {formatPrice(selectedDevice.dailyPrice * Number(form.quantity) * Number(form.durationDays))}
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                  <textarea rows={3} value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Özel gereksinimler, teslimat adresi vb."
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                </div>

                <button type="submit" disabled={formLoading}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
                  {formLoading ? 'Gönderiliyor...' : 'Kiralama Talebini Gönder'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // HOME VIEW
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-8 md:p-10 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-5 w-5 text-indigo-200" />
            <span className="text-indigo-200 text-sm font-semibold uppercase tracking-wider">Kurumsal Kiralama</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
            Firmanız İçin<br />Teknoloji Kirala
          </h1>
          <p className="text-indigo-100 text-sm md:text-base leading-relaxed mb-6">
            Saha ekiplerinden eğitim organizasyonlarına kadar her ihtiyaç için sigortalı, kurye teslimatlı cihaz kiralama.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Minimum 1 Gün', 'Ücretsiz Kargo', 'Hasar Sigortası'].map(tag => (
              <div key={tag} className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-sm font-medium">
                <Check className="h-3.5 w-3.5" />{tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avantajlar şeridi */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {BENEFITS.map(b => (
          <div key={b.title} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-start gap-2 hover:border-indigo-100 transition-colors">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
              <b.icon className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="font-bold text-sm text-gray-900">{b.title}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Cihaz ara..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
        </div>
        <div className="flex gap-2">
          {['Tümü', 'Telefon', 'Tablet'].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${category === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
              {cat === 'Telefon' && <Smartphone className="h-3.5 w-3.5" />}
              {cat === 'Tablet' && <Tablet className="h-3.5 w-3.5" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fiyat görünüm seçici */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs text-gray-500 font-medium">Fiyat gösterimi:</span>
        {PRICE_TIERS.map(t => (
          <button key={t.id} onClick={() => setPriceTier(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${priceTier === t.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50'}`}>
            {t.label}
            {t.discountPct > 0 && <span className="ml-1 opacity-75">-%{t.discountPct}</span>}
          </button>
        ))}
      </div>

      {/* Cihaz grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Smartphone className="h-14 w-14 text-gray-200 mb-4" />
          <h3 className="font-medium text-gray-900">Cihaz bulunamadı</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(device => (
            <div key={device.id}
              onClick={() => { setSelectedDevice(device); setView('detail'); setFormSuccess(false); setFormError(''); setForm({ companyName: '', contactName: '', email: currentUser?.email || '', phone: '', quantity: 1, startDate: '', durationDays: '', notes: '' }); }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all duration-200 group"
            >
              <div className="relative h-48 bg-[#f8f9fa] flex items-center justify-center overflow-hidden px-8 py-6">
                <img src={device.image} alt={device.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                {device.badge && (
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {device.badge}
                  </span>
                )}
                <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${device.category === 'Telefon' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'}`}>
                  {device.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-2 leading-tight">{device.name}</h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {device.specs.slice(0, 3).map(s => (
                    <span key={s} className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-medium">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium mb-0.5">
                      {PRICE_TIERS.find(t => t.id === priceTier)?.label} fiyat
                    </p>
                    <p className="text-xl font-black text-gray-900">
                      {formatPrice(tierPrice(device, priceTier))}
                      {priceTier === 'daily' && <span className="text-sm font-medium text-gray-400">/gün</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                    Kirala <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
