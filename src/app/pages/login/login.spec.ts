import { Login } from './login';
import { guardar, montar } from '../../../testing/dom';

const laura = { name: 'Laura Gómez', email: 'laura@uni.edu.co' };

// Login: todo se prueba escribiendo y tocando el HTML
describe('Login', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('el botón empieza deshabilitado', async () => {
    guardar('pulso-user', laura);
    const p = await montar(Login);
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
  });

  it('con el correo registrado y una contraseña válida se habilita y lleva al inicio', async () => {
    guardar('pulso-user', laura);
    const p = await montar(Login);
    await p.escribir('#email', 'laura@uni.edu.co');
    await p.escribir('#password', '12345678');
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(false);
    expect(p.href('.btn-primary')).toBe('/inicio');
  });

  it('un correo sin @ marca el campo en rojo y muestra el error', async () => {
    guardar('pulso-user', laura);
    const p = await montar(Login);
    await p.escribir('#email', 'laura.uni.edu.co');
    expect(p.tieneClase('.field', 'error', 0)).toBe(true);
    expect(p.texto('.error-text.show')).toBe('Escribe un correo válido');
  });

  it('una contraseña de menos de 8 caracteres muestra el error', async () => {
    guardar('pulso-user', laura);
    const p = await montar(Login);
    await p.escribir('#password', '12345');
    expect(p.texto('.error-text.show')).toBe('Mínimo 8 caracteres');
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
  });

  it('los errores no aparecen antes de escribir', async () => {
    guardar('pulso-user', laura);
    const p = await montar(Login);
    expect(p.existe('.error-text.show')).toBe(false);
  });

  it('con otro correo avisa que no está registrado y no deja entrar', async () => {
    guardar('pulso-user', laura);
    const p = await montar(Login);
    await p.escribir('#email', 'otro@uni.edu.co');
    await p.escribir('#password', '12345678');
    expect(p.texto('.error-text.show')).toBe('Este correo no está registrado');
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
  });

  it('sin ninguna cuenta creada pide registrarse y no deja entrar', async () => {
    const p = await montar(Login);
    await p.escribir('#email', 'laura@uni.edu.co');
    await p.escribir('#password', '12345678');
    expect(p.texto('.error-text.show')).toContain('Regístrate primero');
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
  });

  it('el ojo muestra y oculta la contraseña', async () => {
    const p = await montar(Login);
    const clave = p.el('#password') as HTMLInputElement;
    expect(clave.type).toBe('password');
    await p.clic('.ver-clave');
    expect(clave.type).toBe('text');
    expect(p.atributo('.ver-clave', 'aria-label')).toBe('Ocultar contraseña');
    await p.clic('.ver-clave');
    expect(clave.type).toBe('password');
  });

  it('"¿Olvidaste tu contraseña?" explica cómo recuperarla', async () => {
    const aviso = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const p = await montar(Login);
    await p.clic('.forgot');
    expect(aviso).toHaveBeenCalledWith(expect.stringContaining('Regístrate'));
  });

  it('el link "Regístrate" lleva a /registro', async () => {
    const p = await montar(Login);
    expect(p.href('.auth-footer a')).toBe('/registro');
  });
});
