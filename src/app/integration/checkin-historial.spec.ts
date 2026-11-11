import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckinMood } from '../pages/checkin-mood/checkin-mood';
import { CheckinWater } from '../pages/checkin-water/checkin-water';
import { CheckinSummary } from '../pages/checkin-summary/checkin-summary';
import { History } from '../pages/history/history';
import { DayDetail } from '../pages/day-detail/day-detail';
import { Stats } from '../pages/stats/stats';
import { CheckinEntry } from '../models/checkin.model';

// Une el check-in (seba4s) con historial, detalle y estadísticas (andresc1108)
describe('Integración: check-in → historial, detalle y estadísticas', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CheckinMood, CheckinWater, CheckinSummary, History, DayDetail, Stats],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  // Hace el check-in como lo haría el usuario: ánimo → agua → resumen
  function hacerCheckin(animo: number, vasos: number) {
    const mood = TestBed.createComponent(CheckinMood).componentInstance;
    mood.seleccionar(animo);
    mood.guardar();

    const agua = TestBed.createComponent(CheckinWater).componentInstance;
    for (let i = 0; i < vasos; i++) {
      agua.sumar();
    }
    agua.guardar();

    TestBed.createComponent(CheckinSummary).componentInstance.guardarDia();
  }

  function leerHistorial(): CheckinEntry[] {
    return JSON.parse(localStorage.getItem('pulso-historial') ?? '[]');
  }

  it('el check-in completo guarda un día en pulso-historial', () => {
    hacerCheckin(5, 3);
    const historial = leerHistorial();
    expect(historial.length).toBe(1);
    expect(historial[0].mood).toBe(5);
    expect(historial[0].water).toBe(3);
    expect(localStorage.getItem('pulso-checkin-hoy')).toBeNull();
  });

  it('el día de hoy aparece en el calendario del historial con su ánimo', () => {
    hacerCheckin(5, 3);
    const historia = TestBed.createComponent(History).componentInstance;
    const diaDeHoy = historia.dias.find((d) => d.isToday);
    expect(diaDeHoy?.mood).toBe(5);
  });

  it('al elegir el día de hoy, el detalle muestra su registro', () => {
    hacerCheckin(5, 3);
    const historia = TestBed.createComponent(History).componentInstance;
    const diaDeHoy = historia.dias.find((d) => d.isToday)!;
    historia.elegirDia(diaDeHoy);

    const detalle = TestBed.createComponent(DayDetail).componentInstance;
    expect(detalle.existe).toBe(true);
    expect(detalle.mood().label).toBe('Muy bien');
  });

  it('las estadísticas toman el ánimo del check-in', () => {
    hacerCheckin(5, 3);
    const estadisticas = TestBed.createComponent(Stats).componentInstance;
    expect(estadisticas.animoPromedio()).toBe('Muy bien');
  });

  it('repetir el check-in el mismo día reemplaza el registro', () => {
    hacerCheckin(5, 3);
    hacerCheckin(2, 1);
    const historial = leerHistorial();
    expect(historial.length).toBe(1);
    expect(historial[0].mood).toBe(2);
  });
});
