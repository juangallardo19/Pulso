import { Goals } from './goals';
import { guardar, leer, montar, Pantalla } from '../../../testing/dom';

const metas = (p: Pantalla<Goals>) => p.todos('.goal .metric').map((m) => m.textContent?.trim());

// Metas: todo se prueba moviendo los sliders y tocando el HTML
describe('Goals', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('en el registro ninguna meta viene elegida', async () => {
    const p = await montar(Goals);
    expect(metas(p)).toEqual(['—', '—', '—']);
    expect(p.cuantos('.range.sin-elegir')).toBe(3);
    expect(p.texto('h1')).toBe('¿Cuáles son tus metas?');
    expect(p.visible('[aria-label="Volver"]')).toBe(false);
  });

  it('"Continuar" está bloqueado hasta elegir las tres metas', async () => {
    const p = await montar(Goals);
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
    expect(p.visible('.falta')).toBe(true);
    await p.mover('input.sleep', 7);
    await p.mover('input.water', 6);
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
    await p.mover('input.exercise', 45);
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(false);
    expect(p.visible('.falta')).toBe(false);
  });

  it('mover una barra muestra su número', async () => {
    const p = await montar(Goals);
    await p.mover('input.water', 12);
    expect(metas(p)[1]).toBe('12');
    expect(p.tieneClase('input.water', 'sin-elegir')).toBe(false);
  });

  it('con las metas incompletas, tocar el botón no guarda nada', async () => {
    const p = await montar(Goals);
    await p.mover('input.water', 6);
    await p.clic('.btn-primary');
    expect(leer('pulso-goals')).toBeNull();
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

  it('al editar desde el perfil muestra las metas guardadas y vuelve al perfil', async () => {
    guardar('pulso-goals', { sleepHours: 7, waterGlasses: 6, exerciseMinutes: 45 });
    const p = await montar(Goals);
    expect(metas(p)).toEqual(['7', '6', '45']);
    expect(p.texto('h1')).toBe('Edita tus metas');
    expect(p.texto('.btn-primary')).toContain('Guardar metas');
    expect(p.href('.btn-primary')).toBe('/perfil');
    expect(p.visible('[aria-label="Volver"]')).toBe(true);
    expect(p.href('[aria-label="Volver"]')).toBe('/perfil');
  });
});
