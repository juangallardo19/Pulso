import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CheckinExercise } from './checkin-exercise';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('CheckinExercise · botones', () => {
  let component: CheckinExercise;
  let fixture: ComponentFixture<CheckinExercise>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinExercise],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinExercise);
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

  it('tocar un chip lo activa y tocarlo otra vez lo desactiva', async () => {
    await crear();
    const chip = () => html.querySelectorAll('app-chip-option .chip')[1] as HTMLElement;
    chip().click();
    await fixture.whenStable();
    expect(chip().classList).toContain('active');
    chip().click();
    await fixture.whenStable();
    expect(chip().classList).not.toContain('active');
  });

  it('mover el slider cambia los minutos', async () => {
    await crear();
    const slider: HTMLInputElement = html.querySelector('input[type="range"]')!;
    slider.value = '60';
    slider.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(component.minutosCtrl.value).toBe(60);
  });

  it('muestra la meta de ejercicio guardada', async () => {
    localStorage.setItem('pulso-goals', JSON.stringify({ exerciseMinutes: 45 }));
    await crear();
    expect(html.querySelector('.limits')!.textContent).toContain('Meta 45 min');
  });

  it('"Siguiente" y "Omitir" guardan minutos y tipos', async () => {
    await crear();
    (html.querySelectorAll('app-chip-option .chip')[4] as HTMLElement).click();
    clic('.btn-primary');
    expect(hoy().exerciseTypes).toEqual(['Yoga']);
    localStorage.clear();
    clic('.btn-ghost');
    expect(hoy().exerciseMinutes).toBe(30);
  });
});
