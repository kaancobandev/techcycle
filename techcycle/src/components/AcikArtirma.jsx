import { useState, useEffect } from 'react';
import { Crown, Lock, ChevronLeft, Clock, Users, TrendingUp, Zap, ChevronUp, Trophy, Flame } from 'lucide-react';

const NOW = Date.now();

const INITIAL_ITEMS = [
  {
    id: 'a1',
    name: 'iPhone 16 Pro Max',
    edition: 'Titanium Special Edition',
    image: 'https://images.unsplash.com/photo-1726587912121-ea21fcc57ff8?auto=format&fit=crop&q=80&w=800',
    original: { ram: '8 GB RAM', storage: '256 GB', color: 'Siyah Titanyum' },
    upgraded: { ram: '16 GB RAM', storage: '1 TB', color: 'Özel Titanium Kaplama' },
    upgrades: ['RAM 2 kat artırıldı (8 GB → 16 GB)', 'Depolama 4 kat artırıldı (256 GB → 1 TB)', 'Özel titanyum renk işlemi'],
    startPrice: 124999,
    currentBid: 158500,
    minIncrement: 2500,
    bidCount: 31,
    endTime: NOW + 1000 * (60 * 60 * 46 + 60 * 17),
    hot: true,
  },
  {
    id: 'a2',
    name: 'Samsung Galaxy S25 Ultra',
    edition: 'Performance Max Edition',
    image: 'https://images.unsplash.com/photo-1738830251513-a7bfef4b53c6?auto=format&fit=crop&q=80&w=800',
    original: { ram: '12 GB RAM', storage: '256 GB', color: 'Titanium Black' },
    upgraded: { ram: '24 GB RAM', storage: '1 TB', color: 'Phantom Titanium' },
    upgrades: ['RAM 2 kat artırıldı (12 GB → 24 GB)', 'Depolama 4 kat artırıldı (256 GB → 1 TB)', 'Snapdragon 8 Elite overclocked BIOS'],
    startPrice: 114999,
    currentBid: 141000,
    minIncrement: 2000,
    bidCount: 24,
    endTime: NOW + 1000 * (60 * 60 * 71 + 60 * 44),
    hot: false,
  },
  {
    id: 'a3',
    name: 'iPhone 16 Pro',
    edition: 'Desert Titanium Ultra',
    image: 'https://images.unsplash.com/photo-1726828537956-61ae115d7d7a?auto=format&fit=crop&q=80&w=800',
    original: { ram: '8 GB RAM', storage: '128 GB', color: 'Natural Titanium' },
    upgraded: { ram: '12 GB RAM', storage: '512 GB', color: 'Desert Gold Titanium' },
    upgrades: ['RAM 1.5 kat artırıldı (8 GB → 12 GB)', 'Depolama 4 kat artırıldı (128 GB → 512 GB)', 'Desert Gold özel renk kaplama'],
    startPrice: 94999,
    currentBid: 109750,
    minIncrement: 1500,
    bidCount: 17,
    endTime: NOW + 1000 * (60 * 60 * 23 + 60 * 5),
    hot: true,
  },
  {
    id: 'a4',
    name: 'Samsung Galaxy Z Fold 6',
    edition: 'Elite Storage Edition',
    image: 'https://images.unsplash.com/photo-1568378711447-f5eef04d85b5?auto=format&fit=crop&q=80&w=800',
    original: { ram: '12 GB RAM', storage: '256 GB', color: 'Shadow' },
    upgraded: { ram: '16 GB RAM', storage: '1 TB', color: 'Midnight Obsidian' },
    upgrades: ['RAM artırıldı (12 GB → 16 GB)', 'Depolama 4 kat artırıldı (256 GB → 1 TB)', 'Midnight Obsidian özel renk'],
    startPrice: 134999,
    currentBid: 162000,
    minIncrement: 3000,
    bidCount: 19,
    endTime: NOW + 1000 * (60 * 60 * 95 + 60 * 30),
    hot: false,
  },
  {
    id: 'a5',
    name: 'Samsung Galaxy S25+',
    edition: 'Hyper RAM Edition',
    image: 'https://images.unsplash.com/photo-1738830234395-a351829a1c7b?auto=format&fit=crop&q=80&w=800',
    original: { ram: '12 GB RAM', storage: '256 GB', color: 'Icy Blue' },
    upgraded: { ram: '20 GB RAM', storage: '512 GB', color: 'Arctic Prism' },
    upgrades: ['RAM 1.6 kat artırıldı (12 GB → 20 GB)', 'Depolama 2 kat artırıldı (256 GB → 512 GB)', 'Arctic Prism özel kaplama'],
    startPrice: 84999,
    currentBid: 97500,
    minIncrement: 1500,
    bidCount: 14,
    endTime: NOW + 1000 * (60 * 60 * 58 + 60 * 12),
    hot: false,
  },
  {
    id: 'a6',
    name: 'iPhone 15 Pro Max',
    edition: 'Cobalt Titanium Edition',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
    original: { ram: '8 GB RAM', storage: '256 GB', color: 'Natural Titanium' },
    upgraded: { ram: '16 GB RAM', storage: '1 TB', color: 'Cobalt Blue Titanium' },
    upgrades: ['RAM 2 kat artırıldı (8 GB → 16 GB)', 'Depolama 4 kat artırıldı (256 GB → 1 TB)', 'Cobalt Blue titanyum kaplama'],
    startPrice: 99999,
    currentBid: 118000,
    minIncrement: 2000,
    bidCount: 22,
    endTime: NOW + 1000 * (60 * 60 * 35 + 60 * 50),
    hot: false,
  },
];

