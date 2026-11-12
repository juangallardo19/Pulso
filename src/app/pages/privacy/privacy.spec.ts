import { Privacy } from './privacy';
import { guardar, leer, montar } from '../../../testing/dom';

// Privacidad: todo se prueba tocando el HTML
describe('Privacy', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('muestra los dos interruptores con sus valores por defecto', async () => {
    const p = await montar(Privacy);
    expect(p.cuantos('app-toggle-switch')).toBe(2);
    expect(p.tieneClase('.toggle', 'on', 0)).toBe(false); // compartir datos
    expect(p.tieneClase('.toggle', 'on', 1)).toBe(true); // consejos
  });

  it('tocar cada interruptor lo cambia y lo guarda', async () => {
    const p = await montar(Privacy);
    await p.clic('.toggle', 0);
    await p.clic('.toggle', 1);
    expect(p.tieneClase('.toggle', 'on', 0)).toBe(true);
    expect(p.tieneClase('.toggle', 'on', 1)).toBe(false);
    expect(leer('pulso-ajustes').shareAnonymousData).toBe(true);
    expect(leer('pulso-ajustes').showInsights).toBe(false);
  });

  it('"Eliminar mis datos" pide confirmación y borra todo', async () => {
    guardar('pulso-historial', [{ date: '2026-11-11' }]);
    guardar('pulso-goals', { sleepHours: 7 });
    guardar('pulso-recordatorios', []);
    const pregunta = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const p = await montar(Privacy);
    expect(p.visible('.eliminado')).toBe(false);
    await p.clic('.btn-danger');
    expect(pregunta).toHaveBeenCalled();
    expect(leer('pulso-historial')).toBeNull();
    expect(leer('pulso-goals')).toBeNull();
    expect(leer('pulso-recordatorios')).toBeNull();
    expect(p.visible('.eliminado')).toBe(true);
  });

  it('si se cancela la confirmación no borra nada', async () => {
    guardar('pulso-historial', [{ date: '2026-11-11' }]);
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const p = await montar(Privacy);
    await p.clic('.btn-danger');
    expect(leer('pulso-historial')).not.toBeNull();
    expect(p.visible('.eliminado')).toBe(false);
  });

  it('después de eliminar, los interruptores vuelven a sus valores por defecto', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const p = await montar(Privacy);
    await p.clic('.toggle', 0);
    await p.clic('.btn-danger');
    expect(p.tieneClase('.toggle', 'on', 0)).toBe(false);
  });

  it('"Volver" lleva al perfil', async () => {
    const p = await montar(Privacy);
    expect(p.href('[aria-label="Volver"]')).toBe('/perfil');
  });
});
