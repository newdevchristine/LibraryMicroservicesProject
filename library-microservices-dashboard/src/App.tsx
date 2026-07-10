import React, { useState, useEffect } from 'react';
import { Book, Member, ApiConfig, Language } from './types';
import { t } from './translations';
import BookManagement from './components/BookManagement';
import MemberManagement from './components/MemberManagement';
import ApiSettings from './components/ApiSettings';
import { BookOpen, Users, Settings, Globe, Database, HelpCircle, Languages, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- INITIAL SEED DATA ---
const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'شاهنامه فردوسی',
    author: 'ابوالقاسم فردوسی',
    isAvailable: true,
  },
  {
    id: 'b2',
    title: 'Domain-Driven Design',
    author: 'Eric Evans',
    isAvailable: true,
  },
  {
    id: 'b3',
    title: 'کلیدر',
    author: 'محمود دولت‌آبادی',
    isAvailable: true,
  },
  {
    id: 'b4',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isAvailable: true,
  },
  {
    id: 'b5',
    title: 'دیوان حافظ',
    author: 'شمس‌الدین محمد حافظ شیرازی',
    isAvailable: true,
  }
];

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    username: 'sohrab',
    email: 'sohrab@poetry.ir',
    fullName: 'سهراب سپهری',
    createdAt: '2025-01-10T12:00:00Z',
  },
  {
    id: 'm2',
    username: 'sara_ahmadi',
    email: 'sara.ahmadi@gmail.com',
    fullName: 'سارا احمدی',
    createdAt: '2025-03-22T14:30:00Z',
  },
  {
    id: 'm3',
    username: 'omid_h',
    email: 'omid.h@yahoo.com',
    fullName: 'امید حسینی',
    createdAt: '2025-05-01T09:15:00Z',
  },
  {
    id: 'm4',
    username: 'arash_k',
    email: 'arash.hero@national.ir',
    fullName: 'آرش کمانگیر',
    createdAt: '2024-06-15T18:00:00Z',
  }
];

const INITIAL_API_CONFIG: ApiConfig = {
  bookServiceUrl: 'http://localhost:8081/api/books',
  memberServiceUrl: 'http://localhost:8082/api/members',
  useMock: true,
};

