export interface DialogueCharacter {
  id: string;
  name: string;
  role: 'customer' | 'friend' | 'family' | 'colleague' | 'expert';
  personality: string;
  painPoint?: string;
  background?: string;
  isPreset: boolean;
}

export interface DialogueScene {
  id: string;
  name: string;
  type: 'story' | 'service' | 'testimonial' | 'lifestyle' | 'interaction';
  description: string;
  characters: DialogueCharacter[];
  scenario: string;
  promptTemplate: string;
  isCustom: boolean;
}

export interface DialoguePainPoint {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
  targetAudience: string[];
}

export interface DialogueSettings {
  style: 'natural' | 'formal' | 'casual';
  length: 'short' | 'medium' | 'long';
  tone: 'friendly' | 'professional' | 'humorous' | 'urgent';
  includeEmotions: boolean;
  customRequirements: string;
}

export interface DialogueStory {
  id: string;
  title: string;
  product: {
    name: string;
    description: string;
    targetAudience: string;
  };
  characters: DialogueCharacter[];
  scene: DialogueScene;
  painPoints: DialoguePainPoint[];
  settings: DialogueSettings;
  dialogue: DialogueLine[];
  createdAt: string;
}

export interface DialogueLine {
  characterId: string;
  characterName: string;
  content: string;
  emotion?: string;
}

export interface DialogueFilters {
  searchTerm: string;
  selectedType: DialogueScene['type'] | 'all';
  sortBy: 'createdAt' | 'title' | 'type';
  sortOrder: 'asc' | 'desc';
}

export interface DialogueStats {
  totalStories: number;
  totalCharacters: number;
  totalScenes: number;
  recentStories: number;
} 