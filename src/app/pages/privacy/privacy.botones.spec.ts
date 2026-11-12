import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Privacy } from './privacy';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('Privacy · botones', () => {
  let component: Privacy;
  let fixture: ComponentFixture<Privacy>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [Privacy],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(Privacy);
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

  it('los dos interruptores cambian y guardan su ajuste', async () => {
    await crear();
    clic('app-toggle-switch .toggle', 0);
    clic('app-toggle-switch .toggle', 1);
    await fixture.whenStable();
    const ajustes = leer('pulso-ajustes');
    expect(ajustes.shareAnonymousData).toBe(true);
    expect(ajustes.showInsights).toBe(false);
  });

  it('"Eliminar mis datos" pide confirmación y borra todo', async () => {
    localStorage.setItem('pulso-historial', JSON.stringify([{ date: '2026-11-11' }]));
    localStorage.setItem('pulso-goals', JSON.stringify({ sleepHours: 7 }));
    const pregunta = vi.spyOn(window, 'confirm').mockReturnValue(true);
    await crear();
    clic('.btn-danger');
    await fixture.whenStable();
    expect(pregunta).toHaveBeenCalled();
    expect(localStorage.getItem('pulso-historial')).toBeNull();
    expect(localStorage.getItem('pulso-goals')).toBeNull();
    expect(html.querySelector('.eliminado')!.classList).not.toContain('oculto');
  });

  it('después de eliminar, los interruptores vuelven a sus valores por defecto', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await crear();
    clic('app-toggle-switch .toggle', 0);
    clic('.btn-danger');
    expect(component.ajustes().shareAnonymousData).toBe(false);
  });

  it('"Volver" lleva al perfil', async () => {
    await crear();
    expect(html.querySelector('[aria-label="Volver"]')!.getAttribute('href')).toBe('/perfil');
  });
});
