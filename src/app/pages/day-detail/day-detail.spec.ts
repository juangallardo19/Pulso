import { DayDetail } from './day-detail';
import { CheckinMood } from '../checkin-mood/checkin-mood';
import { CheckinSummary } from '../checkin-summary/checkin-summary';
import { CHECKIN_VACIO } from '../../models/checkin.model';
import { guardar, leer, montar } from '../../../testing/dom';

const diaPasado = {
  ...CHECKIN_VACIO,
  date: '2026-11-05',
  mood: 2,
  note: 'Día de parcial',
  sleepStart: '01:00',
  sleepEnd: '06:30',
  sleepQuality: 2,
  water: 4,
  exerciseMinutes: 15,
  exerciseTypes: ['Caminar'],
  stress: 9,
  stressCauses: ['Parcial', 'Trabajo'],
};

// Detalle del día: todo se prueba tocando y leyendo el HTML
describe('DayDetail', () => {
  beforeEach(() => {
    localStorage.clear();
    guardar('pulso-historial', [diaPasado]);
    localStorage.setItem('pulso-dia-seleccionado', '2026-11-05');
  });

  afterEach(() => localStorage.clear());

  it('muestra la fecha y todo lo registrado ese día', async () => {
    const p = await montar(DayDetail);
    expect(p.texto('.fecha').toLowerCase()).toContain('5 de noviembre');
    expect(p.texto('.mood-hero')).toContain('Mal');
    expect(p.texto('.mood-hero')).toContain('"Día de parcial"');
    expect(p.texto('.detail-grid')).toContain('5 h 30 min');
    expect(p.texto('.detail-grid')).toContain('01:00 a 06:30 · calidad 2');
    expect(p.texto('.detail-grid')).toContain('caminar');
    expect(p.todos('.tags .chip').map((c) => c.textContent?.trim())).toEqual([
      'Parcial',
      'Trabajo',
    ]);
  });

  it('si el día no tiene registro lo dice y no muestra datos', async () => {
    localStorage.setItem('pulso-dia-seleccionado', '2026-11-01');
    const p = await montar(DayDetail);
    expect(p.texto('p.card')).toBe('No hay registro para este día');
    expect(p.visible('.detail-grid')).toBe(false);
  });

  it('"Editar registro" carga ese día en el check-in', async () => {
    const p = await montar(DayDetail);
    await p.clic('.edit');
    expect(leer('pulso-checkin-hoy')).toEqual(diaPasado);
    expect(p.href('.edit')).toBe('/checkin/animo');
  });

  it('el lápiz del encabezado también carga ese día', async () => {
    const p = await montar(DayDetail);
    await p.clic('.page-header [aria-label="Editar registro"]');
    expect(leer('pulso-checkin-hoy').date).toBe('2026-11-05');
  });

  it('al editar, el día se corrige en su fecha y no se duplica', async () => {
    let p = await montar(DayDetail, [CheckinMood, CheckinSummary]);
    await p.clic('.edit');

    const animo = await montar(CheckinMood);
    await animo.clic('.mood', 4);
    await animo.clic('.btn-primary');

    const resumen = await montar(CheckinSummary);
    await resumen.clic('.btn-primary');

    const historial = leer('pulso-historial');
    expect(historial.length).toBe(1);
    expect(historial[0].date).toBe('2026-11-05');
    expect(historial[0].mood).toBe(5);

    p = await montar(DayDetail);
    expect(p.texto('.mood-hero')).toContain('Muy bien');
  });

  it('si el día no tiene registro, editar empieza un check-in vacío', async () => {
    localStorage.setItem('pulso-dia-seleccionado', '2026-11-01');
    guardar('pulso-checkin-hoy', { date: '2026-10-01' });
    const p = await montar(DayDetail);
    await p.clic('.page-header [aria-label="Editar registro"]');
    expect(leer('pulso-checkin-hoy')).toBeNull();
  });

  it('"Volver" lleva al historial', async () => {
    const p = await montar(DayDetail);
    expect(p.href('[aria-label="Volver"]')).toBe('/historial');
  });
});
