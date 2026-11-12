import { Wellness } from './wellness';
import { montar } from '../../../testing/dom';

// Bienestar U: todo se prueba tocando y leyendo el HTML
describe('Wellness', () => {
  afterEach(() => vi.restoreAllMocks());

  it('muestra la sede real del campus Pasto', async () => {
    const p = await montar(Wellness);
    expect(p.texto('.sede')).toContain('Calle 18 N.º 45-150, Torobajo');
    expect(p.texto('.sede')).toContain('602 7370660');
  });

  it('muestra los servicios del JSON y el filtro "Todos" activo', async () => {
    const p = await montar(Wellness);
    expect(p.todos('app-service-card h3').map((h) => h.textContent)).toEqual([
      'Bienestar Universitario',
      'Clínica Odontológica',
      'Conmutador del campus',
    ]);
    expect(p.texto('.filters .chip.active')).toBe('Todos');
  });

  it('los filtros salen de las categorías del JSON', async () => {
    const p = await montar(Wellness);
    expect(p.todos('.filters .chip').map((c) => c.textContent?.trim())).toEqual([
      'Todos',
      'Bienestar',
      'Salud',
      'Contacto',
    ]);
  });

  it('tocar un filtro deja solo los servicios de esa categoría', async () => {
    const p = await montar(Wellness);
    await p.clic('.filters .chip', 2);
    expect(p.texto('.filters .chip.active')).toBe('Salud');
    expect(p.todos('app-service-card h3').map((h) => h.textContent)).toEqual([
      'Clínica Odontológica',
    ]);
    await p.clic('.filters .chip', 0);
    expect(p.cuantos('app-service-card')).toBe(3);
  });

  it('cada servicio muestra su horario y su lugar', async () => {
    const p = await montar(Wellness);
    expect(p.texto('app-service-card', 0)).toContain('Lun a vie · 8:00–12:00 y 2:00–5:30 p. m.');
    expect(p.texto('app-service-card', 0)).toContain('Torobajo');
  });

  it('"Contactar" muestra el teléfono y la extensión del servicio', async () => {
    const aviso = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const p = await montar(Wellness);
    await p.clic('app-service-card .contact', 0);
    expect(aviso).toHaveBeenCalledWith('Comunícate al 602 7370660 ext. 2198');
  });

  it('el encabezado llama al conmutador y las líneas de ayuda son nacionales', async () => {
    const p = await montar(Wellness);
    expect(p.href('.page-header a')).toBe('tel:6027370660');
    expect(p.todos('.lines a').map((a) => a.getAttribute('href'))).toEqual(['tel:192', 'tel:123']);
  });

  it('dice de dónde salen los datos y que la ubicación exacta se confirma', async () => {
    const p = await montar(Wellness);
    expect(p.texto('.fuente')).toContain('ucc.edu.co');
    expect(p.texto('.fuente')).toContain('confírmalos llamando al conmutador');
  });
});
