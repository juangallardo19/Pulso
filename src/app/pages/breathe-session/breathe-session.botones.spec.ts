import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BreatheSession } from './breathe-session';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('BreatheSession · botones', () => {
  let component: BreatheSession;
  let fixture: ComponentFixture<BreatheSession>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [BreatheSession],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(BreatheSession);
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

  it('el botón de pausa alterna entre pausar y reanudar', async () => {
    await crear();
    clic('.pause');
    await fixture.whenStable();
    expect(html.querySelector('.pause')!.getAttribute('aria-label')).toBe('Reanudar');
    clic('.pause');
    await fixture.whenStable();
    expect(html.querySelector('.pause')!.getAttribute('aria-label')).toBe('Pausar');
    expect(html.querySelector('main')!.classList).not.toContain('pausado');
  });

  it('la X cierra la sesión y vuelve a Respira', async () => {
    await crear();
    expect(html.querySelector('[aria-label="Cerrar"]')!.getAttribute('href')).toBe('/respira');
  });
});
