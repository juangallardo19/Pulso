import { Register } from './register';
import { leer, montar, Pantalla } from '../../../testing/dom';

async function llenar(p: Pantalla<Register>, confirmacion = '12345678', aceptar = true) {
  await p.escribir('#name', 'Laura Gómez');
  await p.escribir('#email', 'laura@uni.edu.co');
  await p.escribir('#password', '12345678');
  await p.escribir('#confirm', confirmacion);
  if (aceptar) {
    await p.clic('.consent input');
  }
}

// Registro: todo se prueba escribiendo y tocando el HTML
describe('Register', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('el botón "Crear cuenta" empieza deshabilitado y el formulario vacío', async () => {
    const p = await montar(Register);
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
    expect((p.el('#confirm') as HTMLInputElement).value).toBe('');
    expect((p.el('.consent input') as HTMLInputElement).checked).toBe(false);
  });

  it('con todo bien escrito se habilita "Crear cuenta"', async () => {
    const p = await montar(Register);
    await llenar(p);
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(false);
  });

  it('sin aceptar el aviso de privacidad no se puede crear la cuenta', async () => {
    const p = await montar(Register);
    await llenar(p, '12345678', false);
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
  });

  it('si las contraseñas no coinciden lo marca y no deja continuar', async () => {
    const p = await montar(Register);
    await llenar(p, '87654321');
    expect(p.texto('.error-text.show')).toBe('Las contraseñas no coinciden');
    expect(p.tieneClase('.field', 'error', 3)).toBe(true);
    expect(p.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
  });

  it('un nombre de 2 letras muestra el error del nombre', async () => {
    const p = await montar(Register);
    await p.escribir('#name', 'La');
    expect(p.texto('.error-text.show')).toContain('mínimo 3 letras');
  });

  it('la barra de fuerza cambia mientras se escribe la contraseña', async () => {
    const p = await montar(Register);
    await p.escribir('#password', '1234');
    expect(p.texto('.strength small')).toBe('Débil');
    expect(p.cuantos('.strength span.on')).toBe(1);
    await p.escribir('#password', '12345678');
    expect(p.texto('.strength small')).toBe('Media');
    await p.escribir('#password', '123456789012');
    expect(p.texto('.strength small')).toBe('Fuerte');
    expect(p.cuantos('.strength span.on')).toBe(3);
  });

  it('el ojo muestra las dos contraseñas a la vez', async () => {
    const p = await montar(Register);
    await p.clic('.ver-clave');
    expect((p.el('#password') as HTMLInputElement).type).toBe('text');
    expect((p.el('#confirm') as HTMLInputElement).type).toBe('text');
  });

  it('"Crear cuenta" guarda nombre y correo, sin la contraseña, y lleva a /metas', async () => {
    const p = await montar(Register);
    await llenar(p);
    await p.clic('.btn-primary');
    expect(leer('pulso-user')).toEqual({ name: 'Laura Gómez', email: 'laura@uni.edu.co' });
    expect(p.href('.btn-primary')).toBe('/metas');
  });

  it('"Inicia sesión" lleva al login', async () => {
    const p = await montar(Register);
    expect(p.href('.auth-footer a')).toBe('/login');
  });
});
