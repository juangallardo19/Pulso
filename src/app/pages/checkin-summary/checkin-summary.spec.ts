import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckinSummary } from './checkin-summary';

describe('CheckinSummary', () => {
  let component: CheckinSummary;
  let fixture: ComponentFixture<CheckinSummary>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinSummary],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());

  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('muestra la etiqueta del ánimo guardado', async () => {
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify({ date: '2026-11-11', mood: 2 }));
    await crear();
    const html: HTMLElement = fixture.nativeElement;
    expect(html.textContent).toContain('Mal');
  });

  it('guardarDia() agrega al historial y borra pulso-checkin-hoy', async () => {
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify({ date: '2026-11-11', mood: 5 }));
    await crear();
    component.guardarDia();
    const historial = JSON.parse(localStorage.getItem('pulso-historial') ?? '[]');
    expect(historial.length).toBe(1);
    expect(historial[0].mood).toBe(5);
    expect(localStorage.getItem('pulso-checkin-hoy')).toBeNull();
  });

  it('con la misma fecha reemplaza el día y el historial no crece', async () => {
    localStorage.setItem('pulso-historial', JSON.stringify([{ date: '2026-11-11', mood: 1 }]));
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify({ date: '2026-11-11', mood: 4 }));
    await crear();
    component.guardarDia();
    const historial = JSON.parse(localStorage.getItem('pulso-historial') ?? '[]');
    expect(historial.length).toBe(1);
    expect(historial[0].mood).toBe(4);
  });
});
