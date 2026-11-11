export interface CheckinEntry {
  date: string;
  mood: number;
  note: string;
  sleepStart: string;
  sleepEnd: string;
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
  water: 0,
  exerciseMinutes: 30,
  exerciseTypes: [],
  stress: 5,
  stressCauses: [],
};
