import { History } from './history';
import { CHECKIN_VACIO } from '../../models/checkin.model';
import { guardar, leer, montar } from '../../../testing/dom';

const hoy = new Date();
// Fecha AAAA-MM-DD de un día del mes actual (o de hace N meses)
const fecha = (dia: number, mesesAtras = 0) =>
  new Date(hoy.getFullYear(), hoy.getMonth() - mesesAtras, dia).toLocaleDateString('en-CA');
const nombreMes = (mesesAtras: number) =>
  new Date(hoy.getFullYear(), hoy.getMonth() - mesesAtras, 1).toLocaleDateString('es-CO', {
    month: 'long',
    year: 'numeric',
  });
const caras = (p: { todos: (s: string) => HTMLElement[] }) =>
  p.todos('app-day-cell img').filter((img) => !img.classList.contains('oculto'));

// Historial: todo se prueba tocando y leyendo el HTML
describe('History', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('muestra el mes actual con todos sus días', async () => {
    const p = await montar(History);
    const diasDelMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    expect(p.texto('.nombre-mes')).toBe(nombreMes(0));
    expect(p.cuantos('app-day-cell')).toBe(diasDelMes);
  });

  it('sin registros muestra el aviso para hacer el primer check-in', async () => {
    const p = await montar(History);
    expect(p.visible('.empty')).toBe(true);
    expect(p.href('.empty a')).toBe('/checkin/animo');
    expect(caras(p).length).toBe(0);
  });

  it('pone la carita de cada día registrado y cuenta los ánimos', async () => {
    guardar('pulso-historial', [
      { ...CHECKIN_VACIO, date: fecha(1), mood: 4 },
      { ...CHECKIN_VACIO, date: fecha(2), mood: 4 },
      { ...CHECKIN_VACIO, date: fecha(3), mood: 1 },
    ]);
    const p = await montar(History);
    expect(p.visible('.empty')).toBe(false);
    expect(caras(p).map((img) => img.getAttribute('src'))).toEqual([
      'moods/4.svg',
      'moods/4.svg',
      'moods/1.svg',
    ]);
    expect(p.todos('.count strong').map((c) => c.textContent)).toEqual(['1', '0', '0', '2', '0']);
    expect(p.texto('.total .metric')).toBe('3');
  });

  it('marca el día de hoy', async () => {
    const p = await montar(History);
    expect(p.cuantos('app-day-cell .today')).toBe(1);
    expect(p.texto('app-day-cell .today')).toBe(String(hoy.getDate()));
  });

  it('"Mes anterior" muestra el mes pasado con sus registros', async () => {
    guardar('pulso-historial', [{ ...CHECKIN_VACIO, date: fecha(5, 1), mood: 2 }]);
    const p = await montar(History);
    expect(caras(p).length).toBe(0);
    await p.clic('[aria-label="Mes anterior"]');
    expect(p.texto('.nombre-mes')).toBe(nombreMes(1));
    expect(caras(p).length).toBe(1);
    expect(p.cuantos('app-day-cell .today')).toBe(0);
  });

  it('"Mes siguiente" vuelve al mes actual y no deja pasar de ahí', async () => {
    const p = await montar(History);
    expect(p.tieneClase('[aria-label="Mes siguiente"]', 'deshabilitado')).toBe(true);
    await p.clic('[aria-label="Mes anterior"]');
    expect(p.tieneClase('[aria-label="Mes siguiente"]', 'deshabilitado')).toBe(false);
    await p.clic('[aria-label="Mes siguiente"]');
    expect(p.texto('.nombre-mes')).toBe(nombreMes(0));
    await p.clic('[aria-label="Mes siguiente"]');
    expect(p.texto('.nombre-mes')).toBe(nombreMes(0));
  });

  it('se puede retroceder hasta el año anterior', async () => {
    const p = await montar(History);
    for (let i = 0; i <= hoy.getMonth(); i++) {
      await p.clic('[aria-label="Mes anterior"]');
    }
    expect(p.texto('.nombre-mes')).toContain('diciembre');
    expect(p.texto('.nombre-mes')).toContain(String(hoy.getFullYear() - 1));
  });

  it('tocar un día guarda su fecha y lleva al detalle', async () => {
    guardar('pulso-historial', [{ ...CHECKIN_VACIO, date: fecha(5), mood: 4 }]);
    const p = await montar(History);
    await p.clic('app-day-cell a', 4);
    expect(localStorage.getItem('pulso-dia-seleccionado')).toBe(fecha(5));
    expect(p.href('app-day-cell a', 4)).toBe('/historial/dia');
    expect(leer('pulso-historial').length).toBe(1);
  });

  it('los accesos llevan a estadísticas y al check-in', async () => {
    const p = await montar(History);
    expect(p.href('[aria-label="Ver estadísticas"]')).toBe('/estadisticas');
    expect(p.href('.more')).toBe('/estadisticas');
    expect(p.href('.fab')).toBe('/checkin/animo');
  });
});
