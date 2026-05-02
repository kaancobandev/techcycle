import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  Plus, Search, ArrowLeft, Star, MessageCircle, ShoppingBag,
  Camera, X, ChevronLeft, ChevronRight, Send, Loader2, Check,
  Shield, AlertCircle, Image as ImageIcon, User, Package,
  BadgeCheck, Sparkles, Award, CreditCard, ShieldCheck, Bot,
} from 'lucide-react';

const PAZAR_CATEGORIES = ['Tümü', 'Telefon', 'Laptop', 'Tablet', 'Saat & Giyilebilir', 'Aksesuar', 'Diğer'];
const CREATE_CATEGORIES = ['Telefon', 'Laptop', 'Tablet', 'Saat & Giyilebilir', 'Aksesuar', 'Diğer'];
const CONDITIONS = ['Yeni', 'Yeni Gibi', 'İyi', 'Makul'];
const CONDITION_STYLES = {
  'Yeni': 'bg-emerald-100 text-emerald-700',
  'Yeni Gibi': 'bg-blue-100 text-blue-700',
  'İyi': 'bg-amber-100 text-amber-700',
  'Makul': 'bg-orange-100 text-orange-700',
};

const COSMETIC_CHECKS = [
  { name: 'Ekran Durumu', detail: 'Ekran yüzeyi piksel düzeyinde analiz edildi' },
  { name: 'Gövde & Çerçeve', detail: 'Kasada çizik/çentik tespiti yapıldı' },
  { name: 'Arka Kapak', detail: 'Arka yüzey bütünlüğü değerlendirildi' },
  { name: 'Kamera Camı', detail: 'Lens camında kırık/çatlak kontrolü yapıldı' },
  { name: 'Tuş & Butonlar', detail: 'Tüm fiziksel tuşlar incelendi' },
];

const ORIGINALITY_CHECKS = [
  { name: 'Batarya', detail: 'Batarya seri kodu orijinal üretici ile eşleştirildi' },
  { name: 'Ekran Paneli', detail: 'Panel renk profili ve yanıt süresi doğrulandı' },
  { name: 'Kamera Modülü', detail: 'Kamera modülü kimliği fabrika kaydıyla karşılaştırıldı' },
  { name: 'Şarj Portu', detail: 'Bileşen direnci ve tork değerleri ölçüldü' },
  { name: 'Ana Kart', detail: 'Anakart imza hash\'i doğrulandı' },
];

// Sertifikasyon ücreti hesaplama
const getCertFee = (price) => {
  if (price >= 70000) return 7000;
  if (price >= 50000) return 5000;
  if (price >= 25000) return 1750;
  return null;
};

// YZ raporu üretici (kondisyona göre gerçekçi puanlar)
const generateAIReport = (condition) => {
  const base = {
    'Yeni':       { c: 97, o: 99 },
    'Yeni Gibi':  { c: 87, o: 95 },
    'İyi':        { c: 73, o: 89 },
    'Makul':      { c: 55, o: 81 },
  }[condition] || { c: 70, o: 88 };

  const v = (n, range = 5) =>
    Math.min(100, Math.max(40, n + Math.floor(Math.random() * range * 2 - range)));

  const cosmeticChecks = COSMETIC_CHECKS.map(ch => ({ ...ch, score: v(base.c) }));
  const originalityChecks = ORIGINALITY_CHECKS.map(ch => ({ ...ch, score: v(base.o, 3) }));

  const avgCosmetic    = Math.round(cosmeticChecks.reduce((s, c) => s + c.score, 0) / cosmeticChecks.length);
  const avgOriginality = Math.round(originalityChecks.reduce((s, c) => s + c.score, 0) / originalityChecks.length);
  const overall        = Math.round((avgCosmetic + avgOriginality) / 2);
  const grade = overall >= 95 ? 'A+' : overall >= 85 ? 'A' : overall >= 75 ? 'B' : overall >= 60 ? 'C' : 'D';

  return { cosmeticChecks, originalityChecks, avgCosmetic, avgOriginality, overall, grade };
};

const GRADE_COLORS = {
  'A+': 'text-emerald-600', A: 'text-green-600', B: 'text-blue-600', C: 'text-amber-600', D: 'text-red-500',
};

