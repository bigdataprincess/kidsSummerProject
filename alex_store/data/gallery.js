// gallery.js — starter pictures shown in the store.
// Uses CSS gradient placeholders by default so the app works with zero images.
// Replace `imageUrl` with `assets/pictures/yourfile.png` once Kiddo adds real art.

export const GALLERY = [
  {
    id: 'pic_001',
    title: 'Sunny Beach',
    priceCoins: 15,
    tags: ['nature', 'summer'],
    emoji: '🏖️',
    color1: '#ffd93d',
    color2: '#5ec8ff',
    imageUrl: null,
  },
  {
    id: 'pic_002',
    title: 'Friendly Dragon',
    priceCoins: 25,
    tags: ['fantasy', 'cool'],
    emoji: '🐉',
    color1: '#7e57c2',
    color2: '#26c6da',
    imageUrl: null,
  },
  {
    id: 'pic_003',
    title: 'Space Rocket',
    priceCoins: 20,
    tags: ['space', 'adventure'],
    emoji: '🚀',
    color1: '#1a237e',
    color2: '#ff6b9d',
    imageUrl: null,
  },
  {
    id: 'pic_004',
    title: 'Rainbow Cat',
    priceCoins: 18,
    tags: ['animal', 'cute'],
    emoji: '🐱',
    color1: '#ff6b9d',
    color2: '#ffd93d',
    imageUrl: null,
  },
  {
    id: 'pic_005',
    title: 'Magic Castle',
    priceCoins: 30,
    tags: ['fantasy', 'building'],
    emoji: '🏰',
    color1: '#5ec8ff',
    color2: '#7e57c2',
    imageUrl: null,
  },
  {
    id: 'pic_006',
    title: 'Pizza Slice',
    priceCoins: 12,
    tags: ['food', 'yum'],
    emoji: '🍕',
    color1: '#ff7043',
    color2: '#ffd93d',
    imageUrl: null,
  },
  {
    id: 'pic_007',
    title: 'Soccer Ball',
    priceCoins: 14,
    tags: ['sports'],
    emoji: '⚽',
    color1: '#4caf50',
    color2: '#ffffff',
    imageUrl: null,
  },
  {
    id: 'pic_008',
    title: 'Mountain View',
    priceCoins: 22,
    tags: ['nature'],
    emoji: '🏔️',
    color1: '#90a4ae',
    color2: '#ffffff',
    imageUrl: null,
  },
];

export function findPicture(id) {
  return GALLERY.find(p => p.id === id) || null;
}
