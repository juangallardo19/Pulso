import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CheckinSleep } from './checkin-sleep';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('CheckinSleep · botones', () => {
  let component: CheckinSleep;
  let fixture: ComponentFixture<CheckinSleep>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinSleep],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinSleep);
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

  it('tocar un punto cambia la calidad del sueño', async () => {
    await crear();
    const puntos = html.querySelectorAll('.q');
    expect(puntos.length).toBe(5);
    (puntos[1] as HTMLElement).click();
    await fixture.whenStable();
    expect(component.calidad()).toBe(2);
    expect(html.querySelectorAll('.q.on').length).toBe(2);
  });

  it('cambiar la hora recalcula las horas dormidas', async () => {
    await crear();
    const fin = html.querySelectorAll('input[type="time"]')[1] as HTMLInputElement;
    fin.value = '08:30';
    fin.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(html.querySelector('.bg-blue h2')!.textContent).toContain('9 h');
  });

  it('muestra la meta de sueño guardada', async () => {
    localStorage.setItem('pulso-goals', JSON.stringify({ sleepHours: 7 }));
    await crear();
    expect(html.querySelector('.bg-blue')!.textContent).toContain('Meta 7 h');
  });

  it('"Siguiente" y "Omitir" guardan horas y calidad', async () => {
    await crear();
    (html.querySelectorAll('.q')[4] as HTMLElement).click();
    clic('.btn-primary');
    expect(hoy().sleepQuality).toBe(5);
    localStorage.clear();
    clic('.btn-ghost');
    expect(hoy().sleepStart).toBe('23:30');
  });
});
