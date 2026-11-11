export interface Reminder {
  id: number;
  title: string; // 'Tomar agua'
  time: string; // '10:00'
  icon: string; // 'i-droplet'
  iconColor: string; // 'c-secondary'
  bubble: string; // 'bg-mint'
  dayColor: string; // 'primary' | 'sleep'
  activeDays: string[]; // subconjunto de SEMANA
  isActive: boolean;
}

export const SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
