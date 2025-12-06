export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown content
  author: string;
  date: string;
  imageUrl: string;
  category: ArticleCategory;
  readTime: string;
  featured?: boolean;
}

export enum ArticleCategory {
  ALL = 'Todos',
  CYBERSECURITY = 'Cibersegurança',
  PROGRAMMING = 'Programação',
  DEVOPS = 'DevOps',
  CLOUD = 'Nuvem',
  AI = 'Inteligência Artificial'
}

export interface User {
  name: string;
  role: 'admin' | 'reader';
}