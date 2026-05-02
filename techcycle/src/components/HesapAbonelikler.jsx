import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Package, Gift, Wallet, MessageSquare, Star, User, Headphones,
  LogOut, ChevronRight, Crown, Check, Plus, Loader2, AlertCircle, Send, Clock,
  TrendingUp, Sparkles, Calendar,
  Truck, MapPin, FileText, RotateCcw, CreditCard, CheckCircle,
} from 'lucide-react';

const ACCOUNT_MENU = [
  { id: 'siparislerim', label: 'Siparişlerim', icon: Package },
  { id: 'premium', label: 'Premium Üyelik', icon: Crown },
  { id: 'firsatlar', label: 'Sana Özel Fırsatlar', icon: Gift },
  { id: 'cuzdan', label: 'Cüzdanım', icon: Wallet },
  { id: 'talepler', label: 'Soru ve Taleplerim', icon: MessageSquare },
  { id: 'degerlendirmeler', label: 'Değerlendirmelerim', icon: Star },
  { id: 'bilgiler', label: 'Kullanıcı Bilgilerim', icon: User },
  { id: 'destek', label: 'Müşteri Hizmetleri', icon: Headphones },
];

const PLANS = [
  {
    id: 'basic',
    label: 'Basic',
    price: 299,
    popular: false,
    features: ['Tüm Siparişlerde Ücretsiz Kargo', '7/24 Öncelikli Destek'],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: 499,
    popular: true,
    features: ['Basic\'teki her şey', '%5 Ekstra İndirim', 'Kampanyalara Erken Erişim'],
  },
  {
    id: 'elite',
    label: 'Elit',
    price: 899,
    popular: false,
    features: ['Pro\'daki her şey', '%15 Ekstra İndirim', 'Özel VIP Müşteri Temsilcisi'],
  },
];

const DEVICE_PICKS = [
  { name: 'Apple iPhone 16',           price: 59999, cat: 'Telefon',  bestMonth: 'Eylül',   tip: 'Apple her Eylül\'de yeni model çıkarır — önceki modeller %10-20 indirime girer.' },
  { name: 'Samsung Galaxy S25',        price: 54999, cat: 'Telefon',  bestMonth: 'Ocak',    tip: 'Samsung yeni S serisini Ocak/Şubat\'ta tanıtır; öncesi alım için iyi fırsat.' },
  { name: 'Apple MacBook Air 13" M3',  price: 64999, cat: 'Laptop',   bestMonth: 'Mart',    tip: 'Apple ilkbaharda MacBook güncellemesi yapar; yeni model çıkınca eski fiyatlar düşer.' },
  { name: 'Apple iPad Pro 11" M4',     price: 59999, cat: 'Tablet',   bestMonth: 'Kasım',   tip: 'Black Friday döneminde tablet kategorisinde en büyük indirimler yaşanır.' },
  { name: 'Apple Watch Series 10',     price: 22999, cat: 'Wearable', bestMonth: 'Eylül',   tip: 'Apple Watch her Eylül\'de iPhone ile birlikte yenilenir; önceki nesil indirime girer.' },
  { name: 'Apple AirPods Pro 2',       price: 14999, cat: 'Aksesuar', bestMonth: 'Kasım',   tip: 'Aksesuar kategorisinde en iyi kampanyalar Black Friday / Kasım dönemindedir.' },
];

const DEVICE_EMOJIS = {
  'Telefon': '📱', 'Laptop': '💻', 'Tablet': '🖥️', 'Wearable': '⌚', 'Aksesuar': '🎧',
};

const ORDER_STATUS = {
  pending:     { label: 'Beklemede',       color: 'bg-yellow-100 text-yellow-700'  },
  processing:  { label: 'Hazırlanıyor',    color: 'bg-blue-100 text-blue-700'      },
  shipped:     { label: 'Kargoya Verildi', color: 'bg-indigo-100 text-indigo-700'  },
  in_delivery: { label: 'Dağıtımda',       color: 'bg-purple-100 text-purple-700'  },
  delivered:   { label: 'Teslim Edildi',   color: 'bg-green-100 text-green-700'    },
};

