import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CheckinSummary } from './checkin-summary';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('CheckinSummary · botones', () => {
  let component: CheckinSummary;
  let fixture: ComponentFixture<CheckinSummary>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinSummary],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinSummary);
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

  it('muestra la calidad del sueño guardada', async () => {
    localStorage.setItem(
      'pulso-checkin-hoy',
      JSON.stringify({ date: '2026-11-11', sleepQuality: 2 }),
    );
    await crear();
    expect(html.querySelector('.summary')!.textContent).toContain('calidad 2');
  });

  it('el botón final guarda el día en el historial y lleva a /checkin/listo', async () => {
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify({ date: '2026-11-11', mood: 5 }));
    await crear();
    const boton: HTMLAnchorElement = html.querySelector('.btn-primary')!;
    boton.click();
    const historial = JSON.parse(localStorage.getItem('pulso-historial') ?? '[]');
    expect(historial.length).toBe(1);
    expect(historial[0].mood).toBe(5);
    expect(localStorage.getItem('pulso-checkin-hoy')).toBeNull();
    expect(boton.getAttribute('href')).toBe('/checkin/listo');
  });
});
