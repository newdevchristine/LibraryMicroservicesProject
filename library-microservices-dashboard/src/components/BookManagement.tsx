import React, { useState, useMemo } from 'react';
import { Book, Language } from '../types';
import { t } from '../translations';
import { Search, Plus, Edit2, Trash2, BookOpen, CheckCircle, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookManagementProps {
  books: Book[];
  onAddBook: (book: Omit<Book, 'id' | 'isAvailable'>) => void;
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  lang: Language;
  loading?: boolean;
}

export default function BookManagement({
  books,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  lang,
  loading = false,
}: BookManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Delete Confirm State
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const [deleteBookTitle, setDeleteBookTitle] = useState<string>('');

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // Handle opening modal for addition
  const handleOpenAdd = () => {
    setEditingBook(null);
    setTitle('');
    setAuthor('');
    setIsAvailable(true);
    setIsModalOpen(true);
  };

  // Handle opening modal for editing
  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setTitle(book.title || '');
    setAuthor(book.author || '');
    setIsAvailable(book.isAvailable !== undefined ? book.isAvailable : true);
    setIsModalOpen(true);
  };

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author) {
      alert(lang === 'fa' ? 'لطفا فیلدهای اجباری را پر کنید' : 'Please fill all required fields');
      return;
    }

    if (editingBook) {
      const updatedBook: Book = {
        ...editingBook,
        title,
        author,
        isAvailable,
      };
      onUpdateBook(updatedBook);
    } else {
      onAddBook({
        title,
        author,
      });
    }

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDeleteTrigger = (id: string, bookTitle: string) => {
    setDeleteBookId(id);
    setDeleteBookTitle(bookTitle);
  };

  const handleConfirmDelete = () => {
    if (deleteBookId) {
      onDeleteBook(deleteBookId);
      setDeleteBookId(null);
      setDeleteBookTitle('');
    }
  };

  // Toggle single book availability
  const handleToggleAvailability = (book: Book) => {
    const updatedBook: Book = {
      ...book,
      isAvailable: !book.isAvailable,
    };
    onUpdateBook(updatedBook);
  };

  // Filter books
  const filteredBooks = useMemo(() => {
    const query = (searchQuery || '').toLowerCase();
    return (books || []).filter((book) => {
      if (!book) return false;
      const titleStr = (book.title || '').toLowerCase();
      const authorStr = (book.author || '').toLowerCase();
      
      return titleStr.includes(query) || authorStr.includes(query);
    });
  }, [books, searchQuery]);

  const isRtl = lang === 'fa';

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} id="book-management-section">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={t('searchPlaceholder', lang)}
            className={`w-full py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all ${
              isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="book-search-input"
          />
        </div>

        {/* Add Button */}
        <div>
          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-xs cursor-pointer"
            id="add-new-book-btn"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addBook', lang)}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-xs">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin mb-3"></div>
          <span className="text-slate-500 text-sm font-medium">
            {lang === 'fa' ? 'در حال دریافت اطلاعات از سرور...' : 'Fetching data from microservice...'}
          </span>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filteredBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-center"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">
                {lang === 'fa' ? 'هیچ کتابی پیدا نشد.' : 'No books found.'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'fa' ? 'می‌توانید کتاب جدیدی اضافه کنید یا جستجو را تغییر دهید.' : 'Try adjusting your search or add a new book.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredBooks.map((book, index) => {
                const isBookAvailable = book.isAvailable !== false;

                return (
                  <motion.div
                    key={book.id || `book-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                    id={`book-card-${book.id}`}
                  >
                    <div className="p-5 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 max-w-[70%]">
                          <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                            {book.title}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {lang === 'fa' ? `اثر ${book.author}` : `by ${book.author}`}
                          </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(book)}
                            className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title={t('editBook', lang)}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTrigger(book.id, book.title)}
                            className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title={lang === 'fa' ? 'حذف کتاب' : 'Delete Book'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Info & Availability */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-xs">
                        <span className="text-slate-400">{lang === 'fa' ? 'وضعیت کتاب' : 'Status'}</span>
                        <button
                          onClick={() => handleToggleAvailability(book)}
                          className={`px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 transition-all cursor-pointer hover:scale-105 ${
                            isBookAvailable 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          }`}
                          title={lang === 'fa' ? 'کلیک برای تغییر وضعیت' : 'Click to toggle availability'}
                        >
                          {isBookAvailable ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>{lang === 'fa' ? 'در دسترس (موجود)' : 'Available'}</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              <span>{lang === 'fa' ? 'امانت داده شده' : 'Borrowed'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Footer decoration */}
                    <div className="h-1 bg-slate-50 group-hover:bg-emerald-500 transition-colors" />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Book Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100"
            >
              {/* Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">
                  {editingBook ? t('editBook', lang) : t('addBook', lang)}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-6 space-y-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">
                    {t('bookTitle', lang)} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                    placeholder={lang === 'fa' ? 'مثال: شاهنامه فردوسی' : 'e.g., Hamlet'}
                  />
                </div>

                {/* Author */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">
                    {t('author', lang)} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={`w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                    placeholder={lang === 'fa' ? 'مثال: ابوالقاسم فردوسی' : 'e.g., William Shakespeare'}
                  />
                </div>

                {/* IsAvailable (Only shown when editing) */}
                {editingBook && (
                  <div className="flex items-center justify-between py-2 border-t border-slate-50">
                    <span className="text-xs font-semibold text-slate-600">
                      {lang === 'fa' ? 'کتاب در دسترس است؟' : 'Is Book Available?'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAvailable(!isAvailable)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 ltr ${
                        isAvailable ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                      role="switch"
                      aria-checked={isAvailable}
                      id="toggle-availability-modal-btn"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          isAvailable ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                )}

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                  >
                    {t('cancel', lang)}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors shadow-xs cursor-pointer"
                  >
                    {t('save', lang)}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteBookId && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-6 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {lang === 'fa' ? 'تایید حذف کتاب' : 'Confirm Book Deletion'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {lang === 'fa' ? 'آیا واقعاً می‌خواهید این کتاب را حذف کنید؟ این عمل غیر قابل بازگشت است.' : 'Are you sure you want to delete this book? This action cannot be undone.'}
                  </p>
                </div>
              </div>

              {/* Book Details Preview */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <span className="text-slate-400 block mb-1">{lang === 'fa' ? 'عنوان کتاب' : 'Book Title'}</span>
                <span className="font-bold text-slate-800">{deleteBookTitle}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteBookId(null);
                    setDeleteBookTitle('');
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  {t('cancel', lang)}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  {lang === 'fa' ? 'حذف کتاب' : 'Delete Book'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
