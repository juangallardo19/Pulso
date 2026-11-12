import { Stats } from './stats';
import { CHECKIN_VACIO, CheckinEntry } from '../../models/checkin.model';
import { guardar, montar } from '../../../testing/dom';

// N días seguidos terminando el 2026-11-11 (miércoles); el ánimo va del 1 al 5 en ciclo
function historialDe(n: number, extra: Partial<CheckinEntry> = {}): CheckinEntry[] {
  const lista: CheckinEntry[] = [];
  for (let i = n - 1; i >= 0; i--) {
    lista.push({
      ...CHECKIN_VACIO,
      date: new Date(2026, 10, 11 - i).toLocaleDateString('en-CA'),
      mood: (i % 5) + 1,
      ...extra,
    });
  }
  return lista;
}

const dias = (p: { todos: (s: string) => HTMLElement[] }) =>
  p.todos('.bar-col small').map((d) => d.textContent);

// Estadísticas: todo se prueba tocando y leyendo el HTML
describe('Stats', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('sin registros muestra "Sin datos" y pide seguir registrando', async () => {
    const p = await montar(Stats);
    expect(p.texto('.mood-card h3')).toBe('Sin datos en promedio');
    expect(p.cuantos('.bar-col')).toBe(0);
    expect(p.texto('.insight h3')).toBe('Sigue registrando tus días');
  });

  it('en "Semana" muestra los últimos 7 registros', async () => {
    guardar('pulso-historial', historialDe(10));
    const p = await montar(Stats);
    expect(p.tieneClase('.segmented button', 'active', 0)).toBe(true);
    expect(p.cuantos('.pt')).toBe(7);
    expect(dias(p)).toEqual(['05', '06', '07', '08', '09', '10', '11']);
  });

  it('calcula el ánimo, el sueño y el estrés promedio', async () => {
    guardar(
      'pulso-historial',
      historialDe(3, { mood: 4, stress: 6, sleepStart: '23:00', sleepEnd: '06:00' }),
    );
    const p = await montar(Stats);
    expect(p.texto('.mood-card h3')).toBe('Bien en promedio');
    expect(p.texto('.stats-grid')).toContain('7 h al día');
    expect(p.texto('.stats-grid')).toContain('6 / 10 en promedio');
  });

  it('"Mes" muestra hasta 30 registros', async () => {
    guardar('pulso-historial', historialDe(40));
    const p = await montar(Stats);
    await p.clic('.segmented button', 1);
    expect(p.tieneClase('.segmented button', 'active', 1)).toBe(true);
    expect(p.cuantos('.bar-col')).toBe(30);
  });

  it('"Anterior" muestra la semana pasada y "Siguiente" vuelve', async () => {
    guardar('pulso-historial', historialDe(10));
    const p = await montar(Stats);
    await p.clic('[aria-label="Anterior"]');
    expect(dias(p)).toEqual(['02', '03', '04']);
    await p.clic('[aria-label="Siguiente"]');
    expect(dias(p)).toEqual(['05', '06', '07', '08', '09', '10', '11']);
  });

  it('las flechas se deshabilitan cuando no hay más registros', async () => {
    guardar('pulso-historial', historialDe(5));
    const p = await montar(Stats);
    expect(p.tieneClase('[aria-label="Anterior"]', 'deshabilitado')).toBe(true);
    expect(p.tieneClase('[aria-label="Siguiente"]', 'deshabilitado')).toBe(true);
  });

  it('cambiar a "Mes" vuelve a los registros más recientes', async () => {
    guardar('pulso-historial', historialDe(40));
    const p = await montar(Stats);
    await p.clic('[aria-label="Anterior"]');
    await p.clic('.segmented button', 1);
    expect(dias(p).at(-1)).toBe('11');
  });

  it('las barras de sueño se marcan cuando se cumple la meta', async () => {
    guardar('pulso-goals', { sleepHours: 7 });
    guardar('pulso-historial', [
      { ...CHECKIN_VACIO, date: '2026-11-10', sleepStart: '23:00', sleepEnd: '07:00' },
      { ...CHECKIN_VACIO, date: '2026-11-11', sleepStart: '01:00', sleepEnd: '06:00' },
    ]);
    const p = await montar(Stats);
    expect(p.texto('.goal-line')).toBe('Meta 7 h');
    expect(p.tieneClase('.bar', 'ok', 0)).toBe(true);
    expect(p.tieneClase('.bar', 'ok', 1)).toBe(false);
  });

  it('la línea del gráfico pasa por los registros reales', async () => {
    guardar('pulso-historial', historialDe(2));
    const p = await montar(Stats);
    expect(p.atributo('svg path', 'd')).toBe('M75.0 99.9 L225.0 124.9');
  });

  it('el mapa de estrés colorea cada día de la semana con su nivel', async () => {
    // 2026-11-11 es miércoles (columna X)
    guardar('pulso-historial', [{ ...CHECKIN_VACIO, date: '2026-11-11', stress: 9 }]);
    const p = await montar(Stats);
    const columnas = p.todos('.heat-col');
    expect(columnas.map((c) => c.textContent?.trim())).toEqual(['L', 'M', 'X', 'J', 'V', 'S', 'D']);
    expect((columnas[2].querySelector('span') as HTMLElement).style.opacity).toBe('0.9');
    expect((columnas[0].querySelector('span') as HTMLElement).style.opacity).toBe('0.08');
  });

  it('el hallazgo compara el sueño de los días de más estrés', async () => {
    guardar('pulso-historial', [
      { ...CHECKIN_VACIO, date: '2026-11-10', stress: 9, sleepStart: '01:00', sleepEnd: '06:00' },
      { ...CHECKIN_VACIO, date: '2026-11-11', stress: 3, sleepStart: '23:00', sleepEnd: '07:00' },
    ]);
    const p = await montar(Stats);
    expect(p.texto('.insight h3')).toBe('Duermes menos los días de más estrés');
    expect(p.texto('.insight p')).toBe('Esos días dormiste 3 h 0 min menos que el resto.');
  });

  it('muestra el rango de fechas del periodo', async () => {
    guardar('pulso-historial', historialDe(3));
    const p = await montar(Stats);
    expect(p.texto('.rango')).toBe('9 nov – 11 nov');
  });

  it('el resumen muestra días registrados, agua y minutos de ejercicio', async () => {
    guardar('pulso-historial', [
      { ...CHECKIN_VACIO, date: '2026-11-10', water: 4, exerciseMinutes: 20 },
      { ...CHECKIN_VACIO, date: '2026-11-11', water: 6, exerciseMinutes: 0 },
    ]);
    const p = await montar(Stats);
    expect(p.todos('.kpi .metric').map((m) => m.textContent?.trim())).toEqual([
      '2',
      expect.any(String),
      '5',
      '20',
    ]);
  });

  it('cada tarjeta explica su dato con una frase', async () => {
    guardar('pulso-goals', { sleepHours: 7 });
    guardar('pulso-historial', [
      {
        ...CHECKIN_VACIO,
        date: '2026-11-09',
        mood: 2,
        stress: 3,
        stressCauses: ['Parcial'],
        sleepStart: '23:00',
        sleepEnd: '07:00',
      },
      {
        ...CHECKIN_VACIO,
        date: '2026-11-10',
        mood: 2,
        stress: 9,
        stressCauses: ['Parcial', 'Dinero'],
        sleepStart: '02:00',
        sleepEnd: '06:00',
      },
      { ...CHECKIN_VACIO, date: '2026-11-11', mood: 5, stress: 4, stressCauses: [] },
    ]);
    const p = await montar(Stats);
    const frases = p.todos('.explica').map((e) => e.textContent?.trim());
    expect(frases[0]).toBe('Lo que más sentiste fue "mal" (2 días).');
    expect(frases[1]).toBe('Llegaste a tu meta de 7 h en 1 de 2 noches.');
    expect(frases[2]).toBe(
      'Tu día más tenso fue el martes (9/10). Lo que más te estresó: parcial.',
    );
  });

  it('las barras de agua y ejercicio se llenan frente a las metas', async () => {
    guardar('pulso-goals', { waterGlasses: 8, exerciseMinutes: 40 });
    guardar('pulso-historial', [
      { ...CHECKIN_VACIO, date: '2026-11-10', water: 4, exerciseMinutes: 20 },
      { ...CHECKIN_VACIO, date: '2026-11-11', water: 8, exerciseMinutes: 0 },
    ]);
    const p = await montar(Stats);
    expect(p.texto('.metas-card')).toContain('6 / 8 vasos');
    expect(p.texto('.metas-card')).toContain('10 / 40 min');
    expect(p.el('.barra .agua').style.width).toBe('75%');
    expect(p.el('.barra .ejercicio').style.width).toBe('25%');
    expect(p.texto('.metas-card')).toContain('Hiciste ejercicio 1 de 2 días.');
  });

  it('el calendario del encabezado lleva al historial', async () => {
    const p = await montar(Stats);
    expect(p.href('.page-header a')).toBe('/historial');
  });
});
