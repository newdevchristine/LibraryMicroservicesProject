export interface Book {
  id: string;
  title: string;
  author: string;
  isAvailable: boolean;
}

export interface Member {
  id: string;
  username: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface ApiConfig {
  bookServiceUrl: string;
  memberServiceUrl: string;
  useMock: boolean;
}

export type Language = 'fa' | 'en';
