import { CheckinMood } from './checkin-mood';
import { guardar, haceDias, leer, montar } from '../../../testing/dom';

// Paso 1 del check-in: todo se prueba tocando el HTML
describe('CheckinMood', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('se crea y muestra las 5 caritas y el paso 1 de 6', async () => {
    const p = await montar(CheckinMood);
    expect(p.cuantos('app-mood-option')).toBe(5);
    expect(p.atributo('.stepper', 'aria-label')).toBe('Paso 1 de 6');
  });

  it('sin check-in empezado, "Bien" aparece elegido', async () => {
    const p = await montar(CheckinMood);
    expect(p.texto('.mood.selected')).toBe('Bien');
  });

  it('tocar una carita la elige y deja solo una seleccionada', async () => {
    const p = await montar(CheckinMood);
    await p.clic('.mood', 0);
    expect(p.texto('.mood.selected')).toBe('Muy mal');
    expect(p.cuantos('.mood.selected')).toBe(1);
  });

  it('"Siguiente" guarda la carita, la nota y la fecha de hoy', async () => {
    const p = await montar(CheckinMood);
    await p.clic('.mood', 4);
    await p.escribir('textarea', 'Buen día');
    await p.clic('.btn-primary');
    const enCurso = leer('pulso-checkin-hoy');
    expect(enCurso.mood).toBe(5);
    expect(enCurso.note).toBe('Buen día');
    expect(enCurso.date).toBe(haceDias(0));
    expect(p.href('.btn-primary')).toBe('/checkin/sueno');
  });

  it('si ya había un check-in empezado, muestra lo que se había elegido', async () => {
    guardar('pulso-checkin-hoy', { mood: 1, note: 'Cansada' });
    const p = await montar(CheckinMood);
    expect(p.texto('.mood.selected')).toBe('Muy mal');
    expect((p.el('textarea') as HTMLTextAreaElement).value).toBe('Cansada');
  });

  it('al editar un día del historial conserva la fecha de ese día', async () => {
    guardar('pulso-historial', [{ date: '2026-11-05', mood: 2 }]);
    guardar('pulso-checkin-hoy', { date: '2026-11-05', mood: 2 });
    const p = await montar(CheckinMood);
    await p.clic('.mood', 3);
    await p.clic('.btn-primary');
    expect(leer('pulso-checkin-hoy').date).toBe('2026-11-05');
  });

  it('volver y cerrar llevan al inicio', async () => {
    const p = await montar(CheckinMood);
    expect(p.href('[aria-label="Volver"]')).toBe('/inicio');
    expect(p.href('[aria-label="Cerrar"]')).toBe('/inicio');
  });
});