export default function App() {
  // --- STATE ---
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lib_lang');
    return (saved as Language) || 'fa';
  });

  const [activeTab, setActiveTab] = useState<'books' | 'members' | 'settings'>('books');

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('lib_books');
    const parsed = saved ? JSON.parse(saved) : INITIAL_BOOKS;
    return Array.isArray(parsed) ? parsed.map((b, i) => {
      const id = String(b.id || b._id || b.ID || `b-${i}`);
      const localAvail = localStorage.getItem(`book_avail_${id}`);
      return {
        id,
        title: b.title || b.Title || '',
        author: b.author || b.Author || '',
        isAvailable: localAvail !== null ? localAvail === 'true' : (b.isAvailable !== undefined ? b.isAvailable : true),
      };
    }) : INITIAL_BOOKS;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('lib_members');
    const parsed = saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    return Array.isArray(parsed) ? parsed.map((m, i) => ({
      id: String(m.id || m._id || m.ID || `m-${i}`),
      username: m.username || m.Username || '',
      email: m.email || m.Email || '',
      fullName: m.fullName || m.FullName || '',
      createdAt: m.createdAt || m.CreatedAt || new Date().toISOString(),
    })) : INITIAL_MEMBERS;
  });

  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => {
    const saved = localStorage.getItem('lib_api_config');
    return saved ? JSON.parse(saved) : INITIAL_API_CONFIG;
  });

  // Loading & Error States for async microservice communication
  const [booksLoading, setBooksLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [booksError, setBooksError] = useState<string | null>(null);
  const [membersError, setMembersError] = useState<string | null>(null);

  // --- LOCAL PERSISTENCE SYNC (Only for Mock Mode) ---
  useEffect(() => {
    if (apiConfig.useMock) {
      localStorage.setItem('lib_books', JSON.stringify(books));
    }
  }, [books, apiConfig.useMock]);

  useEffect(() => {
    if (apiConfig.useMock) {
      localStorage.setItem('lib_members', JSON.stringify(members));
    }
  }, [members, apiConfig.useMock]);

  useEffect(() => {
    localStorage.setItem('lib_api_config', JSON.stringify(apiConfig));
  }, [apiConfig]);

  useEffect(() => {
    localStorage.setItem('lib_lang', lang);
  }, [lang]);

  // --- ASYNC API CLIENT HANDLERS ---
  const fetchBooksFromApi = async () => {
    if (apiConfig.useMock) return;
    setBooksLoading(true);
    setBooksError(null);
    try {
      const response = await fetch(apiConfig.bookServiceUrl);
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        const normalized = data.map((b: any, i: number) => {
          const id = String(b.id || b._id || b.ID || `b-${i}`);
          const localAvail = localStorage.getItem(`book_avail_${id}`);
          return {
            id,
            title: b.title || b.Title || '',
            author: b.author || b.Author || '',
            isAvailable: localAvail !== null ? localAvail === 'true' : (b.isAvailable !== undefined ? b.isAvailable : (b.IsAvailable !== undefined ? b.IsAvailable : true)),
          };
        });
        setBooks(normalized);
      } else {
        throw new Error("Invalid response format. Expected JSON array of books.");
      }
    } catch (err: any) {
      setBooksError(err.message || 'Could not fetch books');
    } finally {
      setBooksLoading(false);
    }
  };

  const fetchMembersFromApi = async () => {
    if (apiConfig.useMock) return;
    setMembersLoading(true);
    setMembersError(null);
    try {
      const response = await fetch(apiConfig.memberServiceUrl);
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        const normalized = data.map((m: any, i: number) => ({
          id: String(m.id || m._id || m.ID || `m-${i}`),
          username: m.username || m.Username || '',
          email: m.email || m.Email || '',
          fullName: m.fullName || m.FullName || '',
          createdAt: m.createdAt || m.CreatedAt || new Date().toISOString(),
        }));
        setMembers(normalized);
      } else {
        throw new Error("Invalid response format. Expected JSON array of members.");
      }
    } catch (err: any) {
      setMembersError(err.message || 'Could not fetch members');
    } finally {
      setMembersLoading(false);
    }
  };

  // Fetch data on mount or when API mode/URLs switch
  useEffect(() => {
    if (!apiConfig.useMock) {
      fetchBooksFromApi();
      fetchMembersFromApi();
    } else {
      // Restore cached mock data if returning to mock mode
      const savedBooks = localStorage.getItem('lib_books');
      const savedMembers = localStorage.getItem('lib_members');
      setBooks(savedBooks ? JSON.parse(savedBooks) : INITIAL_BOOKS);
      setMembers(savedMembers ? JSON.parse(savedMembers) : INITIAL_MEMBERS);
      setBooksError(null);
      setMembersError(null);
    }
  }, [apiConfig.useMock, apiConfig.bookServiceUrl, apiConfig.memberServiceUrl]);

  // Safe URL Joiner to prevent duplicate or missing slashes in API calls
  const safeUrlJoin = (base: string, path: string) => {
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${cleanBase}/${cleanPath}`;
  };

  // --- MUTATION HANDLERS (With Async support) ---

  // Books Mutations
  const handleAddBook = async (newBookData: Omit<Book, 'id' | 'isAvailable'>) => {
    if (apiConfig.useMock) {
      const newBook: Book = {
        ...newBookData,
        id: 'b' + (books.length + 1) + '-' + Math.floor(Math.random() * 100),
        isAvailable: true,
      };
      setBooks((prev) => [...prev, newBook]);
    } else {
      try {
        const response = await fetch(apiConfig.bookServiceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newBookData.title,
            author: newBookData.author,
          }),
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        await fetchBooksFromApi();
      } catch (err: any) {
        alert(
          lang === 'fa'
            ? `خطا در برقراری ارتباط با سرور کتاب‌ها: ${err.message}`
            : `Error connecting to Book Service: ${err.message}`
        );
      }
    }
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    localStorage.setItem(`book_avail_${updatedBook.id}`, String(updatedBook.isAvailable));
    if (apiConfig.useMock) {
      setBooks((prev) =>
        prev.map((b) => (String(b.id) === String(updatedBook.id) ? updatedBook : b))
      );
    } else {
      try {
        const url = safeUrlJoin(apiConfig.bookServiceUrl, String(updatedBook.id));
        const response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: updatedBook.title,
            author: updatedBook.author,
            isAvailable: updatedBook.isAvailable,
          }),
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        await fetchBooksFromApi();
      } catch (err: any) {
        alert(
          lang === 'fa'
            ? `خطا در به‌روزرسانی کتاب در سرور: ${err.message}`
            : `Error updating book on server: ${err.message}`
        );
      }
    }
  };

  const handleDeleteBook = async (id: string) => {
    localStorage.removeItem(`book_avail_${id}`);
    if (apiConfig.useMock) {
      setBooks((prev) => prev.filter((b) => String(b.id) !== String(id)));
    } else {
      try {
        const url = safeUrlJoin(apiConfig.bookServiceUrl, String(id));
        const response = await fetch(url, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        await fetchBooksFromApi();
      } catch (err: any) {
        alert(
          lang === 'fa'
            ? `خطا در حذف کتاب از سرور: ${err.message}`
            : `Error deleting book from server: ${err.message}`
        );
      }
    }
  };

  // Members Mutations
  const handleAddMember = async (newMemberData: Omit<Member, 'id' | 'createdAt'>) => {
    if (apiConfig.useMock) {
      const newMember: Member = {
        ...newMemberData,
        id: 'm' + (members.length + 1) + '-' + Math.floor(Math.random() * 100),
        createdAt: new Date().toISOString(),
      };
      setMembers((prev) => [...prev, newMember]);
    } else {
      try {
        const response = await fetch(apiConfig.memberServiceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: newMemberData.username,
            email: newMemberData.email,
            fullName: newMemberData.fullName,
          }),
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        await fetchMembersFromApi();
      } catch (err: any) {
        alert(
          lang === 'fa'
            ? `خطا در برقراری ارتباط با سرور اعضا: ${err.message}`
            : `Error connecting to Member Service: ${err.message}`
        );
      }
    }
  };

  const handleUpdateMember = async (updatedMember: Member) => {
    if (apiConfig.useMock) {
      setMembers((prev) =>
        prev.map((m) => (String(m.id) === String(updatedMember.id) ? updatedMember : m))
      );
    } else {
      try {
        const url = safeUrlJoin(apiConfig.memberServiceUrl, String(updatedMember.id));
        const response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: updatedMember.fullName,
          }),
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        await fetchMembersFromApi();
      } catch (err: any) {
        alert(
          lang === 'fa'
            ? `خطا در به‌روزرسانی اطلاعات کاربر در سرور: ${err.message}`
            : `Error updating user details on server: ${err.message}`
        );
      }
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (apiConfig.useMock) {
      setMembers((prev) => prev.filter((m) => String(m.id) !== String(id)));
    } else {
      try {
        const url = safeUrlJoin(apiConfig.memberServiceUrl, String(id));
        const response = await fetch(url, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        await fetchMembersFromApi();
      } catch (err: any) {
        alert(
          lang === 'fa'
            ? `خطا در حذف کاربر از سرور: ${err.message}`
            : `Error deleting user from server: ${err.message}`
        );
      }
    }
  };

  // --- STATS COMPUTATIONS ---
  const stats = React.useMemo(() => {
    const totalBooks = books.length;
    const availableBooks = books.filter((b) => b.isAvailable !== false).length;
    const unavailableBooks = books.filter((b) => b.isAvailable === false).length;
    const totalMembers = members.length;

    return {
      totalBooks,
      availableBooks,
      unavailableBooks,
      totalMembers,
    };
  }, [books, members]);

  const isRtl = lang === 'fa';

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'fa' ? 'en' : 'fa'));
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 ${isRtl ? 'rtl text-right' : 'ltr text-left'}`} id="app-wrapper-container">
      {/* Top Gradient visual separator */}
      <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 w-full" />

      {/* --- BILINGUAL APPLICATION HEADER --- */}
      <header className="bg-white border-b border-slate-100 shadow-xs py-5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Main Title branding */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                📚
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {t('appTitle', lang)}
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t('appSubtitle', lang)}</span>
            </p>
          </div>

          {/* Action Row: Languages & Health badge */}
          <div className="flex items-center gap-3">
            {/* Health status badge */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              apiConfig.useMock 
                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${apiConfig.useMock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="font-mono text-[10px]">
                {apiConfig.useMock ? (lang === 'fa' ? 'شبیه‌ساز آفلاین' : 'Offline Mock') : (lang === 'fa' ? 'میکروسرویس‌های متصل (LIVE)' : 'LIVE APIs')}
              </span>
            </span>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              id="language-toggle-btn"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'English (EN)' : 'فارسی (FA)'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN PAGE LAYOUT CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8 space-y-8">
        
        {/* --- API ERROR BAR --- */}
        {(!apiConfig.useMock && (booksError || membersError)) && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-800">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block">
                  {lang === 'fa' ? 'خطا در ارتباط با میکروسرویس‌ها' : 'Microservice Connection Failure'}
                </span>
                <span className="text-xs text-rose-700 block mt-1 font-mono">
                  {booksError && `Book API: ${booksError}`}
                  {booksError && membersError && ' | '}
                  {membersError && `Member API: ${membersError}`}
                </span>
                <p className="text-[11px] text-rose-600 mt-1">
                  {lang === 'fa' 
                    ? 'مطمئن شوید که سرویس‌های بک‌اند روی لوکال‌هاست اجرا هستند، پورت‌ها درستند، و هدر CORS فعال است.' 
                    : 'Please ensure your backend services are running on localhost, ports are correct, and CORS is enabled.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  fetchBooksFromApi();
                  fetchMembersFromApi();
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'تلاش مجدد' : 'Retry'}</span>
              </button>
              <button
                onClick={() => setApiConfig(prev => ({ ...prev, useMock: true }))}
                className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                {lang === 'fa' ? 'فعال‌سازی شبیه‌ساز آفلاین' : 'Enable Offline Simulator'}
              </button>
            </div>
          </div>
        )}

        {/* --- STATS PANEL --- */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="stats-panel-section">
          
          {/* Total Book Titles */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-semibold block">{t('totalBooksCount', lang)}</span>
              <strong className="text-2xl font-black text-slate-900 font-mono">{stats.totalBooks}</strong>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          {/* Available Books */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-semibold block">
                {lang === 'fa' ? 'کتاب‌های در دسترس' : 'Available Books'}
              </span>
              <strong className="text-2xl font-black text-slate-900 font-mono">{stats.availableBooks}</strong>
            </div>
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-semibold block">
                {lang === 'fa' ? 'کل کاربران' : 'Total Users'}
              </span>
              <strong className="text-2xl font-black text-slate-900 font-mono">{stats.totalMembers}</strong>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* --- DYNAMIC NAVIGATION TABS --- */}
        <nav className="flex items-center border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none" id="dashboard-tabs">
          
          {/* Books Management Tab */}
          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative border-b-2 cursor-pointer ${
              activeTab === 'books'
                ? 'text-emerald-700 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('books', lang)}</span>
          </button>

          {/* Members Management Tab */}
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative border-b-2 cursor-pointer ${
              activeTab === 'members'
                ? 'text-emerald-700 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t('members', lang)}</span>
          </button>

          {/* API Settings Tab */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative border-b-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'text-emerald-700 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t('settings', lang)}</span>
          </button>
        </nav>

        {/* --- DYNAMICALLY RENDERED PANEL --- */}
        <section className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'books' && (
                <BookManagement
                  books={books}
                  onAddBook={handleAddBook}
                  onUpdateBook={handleUpdateBook}
                  onDeleteBook={handleDeleteBook}
                  lang={lang}
                  loading={booksLoading}
                />
              )}

              {activeTab === 'members' && (
                <MemberManagement
                  members={members}
                  onAddMember={handleAddMember}
                  onUpdateMember={handleUpdateMember}
                  onDeleteMember={handleDeleteMember}
                  lang={lang}
                  loading={membersLoading}
                />
              )}

              {activeTab === 'settings' && (
                <ApiSettings
                  config={apiConfig}
                  onUpdateConfig={setApiConfig}
                  lang={lang}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
