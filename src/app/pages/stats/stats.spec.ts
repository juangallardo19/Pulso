import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Stats } from './stats';
import { CheckinEntry, CHECKIN_VACIO } from '../../models/checkin.model';

const historialDePrueba: CheckinEntry[] = [
  { ...CHECKIN_VACIO, date: '2026-11-01', mood: 4, sleepStart: '23:00', sleepEnd: '07:00' },
  { ...CHECKIN_VACIO, date: '2026-11-02', mood: 4, sleepStart: '00:00', sleepEnd: '06:00' },
  { ...CHECKIN_VACIO, date: '2026-11-03', mood: 4, sleepStart: '22:30', sleepEnd: '07:00' },
];

// 20 días seguidos para probar el corte de semana y mes
const veinteDias: CheckinEntry[] = Array(20)
  .fill(0)
  .map((_, i) => ({
    ...CHECKIN_VACIO,
    date: '2026-10-' + String(i + 1).padStart(2, '0'),
    mood: 3,
  }));

describe('Stats', () => {
  let component: Stats;
  let fixture: ComponentFixture<Stats>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [Stats],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Stats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('sin historial animoPromedio() es Sin datos', async () => {
    await crear();
    expect(component.animoPromedio()).toBe('Sin datos');
  });

  it('con 3 días de ánimo 4 animoPromedio() es Bien', async () => {
    localStorage.setItem('pulso-historial', JSON.stringify(historialDePrueba));
    await crear();
    expect(component.animoPromedio()).toBe('Bien');
    expect(fixture.nativeElement.textContent).toContain('Bien en promedio');
  });

  it("periodo.set('mes') toma hasta 30 registros", async () => {
    localStorage.setItem('pulso-historial', JSON.stringify(veinteDias));
    await crear();
    expect(component.registros().length).toBe(7);
    component.periodo.set('mes');
    await fixture.whenStable();
    expect(component.registros().length).toBe(20);
    expect(fixture.nativeElement.querySelectorAll('.bar-col').length).toBe(20);
  });

  it('cumpleMeta() usa 8 h si no existe pulso-goals', async () => {
    localStorage.setItem('pulso-historial', JSON.stringify(historialDePrueba));
    await crear();
    expect(component.metaSueno).toBe(8);
    expect(component.cumpleMeta(historialDePrueba[0])).toBe(true);
    expect(component.cumpleMeta(historialDePrueba[1])).toBe(false);
  });

  it('cumpleMeta() usa la meta de pulso-goals', async () => {
    localStorage.setItem('pulso-historial', JSON.stringify(historialDePrueba));
    localStorage.setItem(
      'pulso-goals',
      JSON.stringify({ sleepHours: 6, waterGlasses: 8, exerciseMinutes: 30 }),
    );
    await crear();
    expect(component.metaSueno).toBe(6);
    expect(component.cumpleMeta(historialDePrueba[1])).toBe(true);
  });

  it('suenoPromedio() da el texto en horas y minutos', async () => {
    localStorage.setItem('pulso-historial', JSON.stringify(historialDePrueba));
    await crear();
    expect(component.suenoPromedio()).toBe('7 h 30 min');
  });
});
