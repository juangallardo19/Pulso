import { Login } from './login';
import { guardar, leer, montar, Pantalla } from '../../../testing/dom';

const laura = {
  name: 'Laura Gómez',
  email: 'laura@uni.edu.co',
  password: 'clave1234',
  datos: { 'pulso-goals': JSON.stringify({ sleepHours: 7, waterGlasses: 6, exerciseMinutes: 45 }) },
};

async function escribirDatos(p: Pantalla<Login>, email: string, clave: string) {
  await p.escribir('#email', email);
  await p.escribir('#password', clave);
}

// Login: todo se prueba escribiendo y tocando el HTML
describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    guardar('pulso-cuentas', [laura]);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('el botón empieza deshabilitado y sin errores', async () => {
    const p = await montar(Login);
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
    expect(p.existe('.error-text.show')).toBe(false);
  });

  it('con el correo y la contraseña correctos se habilita y lleva al inicio', async () => {
    const p = await montar(Login);
    await escribirDatos(p, 'laura@uni.edu.co', 'clave1234');
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(false);
    expect(p.href('.btn-primary')).toBe('/inicio');
  });

  it('el correo no distingue mayúsculas', async () => {
    const p = await montar(Login);
    await escribirDatos(p, 'Laura@Uni.edu.co', 'clave1234');
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(false);
  });

  it('"Iniciar sesión" abre la sesión y carga los datos de esa cuenta', async () => {
    const p = await montar(Login);
    await escribirDatos(p, 'laura@uni.edu.co', 'clave1234');
    await p.clic('.btn-primary');
    expect(leer('pulso-user')).toEqual({ name: 'Laura Gómez', email: 'laura@uni.edu.co' });
    expect(leer('pulso-goals')).toEqual({ sleepHours: 7, waterGlasses: 6, exerciseMinutes: 45 });
  });

  it('con una contraseña equivocada lo dice y no deja entrar', async () => {
    const p = await montar(Login);
    await escribirDatos(p, 'laura@uni.edu.co', 'otraclave1');
    expect(p.texto('.error-text.show')).toBe('La contraseña no es correcta');
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
    await p.clic('.btn-primary');
    expect(leer('pulso-user')).toBeNull();
  });

  it('con un correo que no tiene cuenta avisa que no está registrado', async () => {
    const p = await montar(Login);
    await escribirDatos(p, 'otro@uni.edu.co', 'clave1234');
    expect(p.texto('.error-text.show')).toBe('Este correo no está registrado');
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
  });

  it('un correo sin @ marca el campo en rojo', async () => {
    const p = await montar(Login);
    await p.escribir('#email', 'laura.uni.edu.co');
    expect(p.tieneClase('.field', 'error', 0)).toBe(true);
    expect(p.texto('.error-text.show')).toBe('Escribe un correo válido');
  });

  it('una contraseña de menos de 8 caracteres muestra el error', async () => {
    const p = await montar(Login);
    await p.escribir('#password', '12345');
    expect(p.texto('.error-text.show')).toBe('Mínimo 8 caracteres');
  });

  it('sin ninguna cuenta creada pide registrarse', async () => {
    localStorage.clear();
    const p = await montar(Login);
    expect(p.texto('.error-text.show')).toContain('Regístrate primero');
  });

  it('el ojo muestra y oculta la contraseña', async () => {
    const p = await montar(Login);
    const clave = p.el('#password') as HTMLInputElement;
    expect(clave.type).toBe('password');
    await p.clic('.ver-clave');
    expect(clave.type).toBe('text');
    await p.clic('.ver-clave');
    expect(clave.type).toBe('password');
  });

  it('"¿Olvidaste tu contraseña?" explica qué hacer', async () => {
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
