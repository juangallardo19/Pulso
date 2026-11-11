import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Register } from '../pages/register/register';
import { Goals } from '../pages/goals/goals';
import { Profile } from '../pages/profile/profile';
import { Home } from '../pages/home/home';
import { CheckinWater } from '../pages/checkin-water/checkin-water';
import { Login } from '../pages/login/login';

// Une registro y metas (juangallardo19) con perfil, inicio y agua (seba4s)
describe('Integración: registro y metas → perfil e inicio', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Register, Goals, Profile, Home, CheckinWater, Login],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  // Registra a Laura y le pone una meta de 6 vasos
  function registrarYPonerMetas() {
    const registro = TestBed.createComponent(Register).componentInstance;
    registro.registerForm.setValue({
      name: 'Laura Gómez',
      email: 'laura@uni.edu.co',
      password: '12345678',
      confirm: '12345678',
      consent: true,
    });
    registro.crearCuenta();

    const metas = TestBed.createComponent(Goals).componentInstance;
    metas.goalsForm.get('waterGlasses')?.setValue(6);
    metas.guardarMetas();
  }

  async function htmlDe<T>(componente: Type<T>) {
    const fixture = TestBed.createComponent(componente);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  it('el registro guarda pulso-user sin la contraseña', () => {
    registrarYPonerMetas();
    const usuario = JSON.parse(localStorage.getItem('pulso-user') ?? 'null');
    expect(usuario).not.toBeNull();
    expect(usuario.name).toBe('Laura Gómez');
    expect(usuario.password).toBeUndefined();
    expect(usuario.confirm).toBeUndefined();
  });

  it('el perfil muestra el nombre y la meta de agua', async () => {
    registrarYPonerMetas();
    const html = await htmlDe(Profile);
    expect(html).toContain('Laura Gómez');
    expect(html).toContain('6 vasos');
  });

  it('el inicio saluda con el nombre del usuario', async () => {
    registrarYPonerMetas();
    expect(await htmlDe(Home)).toContain('Laura');
  });

  it('el paso de agua del check-in usa la meta guardada', () => {
    registrarYPonerMetas();
    expect(TestBed.createComponent(CheckinWater).componentInstance.meta).toBe(6);
  });

  it('al cerrar sesión el inicio vuelve a mostrar Estudiante', async () => {
    registrarYPonerMetas();
    TestBed.createComponent(Profile).componentInstance.cerrarSesion();
    expect(localStorage.getItem('pulso-user')).toBeNull();
    expect(await htmlDe(Home)).toContain('Estudiante');
  });

  it('el login reconoce el correo registrado', () => {
    registrarYPonerMetas();
    const login = TestBed.createComponent(Login).componentInstance;

    login.loginForm.setValue({ email: 'laura@uni.edu.co', password: '12345678' });
    expect(login.correoNoRegistrado()).toBe(false);

    login.loginForm.setValue({ email: 'otro@uni.edu.co', password: '12345678' });
    expect(login.correoNoRegistrado()).toBe(true);
  });
});
