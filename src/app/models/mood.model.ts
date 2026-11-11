export interface Mood {
  value: number;
  label: string;
  image: string;
}

export const MOODS: Mood[] = [
  { value: 1, label: 'Muy mal', image: 'moods/1.svg' },
  { value: 2, label: 'Mal', image: 'moods/2.svg' },
  { value: 3, label: 'Regular', image: 'moods/3.svg' },
  { value: 4, label: 'Bien', image: 'moods/4.svg' },
  { value: 5, label: 'Muy bien', image: 'moods/5.svg' },
];
