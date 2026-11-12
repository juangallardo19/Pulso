import { Privacy } from '../pages/privacy/privacy';
import { History } from '../pages/history/history';
import { Reminders } from '../pages/reminders/reminders';
import { Stats } from '../pages/stats/stats';
import { Profile } from '../pages/profile/profile';
import { CheckinEntry, CHECKIN_VACIO } from '../models/checkin.model';
import { Reminder } from '../models/reminder.model';
import { guardar, leer, montar } from '../../testing/dom';

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

// Toca "Eliminar mis datos" en Privacidad, aceptando (o no) la confirmación
async function eliminarDatos(confirmar: boolean) {
  vi.spyOn(window, 'confirm').mockReturnValue(confirmar);
  const privacidad = await montar(Privacy);
  await privacidad.clic('.btn-danger');
  return privacidad;
}

// Une privacidad (juangallardo19) con historial, recordatorios y estadísticas (andresc1108)
describe('Integración: eliminar datos desde privacidad', () => {
  beforeEach(() => {
    localStorage.clear();
    guardar('pulso-historial', historialDePrueba);
    guardar('pulso-recordatorios', [recordatorioDePrueba]);
    guardar('pulso-goals', { sleepHours: 7, waterGlasses: 6, exerciseMinutes: 20 });
    guardar('pulso-ajustes', { darkMode: true, shareAnonymousData: true, showInsights: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('al confirmar, avisa que se borró y quita todos los datos', async () => {
    const privacidad = await eliminarDatos(true);
    expect(privacidad.visible('.eliminado')).toBe(true);
    expect(leer('pulso-historial')).toBeNull();
    expect(leer('pulso-recordatorios')).toBeNull();
    expect(leer('pulso-goals')).toBeNull();
    expect(leer('pulso-ajustes')).toBeNull();
  });

  it('después de borrar, el historial queda sin caritas y con el aviso', async () => {
    await eliminarDatos(true);
    const historial = await montar(History);
    expect(historial.visible('.empty')).toBe(true);
    expect(historial.texto('.total .metric')).toBe('0');
  });

  it('después de borrar, recordatorios queda vacío', async () => {
    await eliminarDatos(true);
    const recordatorios = await montar(Reminders);
    expect(recordatorios.cuantos('app-reminder-card')).toBe(0);
    expect(recordatorios.visible('.vacio')).toBe(true);
  });

  it('después de borrar, estadísticas y perfil no muestran datos viejos', async () => {
    await eliminarDatos(true);
    const estadisticas = await montar(Stats);
    expect(estadisticas.texto('.mood-card h3')).toBe('Sin datos en promedio');

    const perfil = await montar(Profile);
    expect(perfil.texto('.goals')).toContain('Sin definir');
  });

  it('si no se confirma, no borra nada', async () => {
    const privacidad = await eliminarDatos(false);
    expect(privacidad.visible('.eliminado')).toBe(false);
    expect(leer('pulso-historial').length).toBe(3);
  });
});
