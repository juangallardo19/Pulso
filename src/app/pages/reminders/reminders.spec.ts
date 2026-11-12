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

// Abre el formulario, lo llena y toca "Guardar"
async function crear(p: Pantalla<Reminders>, titulo: string, hora: string) {
  await p.clic('.new');
  await p.escribir('form input[type="text"]', titulo);
  await p.escribir('form input[type="time"]', hora);
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

  it('"Guardar" está deshabilitado hasta escribir título y hora', async () => {
    const p = await montar(Reminders);
    await p.clic('.new');
    expect(p.tieneClase('form .btn-primary', 'deshabilitado')).toBe(true);
    await p.escribir('form input[type="text"]', 'Estirar la espalda');
    await p.escribir('form input[type="time"]', '16:00');
    expect(p.tieneClase('form .btn-primary', 'deshabilitado')).toBe(false);
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
