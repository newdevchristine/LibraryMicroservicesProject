import { Language } from './types';

export const translations = {
  appTitle: {
    fa: 'سامانه مدیریت یکپارچه کتابخانه',
    en: 'Integrated Library Management System',
  },
  appSubtitle: {
    fa: 'پورتال تعاملی مدیریت کتاب‌ها و کاربران با قابلیت اتصال مستقیم به میکروسرویس‌ها',
    en: 'Interactive Portal for Books & Users with Direct Microservice Integration',
  },
  books: {
    fa: 'مدیریت کتاب‌ها',
    en: 'Books Management',
  },
  members: {
    fa: 'مدیریت کاربران (اعضا)',
    en: 'Users (Members) Management',
  },
  settings: {
    fa: 'تنظیمات اتصال API',
    en: 'API Connection Settings',
  },
  searchPlaceholder: {
    fa: 'جستجو...',
    en: 'Search...',
  },
  addBook: {
    fa: 'افزودن کتاب جدید',
    en: 'Add New Book',
  },
  editBook: {
    fa: 'ویرایش کتاب',
    en: 'Edit Book',
  },
  bookTitle: {
    fa: 'عنوان کتاب',
    en: 'Book Title',
  },
  author: {
    fa: 'نویسنده',
    en: 'Author',
  },
  isbn: {
    fa: 'شابک (ISBN)',
    en: 'ISBN',
  },
  category: {
    fa: 'دسته‌بندی',
    en: 'Category',
  },
  publishYear: {
    fa: 'سال انتشار',
    en: 'Publish Year',
  },
  totalCopies: {
    fa: 'کل نسخه‌ها',
    en: 'Total Copies',
  },
  availableCopies: {
    fa: 'نسخه‌های موجود',
    en: 'Available Copies',
  },
  location: {
    fa: 'محل قرارگیری',
    en: 'Shelf Location',
  },
  save: {
    fa: 'ذخیره',
    en: 'Save',
  },
  cancel: {
    fa: 'انصراف',
    en: 'Cancel',
  },
  actions: {
    fa: 'عملیات',
    en: 'Actions',
  },
  deleteConfirm: {
    fa: 'آیا از حذف این آیتم اطمینان دارید؟',
    en: 'Are you sure you want to delete this item?',
  },
  addMember: {
    fa: 'ثبت کاربر جدید',
    en: 'Register New User',
  },
  editMember: {
    fa: 'ویرایش اطلاعات کاربر',
    en: 'Edit User Details',
  },
  memberName: {
    fa: 'نام کامل',
    en: 'Full Name',
  },
  email: {
    fa: 'ایمیل',
    en: 'Email',
  },
  phone: {
    fa: 'شماره تماس',
    en: 'Phone',
  },
  membershipId: {
    fa: 'کد عضویت',
    en: 'Membership ID',
  },
  membershipType: {
    fa: 'نوع عضویت',
    en: 'Membership Type',
  },
  status: {
    fa: 'وضعیت',
    en: 'Status',
  },
  joinedDate: {
    fa: 'تاریخ عضویت',
    en: 'Joined Date',
  },
  borrowedBooks: {
    fa: 'کتاب‌های امانت گرفته شده',
    en: 'Borrowed Books',
  },
  active: {
    fa: 'فعال',
    en: 'Active',
  },
  suspended: {
    fa: 'تعلیق شده',
    en: 'Suspended',
  },
  expired: {
    fa: 'منقضی شده',
    en: 'Expired',
  },
  regular: {
    fa: 'عادی',
    en: 'Regular',
  },
  premium: {
    fa: 'ویژه',
    en: 'Premium',
  },
  student: {
    fa: 'دانشجویی',
    en: 'Student',
  },
  dashboardStats: {
    fa: 'آمار کل کتابخانه',
    en: 'Library Statistics',
  },
  totalBooksCount: {
    fa: 'تعداد کل عناوین',
    en: 'Total Titles',
  },
  totalCopiesCount: {
    fa: 'کل نسخه‌های موجود',
    en: 'Total Copies',
  },
  totalMembersCount: {
    fa: 'کل کاربران ثبت‌شده',
    en: 'Total Users',
  },
  activeMembersCount: {
    fa: 'کاربران فعال',
    en: 'Active Users',
  },
  mockDataLoaded: {
    fa: 'داده‌های نمونه بارگذاری شدند.',
    en: 'Mock data loaded successfully.',
  },
  apiEndpoints: {
    fa: 'آدرس‌های میکروسرویس‌ها',
    en: 'Microservice Endpoints',
  },
  bookServiceUrl: {
    fa: 'آدرس API کتاب‌ها (Book Service)',
    en: 'Book Service API URL',
  },
  memberServiceUrl: {
    fa: 'آدرس API اعضا (Member Service)',
    en: 'Member Service API URL',
  },
  useMockServer: {
    fa: 'استفاده از شبیه‌ساز آفلاین محلی (Mock Mode)',
    en: 'Use local offline simulator (Mock Mode)',
  },
  settingsDesc: {
    fa: 'اگر میکروسرویس‌های خود را به صورت محلی یا ابری اجرا می‌کنید، آدرس‌های API آنها را وارد کنید تا پنل از طریق درخواست‌های async مستقیماً با پایگاه داده واقعی شما کار کند.',
    en: 'If you run your backend microservices locally or in the cloud, configure their API endpoints here to perform live async requests against your actual database.',
  },
  connectionStatus: {
    fa: 'وضعیت ارتباط پایگاه داده',
    en: 'Database & API Status',
  },
  connected: {
    fa: 'متصل به میکروسرویس‌ها (LIVE)',
    en: 'Connected to Microservices (LIVE)',
  },
  disconnected: {
    fa: 'شبیه‌ساز آفلاین فعال است',
    en: 'Offline Simulator Active',
  },
};

export function t(key: keyof typeof translations, lang: Language): string {
  return translations[key]?.[lang] || '';
}