const CARGO_STEPS   = ['Sipariş Alındı', 'Hazırlanıyor', 'Kargoya Verildi', 'Dağıtımda', 'Teslim Edildi'];
const STATUS_TO_STEP = { pending: 0, processing: 1, shipped: 2, in_delivery: 3, delivered: 4 };
const PAYMENT_LABELS = { card: 'Kredi / Banka Kartı', transfer: 'Havale / EFT', door: 'Kapıda Ödeme' };
const RETURN_REASONS = [
  'Hasarlı / Bozuk Ürün', 'Yanlış Ürün Geldi', 'Ürün Açıklamayla Uyuşmuyor',
  'Ürünü Beğenmedim', 'Vazgeçtim', 'Diğer',
];

const TICKET_STATUS = {
  open:        { label: 'Açık',    color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'İşlemde', color: 'bg-yellow-100 text-yellow-700' },
  resolved:    { label: 'Çözüldü', color: 'bg-green-100 text-green-700' },
};

export default function HesapAbonelikler({ setCurrentView, currentUser, currentSub: currentSubProp, onSubChange }) {
  const [activeTab, setActiveTab] = useState('premium');

  // Auth form
  const [authMode, setAuthMode]   = useState('signin');
  const [authForm, setAuthForm]   = useState({ email: '', password: '', name: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError]     = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Orders
  const [orders, setOrders]           = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderSections, setOrderSections] = useState({}); // orderId → 'invoice' | 'return' | null
  const [returnForms, setReturnForms]     = useState({}); // orderId → { reason, desc, loading, done }

  // Subscription
  const [currentSub, setCurrentSub]   = useState(null);
  const [subLoading, setSubLoading]   = useState(false);

  // Wallet
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletTxs, setWalletTxs]         = useState([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);

  // Tickets
  const [tickets, setTickets]             = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketForm, setTicketForm]       = useState({ subject: '', message: '' });
  const [ticketSubmitting, setTicketSubmitting] = useState(false);

  // Always load subscription when user is available (for sidebar status)
  useEffect(() => {
    if (!currentUser) return;
    fetchSubscription();
  }, [currentUser?.id]);

  // Load tab-specific data
  useEffect(() => {
    if (!currentUser) return;
    if (activeTab === 'siparislerim') fetchOrders();
    else if (activeTab === 'cuzdan')  fetchWallet();
    else if (activeTab === 'talepler') fetchTickets();
    else if (activeTab === 'premium') fetchSubscription();
  }, [currentUser?.id, activeTab]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    if (authMode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password,
      });
      if (error) setAuthError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password,
        options: { data: { full_name: authForm.name } },
      });
      if (error) setAuthError(error.message);
      else setAuthSuccess('Hesabınız oluşturuldu! E-posta adresinizi doğrulamayı unutmayın.');
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // ── Fetchers ──────────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setOrdersLoading(false);
  };

  const fetchSubscription = async () => {
    setSubLoading(true);
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1);
    setCurrentSub(data?.[0] ?? null);
    setSubLoading(false);
  };

  const fetchWallet = async () => {
    setWalletLoading(true);
    const { data } = await supabase
      .from('wallet_transactions')
      .select('*')
      .order('created_at', { ascending: false });
    const txs = data || [];
    setWalletTxs(txs);
    setWalletBalance(
      txs.reduce((sum, tx) => sum + (tx.type === 'deposit' ? tx.amount : -tx.amount), 0)
    );
    setWalletLoading(false);
  };

  const fetchTickets = async () => {
    setTicketsLoading(true);
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    setTickets(data || []);
    setTicketsLoading(false);
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleSubscribe = async (plan) => {
    setSubLoading(true);
    if (currentSub) {
      await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('id', currentSub.id);
    }
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    await supabase.from('subscriptions').insert({
      user_id: currentUser.id,
      plan_type: plan.id,
      price: plan.price,
      status: 'active',
      expires_at: expiresAt.toISOString(),
    });
    await fetchSubscription();
    if (onSubChange) await onSubChange();
    setSubLoading(false);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) return;
    setDepositLoading(true);
    await supabase.from('wallet_transactions').insert({
      user_id: currentUser.id,
      amount,
      type: 'deposit',
      description: 'Manuel bakiye yükleme',
    });
    setDepositAmount('');
    await fetchWallet();
    setDepositLoading(false);
  };

  const handleReturnSubmit = async (orderId) => {
    const form = returnForms[orderId] || {};
    if (!form.reason) return;
    setReturnForms(prev => ({ ...prev, [orderId]: { ...form, loading: true } }));
    await supabase.from('return_requests').insert({
      user_id: currentUser.id,
      order_id: orderId,
      reason: form.reason,
      description: form.desc || '',
      status: 'pending',
    });
    setReturnForms(prev => ({ ...prev, [orderId]: { ...form, loading: false, done: true } }));
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) return;
    setTicketSubmitting(true);
    await supabase.from('support_tickets').insert({
      user_id: currentUser.id,
      subject: ticketForm.subject.trim(),
      message: ticketForm.message.trim(),
      status: 'open',
    });
    setTicketForm({ subject: '', message: '' });
    await fetchTickets();
    setTicketSubmitting(false);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatPrice = (price) =>
    `₺${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)}`;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  // ── Auth Screen ───────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {authMode === 'signin' ? 'Giriş Yap' : 'Hesap Oluştur'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {authMode === 'signin'
                ? 'Hesabınıza erişmek için giriş yapın'
                : 'Ücretsiz hesabınızı oluşturun'}
            </p>
          </div>

          {authError && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {authError}
            </div>
          )}
          {authSuccess && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
              <Check className="h-4 w-4 flex-shrink-0" />
              {authSuccess}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={authForm.name}
                  onChange={e => setAuthForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Adınızı girin"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input
                type="email"
                required
                value={authForm.email}
                onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))}
                placeholder="ornek@email.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <input
                type="password"
                required
                value={authForm.password}
                onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}
                placeholder="En az 6 karakter"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {authMode === 'signin' ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {authMode === 'signin' ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}{' '}
            <button
              className="text-indigo-600 font-semibold hover:underline"
              onClick={() => {
                setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                setAuthError('');
                setAuthSuccess('');
              }}
            >
              {authMode === 'signin' ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const userName =
    currentUser.user_metadata?.full_name ||
    currentUser.email?.split('@')[0] ||
    'Kullanıcı';

  const effectiveSub = currentSubProp ?? currentSub;
  const activePlanLabel = effectiveSub
    ? PLANS.find(p => p.id === effectiveSub.plan_type)?.label ?? 'Premium'
    : null;

  const isEliteSub = effectiveSub?.plan_type === 'elite';
  const isProSub = effectiveSub?.plan_type === 'pro';

  const sidebarHeaderBg = isEliteSub
    ? 'bg-gradient-to-br from-amber-500 to-yellow-400'
    : isProSub
    ? 'bg-gradient-to-br from-purple-700 to-violet-500'
    : 'bg-indigo-600';

  const activeItemStyle = isEliteSub
    ? 'bg-amber-50 text-amber-700'
    : isProSub
    ? 'bg-purple-50 text-purple-700'
    : 'bg-indigo-50 text-indigo-700';

  const activeIconColor = isEliteSub ? 'text-amber-600' : isProSub ? 'text-purple-600' : 'text-indigo-600';
  const activeChevronColor = isEliteSub ? 'text-amber-500' : isProSub ? 'text-purple-500' : 'text-indigo-600';

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
          {/* Profile */}
          <div className={`p-6 text-white flex items-center space-x-4 ${sidebarHeaderBg}`}>
            <div className="h-12 w-12 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl border-2 border-indigo-200">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{userName}</h3>
              <p className="text-indigo-200 text-xs truncate max-w-[130px]">{currentUser.email}</p>
              <p className="text-indigo-100 text-xs font-medium mt-0.5">
                {activePlanLabel ? `${activePlanLabel} Üye` : 'Ücretsiz Üyelik'}
              </p>
            </div>
          </div>

          {/* Menu */}
          <nav className="p-2">
            <ul className="space-y-1">
              {ACCOUNT_MENU.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                        isActive
                          ? activeItemStyle
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`h-5 w-5 mr-3 ${isActive ? activeIconColor : 'text-gray-400'}`} />
                        {item.label}
                      </div>
                      {isActive && <ChevronRight className={`h-4 w-4 ${activeChevronColor}`} />}
                    </button>
                  </li>
                );
              })}

              <li className="pt-2 mt-2 border-t border-gray-100">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Çıkış Yap
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
            {ACCOUNT_MENU.find(m => m.id === activeTab)?.label}
          </h2>

          {/* ── ORDERS ── */}
          {activeTab === 'siparislerim' && (
            ordersLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Henüz bir siparişiniz yok</h3>
                <p className="text-gray-500 mt-2 mb-6 text-sm">Sipariş verdiğiniz ürünler burada görünecektir.</p>
                <button onClick={() => setCurrentView('home')}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-indigo-700 transition-colors">
                  Alışverişe Başla
                </button>
              </div>
            ) : (
              <ul className="space-y-5">
                {orders.map(order => {
                  const st           = ORDER_STATUS[order.status] ?? ORDER_STATUS.pending;
                  const currentStep  = STATUS_TO_STEP[order.status] ?? 0;
                  const section      = orderSections[order.id] ?? null;
                  const returnForm   = returnForms[order.id] ?? { reason: '', desc: '', loading: false, done: false };
                  const addr         = order.shipping_address;
                  const payLabel     = PAYMENT_LABELS[order.payment_method] ?? order.payment_method ?? 'Belirtilmemiş';
                  const isDelivered  = order.status === 'delivered';
                  const baseTotal    = (order.total || 0) / 1.2;
                  const kdv          = (order.total || 0) - baseTotal;

                  return (
                    <li key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden">

                      {/* HEADER */}
                      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                        <div>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Sipariş No</p>
                          <p className="text-sm font-mono font-bold text-gray-800">#{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 hidden sm:inline">{formatDate(order.created_at)}</span>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${st.color}`}>{st.label}</span>
                        </div>
                      </div>

                      <div className="p-5 space-y-5">

                        {/* ÜRÜNLER */}
                        <ul className="space-y-3">
                          {(order.items || []).map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                              {item.image && (
                                <div className="w-14 h-14 rounded-xl bg-[#f8f9fa] flex-shrink-0 flex items-center justify-center p-1.5">
                                  <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-darken" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                <p className="text-xs text-gray-400">Adet: {item.quantity}</p>
                              </div>
                              <span className="text-sm font-bold text-gray-900 flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                            </li>
                          ))}
                        </ul>

                        {/* ADRES + ÖDEME */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {addr ? (
                            <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2.5">
                              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Teslimat Adresi</p>
                                <p className="text-xs font-semibold text-gray-800">{addr.fullName}</p>
                                <p className="text-xs text-gray-500 leading-relaxed">{addr.addressLine}, {addr.district} / {addr.city}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2.5">
                              <MapPin className="h-4 w-4 text-gray-300" />
                              <p className="text-xs text-gray-400">Adres bilgisi yok</p>
                            </div>
                          )}
                          <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2.5">
                            <CreditCard className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Ödeme Yöntemi</p>
                              <p className="text-xs font-semibold text-gray-800">{payLabel}</p>
                            </div>
                          </div>
                        </div>

                        {/* KARGO TAKİBİ */}
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                            <Truck className="h-3.5 w-3.5" /> Kargo Takibi
                          </p>
                          <div className="flex items-center mb-2">
                            {CARGO_STEPS.map((_, i) => (
                              <React.Fragment key={i}>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${i <= currentStep ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-200'}`}>
                                  {i <= currentStep && <Check className="h-3 w-3 text-white" />}
                                </div>
                                {i < CARGO_STEPS.length - 1 && (
                                  <div className={`flex-1 h-0.5 transition-colors ${i < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                          <div className="flex">
                            {CARGO_STEPS.map((step, i) => (
                              <div key={step} className="flex-1 text-center">
                                <p className={`text-[9px] font-semibold leading-tight ${i === currentStep ? 'text-indigo-600' : i < currentStep ? 'text-gray-500' : 'text-gray-300'}`}>{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* TOPLAM + BUTONLAR */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                          <span className="font-bold text-gray-900 text-base">{formatPrice(order.total)}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setOrderSections(prev => ({ ...prev, [order.id]: prev[order.id] === 'invoice' ? null : 'invoice' }))}
                              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${section === 'invoice' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                              <FileText className="h-3.5 w-3.5" /> Fatura
                            </button>
                            <button
                              onClick={() => setOrderSections(prev => ({ ...prev, [order.id]: prev[order.id] === 'return' ? null : 'return' }))}
                              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                section === 'return'
                                  ? 'bg-red-600 text-white'
                                  : isDelivered
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              {isDelivered ? 'İade / Talep' : 'Diğer Talepler'}
                            </button>
                          </div>
                        </div>

                        {/* FATURA */}
                        {section === 'invoice' && (
                          <div className="border-t border-gray-100 pt-4">
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                              <div className="flex justify-between items-start mb-5">
                                <div>
                                  <p className="text-xl font-extrabold text-gray-900 tracking-tight">FATURA</p>
                                  <p className="text-xs text-gray-500 mt-0.5">No: #{order.id.slice(0, 8).toUpperCase()}</p>
                                  <p className="text-xs text-gray-500">Tarih: {formatDate(order.created_at)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-extrabold text-gray-900">TechCycle Teknoloji A.Ş.</p>
                                  <p className="text-xs text-gray-500">Vergi No: 1234567890</p>
                                  <p className="text-xs text-gray-500">destek@techcycle.com</p>
                                </div>
                              </div>
                              {addr && (
                                <div className="mb-4 pb-4 border-b border-gray-200">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Fatura Edilen</p>
                                  <p className="text-xs font-semibold text-gray-800">{addr.fullName}</p>
                                  <p className="text-xs text-gray-500">{addr.addressLine}, {addr.district} / {addr.city} {addr.postalCode}</p>
                                </div>
                              )}
                              <table className="w-full text-xs mb-4">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left text-gray-500 font-semibold pb-2 pr-4">Ürün</th>
                                    <th className="text-center text-gray-500 font-semibold pb-2 w-12">Adet</th>
                                    <th className="text-right text-gray-500 font-semibold pb-2 w-24">Tutar</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(order.items || []).map((item, i) => (
                                    <tr key={i} className="border-b border-gray-100">
                                      <td className="py-2 pr-4 text-gray-800 font-medium">{item.name}</td>
                                      <td className="py-2 text-center text-gray-600">{item.quantity}</td>
                                      <td className="py-2 text-right font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between text-gray-500"><span>Ara Toplam (KDV Hariç)</span><span>{formatPrice(baseTotal)}</span></div>
                                <div className="flex justify-between text-gray-500"><span>KDV (%20)</span><span>{formatPrice(kdv)}</span></div>
                                <div className="flex justify-between font-extrabold text-gray-900 text-sm pt-2 border-t border-gray-200 mt-1">
                                  <span>GENEL TOPLAM</span><span>{formatPrice(order.total)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* İADE / TALEP */}
                        {section === 'return' && (
                          <div className="border-t border-gray-100 pt-4">
                            <h4 className="font-bold text-sm text-gray-900 mb-1">
                              {isDelivered ? 'İade veya Diğer Talep' : 'Diğer Talepler'}
                            </h4>
                            <p className="text-xs text-gray-500 mb-4">
                              {isDelivered
                                ? 'Talebinizi ilettikten sonra ekibimiz 1 iş günü içinde sizinle iletişime geçecektir.'
                                : 'Sipariş teslim edilmeden iade başlatılamaz. Farklı bir konuda destek almak için talep oluşturabilirsiniz.'}
                            </p>
                            {returnForm.done ? (
                              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-xl">
                                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                Talebiniz alındı! Ekibimiz en kısa sürede dönüş yapacaktır.
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Talep Nedeni</label>
                                  <select
                                    value={returnForm.reason}
                                    onChange={e => setReturnForms(prev => ({ ...prev, [order.id]: { ...returnForm, reason: e.target.value } }))}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                                  >
                                    <option value="">Seçin...</option>
                                    {RETURN_REASONS.map(r => <option key={r}>{r}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Açıklama</label>
                                  <textarea rows={3}
                                    value={returnForm.desc || ''}
                                    onChange={e => setReturnForms(prev => ({ ...prev, [order.id]: { ...returnForm, desc: e.target.value } }))}
                                    placeholder="Talebinizi detaylandırın..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                                  />
                                </div>
                                <button
                                  disabled={!returnForm.reason || returnForm.loading}
                                  onClick={() => handleReturnSubmit(order.id)}
                                  className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-40"
                                >
                                  {returnForm.loading
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <RotateCcw className="h-4 w-4" />}
                                  {returnForm.loading ? 'Gönderiliyor...' : 'Talebi Gönder'}
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    </li>
                  );
                })}
              </ul>
            )
          )}

          {/* ── PREMIUM ── */}
          {activeTab === 'premium' && (
            <div>
              {currentSub && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-8 flex items-center gap-3">
                  <Crown className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-indigo-800">
                      Mevcut Plan: {PLANS.find(p => p.id === currentSub.plan_type)?.label}
                    </p>
                    <p className="text-xs text-indigo-500">
                      Yenileme: {formatDate(currentSub.expires_at)}
                    </p>
                  </div>
                </div>
              )}

              {subLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PLANS.map(plan => {
                    const isActive = currentSub?.plan_type === plan.id;
                    return (
                      <div
                        key={plan.id}
                        className={`relative rounded-2xl border-2 p-6 flex flex-col ${
                          plan.popular
                            ? 'border-indigo-500 shadow-lg shadow-indigo-100'
                            : 'border-gray-100'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                            EN POPÜLER
                          </span>
                        )}
                        <h4 className="font-bold text-xl text-gray-900 mb-1">{plan.label}</h4>
                        <p className="text-3xl font-extrabold text-indigo-600 mb-4">
                          ₺{plan.price}
                          <span className="text-sm font-medium text-gray-400">/ay</span>
                        </p>
                        <ul className="text-sm text-gray-600 space-y-2 mb-8 flex-1">
                          {plan.features.map(f => (
                            <li key={f} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => handleSubscribe(plan)}
                          disabled={isActive || subLoading}
                          className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${
                            isActive
                              ? 'bg-green-100 text-green-700 cursor-default'
                              : plan.popular
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-gray-900 text-white hover:bg-indigo-600'
                          }`}
                        >
                          {isActive ? '✓ Mevcut Plan' : 'Abone Ol'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── WALLET ── */}
          {activeTab === 'cuzdan' && (
            <div className="space-y-6">

              {/* Balance card */}
              <div className="bg-gradient-to-br from-slate-800 to-indigo-900 rounded-2xl p-6 text-white">
                <p className="text-indigo-200 text-sm font-medium mb-1">Kullanılabilir Bakiye</p>
                {walletLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin opacity-60 mt-1" />
                ) : (
                  <>
                    <h3 className="text-4xl font-black">{formatPrice(walletBalance)}</h3>
                    {walletBalance > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 text-emerald-300 text-sm font-medium">
                        <TrendingUp className="h-4 w-4" />
                        <span>Bu ay +{formatPrice(walletBalance * 0.01)} kazanacaksınız</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* ── Büyüme Projeksiyonu ── */}
              {!walletLoading && walletBalance > 0 && (
                <>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Aylık %1 Otomatik Kazanç</p>
                        <p className="text-xs text-gray-500">Yüklediğiniz bakiyenin %1'i her ay hesabınıza eklenir</p>
                      </div>
                    </div>

                    {/* 3 metric boxes */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { label: 'Bu Ay Kazanç',  value: walletBalance * 0.01,              color: 'text-emerald-600' },
                        { label: '3 Ay Sonra',    value: walletBalance * Math.pow(1.01, 3), color: 'text-gray-900'    },
                        { label: '6 Ay Sonra',    value: walletBalance * Math.pow(1.01, 6), color: 'text-indigo-700'  },
                      ].map(item => (
                        <div key={item.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                          <p className="text-[11px] text-gray-400 font-medium mb-0.5">{item.label}</p>
                          <p className={`text-sm font-black ${item.color}`}>{formatPrice(item.value)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Bar chart — Şimdi + 6 ay projeksiyon */}
                    {(() => {
                      const bars = Array.from({ length: 7 }, (_, i) => ({
                        label: i === 0 ? 'Şimdi' : `${i}. Ay`,
                        value: walletBalance * Math.pow(1.01, i),
                        projected: i > 0,
                      }));
                      const maxVal = bars[6].value;
                      return (
                        <div>
                          <div className="flex items-end gap-1.5 h-28 mb-1">
                            {bars.map((bar, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                                <div
                                  className={`w-full rounded-t-md transition-all duration-500 ${bar.projected ? 'bg-indigo-200' : 'bg-indigo-600'}`}
                                  style={{ height: `${Math.max(6, (bar.value / maxVal) * 100)}%` }}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-1.5 mb-3">
                            {bars.map((bar, i) => (
                              <div key={i} className="flex-1 text-center">
                                <p className="text-[10px] text-gray-400">{bar.label}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 justify-end">
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-sm bg-indigo-600" />
                              <span className="text-[11px] text-gray-500">Mevcut</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-sm bg-indigo-200" />
                              <span className="text-[11px] text-gray-500">Projeksiyon</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* ── Cihaz Tavsiyeleri ── */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-indigo-500" />
                      <h3 className="font-bold text-gray-900">Cihaz Tavsiyeleri</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {DEVICE_PICKS.map(device => {
                        let monthsNeeded = 0;
                        if (walletBalance < device.price) {
                          let bal = walletBalance;
                          while (bal < device.price && monthsNeeded < 120) {
                            bal *= 1.01;
                            monthsNeeded++;
                          }
                          if (monthsNeeded >= 120) monthsNeeded = null;
                        }
                        const canAfford = walletBalance >= device.price;
                        return (
                          <div
                            key={device.name}
                            className={`border rounded-2xl p-4 transition-colors ${canAfford ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-white hover:border-indigo-100'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${canAfford ? 'bg-emerald-100' : 'bg-gray-50'}`}>
                                {DEVICE_EMOJIS[device.cat] || '📱'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-0.5">
                                  <p className="font-bold text-sm text-gray-900 leading-tight">{device.name}</p>
                                  {canAfford ? (
                                    <span className="text-[11px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold flex-shrink-0">Şimdi Al!</span>
                                  ) : monthsNeeded ? (
                                    <span className="text-[11px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold flex-shrink-0">{monthsNeeded} ay</span>
                                  ) : null}
                                </div>
                                <p className="text-sm font-extrabold text-gray-900 mb-1.5">{formatPrice(device.price)}</p>
                                <div className="flex items-center gap-1 mb-1.5">
                                  <Calendar className="h-3 w-3 text-indigo-500 flex-shrink-0" />
                                  <p className="text-xs text-indigo-600 font-semibold">{device.bestMonth}'da almak en avantajlı</p>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">{device.tip}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Deposit form */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Bakiye Yükle</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[100, 250, 500, 1000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setDepositAmount(String(amt))}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                        depositAmount === String(amt)
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                      }`}
                    >
                      ₺{amt}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleDeposit} className="flex gap-3">
                  <input
                    type="number"
                    min="1"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    placeholder="Tutar girin (₺)"
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!depositAmount || depositLoading}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-40 flex items-center gap-2"
                  >
                    {depositLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Yükle
                  </button>
                </form>
              </div>

              {/* Transaction history */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">İşlem Geçmişi</h3>
                {walletLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                  </div>
                ) : walletTxs.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">Henüz işlem geçmişi yok.</p>
                ) : (
                  <ul className="space-y-3">
                    {walletTxs.map(tx => (
                      <li key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                            tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                          }`}>
                            {tx.type === 'deposit' ? <Plus className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {tx.description || (tx.type === 'deposit' ? 'Bakiye Yükleme' : 'Harcama')}
                            </p>
                            <p className="text-xs text-gray-400">{formatDate(tx.created_at)}</p>
                          </div>
                        </div>
                        <span className={`font-bold text-sm ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-500'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}{formatPrice(tx.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ── TICKETS ── */}
          {activeTab === 'talepler' && (
            <div className="space-y-6">
              {/* New ticket form */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Yeni Talep Oluştur</h3>
                <form onSubmit={handleTicketSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                    <input
                      type="text"
                      required
                      value={ticketForm.subject}
                      onChange={e => setTicketForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="Konunuzu kısaca belirtin"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
                    <textarea
                      required
                      rows={4}
                      value={ticketForm.message}
                      onChange={e => setTicketForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Sorunuzu veya talebinizi detaylıca açıklayın..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={ticketSubmitting}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-40 flex items-center gap-2"
                  >
                    {ticketSubmitting
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Send className="h-4 w-4" />}
                    Gönder
                  </button>
                </form>
              </div>

              {/* Ticket list */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Taleplerim</h3>
                {ticketsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                  </div>
                ) : tickets.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">Henüz talebiniz yok.</p>
                ) : (
                  <ul className="space-y-3">
                    {tickets.map(ticket => {
                      const st = TICKET_STATUS[ticket.status] ?? TICKET_STATUS.open;
                      return (
                        <li key={ticket.id} className="border border-gray-100 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-semibold text-sm text-gray-900">{ticket.subject}</p>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${st.color}`}>
                              {st.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{ticket.message}</p>
                          <p className="text-xs text-gray-400">{formatDate(ticket.created_at)}</p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ── PLACEHOLDER TABS ── */}
          {activeTab === 'firsatlar' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-indigo-100 bg-indigo-50 rounded-xl p-6 text-center">
                <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  SİZE ÖZEL
                </span>
                <h3 className="font-bold text-xl mb-2 text-indigo-900">Teknoloji Haftası</h3>
                <p className="text-indigo-700 text-sm mb-4">Seçili bilgisayarlarda %15 ekstra indirim!</p>
                <button className="text-indigo-600 font-bold hover:underline">Fırsatı Gör</button>
              </div>
            </div>
          )}

          {['degerlendirmeler', 'bilgiler', 'destek'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                {activeTab === 'degerlendirmeler' && <Star className="h-8 w-8 text-gray-400" />}
                {activeTab === 'bilgiler' && <User className="h-8 w-8 text-gray-400" />}
                {activeTab === 'destek' && <Headphones className="h-8 w-8 text-gray-400" />}
              </div>
              <h3 className="text-gray-900 font-medium mb-2">Bu alan yapım aşamasındadır</h3>
              <p className="text-sm max-w-sm">Gelecek güncellemelerde bu bölümü kullanabileceksiniz.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
