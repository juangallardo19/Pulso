import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { conSesion, sinSesion } from './guards/sesion.guard';

import { Splash } from './pages/splash/splash';
import { Onboarding } from './pages/onboarding/onboarding';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Goals } from './pages/goals/goals';
import { Home } from './pages/home/home';
import { CheckinMood } from './pages/checkin-mood/checkin-mood';
import { CheckinSleep } from './pages/checkin-sleep/checkin-sleep';
import { CheckinWater } from './pages/checkin-water/checkin-water';
import { CheckinExercise } from './pages/checkin-exercise/checkin-exercise';
import { CheckinStress } from './pages/checkin-stress/checkin-stress';
import { CheckinSummary } from './pages/checkin-summary/checkin-summary';
import { CheckinDone } from './pages/checkin-done/checkin-done';
import { Stats } from './pages/stats/stats';
import { History } from './pages/history/history';
import { DayDetail } from './pages/day-detail/day-detail';
import { Breathe } from './pages/breathe/breathe';
import { BreatheSession } from './pages/breathe-session/breathe-session';
import { Reminders } from './pages/reminders/reminders';
import { Wellness } from './pages/wellness/wellness';
import { Profile } from './pages/profile/profile';
import { Privacy } from './pages/privacy/privacy';

function componenteDe(path: string) {
  return routes.find((r) => r.path === path)?.component;
}

describe('Rutas de la app', () => {
  it('tiene 22 rutas', () => {
    expect(routes.length).toBe(22);
  });

  it('no hay rutas repetidas', () => {
    expect(new Set(routes.map((r) => r.path)).size).toBe(routes.length);
  });

  it('las rutas de cuenta llevan a sus páginas', () => {
    expect(componenteDe('')).toBe(Splash);
    expect(componenteDe('onboarding')).toBe(Onboarding);
    expect(componenteDe('login')).toBe(Login);
    expect(componenteDe('registro')).toBe(Register);
    expect(componenteDe('metas')).toBe(Goals);
  });

  it('las rutas del check-in llevan a sus 7 páginas', () => {
    expect(componenteDe('checkin/animo')).toBe(CheckinMood);
    expect(componenteDe('checkin/sueno')).toBe(CheckinSleep);
    expect(componenteDe('checkin/agua')).toBe(CheckinWater);
    expect(componenteDe('checkin/ejercicio')).toBe(CheckinExercise);
    expect(componenteDe('checkin/estres')).toBe(CheckinStress);
    expect(componenteDe('checkin/resumen')).toBe(CheckinSummary);
    expect(componenteDe('checkin/listo')).toBe(CheckinDone);
  });

  it('las rutas de seguimiento llevan a sus páginas', () => {
    expect(componenteDe('inicio')).toBe(Home);
    expect(componenteDe('estadisticas')).toBe(Stats);
    expect(componenteDe('historial')).toBe(History);
    expect(componenteDe('historial/dia')).toBe(DayDetail);
    expect(componenteDe('recordatorios')).toBe(Reminders);
  });

  it('las rutas de bienestar llevan a sus páginas', () => {
    expect(componenteDe('respira')).toBe(Breathe);
    expect(componenteDe('respira/sesion')).toBe(BreatheSession);
    expect(componenteDe('bienestar')).toBe(Wellness);
    expect(componenteDe('perfil')).toBe(Profile);
    expect(componenteDe('privacidad')).toBe(Privacy);
  });

  describe('navegación con sesión', () => {
    beforeEach(() => {
      localStorage.clear();
      localStorage.setItem('pulso-user', JSON.stringify({ name: 'Laura', email: 'l@u.co' }));
      TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    });

    afterEach(() => localStorage.clear());

    it('navega a /inicio y muestra Home', async () => {
      const harness = await RouterTestingHarness.create();
      expect(await harness.navigateByUrl('/inicio', Home)).toBeInstanceOf(Home);
    });

    it('navega a /checkin/animo y muestra CheckinMood', async () => {
      const harness = await RouterTestingHarness.create();
      const pagina = await harness.navigateByUrl('/checkin/animo', CheckinMood);
      expect(pagina).toBeInstanceOf(CheckinMood);
    });

    it('navega a /historial y muestra History', async () => {
      const harness = await RouterTestingHarness.create();
      expect(await harness.navigateByUrl('/historial', History)).toBeInstanceOf(History);
    });

    it('con sesión abierta, /login lleva directo al inicio', async () => {
      const harness = await RouterTestingHarness.create();
      expect(await harness.navigateByUrl('/login', Home)).toBeInstanceOf(Home);
    });
  });

  describe('navegación sin sesión', () => {
    beforeEach(() => {
      localStorage.clear();
      TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    });

    afterEach(() => localStorage.clear());

    it('/estadisticas sin sesión manda al login', async () => {
      const harness = await RouterTestingHarness.create();
      expect(await harness.navigateByUrl('/estadisticas', Login)).toBeInstanceOf(Login);
    });

    it('/inicio sin sesión manda al login', async () => {
      const harness = await RouterTestingHarness.create();
      expect(await harness.navigateByUrl('/inicio', Login)).toBeInstanceOf(Login);
    });

    it('la bienvenida y el registro sí se pueden abrir sin sesión', async () => {
      const harness = await RouterTestingHarness.create();
      expect(await harness.navigateByUrl('/', Splash)).toBeInstanceOf(Splash);
      expect(await harness.navigateByUrl('/registro', Register)).toBeInstanceOf(Register);
    });
  });

  it('solo bienvenida, onboarding, login y registro son públicas', () => {
    const publicas = routes.filter((r) => r.canActivate?.includes(sinSesion)).map((r) => r.path);
    expect(publicas).toEqual(['', 'onboarding', 'login', 'registro']);
    expect(routes.filter((r) => r.canActivate?.includes(conSesion)).length).toBe(18);
  });
});
