import { Reminders } from './reminders';
import { Reminder } from '../../models/reminder.model';
import { guardar, leer, montar, Pantalla } from '../../../testing/dom';

const tomarAgua: Reminder = {
  id: 1,
  title: 'Tomar agua',
  time: '10:00',
  icon: 'i-droplet',
  iconColor: 'c-secondary',
  bubble: 'bg-mint',
  dayColor: 'secondary',
  activeDays: ['L', 'X'],
  isActive: true,
};

// Abre el formulario, lo llena (con los días indicados) y toca "Guardar"
async function crear(p: Pantalla<Reminders>, titulo: string, hora: string, dias = [0, 2]) {
  await p.clic('.new');
  await p.escribir('form input[type="text"]', titulo);
  await p.escribir('form input[type="time"]', hora);
  for (const dia of dias) {
    await p.clic('.dia', dia);
  }
  await p.clic('form .btn-primary');
}

// Recordatorios: todo se prueba tocando y escribiendo en el HTML
describe('Reminders', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('empieza vacío (sin recordatorios inventados) y lo dice', async () => {
    const p = await montar(Reminders);
    expect(p.cuantos('app-reminder-card')).toBe(0);
    expect(p.visible('.vacio')).toBe(true);
  });

  it('muestra los recordatorios guardados', async () => {
    guardar('pulso-recordatorios', [tomarAgua]);
    const p = await montar(Reminders);
    expect(p.cuantos('app-reminder-card')).toBe(1);
    expect(p.texto('app-reminder-card h3')).toBe('Tomar agua');
    expect(p.texto('app-reminder-card .metric')).toBe('10:00');
    expect(p.visible('.vacio')).toBe(false);
  });

  it('"Nuevo recordatorio" muestra y oculta el formulario', async () => {
    const p = await montar(Reminders);
    expect(p.visible('form')).toBe(false);
    await p.clic('.new');
    expect(p.visible('form')).toBe(true);
    await p.clic('.new');
    expect(p.visible('form')).toBe(false);
  });

  it('"Guardar" está deshabilitado hasta escribir título, hora y elegir al menos un día', async () => {
    const p = await montar(Reminders);
    await p.clic('.new');
    expect(p.tieneClase('form .btn-primary', 'deshabilitado')).toBe(true);
    await p.escribir('form input[type="text"]', 'Estirar la espalda');
    await p.escribir('form input[type="time"]', '16:00');
    expect(p.tieneClase('form .btn-primary', 'deshabilitado')).toBe(true);
    await p.clic('.dia', 0);
    expect(p.tieneClase('form .btn-primary', 'deshabilitado')).toBe(false);
  });

  it('tocar un día lo marca y tocarlo otra vez lo desmarca', async () => {
    const p = await montar(Reminders);
    await p.clic('.new');
    expect(p.cuantos('.dia')).toBe(7);
    expect(p.cuantos('.dia.on')).toBe(0);
    await p.clic('.dia', 4);
    expect(p.tieneClase('.dia', 'on', 4)).toBe(true);
    expect(p.atributo('.dia', 'aria-label', 4)).toBe('Viernes');
    await p.clic('.dia', 4);
    expect(p.tieneClase('.dia', 'on', 4)).toBe(false);
  });

  it('los atajos eligen todos los días o de lunes a viernes', async () => {
    const p = await montar(Reminders);
    await p.clic('.new');
    await p.clic('.atajo', 0);
    expect(p.cuantos('.dia.on')).toBe(7);
    await p.clic('.atajo', 1);
    expect(p.todos('.dia.on').map((d) => d.textContent?.trim())).toEqual(['L', 'M', 'X', 'J', 'V']);
  });

  it('el recordatorio guarda solo los días elegidos, en orden', async () => {
    const p = await montar(Reminders);
    await crear(p, 'Estirar la espalda', '16:00', [4, 0]);
    expect(leer('pulso-recordatorios')[0].activeDays).toEqual(['L', 'V']);
    expect(p.todos('app-reminder-card .day.on').map((d) => d.textContent)).toEqual(['L', 'V']);
  });

  it('tocar cualquier parte del campo de hora enfoca el selector de hora', async () => {
    const p = await montar(Reminders);
    await p.clic('.new');
    const hora = p.el('#hora') as HTMLInputElement;
    hora.showPicker = vi.fn();
    await p.clic('.campo-hora');
    expect(document.activeElement).toBe(hora);
    expect(hora.showPicker).toHaveBeenCalled();
  });

  it('crear un recordatorio lo agrega a la lista, lo guarda y cierra el formulario', async () => {
    const p = await montar(Reminders);
    await crear(p, 'Estirar la espalda', '16:00');
    expect(p.cuantos('app-reminder-card')).toBe(1);
    expect(p.texto('app-reminder-card h3')).toBe('Estirar la espalda');
    expect(p.visible('form')).toBe(false);
    expect(leer('pulso-recordatorios')[0].title).toBe('Estirar la espalda');
  });

  it('un título de menos de 3 letras no se guarda', async () => {
    const p = await montar(Reminders);
    await crear(p, 'Ok', '16:00');
    expect(p.cuantos('app-reminder-card')).toBe(0);
  });

  it('el interruptor apaga y prende un recordatorio y lo guarda', async () => {
    guardar('pulso-recordatorios', [tomarAgua]);
    const p = await montar(Reminders);
    await p.clic('app-reminder-card .toggle');
    expect(p.tieneClase('app-reminder-card article', 'off')).toBe(true);
    expect(leer('pulso-recordatorios')[0].isActive).toBe(false);
    await p.clic('app-reminder-card .toggle');
    expect(leer('pulso-recordatorios')[0].isActive).toBe(true);
  });

  it('la papelera elimina el recordatorio', async () => {
    guardar('pulso-recordatorios', [tomarAgua, { ...tomarAgua, id: 2, title: 'Dormir' }]);
    const p = await montar(Reminders);
    await p.clic('[aria-label="Eliminar recordatorio"]', 0);
    expect(p.cuantos('app-reminder-card')).toBe(1);
    expect(p.texto('app-reminder-card h3')).toBe('Dormir');
    expect(leer('pulso-recordatorios').length).toBe(1);
  });

  it('marca los días de la semana en que suena', async () => {
    guardar('pulso-recordatorios', [tomarAgua]);
    const p = await montar(Reminders);
    expect(p.todos('.day.on').map((d) => d.textContent)).toEqual(['L', 'X']);
  });

  it('"Volver" lleva al perfil', async () => {
    const p = await montar(Reminders);
    expect(p.href('[aria-label="Volver"]')).toBe('/perfil');
  });
});
