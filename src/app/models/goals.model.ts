export interface Goals {
  sleepHours: number; // 4 a 12
  waterGlasses: number; // vasos por día
  exerciseMinutes: number; // minutos por día
}

export const METAS_POR_DEFECTO: Goals = {
  sleepHours: 8,
  waterGlasses: 8,
  exerciseMinutes: 30,
};
