export interface GlassItem {
  id: string;
  name: string;
  category: 'virtue' | 'quirk' | 'fun';
  color: string;
  description?: string;
  icon?: string;
}

export interface GlassProfile {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  avatarIcon: string;
  glasses: GlassItem[];
}

export const GLASSES_PROFILES: Record<'female' | 'male', GlassProfile> = {
  female: {
    id: 'female',
    title: 'Según mi Esposo',
    subtitle: 'Colorea y llena cada vaso según cómo ves a tu compañera',
    badge: 'Para Ella',
    avatarIcon: '👰‍♀️',
    glasses: [
      { id: 'f-1', name: 'Cariñosa', category: 'virtue', color: '#f43f5e', icon: '🥰' },
      { id: 'f-2', name: 'Atenta', category: 'virtue', color: '#f59e0b', icon: '👀' },
      { id: 'f-3', name: 'Inteligente', category: 'virtue', color: '#8b5cf6', icon: '💡' },
      { id: 'f-4', name: 'Divertida', category: 'fun', color: '#ec4899', icon: '🎉' },
      { id: 'f-5', name: 'Responsable', category: 'virtue', color: '#10b981', icon: '📋' },
      { id: 'f-6', name: 'Trabajadora', category: 'virtue', color: '#06b6d4', icon: '💼' },
      { id: 'f-7', name: 'Paciente', category: 'virtue', color: '#14b8a6', icon: '🧘‍♀️' },
      { id: 'f-8', name: 'Romántica', category: 'virtue', color: '#e11d48', icon: '🌹' },
      { id: 'f-9', name: 'Buena cocinera', category: 'fun', color: '#f97316', icon: '🍳' },
      { id: 'f-10', name: 'Buena compañera', category: 'virtue', color: '#6366f1', icon: '🤝' },
      { id: 'f-11', name: 'Bonita', category: 'virtue', color: '#d946ef', icon: '✨' },
      { id: 'f-12', name: 'La mejor esposa', category: 'virtue', color: '#eab308', icon: '👑' },
    ],
  },
  male: {
    id: 'male',
    title: 'Según mi Esposa',
    subtitle: 'Colorea y llena cada vaso según cómo ves a tu esposo',
    badge: 'Para Él',
    avatarIcon: '🤵‍♂️',
    glasses: [
      { id: 'm-1', name: 'Cariñoso', category: 'virtue', color: '#f43f5e', icon: '🤗' },
      { id: 'm-2', name: 'Sensible', category: 'virtue', color: '#a855f7', icon: '🥺' },
      { id: 'm-3', name: 'Enojón / Pelona', category: 'quirk', color: '#ef4444', icon: '😤' },
      { id: 'm-4', name: 'Celoso', category: 'quirk', color: '#84cc16', icon: '🤨' },
      { id: 'm-5', name: 'Dramático', category: 'quirk', color: '#d946ef', icon: '🎭' },
      { id: 'm-6', name: 'Lindo', category: 'virtue', color: '#06b6d4', icon: '😊' },
      { id: 'm-7', name: 'Seco / Frío', category: 'quirk', color: '#38bdf8', icon: '🧊' },
      { id: 'm-8', name: 'Odioso', category: 'quirk', color: '#f43f5e', icon: '😜' },
      { id: 'm-9', name: 'Romántico', category: 'virtue', color: '#fb7185', icon: '💌' },
      { id: 'm-10', name: 'Amistoso', category: 'virtue', color: '#10b981', icon: '👋' },
      { id: 'm-11', name: 'Productivo', category: 'virtue', color: '#3b82f6', icon: '⚡' },
      { id: 'm-12', name: 'Inteligente', category: 'virtue', color: '#eab308', icon: '🧠' },
    ],
  },
};
