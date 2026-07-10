import React, { useState } from 'react';
import { ApiConfig, Language } from '../types';
import { t } from '../translations';
import { Settings, Server, Globe, ToggleLeft, ToggleRight, Wifi, RefreshCw, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApiSettingsProps {
  config: ApiConfig;
  onUpdateConfig: (newConfig: ApiConfig) => void;
  lang: Language;
}

export default function ApiSettings({
  config,
  onUpdateConfig,
  lang,
}: ApiSettingsProps) {
  const [bookServiceUrl, setBookServiceUrl] = useState(config.bookServiceUrl);
  const [memberServiceUrl, setMemberServiceUrl] = useState(config.memberServiceUrl);
  const [useMock, setUseMock] = useState(config.useMock);

  // Connection testing states
  const [checking, setChecking] = useState<Record<string, boolean>>({});
  const [statuses, setStatuses] = useState<Record<string, 'online' | 'offline' | null>>({
    books: null,
    members: null,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      bookServiceUrl,
      memberServiceUrl,
      useMock,
    });

    alert(
      lang === 'fa'
        ? 'تنظیمات با موفقیت ذخیره شدند.'
        : 'Settings saved successfully.'
    );
  };

  const handleToggleMock = () => {
    const newVal = !useMock;
    setUseMock(newVal);
    onUpdateConfig({
      bookServiceUrl,
      memberServiceUrl,
      useMock: newVal,
    });
  };

  const testConnection = async (key: string, url: string) => {
    setChecking((prev) => ({ ...prev, [key]: true }));
    setStatuses((prev) => ({ ...prev, [key]: null }));

    try {
      // Create a timeout controller to avoid hanging requests
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors',
      });
      clearTimeout(id);

      if (res.status >= 200 && res.status < 400) {
        setStatuses((prev) => ({ ...prev, [key]: 'online' }));
      } else {
        setStatuses((prev) => ({ ...prev, [key]: 'offline' }));
      }
    } catch {
      setStatuses((prev) => ({ ...prev, [key]: 'offline' }));
    } finally {
      setChecking((prev) => ({ ...prev, [key]: false }));
    }
  };

  const isRtl = lang === 'fa';

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} id="api-settings-section">
      {/* Settings Info Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              {t('apiEndpoints', lang)}
            </h3>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed mt-1">
              {t('settingsDesc', lang)}
            </p>
          </div>
        </div>

        {/* Mock Toggle Button */}
        <button
          onClick={handleToggleMock}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
            useMock
              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
          }`}
          id="toggle-mock-btn"
        >
          {useMock ? <ToggleRight className="w-5 h-5 text-amber-600" /> : <ToggleLeft className="w-5 h-5 text-emerald-600" />}
          <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
            <span className="block text-[9px] text-slate-400 font-medium">
              {lang === 'fa' ? 'حالت جاری' : 'Current Mode'}
            </span>
            <span className="font-bold">
              {useMock ? t('disconnected', lang) : t('connected', lang)}
            </span>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Form Panel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'fa' ? 'پیکربندی آدرس‌های API میکروسرویس‌ها' : 'Configure Microservice API URLs'}</span>
          </h4>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Book Service */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">{t('bookServiceUrl', lang)}</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className={`absolute top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 ${isRtl ? 'right-3' : 'left-3'}`} />
                  <input
                    type="url"
                    value={bookServiceUrl}
                    onChange={(e) => setBookServiceUrl(e.target.value)}
                    disabled={useMock}
                    className={`w-full py-2 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 rounded-xl text-xs font-mono text-left focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 ${
                      isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                    }`}
                    placeholder="e.g. http://localhost:8081/api/books"
                  />
                </div>
                {!useMock && (
                  <button
                    type="button"
                    onClick={() => testConnection('books', bookServiceUrl)}
                    disabled={checking['books']}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
                  >
                    {checking['books'] ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Ping'}
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-400 block">
                {lang === 'fa' 
                  ? 'مثال: آدرس اندپوینت دریافت و ثبت کتاب‌ها (GET, POST)' 
                  : 'Example: Direct collection URL to retrieve and add books (GET, POST)'}
              </span>
            </div>

            {/* Member Service */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">{t('memberServiceUrl', lang)}</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className={`absolute top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 ${isRtl ? 'right-3' : 'left-3'}`} />
                  <input
                    type="url"
                    value={memberServiceUrl}
                    onChange={(e) => setMemberServiceUrl(e.target.value)}
                    disabled={useMock}
                    className={`w-full py-2 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 rounded-xl text-xs font-mono text-left focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 ${
                      isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                    }`}
                    placeholder="e.g. http://localhost:8082/api/members"
                  />
                </div>
                {!useMock && (
                  <button
                    type="button"
                    onClick={() => testConnection('members', memberServiceUrl)}
                    disabled={checking['members']}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
                  >
                    {checking['members'] ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Ping'}
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-400 block">
                {lang === 'fa' 
                  ? 'مثال: آدرس اندپوینت دریافت و ثبت کاربران (GET, POST)' 
                  : 'Example: Direct collection URL to retrieve and register users (GET, POST)'}
              </span>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="submit"
                disabled={useMock}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer"
              >
                {t('save', lang)}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Diagnostics */}
        <div className="space-y-4">
          {/* Connection Status Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-600" />
              <span>{t('connectionStatus', lang)}</span>
            </h4>

            {useMock ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="font-semibold">{lang === 'fa' ? 'شبیه‌ساز آفلاین فعال است' : 'Offline Simulator Active'}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {lang === 'fa'
                    ? 'سامانه به صورت ایزوله کار می‌کند. تغییرات در حافظه محلی مرورگر (Local Storage) ذخیره می‌شوند تا بدون نیاز به بک‌اند پروژه را تست کنید.'
                    : 'The application is running in fully offline mock mode. Data is persisted to the browser\'s Local Storage, allowing zero-setup interface demo.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Books diagnostic */}
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="font-mono text-slate-600 text-[10px]">Book Service API</span>
                  <div className="flex items-center gap-1.5">
                    {statuses['books'] === 'online' && <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                    {statuses['books'] === 'offline' && <span className="flex h-2 w-2 rounded-full bg-rose-500" />}
                    {statuses['books'] === null && <span className="flex h-2 w-2 rounded-full bg-slate-400" />}
                    <span className="font-bold text-[10px] uppercase text-slate-500">
                      {statuses['books'] || (lang === 'fa' ? 'تست نشده' : 'untested')}
                    </span>
                  </div>
                </div>

                {/* Members diagnostic */}
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="font-mono text-slate-600 text-[10px]">Member Service API</span>
                  <div className="flex items-center gap-1.5">
                    {statuses['members'] === 'online' && <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                    {statuses['members'] === 'offline' && <span className="flex h-2 w-2 rounded-full bg-rose-500" />}
                    {statuses['members'] === null && <span className="flex h-2 w-2 rounded-full bg-slate-400" />}
                    <span className="font-bold text-[10px] uppercase text-slate-500">
                      {statuses['members'] || (lang === 'fa' ? 'تست نشده' : 'untested')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tips card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xs space-y-2">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>{lang === 'fa' ? 'اتصال موفق و رفع خطای CORS' : 'CORS & Async API Tips'}</span>
            </h5>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {lang === 'fa'
                ? 'برای اینکه مرورگر بتواند به صورت آسنکرون به میکروسرویس‌های محلی شما (مثلا پورت ۸۰۸۱) درخواست بزند، حتما باید CORS را روی سرور بک‌اند خود فعال کرده باشید.'
                : 'For the browser to communicate asynchronously with your backend services (e.g., localhost ports), ensure CORS headers (Access-Control-Allow-Origin: *) are enabled on your server.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
