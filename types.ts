
export type Platform = 'instagram' | 'twitter' | 'youtube' | 'facebook';

export interface Brand {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl?: string;
}

export interface GeneratedAsset {
  id: string;
  brandId: string;
  platform: Platform;
  topic: string;
  imageUrl: string;
  textContent: string;
  finalOutputUrl: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface GenerationInput {
  brandId: string;
  platform: Platform;
  topic: string;
  tone: string;
  cta: string;
}
