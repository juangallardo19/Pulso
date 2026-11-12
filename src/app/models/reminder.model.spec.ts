import {
  avisarRecordatorios,
  letraDelDia,
  recordatoriosParaAhora,
  Reminder,
} from './reminder.model';

const agua: Reminder = {
  id: 1,
  title: 'Tomar agua',
  time: '10:00',
  icon: 'i-bell',
  iconColor: 'c-primary',
  bubble: 'bg-lav',
  dayColor: 'primary',
  activeDays: ['L', 'X'],
  isActive: true,
};

// 2026-11-09 es lunes y 2026-11-10 es martes
const lunesALas10 = new Date(2026, 10, 9, 10, 0, 20);
const martesALas10 = new Date(2026, 10, 10, 10, 0, 20);

describe('Recordatorios: cuándo avisar', () => {
  it('la letra del día va de lunes (L) a domingo (D)', () => {
    expect(letraDelDia(lunesALas10)).toBe('L');
    expect(letraDelDia(new Date(2026, 10, 15))).toBe('D');
  });

  it('toca un recordatorio encendido en su día y a su hora', () => {
    expect(recordatoriosParaAhora([agua], lunesALas10)).toEqual([agua]);
  });

  it('no toca en un día que no está elegido', () => {
    expect(recordatoriosParaAhora([agua], martesALas10)).toEqual([]);
  });

  it('no toca a otra hora ni si está apagado', () => {
    expect(recordatoriosParaAhora([agua], new Date(2026, 10, 9, 10, 1))).toEqual([]);
    expect(recordatoriosParaAhora([{ ...agua, isActive: false }], lunesALas10)).toEqual([]);
  });
});

describe('Recordatorios: aviso del navegador', () => {
  const avisos: { titulo: string; cuerpo: string }[] = [];

  beforeEach(() => {
    avisos.length = 0;
    localStorage.setItem('pulso-recordatorios', JSON.stringify([agua]));
    // Notificación falsa que solo anota lo que se mostraría
    vi.stubGlobal(
      'Notification',
      Object.assign(
        function (titulo: string, opciones: { body: string }) {
          avisos.push({ titulo, cuerpo: opciones.body });
        },
        { permission: 'granted', requestPermission: vi.fn() },
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('muestra el aviso a la hora del recordatorio', () => {
    avisarRecordatorios(lunesALas10);
    expect(avisos).toEqual([
      { titulo: 'Pulso · Tomar agua', cuerpo: 'Tu recordatorio de las 10:00' },
    ]);
  });

  it('no repite el aviso en el mismo minuto', () => {
    avisarRecordatorios(new Date(2026, 10, 16, 10, 0, 5)); // otro lunes
    avisarRecordatorios(new Date(2026, 10, 16, 10, 0, 35));
    expect(avisos.length).toBe(1);
  });

  it('sin permiso no muestra nada', () => {
    (Notification as unknown as { permission: string }).permission = 'denied';
    avisarRecordatorios(new Date(2026, 10, 23, 10, 0));
    expect(avisos.length).toBe(0);
  });
});
