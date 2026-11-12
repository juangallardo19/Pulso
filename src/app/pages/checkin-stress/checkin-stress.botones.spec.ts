import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CheckinStress } from './checkin-stress';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('CheckinStress · botones', () => {
  let component: CheckinStress;
  let fixture: ComponentFixture<CheckinStress>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinStress],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinStress);
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

  it('tocar una causa la activa', async () => {
    await crear();
    (html.querySelectorAll('app-chip-option .chip')[2] as HTMLElement).click();
    await fixture.whenStable();
    expect(html.querySelectorAll('app-chip-option .chip')[2].classList).toContain('active');
  });

  it('mover el slider cambia el nivel y su color', async () => {
    await crear();
    const slider: HTMLInputElement = html.querySelector('input[type="range"]')!;
    slider.value = '9';
    slider.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(component.nivelCtrl.value).toBe(9);
    expect(component.claseNivel()).toBe('alto');
  });

  it('"Siguiente" y "Omitir" guardan nivel y causas', async () => {
    await crear();
    (html.querySelectorAll('app-chip-option .chip')[0] as HTMLElement).click();
    clic('.btn-primary');
    expect(hoy().stressCauses).toEqual(['Parcial']);
    localStorage.clear();
    clic('.btn-ghost');
    expect(hoy().stress).toBe(5);
  });
});
