export interface BreathStep {
  nombre: string; // 'Inhala' | 'Sostén' | 'Exhala'
  segundos: number;
}

export interface BreathExercise {
  name: string; // 'Respiración 4-7-8'
  description: string;
  phases: string[]; // etiquetas de la tarjeta: ['4 inhala', '7 sostén', '8 exhala']
  pasos: BreathStep[]; // lo que sigue la sesión, en orden
  color: string; // clase de .art: 'primary' | 'secondary'
  tint: string; // fondo de la tarjeta: 'bg-lav' | 'bg-mint'
}

// Técnicas disponibles. La usan la página Respira (para elegir) y la sesión (para guiar).
export const TECNICAS: BreathExercise[] = [
  {
    name: 'Respiración 4-7-8',
    description: 'Ideal antes de dormir o de un parcial.',
    phases: ['4 inhala', '7 sostén', '8 exhala'],
    pasos: [
      { nombre: 'Inhala', segundos: 4 },
      { nombre: 'Sostén', segundos: 7 },
      { nombre: 'Exhala', segundos: 8 },
    ],
    color: 'primary',
    tint: 'bg-lav',
  },
  {
    name: 'Respiración en caja',
    description: 'Para recuperar el foco con calma.',
    phases: ['4 inhala', '4 sostén', '4 exhala', '4 sostén'],
    pasos: [
      { nombre: 'Inhala', segundos: 4 },
      { nombre: 'Sostén', segundos: 4 },
      { nombre: 'Exhala', segundos: 4 },
      { nombre: 'Sostén', segundos: 4 },
    ],
    color: 'secondary',
    tint: 'bg-mint',
  },
];
