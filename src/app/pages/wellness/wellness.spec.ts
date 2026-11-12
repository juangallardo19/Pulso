import { Wellness } from './wellness';
import { montar } from '../../../testing/dom';

// Bienestar U: todo se prueba tocando y leyendo el HTML
describe('Wellness', () => {
  afterEach(() => vi.restoreAllMocks());

  it('muestra los 3 servicios y el filtro "Todos" activo', async () => {
    const p = await montar(Wellness);
    expect(p.todos('app-service-card h3').map((h) => h.textContent)).toEqual([
      'Psicología',
      'Enfermería',
      'Deportes',
    ]);
    expect(p.texto('.filters .chip.active')).toBe('Todos');
  });

  it('tocar un filtro deja solo los servicios de esa categoría', async () => {
    const p = await montar(Wellness);
    await p.clic('.filters .chip', 2);
    expect(p.texto('.filters .chip.active')).toBe('Enfermería');
    expect(p.todos('app-service-card h3').map((h) => h.textContent)).toEqual(['Enfermería']);
    await p.clic('.filters .chip', 0);
    expect(p.cuantos('app-service-card')).toBe(3);
  });

  it('"Contactar" muestra el teléfono de ese servicio', async () => {
    const aviso = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const p = await montar(Wellness);
    await p.clic('app-service-card .contact', 1);
    expect(aviso).toHaveBeenCalledWith('Puedes comunicarte al 601 555 0102');
  });

  it('el ícono del encabezado y las líneas llaman a los números de ayuda', async () => {
    const p = await montar(Wellness);
    expect(p.href('.page-header a')).toBe('tel:106');
    expect(p.todos('.lines a').map((a) => a.getAttribute('href'))).toEqual(['tel:106', 'tel:192']);
  });
});
