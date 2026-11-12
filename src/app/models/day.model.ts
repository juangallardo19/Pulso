export interface Day {
  number: number;
  mood: number; // 0 = día sin registro
  isToday?: boolean;
  date?: string; // 'AAAA-MM-DD'
}
