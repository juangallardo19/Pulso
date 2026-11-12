import { Register } from '../pages/register/register';
import { Goals } from '../pages/goals/goals';
import { Profile } from '../pages/profile/profile';
import { Home } from '../pages/home/home';
import { CheckinWater } from '../pages/checkin-water/checkin-water';
import { Login } from '../pages/login/login';
import { leer, montar } from '../../testing/dom';

// Se registra y elige sus metas (8 h, 6 vasos, 30 min), todo desde los formularios
async function registrarYPonerMetas() {
  const registro = await montar(Register);
  await registro.escribir('#name', 'Laura Gómez');
  await registro.escribir('#email', 'laura@uni.edu.co');
  await registro.escribir('#password', '12345678');
  await registro.escribir('#confirm', '12345678');
  await registro.clic('.consent input');
  await registro.clic('.btn-primary');

  const metas = await montar(Goals);
  await metas.mover('input.sleep', 8);
  await metas.mover('input.water', 6);
  await metas.mover('input.exercise', 30);
  await metas.clic('.btn-primary');
}

// Une registro y metas (juangallardo19) con perfil, inicio y agua (seba4s)
describe('Integración: registro y metas → perfil e inicio', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('el registro guarda la cuenta sin la contraseña', async () => {
    await registrarYPonerMetas();
    expect(leer('pulso-user')).toEqual({ name: 'Laura Gómez', email: 'laura@uni.edu.co' });
  });

  it('el perfil muestra el nombre, el correo y las metas guardadas', async () => {
    await registrarYPonerMetas();
    const perfil = await montar(Profile);
    expect(perfil.texto('.identity h2')).toBe('Laura Gómez');
    expect(perfil.texto('.identity')).toContain('laura@uni.edu.co');
    expect(perfil.texto('.goals')).toContain('6 vasos');
  });

  it('el inicio saluda con el nombre y usa la meta de agua', async () => {
    await registrarYPonerMetas();
    const inicio = await montar(Home);
    expect(inicio.texto('.hero-text h3')).toBe('Hola, Laura');
    expect(inicio.texto('.rings')).toContain('0 / 6');
  });

  it('el paso de agua del check-in usa la meta guardada', async () => {
    await registrarYPonerMetas();
    const agua = await montar(CheckinWater);
    expect(agua.texto('.big-number')).toContain('/ 6 vasos');
  });

  it('al cerrar sesión, el inicio y el perfil muestran "Invitado"', async () => {
    await registrarYPonerMetas();
    const perfil = await montar(Profile);
    await perfil.clic('.logout');
    expect(leer('pulso-user')).toBeNull();

    const inicio = await montar(Home);
    expect(inicio.texto('.hero-text h3')).toBe('Hola, Invitado');
  });

  it('el login deja entrar con el correo registrado y no con otro', async () => {
    await registrarYPonerMetas();
    const login = await montar(Login);
    await login.escribir('#email', 'laura@uni.edu.co');
    await login.escribir('#password', '12345678');
    expect(login.tieneClase('.btn-primary', 'deshabilitado')).toBe(false);

    await login.escribir('#email', 'otro@uni.edu.co');
    expect(login.tieneClase('.btn-primary', 'deshabilitado')).toBe(true);
    expect(login.texto('.error-text.show')).toBe('Este correo no está registrado');
  });
});
