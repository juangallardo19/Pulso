import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Privacy } from '../pages/privacy/privacy';
import { History } from '../pages/history/history';
import { Reminders } from '../pages/reminders/reminders';
import { Stats } from '../pages/stats/stats';
import { CheckinEntry, CHECKIN_VACIO } from '../models/checkin.model';
import { Reminder } from '../models/reminder.model';

// Fechas del mes actual para que caigan en el calendario del historial
const hoy = new Date();
const fechaDelMes = (n: number) =>
  new Date(hoy.getFullYear(), hoy.getMonth(), n).toLocaleDateString('en-CA');

const historialDePrueba: CheckinEntry[] = [
  { ...CHECKIN_VACIO, date: fechaDelMes(1), mood: 4 },
  { ...CHECKIN_VACIO, date: fechaDelMes(2), mood: 5 },
  { ...CHECKIN_VACIO, date: fechaDelMes(3), mood: 2 },
];

const recordatorioDePrueba: Reminder = {
  id: 99,
  title: 'Estirar la espalda',
  time: '16:00',
  icon: 'i-bell',
  iconColor: 'c-primary',
  bubble: 'bg-lav',
  dayColor: 'primary',
  activeDays: ['L'],
  isActive: true,
};

// Une privacidad (juangallardo19) con historial, recordatorios y estadísticas (andresc1108)
describe('Integración: eliminar datos desde privacidad', () => {
  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('pulso-historial', JSON.stringify(historialDePrueba));
    localStorage.setItem('pulso-recordatorios', JSON.stringify([recordatorioDePrueba]));
    localStorage.setItem(
      'pulso-goals',
      JSON.stringify({ sleepHours: 7, waterGlasses: 6, exerciseMinutes: 20 }),
    );
    localStorage.setItem(
      'pulso-ajustes',
      JSON.stringify({ darkMode: true, shareAnonymousData: true, showInsights: false }),
    );

    await TestBed.configureTestingModule({
      imports: [Privacy, History, Reminders, Stats],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  function eliminarConfirmando() {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const privacidad = TestBed.createComponent(Privacy).componentInstance;
    privacidad.eliminarDatos();
    return privacidad;
  }

  it('al confirmar, eliminarDatos() marca eliminado y borra las llaves', () => {
    const privacidad = eliminarConfirmando();
    expect(privacidad.eliminado()).toBe(true);
    expect(localStorage.getItem('pulso-historial')).toBeNull();
    expect(localStorage.getItem('pulso-recordatorios')).toBeNull();
    expect(localStorage.getItem('pulso-goals')).toBeNull();
    expect(localStorage.getItem('pulso-ajustes')).toBeNull();
  });

  it('después de borrar, el historial queda sin registros', () => {
    eliminarConfirmando();
    const historia = TestBed.createComponent(History).componentInstance;
    expect(historia.dias.every((d) => d.mood === 0)).toBe(true);
  });

  it('después de borrar, recordatorios vuelve a los 4 de ejemplo', () => {
    eliminarConfirmando();
    const recordatorios = TestBed.createComponent(Reminders).componentInstance;
    expect(recordatorios.recordatorios().length).toBe(4);
    expect(recordatorios.recordatorios().some((r) => r.id === 99)).toBe(false);
  });

  it('después de borrar, las estadísticas no tienen datos', () => {
    eliminarConfirmando();
    const estadisticas = TestBed.createComponent(Stats).componentInstance;
    expect(estadisticas.animoPromedio()).toBe('Sin datos');
  });

  it('si no se confirma, eliminarDatos() no borra el historial', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const privacidad = TestBed.createComponent(Privacy).componentInstance;
    privacidad.eliminarDatos();
    expect(privacidad.eliminado()).toBe(false);
    expect(JSON.parse(localStorage.getItem('pulso-historial') ?? '[]').length).toBe(3);
  });
});
