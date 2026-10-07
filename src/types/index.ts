export type Language = 'es' | 'en';

export interface LocalizedString {
  es: string;
  en: string;
}

export type ProjectStatus =
  | 'Live'
  | 'Coming Soon'
  | 'In Progress'
  | 'available'
  | 'coming-soon'
  | 'in-progress';

export interface ProjectCardInfo {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  coverImage?: string;
  status: ProjectStatus;
  tags: LocalizedString[];
  layoutSpan: string; // e.g. "col-span-1 md:col-span-2 md:row-span-2"
  accentGradient: string;
  featured?: boolean;
  category: LocalizedString;
}
