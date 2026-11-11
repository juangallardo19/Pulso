export interface BreathExercise {
  name: string; // 'Respiración 4-7-8'
  description: string;
  phases: string[]; // ['4 inhala', '7 sostén', '8 exhala']
  color: string; // clase de .art: 'primary' | 'secondary'
  tint: string; // fondo de la tarjeta: 'bg-lav' | 'bg-mint'
}