function useCountdown(endTime) {
  const calc = () => {
    const diff = Math.max(0, endTime - Date.now());
    return {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff / (1000 * 60 * 60)) % 24),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60),
      done: diff === 0,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [endTime]);
  return t;
}

function CountdownBadge({ endTime, accent }) {
  const t = useCountdown(endTime);
  if (t.done) return <span className="text-xs font-bold text-red-500">Sona Erdi</span>;
  const urgent = t.d === 0 && t.h < 6;
  return (
    <div className={`flex items-center gap-1.5 text-xs font-bold ${urgent ? 'text-red-400' : accent}`}>
      <Clock className="h-3.5 w-3.5" />
      {t.d > 0 && <span>{t.d}g </span>}
      <span>{String(t.h).padStart(2,'0')}:{String(t.m).padStart(2,'0')}:{String(t.s).padStart(2,'0')}</span>
    </div>
  );
}

function AuctionCard({ item, isElite, onBid }) {
  const [bidding, setBidding] = useState(false);
  const accent = isElite ? 'text-amber-400' : 'text-violet-400';
  const accentBg = isElite ? 'bg-amber-400' : 'bg-violet-500';
  const accentBorder = isElite ? 'border-amber-400/30' : 'border-violet-400/30';

  const handleBid = () => {
    setBidding(true);
    setTimeout(() => { onBid(item.id); setBidding(false); }, 600);
  };

  return (
    <div className={`bg-slate-800 rounded-3xl border ${accentBorder} overflow-hidden flex flex-col`}>
      {/* Görsel + rozetler */}
      <div className="relative h-52 bg-slate-900 flex items-center justify-center p-6">
        {item.hot && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            <Flame className="h-3 w-3" /> HOT
          </div>
        )}
        <div className={`absolute top-3 right-3 flex items-center gap-1 ${isElite ? 'bg-amber-400/20 text-amber-400' : 'bg-violet-500/20 text-violet-300'} text-[10px] font-bold px-2.5 py-1 rounded-full border ${accentBorder}`}>
          <Zap className="h-3 w-3" /> YÜKSELTILMIŞ
        </div>
        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Başlık */}
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-widest ${accent} mb-0.5`}>{item.edition}</p>
          <h3 className="text-white font-black text-lg leading-tight">{item.name}</h3>
        </div>

        {/* Yükseltme farkı */}
        <div className={`rounded-2xl border ${accentBorder} overflow-hidden`}>
          <div className="grid grid-cols-2 divide-x divide-slate-700">
            <div className="p-3">
              <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1.5">Orijinal</p>
              <p className="text-slate-400 text-xs">{item.original.ram}</p>
              <p className="text-slate-400 text-xs">{item.original.storage}</p>
              <p className="text-slate-400 text-xs">{item.original.color}</p>
            </div>
            <div className="p-3">
              <p className={`text-[10px] font-bold uppercase mb-1.5 ${accent}`}>Yükseltilmiş</p>
              <p className="text-white text-xs font-semibold">{item.upgraded.ram}</p>
              <p className="text-white text-xs font-semibold">{item.upgraded.storage}</p>
              <p className="text-white text-xs font-semibold">{item.upgraded.color}</p>
            </div>
          </div>
          <div className={`border-t border-slate-700 px-3 py-2 ${isElite ? 'bg-amber-400/5' : 'bg-violet-500/5'}`}>
            <ul className="space-y-1">
              {item.upgrades.map((u, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                  <ChevronUp className={`h-3 w-3 flex-shrink-0 mt-0.5 ${accent}`} />
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Teklif bilgisi */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-slate-500 text-[11px] font-medium mb-0.5">Güncel Teklif</p>
            <p className={`text-2xl font-black ${accent}`}>
              ₺{item.currentBid.toLocaleString('tr-TR')}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Users className="h-3 w-3" /> {item.bidCount} teklif
              </span>
              <CountdownBadge endTime={item.endTime} accent={accent} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-600 text-[10px] mb-0.5">Min. artış</p>
            <p className="text-slate-400 text-xs font-semibold">+₺{item.minIncrement.toLocaleString('tr-TR')}</p>
          </div>
        </div>

        {/* Buton */}
        <button
          onClick={handleBid}
          disabled={bidding}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${bidding ? 'opacity-60 scale-95' : 'hover:scale-[1.02]'} ${isElite ? 'bg-amber-400 text-slate-900 hover:bg-amber-300' : 'bg-violet-600 text-white hover:bg-violet-500'}`}
        >
          <TrendingUp className="h-4 w-4" />
          {bidding ? 'Teklifiniz İşleniyor...' : `₺${(item.currentBid + item.minIncrement).toLocaleString('tr-TR')} Teklif Ver`}
        </button>
      </div>
    </div>
  );
}

