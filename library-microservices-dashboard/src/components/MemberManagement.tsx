import React, { useState, useMemo } from 'react';
import { Member, Language } from '../types';
import { t } from '../translations';
import { Search, Plus, Edit2, Trash2, Users, Mail, Calendar, User, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemberManagementProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'id' | 'createdAt'>) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  lang: Language;
  loading?: boolean;
}

export default function MemberManagement({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  lang,
  loading = false,
}: MemberManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Delete Confirm State
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const [deleteMemberName, setDeleteMemberName] = useState<string>('');

  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  const handleOpenAdd = () => {
    setEditingMember(null);
    setUsername('');
    setEmail('');
    setFullName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setEditingMember(member);
    setUsername(member.username || '');
    setEmail(member.email || '');
    setFullName(member.fullName || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !fullName) {
      alert(lang === 'fa' ? 'لطفا همه فیلدها را پر کنید' : 'Please fill all fields');
      return;
    }

    if (editingMember) {
      const updatedMember: Member = {
        ...editingMember,
        fullName,
      };
      onUpdateMember(updatedMember);
    } else {
      onAddMember({
        username,
        email,
        fullName,
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteTrigger = (id: string, memberName: string) => {
    setDeleteMemberId(id);
    setDeleteMemberName(memberName);
  };

  const handleConfirmDelete = () => {
    if (deleteMemberId) {
      onDeleteMember(deleteMemberId);
      setDeleteMemberId(null);
      setDeleteMemberName('');
    }
  };

  // Filter members
  const filteredMembers = useMemo(() => {
    const query = (searchQuery || '').toLowerCase();
    return (members || []).filter((member) => {
      if (!member) return false;
      const nameStr = (member.fullName || '').toLowerCase();
      const usernameStr = (member.username || '').toLowerCase();
      const emailStr = (member.email || '').toLowerCase();

      return (
        nameStr.includes(query) ||
        usernameStr.includes(query) ||
        emailStr.includes(query)
      );
    });
  }, [members, searchQuery]);

  const isRtl = lang === 'fa';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} id="member-management-section">
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
            id="member-search-input"
          />
        </div>

        {/* Register Button */}
        <div>
          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-xs cursor-pointer"
            id="register-member-btn"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addMember', lang)}</span>
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
          {filteredMembers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-center"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">
                {lang === 'fa' ? 'هیچ کاربری پیدا نشد.' : 'No users found.'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'fa' ? 'می‌توانید کاربر جدیدی اضافه کنید.' : 'Try adjusting your search or add a new user.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id || `member-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group relative overflow-hidden"
                  id={`member-card-${member.id}`}
                >
                  {/* Decorative bar */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

                  <div className="space-y-4 pt-2">
                    {/* Top Line */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {member.fullName}
                          </h4>
                        </div>
                        <span className="font-mono text-slate-400 text-[11px] block">
                          @{member.username}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                          title={t('editMember', lang)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrigger(member.id, member.fullName)}
                          className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title={lang === 'fa' ? 'حذف کاربر' : 'Delete User'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate select-all font-mono">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{lang === 'fa' ? 'تاریخ ثبت‌نام' : 'Registered'}: <span className="font-mono">{formatDate(member.createdAt)}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Footer status */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-4">
                    <span className="text-[10px] text-slate-400 font-medium">
                      ID: {member.id}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-md">
                      <User className="w-3 h-3 text-slate-400" />
                      {lang === 'fa' ? 'کاربر میکروسرویس' : 'Microservice User'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Member Form Modal */}
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
                  {editingMember ? t('editMember', lang) : t('addMember', lang)}
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
                {/* Username */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">
                    {lang === 'fa' ? 'نام کاربری (غیر قابل تغییر بعد از ثبت)' : 'Username'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingMember}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 ${
                      isRtl ? 'text-right' : 'text-left'
                    } disabled:bg-slate-50 disabled:text-slate-400`}
                    placeholder={lang === 'fa' ? 'مثال: ali_ahmadi' : 'e.g., ali_ahmadi'}
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">
                    {t('memberName', lang)} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                    placeholder={lang === 'fa' ? 'مثال: علی رضایی' : 'e.g., Jane Doe'}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">
                    {t('email', lang)} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!!editingMember}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 text-left font-mono disabled:bg-slate-50 disabled:text-slate-400"
                    placeholder="email@example.com"
                  />
                </div>

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
        {deleteMemberId && (
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
                    {lang === 'fa' ? 'تایید حذف کاربر' : 'Confirm User Deletion'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {lang === 'fa' ? 'آیا واقعاً می‌خواهید این کاربر را حذف کنید؟ این عمل غیر قابل بازگشت است.' : 'Are you sure you want to delete this user? This action cannot be undone.'}
                  </p>
                </div>
              </div>

              {/* User Details Preview */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <span className="text-slate-400 block mb-1">{lang === 'fa' ? 'نام کامل کاربر' : 'User Full Name'}</span>
                <span className="font-bold text-slate-800">{deleteMemberName}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteMemberId(null);
                    setDeleteMemberName('');
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
                  {lang === 'fa' ? 'حذف کاربر' : 'Delete User'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
