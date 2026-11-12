export interface Reminder {
  id: number;
  title: string; // 'Tomar agua'
  time: string; // '10:00'
  icon: string; // 'i-droplet'
  iconColor: string; // 'c-secondary'
  bubble: string; // 'bg-mint'
  dayColor: string; // 'primary' | 'sleep'
  activeDays: string[]; // subconjunto de SEMANA
  isActive: boolean;
}

export const SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const NOMBRES_DIAS: Record<string, string> = {
  L: 'Lunes',
  M: 'Martes',
  X: 'Miércoles',
  J: 'Jueves',
  V: 'Viernes',
  S: 'Sábado',
  D: 'Domingo',
};

// Letra del día de la semana de una fecha (lunes = 'L' ... domingo = 'D')
export function letraDelDia(fecha: Date): string {
  return SEMANA[(fecha.getDay() + 6) % 7];
}

// Recordatorios encendidos que tocan en este minuto (mismo día de la semana y misma hora)
export function recordatoriosParaAhora(lista: Reminder[], ahora: Date): Reminder[] {
  const hora = ahora.toTimeString().slice(0, 5); // 'HH:MM'
  const dia = letraDelDia(ahora);
  return lista.filter((r) => r.isActive && r.time === hora && r.activeDays.includes(dia));
}

// Avisos del navegador. Solo funcionan si la persona dio permiso y Pulso está abierto.
export function notificacionesDisponibles(): boolean {
  return typeof Notification !== 'undefined';
}

export function pedirPermisoDeAvisos() {
  if (notificacionesDisponibles() && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// Minutos ya avisados, para no repetir el mismo aviso varias veces en el mismo minuto
const avisados = new Set<string>();

// Revisa los recordatorios guardados y muestra los que tocan ahora
export function avisarRecordatorios(ahora: Date = new Date()) {
  if (!notificacionesDisponibles() || Notification.permission !== 'granted') {
    return;
  }
  const lista: Reminder[] = JSON.parse(localStorage.getItem('pulso-recordatorios') ?? '[]');
  const minuto = ahora.toISOString().slice(0, 16);
  recordatoriosParaAhora(lista, ahora).forEach((r) => {
    const clave = r.id + '@' + minuto;
    if (!avisados.has(clave)) {
      avisados.add(clave);
      new Notification('Pulso · ' + r.title, { body: 'Tu recordatorio de las ' + r.time });
    }
  });
}
