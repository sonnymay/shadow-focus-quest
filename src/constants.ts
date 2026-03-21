import { Type } from "@google/genai";

export interface ShadowSoldier {
  id: string;
  name: string;
  rank: 'Normal' | 'Elite' | 'Knight' | 'Commander' | 'Marshal' | 'Legendary';
  level: number;
  xp: number;
  unlocked: boolean;
  icon: string;
  imageUrl: string;
  prompt: string;
}

export const INITIAL_SOLDIERS: ShadowSoldier[] = [
  { 
    id: 'infantry', 
    name: 'Shadow Infantry', 
    rank: 'Normal', 
    level: 1, 
    xp: 0, 
    unlocked: true, 
    icon: 'Shield',
    imageUrl: 'https://picsum.photos/seed/shadow-warrior/400/400',
    prompt: 'A cool shadow soldier from solo leveling, dark blue mana glow, knight armor made of shadows, epic anime style, dark background'
  },
  { 
    id: 'poring', 
    name: 'Shadow Poring', 
    rank: 'Normal', 
    level: 1, 
    xp: 0, 
    unlocked: true, 
    icon: 'Dna',
    imageUrl: 'https://picsum.photos/seed/poring/400/400',
    prompt: 'A cute pink slime creature called a Poring from Ragnarok Online, but stylized as a shadow soldier with dark blue mana glow, epic anime style'
  },
  { 
    id: 'agumon', 
    name: 'Shadow Agumon', 
    rank: 'Elite', 
    level: 5, 
    xp: 0, 
    unlocked: false, 
    icon: 'Flame',
    imageUrl: 'https://picsum.photos/seed/agumon/400/400',
    prompt: 'Agumon from Digimon, but stylized as a shadow soldier with dark blue mana glow, glowing blue eyes, epic anime style'
  },
  { 
    id: 'knight', 
    name: 'Igris', 
    rank: 'Knight', 
    level: 10, 
    xp: 0, 
    unlocked: false, 
    icon: 'Sword',
    imageUrl: 'https://picsum.photos/seed/blood-knight/400/400',
    prompt: 'Igris the Blood Red Knight from Solo Leveling, tall knight in blood red armor with a long red plume, holding a massive sword, dark shadow aura, epic anime style'
  },
  { 
    id: 'tank', 
    name: 'Tank', 
    rank: 'Elite', 
    level: 15, 
    xp: 0, 
    unlocked: false, 
    icon: 'Dna',
    imageUrl: 'https://picsum.photos/seed/shadow-bear/400/400',
    prompt: 'Tank the shadow bear from Solo Leveling, massive grizzly bear made of dark shadows and blue mana, armored, epic anime style'
  },
  { 
    id: 'mage', 
    name: 'Tusk', 
    rank: 'Commander', 
    level: 20, 
    xp: 0, 
    unlocked: false, 
    icon: 'Zap',
    imageUrl: 'https://picsum.photos/seed/dark-shaman/400/400',
    prompt: 'Tusk the high orc shaman shadow from Solo Leveling, tall muscular orc with dark shadow skin, glowing blue tattoos, holding a magical staff, epic anime style'
  },
  { 
    id: 'beru', 
    name: 'Beru', 
    rank: 'Marshal', 
    level: 30, 
    xp: 0, 
    unlocked: false, 
    icon: 'Bug',
    imageUrl: 'https://picsum.photos/seed/shadow-king/400/400',
    prompt: 'Beru the shadow ant king from Solo Leveling, humanoid ant warrior with sharp claws and wings, dark shadow armor, glowing blue eyes, epic anime style'
  },
];

export const FOCUS_DURATIONS = [
  { label: '10m', value: 10 * 60, xp: 100 },
  { label: '25m', value: 25 * 60, xp: 300 },
  { label: '50m', value: 50 * 60, xp: 700 },
  { label: '90m', value: 90 * 60, xp: 1500 },
];
