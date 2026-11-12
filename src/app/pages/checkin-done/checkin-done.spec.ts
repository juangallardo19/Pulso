import { CheckinDone } from './checkin-done';
import { guardar, haceDias, montar } from '../../../testing/dom';

// Pantalla final del check-in: todo se prueba leyendo el HTML
describe('CheckinDone', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('se crea y dice "Check-in guardado"', async () => {
    const p = await montar(CheckinDone);
    expect(p.texto('h1')).toBe('Check-in guardado');
  });

  it('muestra la racha de días seguidos', async () => {
    guardar('pulso-historial', [
      { date: haceDias(2) },
      { date: haceDias(1) },
      { date: haceDias(0) },
    ]);
    const p = await montar(CheckinDone);
    expect(p.texto('.streak .metric')).toBe('3 días');
  });

  it('un día sin check-in corta la racha', async () => {
    guardar('pulso-historial', [
      { date: haceDias(5) },
      { date: haceDias(4) },
      { date: haceDias(0) },
    ]);
    const p = await montar(CheckinDone);
    expect(p.texto('.streak .metric')).toBe('1 día');
  });

  it('sin historial la racha es 0', async () => {
    const p = await montar(CheckinDone);
    expect(p.texto('.streak .metric')).toBe('0 días');
  });

  it('"Ir al inicio" lleva a /inicio', async () => {
    const p = await montar(CheckinDone);
    expect(p.href('.btn-primary')).toBe('/inicio');
  });
});