const ScoreBar = ({ score }) => (
  <div className="flex items-center gap-2 flex-1">
    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all duration-500 ${score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-blue-500' : score >= 55 ? 'bg-amber-500' : 'bg-red-400'}`}
        style={{ width: `${score}%` }}
      />
    </div>
    <span className="text-xs font-bold text-gray-700 w-8 text-right">{score}</span>
  </div>
);

const formatPrice = (p) =>
  `₺${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(p)}`;
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

// ── ANA BİLEŞEN ────────────────────────────────────────────────────────────────
export default function Pazar({ currentUser, onGoToAccount }) {
  const [view, setView] = useState('home');
  const [selectedListing, setSelectedListing] = useState(null);

  // Home
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  // Create
  const [createForm, setCreateForm] = useState({
    title: '', category: 'Telefon', condition: 'İyi', price: '', description: '', specs: '',
  });
  const [photoFiles, setPhotoFiles] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const fileInputRef = useRef(null);

  // Detail
  const [photoIndex, setPhotoIndex] = useState(0);
  const [detailTab, setDetailTab] = useState('qa');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Q&A
  const [questions, setQuestions] = useState([]);
  const [qaLoading, setQaLoading] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [answerInputs, setAnswerInputs] = useState({});

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, hoverRating: 0, comment: '' });

  // Sertifikasyon
  const [certModal, setCertModal] = useState(false);
  const [certStep, setCertStep] = useState(0);     // 0=intro 1=payment 2=analyzing 3=result
  const [certReport, setCertReport] = useState(null);
  const [certProgress, setCertProgress] = useState(0); // 0-10 (5 cosmetic + 5 orig)
  const [existingCert, setExistingCert] = useState(null);
  const [certLoading, setCertLoading] = useState(false);

  useEffect(() => { fetchListings(); }, []);

  useEffect(() => {
    if (selectedListing) {
      fetchQuestions(selectedListing.id);
      fetchReviews(selectedListing.id);
      fetchCertification(selectedListing.id);
      setPhotoIndex(0);
      setPurchaseSuccess(false);
      setDetailTab('qa');
    }
  }, [selectedListing?.id]);

  // Analiz animasyonu
  useEffect(() => {
    if (certStep !== 2 || !certReport) return;
    setCertProgress(0);
    const total = COSMETIC_CHECKS.length + ORIGINALITY_CHECKS.length;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setCertProgress(current);
      if (current >= total) {
        clearInterval(timer);
        setTimeout(() => setCertStep(3), 600);
      }
    }, 380);
    return () => clearInterval(timer);
  }, [certStep, certReport]);

  // ── Veri çekme ─────────────────────────────────────────────────────────────

  const fetchListings = async () => {
    setListingsLoading(true);
    const { data } = await supabase
      .from('listings').select('*').eq('status', 'active')
      .order('created_at', { ascending: false });
    setListings(data || []);
    setListingsLoading(false);
  };

  const fetchQuestions = async (id) => {
    setQaLoading(true);
    const { data } = await supabase
      .from('listing_questions').select('*').eq('listing_id', id)
      .order('created_at', { ascending: true });
    setQuestions(data || []);
    setQaLoading(false);
  };

  const fetchReviews = async (id) => {
    setReviewsLoading(true);
    const { data } = await supabase
      .from('listing_reviews').select('*').eq('listing_id', id)
      .order('created_at', { ascending: false });
    setReviews(data || []);
    setReviewsLoading(false);
  };

  const fetchCertification = async (id) => {
    const { data } = await supabase
      .from('certifications').select('*').eq('listing_id', id).maybeSingle();
    setExistingCert(data ?? null);
  };

  // ── Fotoğraf ────────────────────────────────────────────────────────────────

  const handlePhotoAdd = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - photoFiles.length;
    const toAdd = files.slice(0, remaining).map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setPhotoFiles(prev => [...prev, ...toAdd]);
    e.target.value = '';
  };

  const removePhoto = (i) => {
    setPhotoFiles(prev => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const uploadPhoto = async (photo) => {
    const ext = photo.file.name.split('.').pop();
    const path = `${currentUser.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('listing-photos').upload(path, photo.file);
    if (error) throw error;
    return supabase.storage.from('listing-photos').getPublicUrl(path).data.publicUrl;
  };

  const sellerName = () =>
    currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Kullanıcı';

  // ── İlan oluşturma ──────────────────────────────────────────────────────────

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) { onGoToAccount(); return; }
    if (photoFiles.length === 0) { setCreateError('En az 1 fotoğraf ekleyin.'); return; }
    setCreateLoading(true);
    setCreateError('');
    try {
      const photos = await Promise.all(photoFiles.map(uploadPhoto));
      await supabase.from('listings').insert({
        user_id: currentUser.id,
        seller_name: sellerName(),
        title: createForm.title.trim(),
        category: createForm.category,
        condition: createForm.condition,
        price: parseFloat(createForm.price),
        description: createForm.description.trim(),
        specs: createForm.specs.trim(),
        photos,
        status: 'active',
        is_certified: false,
      });
      photoFiles.forEach(p => URL.revokeObjectURL(p.preview));
      setPhotoFiles([]);
      setCreateForm({ title: '', category: 'Telefon', condition: 'İyi', price: '', description: '', specs: '' });
      await fetchListings();
      setView('home');
    } catch (err) {
      setCreateError(`Hata: ${err?.message || JSON.stringify(err)}`);
    } finally {
      setCreateLoading(false);
    }
  };

  // ── Satın alma ──────────────────────────────────────────────────────────────

  const handlePurchase = async () => {
    if (!currentUser) { onGoToAccount(); return; }
    if (purchaseLoading || purchaseSuccess) return;
    setPurchaseLoading(true);
    await supabase.from('orders').insert({
      user_id: currentUser.id,
      items: [{ id: selectedListing.id, name: selectedListing.title, price: selectedListing.price, quantity: 1 }],
      total: selectedListing.price,
      status: 'pending',
    });
    await supabase.from('listings').update({ status: 'sold' }).eq('id', selectedListing.id);
    setPurchaseSuccess(true);
    setPurchaseLoading(false);
  };

  // ── Soru & Cevap ────────────────────────────────────────────────────────────

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!currentUser) { onGoToAccount(); return; }
    if (!questionInput.trim()) return;
    await supabase.from('listing_questions').insert({
      listing_id: selectedListing.id,
      asker_id: currentUser.id,
      asker_name: sellerName(),
      question: questionInput.trim(),
    });
    setQuestionInput('');
    await fetchQuestions(selectedListing.id);
  };

  const handleAnswerSubmit = async (qId) => {
    const text = answerInputs[qId];
    if (!text?.trim()) return;
    await supabase.from('listing_questions').update({ answer: text.trim() }).eq('id', qId);
    setAnswerInputs(prev => ({ ...prev, [qId]: '' }));
    await fetchQuestions(selectedListing.id);
  };

  // ── Değerlendirme ───────────────────────────────────────────────────────────

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) { onGoToAccount(); return; }
    if (!reviewForm.rating || !reviewForm.comment.trim()) return;
    await supabase.from('listing_reviews').insert({
      listing_id: selectedListing.id,
      reviewer_id: currentUser.id,
      reviewer_name: sellerName(),
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
    });
    setReviewForm({ rating: 0, hoverRating: 0, comment: '' });
    await fetchReviews(selectedListing.id);
  };

  // ── Sertifikasyon ───────────────────────────────────────────────────────────

  const openCertModal = () => {
    setCertStep(0);
    setCertReport(null);
    setCertProgress(0);
    setCertModal(true);
  };

  const handlePayAndAnalyze = async () => {
    setCertLoading(true);
    // Ödeme simülasyonu (500ms)
    await new Promise(r => setTimeout(r, 500));
    setCertLoading(false);
    // YZ raporu üret ve analiz animasyonunu başlat
    const report = generateAIReport(selectedListing.condition);
    setCertReport(report);
    setCertStep(2);
  };

  const handleSaveCertificate = async () => {
    if (!certReport) return;
    const fee = getCertFee(selectedListing.price);
    await supabase.from('certifications').upsert({
      listing_id: selectedListing.id,
      user_id: currentUser.id,
      fee,
      cosmetic_score: certReport.avgCosmetic,
      originality_score: certReport.avgOriginality,
      overall_score: certReport.overall,
      grade: certReport.grade,
      report: certReport,
      certified_at: new Date().toISOString(),
    }, { onConflict: 'listing_id' });
    await supabase.from('listings').update({ is_certified: true }).eq('id', selectedListing.id);
    // Yerel state güncelle
    setSelectedListing(prev => ({ ...prev, is_certified: true }));
    setExistingCert({ ...certReport, fee, certified_at: new Date().toISOString() });
    setListings(prev => prev.map(l => l.id === selectedListing.id ? { ...l, is_certified: true } : l));
    setCertModal(false);
  };

  // ── Türetilmiş değerler ─────────────────────────────────────────────────────

  const filteredListings = listings.filter(l => {
    const matchCat = selectedCategory === 'Tümü' || l.category === selectedCategory;
    const matchSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const isOwner = selectedListing && currentUser && selectedListing.user_id === currentUser.id;
  const userAlreadyReviewed = currentUser && reviews.some(r => r.reviewer_id === currentUser.id);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const certFee = selectedListing ? getCertFee(selectedListing.price) : null;

  // ══════════════════════════════════════════════════════════════════════════
  // SERTIFIKASYON MODALI
  // ══════════════════════════════════════════════════════════════════════════

  const CertModal = () => {
    if (!certModal || !selectedListing) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => certStep < 2 && setCertModal(false)} />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

          {/* Kapat (sadece step 0,1,3'te) */}
          {certStep !== 2 && (
            <button
              onClick={() => certStep === 3 ? handleSaveCertificate() : setCertModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              {certStep === 3 ? null : <X className="h-5 w-5" />}
            </button>
          )}

          {/* ── STEP 0: Tanıtım ── */}
          {certStep === 0 && (
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mx-auto mb-5">
                <ShieldCheck className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-2">TechCycle Sertifikasyonu</h2>
              <p className="text-gray-500 text-sm text-center mb-6">
                Yapay zeka destekli analizle cihazınızın doğruluğunu kanıtlayın, daha hızlı satın.
              </p>
              <ul className="space-y-3 mb-7">
                {[
                  { icon: Bot,         text: 'YZ ile kozmetik durum analizi (fotoğraflardan)' },
                  { icon: ShieldCheck, text: 'Parça orijinalliği doğrulama (5 bileşen)' },
                  { icon: BadgeCheck,  text: 'Sertifikalı rozet — ilandaki alıcılarda güven' },
                  { icon: Award,       text: 'Detaylı puanlama raporu (A+ — D)' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="bg-indigo-50 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-indigo-600" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Sertifikasyon Ücreti</p>
                  <p className="text-2xl font-black text-gray-900">{formatPrice(certFee)}</p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>Cihaz fiyatı</p>
                  <p className="font-semibold text-gray-600">{formatPrice(selectedListing.price)}</p>
                </div>
              </div>
              <button
                onClick={() => setCertStep(1)}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="h-5 w-5" /> Ödemeye Geç
              </button>
            </div>
          )}

          {/* ── STEP 1: Ödeme ── */}
          {certStep === 1 && (
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-5">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 text-center mb-1">Ödemeyi Onayla</h2>
              <p className="text-gray-500 text-sm text-center mb-6">Ödeme onaylandıktan sonra YZ analizi başlayacak.</p>
              <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50 mb-6">
                <div className="flex justify-between px-5 py-3 text-sm">
                  <span className="text-gray-500">Cihaz</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[220px] truncate">{selectedListing.title}</span>
                </div>
                <div className="flex justify-between px-5 py-3 text-sm">
                  <span className="text-gray-500">Sertifikasyon ücreti</span>
                  <span className="font-bold text-gray-900">{formatPrice(certFee)}</span>
                </div>
              </div>
              <button
                onClick={handlePayAndAnalyze}
                disabled={certLoading}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {certLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                {certLoading ? 'İşleniyor...' : `${formatPrice(certFee)} Öde ve Analizi Başlat`}
              </button>
            </div>
          )}

          {/* ── STEP 2: Analiz ── */}
          {certStep === 2 && certReport && (
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-violet-100 rounded-2xl mx-auto mb-4">
                <Bot className="h-8 w-8 text-violet-600" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 text-center mb-1">YZ Analizi Çalışıyor</h2>
              <p className="text-gray-500 text-xs text-center mb-6">Fotoğraflarınız yapay zeka tarafından inceleniyor...</p>

              {/* Genel ilerleme */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>İlerleme</span>
                  <span>{Math.round((certProgress / (COSMETIC_CHECKS.length + ORIGINALITY_CHECKS.length)) * 100)}%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-violet-600 h-2 rounded-full transition-all duration-400"
                    style={{ width: `${(certProgress / (COSMETIC_CHECKS.length + ORIGINALITY_CHECKS.length)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Kozmetik kontroller */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Kozmetik Durum
                </p>
                <div className="space-y-2">
                  {COSMETIC_CHECKS.map((ch, i) => {
                    const done = certProgress > i;
                    const active = certProgress === i;
                    return (
                      <div key={ch.name} className="flex items-center gap-3 text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500' : active ? 'bg-violet-200' : 'bg-gray-100'}`}>
                          {done ? <Check className="h-3 w-3 text-white" /> : active ? <Loader2 className="h-3 w-3 text-violet-600 animate-spin" /> : null}
                        </div>
                        <span className={done ? 'text-gray-700' : active ? 'text-violet-700 font-medium' : 'text-gray-300'}>{ch.name}</span>
                        {done && <span className="ml-auto text-xs font-bold text-emerald-600">{certReport.cosmeticChecks[i].score}/100</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Orijinallik kontrolleri */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Orijinallik Kontrolü
                </p>
                <div className="space-y-2">
                  {ORIGINALITY_CHECKS.map((ch, i) => {
                    const globalIdx = COSMETIC_CHECKS.length + i;
                    const done = certProgress > globalIdx;
                    const active = certProgress === globalIdx;
                    return (
                      <div key={ch.name} className="flex items-center gap-3 text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500' : active ? 'bg-violet-200' : 'bg-gray-100'}`}>
                          {done ? <Check className="h-3 w-3 text-white" /> : active ? <Loader2 className="h-3 w-3 text-violet-600 animate-spin" /> : null}
                        </div>
                        <span className={done ? 'text-gray-700' : active ? 'text-violet-700 font-medium' : 'text-gray-300'}>{ch.name}</span>
                        {done && <span className="ml-auto text-xs font-bold text-emerald-600">{certReport.originalityChecks[i].score}/100</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Sonuç ── */}
          {certStep === 3 && certReport && (
            <div className="p-8">
              {/* Rozet başlık */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                  <BadgeCheck className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Sertifika Verildi!</h2>
                <p className="text-gray-500 text-sm">{selectedListing.title}</p>
              </div>

              {/* Genel puan */}
              <div className="bg-gray-50 rounded-2xl p-5 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Genel Puan</p>
                  <p className="text-4xl font-black text-gray-900">{certReport.overall}<span className="text-lg text-gray-400">/100</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Derece</p>
                  <p className={`text-5xl font-black ${GRADE_COLORS[certReport.grade] || 'text-gray-700'}`}>{certReport.grade}</p>
                </div>
              </div>

              {/* Skor kartları */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-indigo-500 font-semibold mb-1">Kozmetik</p>
                  <p className="text-2xl font-black text-indigo-700">{certReport.avgCosmetic}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-emerald-600 font-semibold mb-1">Orijinallik</p>
                  <p className="text-2xl font-black text-emerald-700">{certReport.avgOriginality}</p>
                </div>
              </div>

              {/* Detaylı kontrol sonuçları */}
              <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50 mb-6 max-h-48 overflow-y-auto">
                {[...certReport.cosmeticChecks.map((c, i) => ({ ...c, cat: 'Kozmetik', detail: COSMETIC_CHECKS[i].detail })),
                  ...certReport.originalityChecks.map((c, i) => ({ ...c, cat: 'Orijinallik', detail: ORIGINALITY_CHECKS[i].detail }))
                ].map(item => (
                  <div key={item.name} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400 truncate">{item.detail}</p>
                    </div>
                    <ScoreBar score={item.score} />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveCertificate}
                className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <BadgeCheck className="h-5 w-5" /> Sertifikayı İlana Ekle
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIEWS
  // ══════════════════════════════════════════════════════════════════════════

  // ── CREATE ─────────────────────────────────────────────────────────────────
  if (view === 'create') {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setView('home')} className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="h-5 w-5 mr-1" /> Pazara Dön
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Yeni İlan Ver</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotoğraflar <span className="text-gray-400 font-normal">(en fazla 5)</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {photoFiles.map((p, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                  <img src={p.preview} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70 transition">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {photoFiles.length < 5 && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors flex-shrink-0">
                  <Camera className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">Ekle</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoAdd} />
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık <span className="text-red-400">*</span></label>
              <input type="text" required value={createForm.title}
                onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))}
                placeholder="ör. iPhone 14 Pro Max 256GB Uzay Siyahı"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select value={createForm.category} onChange={e => setCreateForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  {CREATE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <select value={createForm.condition} onChange={e => setCreateForm(f => ({ ...f, condition: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺) <span className="text-red-400">*</span></label>
              <input type="number" required min="1" value={createForm.price}
                onChange={e => setCreateForm(f => ({ ...f, price: e.target.value }))}
                placeholder="0"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea rows={4} value={createForm.description}
                onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Cihazınızın durumu, kullanım süresi, kutu içeriği vb..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teknik Özellikler</label>
              <textarea rows={3} value={createForm.specs}
                onChange={e => setCreateForm(f => ({ ...f, specs: e.target.value }))}
                placeholder="ör. RAM: 8GB, Depolama: 256GB, Batarya: %92..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            </div>
            {createError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />{createError}
              </div>
            )}
            <button type="submit" disabled={createLoading || !createForm.title.trim() || !createForm.price}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
              {createLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {createLoading ? 'İlan Yükleniyor...' : 'İlanı Yayınla'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── DETAIL ─────────────────────────────────────────────────────────────────
  if (view === 'detail' && selectedListing) {
    const photos = selectedListing.photos || [];

    return (
      <>
        <CertModal />

        <div className="animate-in fade-in duration-300">
          <button onClick={() => setView('home')} className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
            <ArrowLeft className="h-5 w-5 mr-1" /> Pazara Dön
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">

              {/* Fotoğraflar */}
              <div className="md:w-1/2 bg-[#f8f9fa]">
                <div className="relative h-80 md:h-[400px] flex items-center justify-center">
                  {photos.length > 0 ? (
                    <img src={photos[photoIndex]} alt={selectedListing.title} className="max-h-full max-w-full object-contain p-8" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-300">
                      <ImageIcon className="h-16 w-16 mb-2" /><span className="text-sm">Fotoğraf yok</span>
                    </div>
                  )}
                  {selectedListing.is_certified && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                      <BadgeCheck className="h-3.5 w-3.5" /> Sertifikalı
                    </div>
                  )}
                  <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${CONDITION_STYLES[selectedListing.condition] || 'bg-gray-100 text-gray-600'}`}>
                    {selectedListing.condition}
                  </span>
                  {photos.length > 1 && (
                    <>
                      <button onClick={() => setPhotoIndex(i => (i - 1 + photos.length) % photos.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button onClick={() => setPhotoIndex(i => (i + 1) % photos.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {photos.map((_, i) => (
                          <button key={i} onClick={() => setPhotoIndex(i)}
                            className={`w-2 h-2 rounded-full transition ${i === photoIndex ? 'bg-indigo-600' : 'bg-gray-400/50'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {photos.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {photos.map((url, i) => (
                      <button key={i} onClick={() => setPhotoIndex(i)}
                        className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${i === photoIndex ? 'border-indigo-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bilgiler */}
              <div className="md:w-1/2 p-8 flex flex-col">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">{selectedListing.category}</span>
                <h1 className="text-2xl font-extrabold text-gray-900 mb-3 leading-tight">{selectedListing.title}</h1>

                {avgRating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 fill-current ${s <= Math.round(Number(avgRating)) ? 'text-[#ffc107]' : 'text-gray-200'}`} />)}
                    </div>
                    <span className="text-sm font-bold text-gray-700">{avgRating}</span>
                    <span className="text-sm text-gray-400">({reviews.length} değerlendirme)</span>
                  </div>
                )}

                <div className="text-3xl font-black text-gray-900 mb-5">{formatPrice(selectedListing.price)}</div>

                {selectedListing.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{selectedListing.description}</p>
                )}
                {selectedListing.specs && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm text-gray-700 whitespace-pre-line">
                    <p className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-2">Teknik Özellikler</p>
                    {selectedListing.specs}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                    {selectedListing.seller_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{selectedListing.seller_name}</p>
                    <p className="text-xs text-gray-400">{formatDate(selectedListing.created_at)}</p>
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  {isOwner ? (
                    <div className="bg-indigo-50 text-indigo-700 text-sm font-semibold py-3.5 rounded-xl text-center border border-indigo-100">
                      Bu sizin ilanınız
                    </div>
                  ) : purchaseSuccess ? (
                    <div className="bg-green-50 text-green-700 text-sm font-semibold py-3.5 rounded-xl text-center border border-green-100 flex items-center justify-center gap-2">
                      <Check className="h-5 w-5" /> Satın alındı! Siparişlerim'den takip edin.
                    </div>
                  ) : (
                    <button onClick={handlePurchase} disabled={purchaseLoading}
                      className="w-full bg-[#5b4eff] text-white py-4 rounded-2xl font-bold text-base hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-200/50">
                      {purchaseLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingBag className="h-5 w-5" />}
                      {purchaseLoading ? 'İşleniyor...' : 'Satın Al'}
                    </button>
                  )}
                  <div className="flex items-center justify-center gap-6 text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-green-500" />Güvenli ödeme</span>
                    <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5 text-blue-500" />Hızlı teslimat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sertifikasyon Bölümü */}
          <div className="mt-6 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            {existingCert ? (
              /* Mevcut sertifika */
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <BadgeCheck className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">TechCycle Sertifikalı</p>
                      <p className="text-xs text-gray-400">{formatDate(existingCert.certified_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Derece</p>
                    <p className={`text-3xl font-black ${GRADE_COLORS[existingCert.grade] || 'text-gray-700'}`}>
                      {existingCert.grade}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-indigo-500 font-medium mb-0.5">Kozmetik</p>
                    <p className="text-xl font-black text-indigo-700">{existingCert.cosmetic_score ?? existingCert.avgCosmetic}/100</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-emerald-600 font-medium mb-0.5">Orijinallik</p>
                    <p className="text-xl font-black text-emerald-700">{existingCert.originality_score ?? existingCert.avgOriginality}/100</p>
                  </div>
                </div>
              </div>
            ) : certFee ? (
              /* Sertifikasyon daveti */
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Bu cihazı sertifikalandır</p>
                  <p className="text-sm text-gray-500 mt-0.5">YZ analizi ile kozmetik durum ve parça orijinalliğini doğrula. Sertifikalı ilanlar daha hızlı satılır.</p>
                </div>
                {isOwner && (
                  <button onClick={openCertModal}
                    className="flex-shrink-0 flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                    <Sparkles className="h-4 w-4" />
                    Sertifikasyon Al · {formatPrice(certFee)}
                  </button>
                )}
                {!isOwner && (
                  <span className="text-xs text-gray-400 italic">Henüz sertifikalanmamış</span>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-2">Bu fiyat aralığında sertifikasyon mevcut değil (min. ₺25.000).</p>
            )}
          </div>

          {/* Soru & Cevap + Değerlendirmeler */}
          <div className="mt-6 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex border-b border-gray-100 mb-8 gap-6">
              {[
                { key: 'qa', label: 'Soru & Cevap', icon: MessageCircle, count: questions.length },
                { key: 'reviews', label: 'Değerlendirmeler', icon: Star, count: reviews.length },
              ].map(tab => (
                <button key={tab.key} onClick={() => setDetailTab(tab.key)}
                  className={`pb-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${detailTab === tab.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  <tab.icon className="h-4 w-4" />{tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Q&A */}
            {detailTab === 'qa' && (
              <div className="space-y-6">
                {qaLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-indigo-400" /></div>
                ) : questions.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">Henüz soru sorulmamış. İlk soruyu siz sorun!</p>
                ) : (
                  <ul className="space-y-4">
                    {questions.map(q => (
                      <li key={q.id} className="border border-gray-100 rounded-2xl p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs flex-shrink-0">
                            {q.asker_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-semibold text-gray-900">{q.asker_name}</span>
                              <span className="text-xs text-gray-400">{formatDate(q.created_at)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{q.question}</p>
                          </div>
                        </div>
                        {q.answer ? (
                          <div className="ml-11 bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                            <p className="text-xs font-bold text-indigo-600 mb-1">Satıcı Yanıtı</p>
                            <p className="text-sm text-gray-700">{q.answer}</p>
                          </div>
                        ) : isOwner ? (
                          <div className="ml-11 flex gap-2">
                            <input type="text" value={answerInputs[q.id] || ''}
                              onChange={e => setAnswerInputs(prev => ({ ...prev, [q.id]: e.target.value }))}
                              placeholder="Soruyu yanıtlayın..."
                              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onKeyDown={e => e.key === 'Enter' && handleAnswerSubmit(q.id)} />
                            <button onClick={() => handleAnswerSubmit(q.id)}
                              className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <p className="ml-11 text-xs text-gray-400 italic">Henüz yanıtlanmadı</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {!isOwner && (
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm">Satıcıya Soru Sor</h3>
                    {!currentUser ? (
                      <p className="text-sm text-gray-500">Soru sormak için <button onClick={onGoToAccount} className="text-indigo-600 font-semibold hover:underline">giriş yapın</button>.</p>
                    ) : (
                      <form onSubmit={handleAskQuestion} className="flex gap-2">
                        <input type="text" value={questionInput} onChange={e => setQuestionInput(e.target.value)}
                          placeholder="Sorunuzu yazın..."
                          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <button type="submit" disabled={!questionInput.trim()}
                          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-40">
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            {detailTab === 'reviews' && (
              <div className="space-y-6">
                {avgRating && (
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-5xl font-black text-gray-900">{avgRating}</span>
                    <div>
                      <div className="flex mb-1">
                        {[1,2,3,4,5].map(s => <Star key={s} className={`h-5 w-5 fill-current ${s <= Math.round(Number(avgRating)) ? 'text-[#ffc107]' : 'text-gray-200'}`} />)}
                      </div>
                      <p className="text-sm text-gray-500">{reviews.length} değerlendirme</p>
                    </div>
                  </div>
                )}
                {reviewsLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-indigo-400" /></div>
                ) : reviews.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">Henüz değerlendirme yok.</p>
                ) : (
                  <ul className="space-y-5">
                    {reviews.map(r => (
                      <li key={r.id} className="flex gap-4">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                          {r.reviewer_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm text-gray-900">{r.reviewer_name}</span>
                            <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                          </div>
                          <div className="flex mb-1.5">
                            {[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 fill-current ${s <= r.rating ? 'text-[#ffc107]' : 'text-gray-200'}`} />)}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {!isOwner && (
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4 text-sm">Değerlendirme Yaz</h3>
                    {!currentUser ? (
                      <p className="text-sm text-gray-500">Değerlendirme için <button onClick={onGoToAccount} className="text-indigo-600 font-semibold hover:underline">giriş yapın</button>.</p>
                    ) : userAlreadyReviewed ? (
                      <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl border border-green-100">
                        <Star className="h-4 w-4 fill-current flex-shrink-0" /> Bu ilan için zaten değerlendirme yaptınız.
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-3">
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(s => (
                            <button key={s} type="button"
                              onMouseEnter={() => setReviewForm(f => ({ ...f, hoverRating: s }))}
                              onMouseLeave={() => setReviewForm(f => ({ ...f, hoverRating: 0 }))}
                              onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                            >
                              <Star className={`h-7 w-7 fill-current transition-colors ${s <= (reviewForm.hoverRating || reviewForm.rating) ? 'text-[#ffc107]' : 'text-gray-200'}`} />
                            </button>
                          ))}
                        </div>
                        <textarea rows={3} value={reviewForm.comment}
                          onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                          placeholder="Alışveriş deneyiminizi paylaşın..."
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                        <button type="submit" disabled={!reviewForm.rating || !reviewForm.comment.trim()}
                          className="bg-[#5b4eff] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-40">
                          Gönder
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── HOME ───────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İkinci El Pazar</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kullanıcıların sattığı ikinci el cihazlar</p>
        </div>
        <button
          onClick={() => { if (!currentUser) { onGoToAccount(); return; } setView('create'); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> İlan Ver
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="İlan ara..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PAZAR_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {listingsLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-indigo-400" /></div>
      ) : filteredListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package className="h-14 w-14 text-gray-200 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">İlan bulunamadı</h3>
          <p className="text-gray-500 text-sm mt-1 mb-6">İlk ilanı siz verin!</p>
          <button onClick={() => { if (!currentUser) { onGoToAccount(); return; } setView('create'); }}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors">
            İlan Ver
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredListings.map(listing => (
            <div key={listing.id}
              onClick={() => { setSelectedListing(listing); setView('detail'); }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all duration-200 group"
            >
              <div className="relative h-48 bg-[#f8f9fa] overflow-hidden">
                {listing.photos?.[0] ? (
                  <img src={listing.photos[0]} alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="h-12 w-12" />
                  </div>
                )}
                <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${CONDITION_STYLES[listing.condition] || 'bg-gray-100 text-gray-600'}`}>
                  {listing.condition}
                </span>
                {listing.is_certified && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <BadgeCheck className="h-3 w-3" /> Sertifikalı
                  </div>
                )}
                {!listing.is_certified && listing.photos?.length > 1 && (
                  <span className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
                    +{listing.photos.length - 1}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1">{listing.category}</p>
                <h3 className="font-bold text-sm text-gray-900 mb-2 leading-tight line-clamp-2">{listing.title}</h3>
                <span className="text-lg font-black text-gray-900">{formatPrice(listing.price)}</span>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                  <User className="h-3 w-3" /><span>{listing.seller_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
