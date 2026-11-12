import { Profile } from './profile';
import { guardar, leer, montar } from '../../../testing/dom';

// Perfil: todo se prueba tocando y leyendo el HTML
describe('Profile', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('muestra el nombre y el correo de la cuenta', async () => {
    guardar('pulso-user', { name: 'Laura Gómez', email: 'laura@uni.edu.co' });
    const p = await montar(Profile);
    expect(p.texto('.identity h2')).toBe('Laura Gómez');
    expect(p.texto('.identity')).toContain('laura@uni.edu.co');
    expect(p.visible('.identity a')).toBe(false);
  });

  it('no inventa datos: no muestra carrera ni semestre', async () => {
    guardar('pulso-user', { name: 'Laura Gómez', email: 'laura@uni.edu.co' });
    const p = await montar(Profile);
    expect(p.texto('.identity')).not.toMatch(/Ingenier|semestre/);
  });

  it('sin cuenta muestra "Invitado" y un enlace para crearla', async () => {
    const p = await montar(Profile);
    expect(p.texto('.identity h2')).toBe('Invitado');
    expect(p.visible('.identity a')).toBe(true);
    expect(p.href('.identity a')).toBe('/registro');
  });

  it('sin metas guardadas dice "Sin definir" en vez de inventar valores', async () => {
    const p = await montar(Profile);
    expect(p.todos('.goal strong').map((g) => g.textContent?.trim())).toEqual([
      'Sin definir',
      'Sin definir',
      'Sin definir',
    ]);
    expect(p.texto('.goals .link')).toBe('Definir');
  });

  it('muestra las metas guardadas', async () => {
    guardar('pulso-goals', { sleepHours: 7, waterGlasses: 6, exerciseMinutes: 45 });
    const p = await montar(Profile);
    expect(p.todos('.goal strong').map((g) => g.textContent?.trim())).toEqual([
      '7 h',
      '6 vasos',
      '45 min',
    ]);
    expect(p.texto('.goals .link')).toBe('Editar');
  });

  it('el interruptor de modo oscuro se enciende, se apaga y se guarda', async () => {
    const p = await montar(Profile);
    await p.clic('app-toggle-switch .toggle');
    expect(p.tieneClase('app-toggle-switch .toggle', 'on')).toBe(true);
    expect(leer('pulso-ajustes').darkMode).toBe(true);
    await p.clic('app-toggle-switch .toggle');
    expect(leer('pulso-ajustes').darkMode).toBe(false);
  });

  it('el modo oscuro guardado aparece encendido al volver', async () => {
    guardar('pulso-ajustes', { darkMode: true });
    const p = await montar(Profile);
    expect(p.tieneClase('app-toggle-switch .toggle', 'on')).toBe(true);
  });

  it('"Cerrar sesión" borra la cuenta, muestra "Invitado" y lleva al login', async () => {
    guardar('pulso-user', { name: 'Laura Gómez', email: 'laura@uni.edu.co' });
    const p = await montar(Profile);
    await p.clic('.logout');
    expect(leer('pulso-user')).toBeNull();
    expect(p.texto('.identity h2')).toBe('Invitado');
    expect(p.href('.logout')).toBe('/login');
  });

  it('los accesos del perfil llevan a su página', async () => {
    const p = await montar(Profile);
    expect(p.todos('.settings a').map((a) => a.getAttribute('href'))).toEqual([
      '/recordatorios',
      '/bienestar',
      '/privacidad',
    ]);
    expect(p.href('.goals .link')).toBe('/metas');
  });
});
