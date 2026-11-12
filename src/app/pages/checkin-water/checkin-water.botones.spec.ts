import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CheckinWater } from './checkin-water';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('CheckinWater · botones', () => {
  let component: CheckinWater;
  let fixture: ComponentFixture<CheckinWater>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinWater],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinWater);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
    await fixture.whenStable();
  }

  function clic(selector: string) {
    (html.querySelector(selector) as HTMLElement).click();
  }

  function hoy() {
    return JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}');
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('los botones + y − cambian el número de vasos en pantalla', async () => {
    await crear();
    clic('.ctrl.plus');
    clic('.ctrl.plus');
    await fixture.whenStable();
    expect(html.querySelector('.metric')!.textContent).toContain('2');
    clic('.ctrl.minus');
    await fixture.whenStable();
    expect(html.querySelector('.metric')!.textContent).toContain('1');
  });

  it('al llegar a la meta muestra "¡Meta cumplida!"', async () => {
    localStorage.setItem('pulso-goals', JSON.stringify({ waterGlasses: 1 }));
    await crear();
    clic('.ctrl.plus');
    await fixture.whenStable();
    const visibles = [...html.querySelectorAll('.water p')].filter(
      (p) => !p.classList.contains('oculto'),
    );
    expect(visibles.map((p) => p.textContent).join()).toContain('Meta cumplida');
  });

  it('"Siguiente" y "Omitir" guardan los vasos', async () => {
    await crear();
    clic('.ctrl.plus');
    clic('.btn-primary');
    expect(hoy().water).toBe(1);
    localStorage.clear();
    clic('.btn-ghost');
    expect(hoy().water).toBe(1);
  });
});