export default function AcikArtirma({ currentUser, tier, isElite, isPro, onGoToAccount, onBack }) {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [toastMsg, setToastMsg] = useState('');

  const hasPremium = isElite || isPro;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleBid = (id) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, currentBid: item.currentBid + item.minIncrement, bidCount: item.bidCount + 1 }
        : item
    ));
    showToast('Teklifiniz başarıyla verildi!');
  };

  const accentGradient = isElite
    ? 'from-amber-400 via-yellow-300 to-amber-500'
    : 'from-violet-500 via-purple-400 to-violet-600';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl font-semibold text-sm">
          ✓ {toastMsg}
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${isElite ? 'from-amber-900/40 to-slate-950' : 'from-violet-900/40 to-slate-950'}`} />
        <div className="relative max-w-7xl mx-auto px-4 pt-10 pb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Ana Sayfaya Dön
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 bg-gradient-to-r ${accentGradient} text-slate-900`}>
                <Crown className="h-3.5 w-3.5" />
                {isElite ? 'ELİT VIP' : 'PRO'} — Özel Erişim
              </div>
              <h1 className="text-5xl font-black mb-3 leading-tight">
                Açık<br />
                <span className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>Arttırma</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-lg">
                Standart pazarda bulamayacağınız, özel olarak yükseltilmiş cihazlar. Daha fazla RAM, daha fazla depolama, özel renk edisyonları.
              </p>
            </div>
            <div className="flex gap-4">
              {[
                { label: 'Aktif İlan', value: items.length },
                { label: 'Toplam Teklif', value: items.reduce((a, b) => a + b.bidCount, 0) },
              ].map(stat => (
                <div key={stat.label} className={`text-center px-6 py-4 rounded-2xl border ${isElite ? 'border-amber-400/20 bg-amber-400/5' : 'border-violet-400/20 bg-violet-500/5'}`}>
                  <p className={`text-3xl font-black ${isElite ? 'text-amber-400' : 'text-violet-400'}`}>{stat.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {!hasPremium ? (
          /* Erişim engeli */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
              <Lock className="h-9 w-9 text-slate-500" />
            </div>
            <h2 className="text-2xl font-black mb-3">Premium Üyelik Gerekiyor</h2>
            <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
              Açık Arttırma sayfası yalnızca <strong className="text-white">Pro</strong> ve <strong className="text-white">Elite</strong> üyelere açıktır.
              Yükseltilmiş cihazlara teklif verebilmek için premium üyeliğe geçin.
            </p>
            <button
              onClick={onGoToAccount}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity"
            >
              <Crown className="h-5 w-5" />
              Premium'a Geç
            </button>
          </div>
        ) : (
          <>
            {/* Uyarı bandı */}
            <div className={`mb-8 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm border ${isElite ? 'bg-amber-400/5 border-amber-400/20 text-amber-200' : 'bg-violet-500/5 border-violet-500/20 text-violet-200'}`}>
              <Trophy className="h-4 w-4 flex-shrink-0" />
              <span>Teklif verdiğinizde açık arttırma sona erdiğinde en yüksek teklif sahibi ile iletişime geçilir. Teklif bağlayıcı nitelik taşır.</span>
            </div>

            {/* Ürün ızgarası */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <AuctionCard
                  key={item.id}
                  item={item}
                  isElite={isElite}
                  onBid={handleBid}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
