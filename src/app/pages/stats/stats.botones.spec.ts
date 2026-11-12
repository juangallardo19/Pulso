import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Stats } from './stats';
import { CHECKIN_VACIO, CheckinEntry } from '../../models/checkin.model';

// N días seguidos terminando el 2026-11-11 (miércoles). El ánimo va del 1 al 5 en ciclo.
function historialDe(n: number, extra: Partial<CheckinEntry> = {}): CheckinEntry[] {
  const lista: CheckinEntry[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(2026, 10, 11 - i);
    lista.push({
      ...CHECKIN_VACIO,
      date: d.toLocaleDateString('en-CA'),
      mood: (i % 5) + 1,
      ...extra,
    });
  }
  return lista;
}

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('Stats · botones', () => {
  let component: Stats;
  let fixture: ComponentFixture<Stats>;
  let html: HTMLElement;

  async function crear(historial: CheckinEntry[]) {
    localStorage.setItem('pulso-historial', JSON.stringify(historial));
    await TestBed.configureTestingModule({
      imports: [Stats],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(Stats);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
    await fixture.whenStable();
  }

  function clic(selector: string) {
    (html.querySelector(selector) as HTMLElement).click();
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('"Anterior" muestra la semana pasada y "Siguiente" vuelve', async () => {
    await crear(historialDe(10));
    expect(component.registros()[0].date).toBe('2026-11-05');

    clic('[aria-label="Anterior"]');
    await fixture.whenStable();
    expect(component.registros().map((d) => d.date)).toEqual([
      '2026-11-02',
      '2026-11-03',
      '2026-11-04',
    ]);
    expect(html.querySelectorAll('.bar-col').length).toBe(3);

    clic('[aria-label="Siguiente"]');
    await fixture.whenStable();
    expect(component.registros().length).toBe(7);
  });

  it('las flechas se deshabilitan cuando no hay más registros', async () => {
    await crear(historialDe(5));
    expect(html.querySelector('[aria-label="Anterior"]')!.classList).toContain('deshabilitado');
    expect(html.querySelector('[aria-label="Siguiente"]')!.classList).toContain('deshabilitado');
    component.anterior();
    expect(component.pagina()).toBe(0);
  });

  it('cambiar a "Mes" vuelve a los registros más recientes', async () => {
    await crear(historialDe(40));
    component.anterior();
    clic('.segmented button:nth-child(2)');
    await fixture.whenStable();
    expect(component.periodo()).toBe('mes');
    expect(component.pagina()).toBe(0);
    expect(component.registros().length).toBe(30);
    expect(html.querySelector('.segmented button:nth-child(2)')!.classList).toContain('active');
  });

  it('la línea del gráfico pasa por los registros reales', async () => {
    await crear(historialDe(2));
    // 2 puntos: x = 75 y 225; ánimo 2 → y = 99.9, ánimo 1 → y = 124.9
    expect(component.trazo()).toBe('M75.0 99.9 L225.0 124.9');
    expect(html.querySelector('svg path')!.getAttribute('d')).toBe(component.trazo());
  });

  it('el mapa de estrés colorea el día de la semana con su nivel', async () => {
    // Un solo registro, un miércoles (índice 2), con estrés 9
    await crear([{ ...CHECKIN_VACIO, date: '2026-11-11', stress: 9 }]);
    expect(component.opacidadPromedio(2)).toBeCloseTo(0.9);
    expect(component.opacidadPromedio(0)).toBe(0.08);
    const columnas = html.querySelectorAll('.heat-col');
    expect(columnas.length).toBe(7);
    expect((columnas[2].querySelector('span') as HTMLElement).style.opacity).toBe('0.9');
  });

  it('el hallazgo compara el sueño de los días de estrés alto', async () => {
    await crear([
      { ...CHECKIN_VACIO, date: '2026-11-10', stress: 9, sleepStart: '01:00', sleepEnd: '06:00' },
      { ...CHECKIN_VACIO, date: '2026-11-11', stress: 3, sleepStart: '23:00', sleepEnd: '07:00' },
    ]);
    expect(component.hallazgo().titulo).toBe('Duermes menos los días de más estrés');
    expect(html.querySelector('.insight')!.textContent).toContain('3 h 0 min menos');
  });

  it('sin días de estrés alto y bajo, pide seguir registrando', async () => {
    await crear([{ ...CHECKIN_VACIO, date: '2026-11-11', stress: 3 }]);
    expect(component.hallazgo().titulo).toBe('Sigue registrando tus días');
  });

  it('el calendario del encabezado lleva al historial', async () => {
    await crear([]);
    expect(html.querySelector('.page-header a')!.getAttribute('href')).toBe('/historial');
  });
});
