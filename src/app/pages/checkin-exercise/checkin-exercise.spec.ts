import { CheckinExercise } from './checkin-exercise';
import { guardar, leer, montar } from '../../../testing/dom';

// Paso 4 del check-in: todo se prueba tocando el HTML
describe('CheckinExercise', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('se crea con el paso 4 de 6, 30 minutos y 6 tipos de actividad', async () => {
    const p = await montar(CheckinExercise);
    expect(p.atributo('.stepper', 'aria-label')).toBe('Paso 4 de 6');
    expect(p.texto('.metric')).toBe('30');
    expect(p.cuantos('.chip')).toBe(6);
  });

  it('mover el slider cambia los minutos en pantalla', async () => {
    const p = await montar(CheckinExercise);
    await p.mover('input[type="range"]', 60);
    expect(p.texto('.metric')).toBe('60');
  });

  it('muestra la meta de ejercicio guardada', async () => {
    guardar('pulso-goals', { exerciseMinutes: 45 });
    const p = await montar(CheckinExercise);
    expect(p.texto('.limits')).toContain('Meta 45 min');
  });

  it('tocar un tipo lo activa y tocarlo otra vez lo desactiva', async () => {
    const p = await montar(CheckinExercise);
    await p.clic('.chip', 1);
    expect(p.tieneClase('.chip', 'active', 1)).toBe(true);
    await p.clic('.chip', 1);
    expect(p.tieneClase('.chip', 'active', 1)).toBe(false);
  });

  it('se pueden elegir varios tipos', async () => {
    const p = await montar(CheckinExercise);
    await p.clic('.chip', 0);
    await p.clic('.chip', 4);
    expect(p.cuantos('.chip.active')).toBe(2);
  });

  it('"Siguiente" guarda minutos y tipos', async () => {
    const p = await montar(CheckinExercise);
    await p.mover('input[type="range"]', 50);
    await p.clic('.chip', 0);
    await p.clic('.chip', 4);
    await p.clic('.btn-primary');
    const enCurso = leer('pulso-checkin-hoy');
    expect(enCurso.exerciseMinutes).toBe(50);
    expect(enCurso.exerciseTypes).toEqual(['Caminar', 'Yoga']);
    expect(p.href('.btn-primary')).toBe('/checkin/estres');
  });

  it('"Omitir" también guarda y sigue al estrés', async () => {
    const p = await montar(CheckinExercise);
    await p.clic('.btn-ghost');
    expect(leer('pulso-checkin-hoy').exerciseMinutes).toBe(30);
    expect(p.href('.btn-ghost')).toBe('/checkin/estres');
  });
});
