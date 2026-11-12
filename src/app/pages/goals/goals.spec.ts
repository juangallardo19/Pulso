import { Goals } from './goals';
import { guardar, leer, montar } from '../../../testing/dom';

// Metas: todo se prueba moviendo los sliders y tocando el HTML
describe('Goals', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('sin metas guardadas los sliders empiezan en 8 h, 8 vasos y 30 min', async () => {
    const p = await montar(Goals);
    expect(p.todos('.goal .metric').map((m) => m.textContent?.trim())).toEqual(['8', '8', '30']);
  });

  it('si ya había metas guardadas, empieza con ellas', async () => {
    guardar('pulso-goals', { sleepHours: 7, waterGlasses: 6, exerciseMinutes: 45 });
    const p = await montar(Goals);
    expect(p.todos('.goal .metric').map((m) => m.textContent?.trim())).toEqual(['7', '6', '45']);
  });

  it('mover un slider cambia su número en pantalla', async () => {
    const p = await montar(Goals);
    await p.mover('input.water', 12);
    expect(p.texto('.goal .metric', 1)).toBe('12');
  });

  it('"Continuar" guarda las metas elegidas y lleva al inicio', async () => {
    const p = await montar(Goals);
    await p.mover('input.sleep', 7);
    await p.mover('input.water', 10);
    await p.mover('input.exercise', 45);
    await p.clic('.btn-primary');
    expect(leer('pulso-goals')).toEqual({ sleepHours: 7, waterGlasses: 10, exerciseMinutes: 45 });
    expect(p.href('.btn-primary')).toBe('/inicio');
  });

  it('"Volver" lleva al registro', async () => {
    const p = await montar(Goals);
    expect(p.href('[aria-label="Volver"]')).toBe('/registro');
  });
});
