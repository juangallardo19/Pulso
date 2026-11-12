import { CheckinWater } from './checkin-water';
import { guardar, leer, montar } from '../../../testing/dom';

// Paso 3 del check-in: todo se prueba tocando el HTML
describe('CheckinWater', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('se crea en 0 vasos con la meta de 8 si no hay metas', async () => {
    const p = await montar(CheckinWater);
    expect(p.atributo('.stepper', 'aria-label')).toBe('Paso 3 de 6');
    expect(p.texto('.big-number')).toBe('0/ 8 vasos');
  });

  it('usa la meta de agua guardada', async () => {
    guardar('pulso-goals', { waterGlasses: 6 });
    const p = await montar(CheckinWater);
    expect(p.texto('.big-number')).toContain('/ 6 vasos');
  });

  it('el botón + suma vasos y el − los quita', async () => {
    const p = await montar(CheckinWater);
    await p.clic('.ctrl.plus');
    await p.clic('.ctrl.plus');
    expect(p.texto('.metric')).toBe('2');
    await p.clic('.ctrl.minus');
    expect(p.texto('.metric')).toBe('1');
  });

  it('el botón − no baja de 0', async () => {
    const p = await montar(CheckinWater);
    await p.clic('.ctrl.minus');
    expect(p.texto('.metric')).toBe('0');
  });

  it('dice cuántos vasos faltan y, al llegar, "¡Meta cumplida!"', async () => {
    guardar('pulso-goals', { waterGlasses: 2 });
    const p = await montar(CheckinWater);
    await p.clic('.ctrl.plus');
    expect(p.texto('.water p', 0)).toContain('Te faltan 1 vasos');
    expect(p.visible('.water p', 1)).toBe(false);
    await p.clic('.ctrl.plus');
    expect(p.visible('.water p', 0)).toBe(false);
    expect(p.visible('.water p', 1)).toBe(true);
  });

  it('el vaso se llena a medida que se suman vasos', async () => {
    guardar('pulso-goals', { waterGlasses: 4 });
    const p = await montar(CheckinWater);
    await p.clic('.ctrl.plus');
    expect(p.el('.water-fill').style.opacity).toBe('0.25');
  });

  it('"Siguiente" y "Omitir" guardan los vasos y siguen al ejercicio', async () => {
    const p = await montar(CheckinWater);
    await p.clic('.ctrl.plus');
    await p.clic('.btn-primary');
    expect(leer('pulso-checkin-hoy').water).toBe(1);
    localStorage.clear();
    await p.clic('.btn-ghost');
    expect(leer('pulso-checkin-hoy').water).toBe(1);
    expect(p.href('.btn-primary')).toBe('/checkin/ejercicio');
  });

  it('si ya había vasos registrados hoy, empieza desde ahí', async () => {
    guardar('pulso-checkin-hoy', { water: 3 });
    const p = await montar(CheckinWater);
    expect(p.texto('.metric')).toBe('3');
  });
});
