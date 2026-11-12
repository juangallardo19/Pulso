import { CheckinSummary } from './checkin-summary';
import { guardar, leer, montar } from '../../../testing/dom';

const enCurso = {
  date: '2026-11-11',
  mood: 4,
  note: '',
  sleepStart: '23:00',
  sleepEnd: '06:30',
  sleepQuality: 3,
  water: 6,
  exerciseMinutes: 20,
  exerciseTypes: ['Caminar'],
  stress: 7,
  stressCauses: ['Parcial'],
};

// Paso 6 del check-in: todo se prueba tocando el HTML
describe('CheckinSummary', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('muestra todo lo que se registró en los pasos anteriores', async () => {
    guardar('pulso-checkin-hoy', enCurso);
    const p = await montar(CheckinSummary);
    const resumen = p.texto('.summary');
    expect(resumen).toContain('Bien');
    expect(resumen).toContain('7 h 30 min · calidad 3');
    expect(resumen).toContain('6 vasos');
    expect(resumen).toContain('20 min · Caminar');
    expect(resumen).toContain('7 / 10');
  });

  it('compara el agua con el día anterior', async () => {
    guardar('pulso-checkin-hoy', enCurso);
    guardar('pulso-historial', [{ ...enCurso, date: '2026-11-10', water: 4 }]);
    const p = await montar(CheckinSummary);
    expect(p.texto('.bg-sand')).toBe('Tomaste 50 % más agua que ayer. ¡Sigue así!');
  });

  it('si tomó menos agua que ayer, lo dice', async () => {
    guardar('pulso-checkin-hoy', { ...enCurso, water: 3 });
    guardar('pulso-historial', [{ ...enCurso, date: '2026-11-10', water: 6 }]);
    const p = await montar(CheckinSummary);
    expect(p.texto('.bg-sand')).toBe('Tomaste 50 % menos agua que ayer.');
  });

  it('sin día anterior, compara con la meta de agua', async () => {
    guardar('pulso-checkin-hoy', { ...enCurso, water: 5 });
    guardar('pulso-goals', { waterGlasses: 8 });
    const p = await montar(CheckinSummary);
    expect(p.texto('.bg-sand')).toBe('Te faltaron 3 vasos para tu meta de agua.');
  });

  it('"Guardar check-in" agrega el día al historial y lleva a /checkin/listo', async () => {
    guardar('pulso-checkin-hoy', enCurso);
    const p = await montar(CheckinSummary);
    await p.clic('.btn-primary');
    expect(leer('pulso-historial')).toEqual([enCurso]);
    expect(leer('pulso-checkin-hoy')).toBeNull();
    expect(p.href('.btn-primary')).toBe('/checkin/listo');
  });

  it('si el día ya estaba en el historial, lo reemplaza en vez de duplicarlo', async () => {
    guardar('pulso-historial', [{ ...enCurso, mood: 1 }]);
    guardar('pulso-checkin-hoy', enCurso);
    const p = await montar(CheckinSummary);
    await p.clic('.btn-primary');
    const historial = leer('pulso-historial');
    expect(historial.length).toBe(1);
    expect(historial[0].mood).toBe(4);
  });
});
