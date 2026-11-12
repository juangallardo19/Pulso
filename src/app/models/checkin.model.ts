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

// Días seguidos con check-in. Si hoy todavía no hay registro, se cuenta desde ayer
// (la racha no se pierde hasta que termina el día).
export function calcularRacha(historial: CheckinEntry[], hoy: Date = new Date()): number {
  const fechas = historial.map((d) => d.date);
  const dia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  if (!fechas.includes(dia.toLocaleDateString('en-CA'))) {
    dia.setDate(dia.getDate() - 1);
  }
  let racha = 0;
  while (fechas.includes(dia.toLocaleDateString('en-CA'))) {
    racha++;
    dia.setDate(dia.getDate() - 1);
  }
  return racha;
}
