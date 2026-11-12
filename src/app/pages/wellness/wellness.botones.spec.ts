import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Wellness } from './wellness';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('Wellness · botones', () => {
  let component: Wellness;
  let fixture: ComponentFixture<Wellness>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [Wellness],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(Wellness);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
    await fixture.whenStable();
  }

  function clic(selector: string, indice = 0) {
    (html.querySelectorAll(selector)[indice] as HTMLElement).click();
  }

  function leer(llave: string) {
    return JSON.parse(localStorage.getItem(llave) ?? 'null');
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('tocar un filtro deja solo los servicios de esa categoría', async () => {
    await crear();
    expect(html.querySelectorAll('app-service-card').length).toBe(3);
    clic('.filters .chip', 2); // Enfermería
    await fixture.whenStable();
    expect(html.querySelectorAll('app-service-card').length).toBe(1);
    expect(html.querySelector('app-service-card h3')!.textContent).toContain('Enfermería');
    clic('.filters .chip', 0); // Todos
    await fixture.whenStable();
    expect(html.querySelectorAll('app-service-card').length).toBe(3);
  });

  it('"Contactar" de una tarjeta muestra el teléfono de ese servicio', async () => {
    const aviso = vi.spyOn(window, 'alert').mockImplementation(() => {});
    await crear();
    clic('app-service-card .contact', 0);
    expect(aviso).toHaveBeenCalledWith(expect.stringContaining(component.servicios[0].phone));
  });

  it('el ícono del encabezado y las líneas llaman a los números de ayuda', async () => {
    await crear();
    expect(html.querySelector('.page-header a')!.getAttribute('href')).toBe('tel:106');
    const lineas = [...html.querySelectorAll('.lines a')].map((a) => a.getAttribute('href'));
    expect(lineas).toEqual(['tel:106', 'tel:192']);
  });
});
