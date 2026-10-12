// Slide Layout Types
export type SlideLayoutType =
  | 'cover'
  | 'section_divider'
  | 'title_content'
  | 'text_image'
  | 'image_text'
  | 'three_cards'
  | 'four_cards'
  | 'statistics'
  | 'timeline'
  | 'process'
  | 'comparison'
  | 'pricing'
  | 'quote'
  | 'case_study'
  | 'full_image'
  | 'chart'
  | 'table'
  | 'team'
  | 'key_benefits'
  | 'cta';

// Element Types
export type ElementType =
  | 'heading'
  | 'subheading'
  | 'paragraph'
  | 'bullet_list'
  | 'image'
  | 'shape'
  | 'icon'
  | 'number'
  | 'statistic'
  | 'chart'
  | 'table'
  | 'quote'
  | 'button'
  | 'divider'
  | 'card';

// Theme System
export interface PresentationTheme {
  name: string;
  fontFamily: string;
  headingFontSize: number;
  bodyFontSize: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  cardStyle: 'flat' | 'outlined' | 'elevated';
  borderRadius: number;
}

export const BUILT_IN_THEMES: Record<string, PresentationTheme> = {
  corporate: {
    name: 'Corporate',
    fontFamily: 'Inter',
    headingFontSize: 36,
    bodyFontSize: 16,
    primaryColor: '#1E3A5F',
    secondaryColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    textColor: '#1E293B',
    cardStyle: 'outlined',
    borderRadius: 4,
  },
  minimal: {
    name: 'Minimal',
    fontFamily: 'Inter',
    headingFontSize: 40,
    bodyFontSize: 16,
    primaryColor: '#111827',
    secondaryColor: '#6B7280',
    backgroundColor: '#FFFFFF',
    textColor: '#374151',
    cardStyle: 'flat',
    borderRadius: 2,
  },
  modern: {
    name: 'Modern',
    fontFamily: 'Inter',
    headingFontSize: 38,
    bodyFontSize: 16,
    primaryColor: '#7C3AED',
    secondaryColor: '#A78BFA',
    backgroundColor: '#FAFAFA',
    textColor: '#1F2937',
    cardStyle: 'elevated',
    borderRadius: 12,
  },
  premium: {
    name: 'Premium',
    fontFamily: 'Georgia',
    headingFontSize: 42,
    bodyFontSize: 17,
    primaryColor: '#471E89',
    secondaryColor: '#DAAF46',
    backgroundColor: '#FFFFFF',
    textColor: '#1a1a2e',
    cardStyle: 'elevated',
    borderRadius: 8,
  },
  editorial: {
    name: 'Editorial',
    fontFamily: 'Georgia',
    headingFontSize: 44,
    bodyFontSize: 16,
    primaryColor: '#0F172A',
    secondaryColor: '#E11D48',
    backgroundColor: '#F8F7F4',
    textColor: '#1E293B',
    cardStyle: 'flat',
    borderRadius: 0,
  },
  startup: {
    name: 'Startup',
    fontFamily: 'Inter',
    headingFontSize: 38,
    bodyFontSize: 16,
    primaryColor: '#059669',
    secondaryColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    cardStyle: 'elevated',
    borderRadius: 16,
  },
  dark: {
    name: 'Dark',
    fontFamily: 'Inter',
    headingFontSize: 38,
    bodyFontSize: 16,
    primaryColor: '#A78BFA',
    secondaryColor: '#60A5FA',
    backgroundColor: '#0F172A',
    textColor: '#F1F5F9',
    cardStyle: 'outlined',
    borderRadius: 8,
  },
  creative: {
    name: 'Creative',
    fontFamily: 'Inter',
    headingFontSize: 40,
    bodyFontSize: 16,
    primaryColor: '#F59E0B',
    secondaryColor: '#EF4444',
    backgroundColor: '#FEFCE8',
    textColor: '#1C1917',
    cardStyle: 'elevated',
    borderRadius: 20,
  },
};

// Slide Element
export interface SlideElement {
  id: string;
  type: ElementType;
  content?: string;
  items?: string[];
  url?: string;
  alt?: string;
  prompt?: string;
  value?: string | number;
  label?: string;
  isBold?: boolean;
  isItalic?: boolean;
  source?: 'generated' | 'stock' | 'uploaded' | 'url';
  cards?: { title: string; description: string; icon?: string }[];
  rows?: string[][];
  headers?: string[];
}

// Slide
export interface Slide {
  id: string;
  layout: SlideLayoutType;
  title?: string;
  subtitle?: string;
  note?: string;
  elements: SlideElement[];
}

// Presentation
export interface Presentation {
  id: string;
  title: string;
  subtitle?: string;
  prompt: string;
  type: string;
  slideCount: number;
  tone: string;
  visualStyle: string;
  theme: PresentationTheme;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
}

// Setup form
export interface PresentationSetup {
  prompt: string;
  type: string;
  slideCount: number | 'custom';
  customSlideCount?: number;
  tone: string;
  visualStyle: string;
  customInstructions?: string;
}
