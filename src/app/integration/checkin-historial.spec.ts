import { CheckinMood } from '../pages/checkin-mood/checkin-mood';
import { CheckinWater } from '../pages/checkin-water/checkin-water';
import { CheckinSummary } from '../pages/checkin-summary/checkin-summary';
import { History } from '../pages/history/history';
import { DayDetail } from '../pages/day-detail/day-detail';
import { Stats } from '../pages/stats/stats';
import { Home } from '../pages/home/home';
import { leer, montar } from '../../testing/dom';

// Hace el check-in como lo haría una persona: toca la carita, suma vasos y guarda
async function hacerCheckin(carita: number, vasos: number) {
  const animo = await montar(CheckinMood);
  await animo.clic('.mood', carita);
  await animo.clic('.btn-primary');

  const agua = await montar(CheckinWater);
  for (let i = 0; i < vasos; i++) {
    await agua.clic('.ctrl.plus');
  }
  await agua.clic('.btn-primary');

  const resumen = await montar(CheckinSummary);
  await resumen.clic('.btn-primary');
}

// Une el check-in (seba4s) con historial, detalle y estadísticas (andresc1108)
describe('Integración: check-in → historial, detalle y estadísticas', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('el check-in completo guarda un día en el historial', async () => {
    await hacerCheckin(4, 3); // carita 5 = "Muy bien"
    const historial = leer('pulso-historial');
    expect(historial.length).toBe(1);
    expect(historial[0].mood).toBe(5);
    expect(historial[0].water).toBe(3);
    expect(leer('pulso-checkin-hoy')).toBeNull();
  });

  it('el día de hoy aparece en el calendario con su carita', async () => {
    await hacerCheckin(4, 3);
    const historial = await montar(History);
    expect(historial.atributo('app-day-cell .today img', 'src')).toBe('moods/5.svg');
    expect(historial.texto('.total .metric')).toBe('1');
  });

  it('al tocar el día de hoy en el historial, el detalle muestra su registro', async () => {
    await hacerCheckin(4, 3);
    const historial = await montar(History);
    await historial.clic('app-day-cell .today');

    const detalle = await montar(DayDetail);
    expect(detalle.texto('.mood-hero h2')).toBe('Muy bien');
    expect(detalle.texto('.detail-grid')).toContain('3');
  });

  it('las estadísticas y el inicio toman los datos del check-in', async () => {
    await hacerCheckin(4, 3);
    const estadisticas = await montar(Stats);
    expect(estadisticas.texto('.mood-card h3')).toBe('Muy bien en promedio');

    const inicio = await montar(Home);
    expect(inicio.texto('.counter .metric')).toBe('3');
    expect(inicio.texto('.hero-panel .selected')).toBe('Muy bien');
  });

  it('repetir el check-in el mismo día reemplaza el registro', async () => {
    await hacerCheckin(4, 3);
    await hacerCheckin(1, 1); // carita 2 = "Mal"
    const historial = leer('pulso-historial');
    expect(historial.length).toBe(1);
    expect(historial[0].mood).toBe(2);
  });
});
