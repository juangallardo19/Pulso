import { CheckinSleep } from './checkin-sleep';
import { guardar, leer, montar, Pantalla } from '../../../testing/dom';

async function llenarHoras(p: Pantalla<CheckinSleep>, dormi: string, desperte: string) {
  await p.escribir('input[type="time"]', dormi, 0);
  await p.escribir('input[type="time"]', desperte, 1);
}

// Paso 2 del check-in: todo se prueba tocando el HTML
describe('CheckinSleep', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('empieza sin horas, sin calidad elegida y con "Siguiente" bloqueado', async () => {
    const p = await montar(CheckinSleep);
    expect(p.atributo('.stepper', 'aria-label')).toBe('Paso 2 de 6');
    expect((p.el('input[type="time"]', 0) as HTMLInputElement).value).toBe('');
    expect((p.el('input[type="time"]', 1) as HTMLInputElement).value).toBe('');
    expect(p.texto('.bg-blue h2')).toBe('—');
    expect(p.cuantos('.q.on')).toBe(0);
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
    expect(p.visible('.falta')).toBe(true);
  });

  it('al escribir las dos horas calcula lo que dormiste', async () => {
    const p = await montar(CheckinSleep);
    await llenarHoras(p, '23:30', '07:00');
    expect(p.texto('.bg-blue h2')).toBe('7 h 30 min');
  });

  it('cuenta bien una noche que cruza la medianoche', async () => {
    const p = await montar(CheckinSleep);
    await llenarHoras(p, '01:00', '06:00');
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
    await p.clic('.q', 1);
    expect(p.cuantos('.q.on')).toBe(2);
  });

  it('"Siguiente" se habilita con las dos horas y la calidad', async () => {
    const p = await montar(CheckinSleep);
    await llenarHoras(p, '22:00', '06:00');
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
    await p.clic('.q', 3);
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(false);
    expect(p.visible('.falta')).toBe(false);
  });

  it('"Siguiente" guarda horas y calidad', async () => {
    const p = await montar(CheckinSleep);
    await llenarHoras(p, '22:00', '06:00');
    await p.clic('.q', 4);
    await p.clic('.btn-primary');
    const enCurso = leer('pulso-checkin-hoy');
    expect(enCurso.sleepStart).toBe('22:00');
    expect(enCurso.sleepEnd).toBe('06:00');
    expect(enCurso.sleepQuality).toBe(5);
    expect(p.href('.btn-primary')).toBe('/checkin/agua');
  });

  it('"Omitir" sigue al agua sin inventar horas', async () => {
    const p = await montar(CheckinSleep);
    await p.clic('.btn-ghost');
    expect(leer('pulso-checkin-hoy').sleepStart).toBe('');
    expect(leer('pulso-checkin-hoy').sleepQuality).toBe(0);
    expect(p.href('.btn-ghost')).toBe('/checkin/agua');
  });
});
