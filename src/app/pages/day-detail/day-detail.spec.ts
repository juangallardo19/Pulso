import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DayDetail } from './day-detail';
import { CheckinEntry, CHECKIN_VACIO } from '../../models/checkin.model';

const historialDePrueba: CheckinEntry[] = [
  { ...CHECKIN_VACIO, date: '2026-11-01', mood: 3, note: 'Día tranquilo' },
  {
    ...CHECKIN_VACIO,
    date: '2026-11-02',
    mood: 5,
    note: 'Salí a caminar',
    sleepStart: '23:30',
    sleepEnd: '07:00',
  },
  { ...CHECKIN_VACIO, date: '2026-11-03', mood: 2, note: 'Mucho parcial' },
];

describe('DayDetail', () => {
  let component: DayDetail;
  let fixture: ComponentFixture<DayDetail>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [DayDetail],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(DayDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('pulso-historial', JSON.stringify(historialDePrueba));
  });
  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('con una fecha guardada muestra la nota y el ánimo', async () => {
    localStorage.setItem('pulso-dia-seleccionado', '2026-11-02');
    await crear();
    expect(component.existe).toBe(true);
    expect(component.mood().label).toBe('Muy bien');
    const html: HTMLElement = fixture.nativeElement;
    expect(html.textContent).toContain('Salí a caminar');
    expect(html.textContent).toContain('Muy bien');
  });

  it('calcula las horas dormidas', async () => {
    localStorage.setItem('pulso-dia-seleccionado', '2026-11-02');
    await crear();
    expect(component.horasDormidas()).toBe('7 h 30 min');
  });

  it('con una fecha sin registro existe es false', async () => {
    localStorage.setItem('pulso-dia-seleccionado', '2026-11-20');
    await crear();
    expect(component.existe).toBe(false);
    expect(fixture.nativeElement.querySelector('.detail-grid').classList.contains('oculto')).toBe(
      true,
    );
  });
});
