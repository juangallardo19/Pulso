import { CheckinSleep } from './checkin-sleep';
import { guardar, leer, montar } from '../../../testing/dom';

// Paso 2 del check-in: todo se prueba tocando el HTML
describe('CheckinSleep', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('se crea con el paso 2 de 6 y 23:30 → 07:00 (7 h 30 min)', async () => {
    const p = await montar(CheckinSleep);
    expect(p.atributo('.stepper', 'aria-label')).toBe('Paso 2 de 6');
    expect(p.texto('.bg-blue h2')).toBe('7 h 30 min');
  });

  it('cambiar la hora de despertar recalcula lo que dormiste', async () => {
    const p = await montar(CheckinSleep);
    await p.escribir('input[type="time"]', '08:30', 1);
    expect(p.texto('.bg-blue h2')).toBe('9 h');
  });

  it('cuenta bien una noche que cruza la medianoche', async () => {
    const p = await montar(CheckinSleep);
    await p.escribir('input[type="time"]', '01:00', 0);
    await p.escribir('input[type="time"]', '06:00', 1);
    expect(p.texto('.bg-blue h2')).toBe('5 h');
  });

  it('sin metas guardadas muestra la meta de 8 h', async () => {
    const p = await montar(CheckinSleep);
    expect(p.texto('.bg-blue')).toContain('Meta 8 h');
  });

  it('muestra la meta de sueño guardada', async () => {
    guardar('pulso-goals', { sleepHours: 7 });
    const p = await montar(CheckinSleep);
    expect(p.texto('.bg-blue')).toContain('Meta 7 h');
  });

  it('tocar un punto elige la calidad del sueño', async () => {
    const p = await montar(CheckinSleep);
    expect(p.cuantos('.q')).toBe(5);
    await p.clic('.q', 1);
    expect(p.cuantos('.q.on')).toBe(2);
  });

  it('"Siguiente" guarda horas y calidad', async () => {
    const p = await montar(CheckinSleep);
    await p.escribir('input[type="time"]', '22:00', 0);
    await p.clic('.q', 4);
    await p.clic('.btn-primary');
    const enCurso = leer('pulso-checkin-hoy');
    expect(enCurso.sleepStart).toBe('22:00');
    expect(enCurso.sleepEnd).toBe('07:00');
    expect(enCurso.sleepQuality).toBe(5);
    expect(p.href('.btn-primary')).toBe('/checkin/agua');
  });

  it('"Omitir" también guarda y sigue al paso del agua', async () => {
    const p = await montar(CheckinSleep);
    await p.clic('.btn-ghost');
    expect(leer('pulso-checkin-hoy').sleepStart).toBe('23:30');
    expect(p.href('.btn-ghost')).toBe('/checkin/agua');
  });
});
