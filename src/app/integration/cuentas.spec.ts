import { Register } from '../pages/register/register';
import { Login } from '../pages/login/login';
import { Profile } from '../pages/profile/profile';
import { CheckinWater } from '../pages/checkin-water/checkin-water';
import { Home } from '../pages/home/home';
import { leer, montar } from '../../testing/dom';

// Crea una cuenta desde el formulario de registro
async function registrar(nombre: string, email: string, clave: string) {
  const registro = await montar(Register);
  await registro.escribir('#name', nombre);
  await registro.escribir('#email', email);
  await registro.escribir('#password', clave);
  await registro.escribir('#confirm', clave);
  await registro.clic('.consent input');
  await registro.clic('.btn-primary');
}

async function iniciarSesion(email: string, clave: string) {
  const login = await montar(Login);
  await login.escribir('#email', email);
  await login.escribir('#password', clave);
  await login.clic('.btn-primary');
}

async function cerrarSesion() {
  const perfil = await montar(Profile);
  await perfil.clic('.logout');
}

// La "base de datos" de cuentas en localStorage: cada persona conserva lo suyo
describe('Integración: cuentas y persistencia de datos', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('registrarse guarda la cuenta con su contraseña y abre la sesión', async () => {
    await registrar('Laura Gómez', 'laura@uni.edu.co', 'clave1234');
    const cuentas = leer('pulso-cuentas');
    expect(cuentas.length).toBe(1);
    expect(cuentas[0]).toMatchObject({
      name: 'Laura Gómez',
      email: 'laura@uni.edu.co',
      password: 'clave1234',
    });
    expect(leer('pulso-user')).toEqual({ name: 'Laura Gómez', email: 'laura@uni.edu.co' });
  });

  it('no deja registrar dos cuentas con el mismo correo', async () => {
    await registrar('Laura Gómez', 'laura@uni.edu.co', 'clave1234');
    await cerrarSesion();

    const registro = await montar(Register);
    await registro.escribir('#email', 'laura@uni.edu.co');
    expect(registro.texto('.error-text.show')).toContain('Ya existe una cuenta con este correo');
    expect(registro.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
  });

  it('los datos de una cuenta se conservan al cerrar y volver a iniciar sesión', async () => {
    await registrar('Laura Gómez', 'laura@uni.edu.co', 'clave1234');
    const agua = await montar(CheckinWater);
    await agua.clic('.ctrl.plus');
    await agua.clic('.ctrl.plus');
    await agua.clic('.btn-primary');

    await cerrarSesion();
    expect(leer('pulso-user')).toBeNull();
    expect(leer('pulso-checkin-hoy')).toBeNull(); // ya no quedan a la vista

    await iniciarSesion('laura@uni.edu.co', 'clave1234');
    expect(leer('pulso-checkin-hoy').water).toBe(2);
    const inicio = await montar(Home);
    expect(inicio.texto('.counter .metric')).toBe('2');
  });

  it('cada cuenta ve solo sus propios datos', async () => {
    await registrar('Laura Gómez', 'laura@uni.edu.co', 'clave1234');
    const agua = await montar(CheckinWater);
    await agua.clic('.ctrl.plus');
    await agua.clic('.btn-primary');
    await cerrarSesion();

    await registrar('Andrés Pérez', 'andres@uni.edu.co', 'clave5678');
    const inicio = await montar(Home);
    expect(inicio.texto('.hero-text h3')).toBe('Hola, Andrés');
    expect(inicio.texto('.counter .metric')).toBe('0');
    await cerrarSesion();

    await iniciarSesion('laura@uni.edu.co', 'clave1234');
    const deLaura = await montar(Home);
    expect(deLaura.texto('.hero-text h3')).toBe('Hola, Laura');
    expect(deLaura.texto('.counter .metric')).toBe('1');
  });

  it('cerrar sesión no borra la cuenta', async () => {
    await registrar('Laura Gómez', 'laura@uni.edu.co', 'clave1234');
    await cerrarSesion();
    expect(leer('pulso-cuentas').length).toBe(1);
  });
});
