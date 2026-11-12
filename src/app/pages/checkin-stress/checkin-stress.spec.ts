import { CheckinStress } from './checkin-stress';
import { leer, montar } from '../../../testing/dom';

// Paso 5 del check-in: todo se prueba tocando el HTML
describe('CheckinStress', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('se crea con el paso 5 de 6, nivel 5 y 6 causas', async () => {
    const p = await montar(CheckinStress);
    expect(p.atributo('.stepper', 'aria-label')).toBe('Paso 5 de 6');
    expect(p.texto('.metric')).toBe('5');
    expect(p.cuantos('.chip')).toBe(6);
  });

  it('mover el slider cambia el número y su color (bajo, medio, alto)', async () => {
    const p = await montar(CheckinStress);
    await p.mover('input[type="range"]', 2);
    expect(p.texto('.metric')).toBe('2');
    expect(p.tieneClase('.metric', 'bajo')).toBe(true);
    await p.mover('input[type="range"]', 5);
    expect(p.tieneClase('.metric', 'medio')).toBe(true);
    await p.mover('input[type="range"]', 9);
    expect(p.tieneClase('.metric', 'alto')).toBe(true);
  });

  it('tocar una causa la activa y tocarla otra vez la desactiva', async () => {
    const p = await montar(CheckinStress);
    await p.clic('.chip', 2);
    expect(p.tieneClase('.chip', 'active', 2)).toBe(true);
    await p.clic('.chip', 2);
    expect(p.tieneClase('.chip', 'active', 2)).toBe(false);
  });

  it('"Siguiente" guarda el nivel y las causas', async () => {
    const p = await montar(CheckinStress);
    await p.mover('input[type="range"]', 8);
    await p.clic('.chip', 0);
    await p.clic('.btn-primary');
    const enCurso = leer('pulso-checkin-hoy');
    expect(enCurso.stress).toBe(8);
    expect(enCurso.stressCauses).toEqual(['Parcial']);
    expect(p.href('.btn-primary')).toBe('/checkin/resumen');
  });

  it('"Omitir" también guarda y sigue al resumen', async () => {
    const p = await montar(CheckinStress);
    await p.clic('.btn-ghost');
    expect(leer('pulso-checkin-hoy').stress).toBe(5);
    expect(p.href('.btn-ghost')).toBe('/checkin/resumen');
  });
});
