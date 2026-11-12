export interface CheckinEntry {
  date: string;
  mood: number;
  note: string;
  sleepStart: string;
  sleepEnd: string;
  sleepQuality?: number; // 1 a 5 (opcional: los registros viejos no lo tienen)
  water: number;
  exerciseMinutes: number;
  exerciseTypes: string[];
  stress: number;
  stressCauses: string[];
}

export const CHECKIN_VACIO: CheckinEntry = {
  date: '',
  mood: 4,
  note: '',
  sleepStart: '23:30',
  sleepEnd: '07:00',
  sleepQuality: 4,
  water: 0,
  exerciseMinutes: 30,
  exerciseTypes: [],
  stress: 5,
  stressCauses: [],
};
