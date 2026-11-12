import { Breathe } from './breathe';
import { leer, montar } from '../../../testing/dom';

// Respira: todo se prueba tocando el HTML
describe('Breathe', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('muestra las 2 técnicas con sus fases y la primera elegida', async () => {
    const p = await montar(Breathe);
    expect(p.cuantos('.technique')).toBe(2);
    expect(p.texto('.technique h3', 0)).toBe('Respiración 4-7-8');
    expect(p.texto('.technique .phases', 1)).toBe('4 inhala4 sostén4 exhala4 sostén');
    expect(p.tieneClase('.technique', 'selected', 0)).toBe(true);
  });

  it('tocar una técnica la marca como elegida', async () => {
    const p = await montar(Breathe);
    await p.clic('.technique', 1);
    expect(p.tieneClase('.technique', 'selected', 1)).toBe(true);
    expect(p.tieneClase('.technique', 'selected', 0)).toBe(false);
  });

  it('tocar una duración la activa', async () => {
    const p = await montar(Breathe);
    expect(p.texto('.duration .chip.active')).toBe('1 min');
    await p.clic('.duration .chip', 2);
    expect(p.texto('.duration .chip.active')).toBe('5 min');
    expect(p.cuantos('.duration .chip.active')).toBe(1);
  });

  it('"Comenzar" guarda la técnica y los minutos y lleva a la sesión', async () => {
    const p = await montar(Breathe);
    await p.clic('.technique', 1);
    await p.clic('.duration .chip', 1);
    await p.clic('.start');
    expect(leer('pulso-respiracion')).toEqual({ name: 'Respiración en caja', minutes: 3 });
    expect(p.href('.start')).toBe('/respira/sesion');
  });
});
