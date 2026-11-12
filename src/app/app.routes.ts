import { Routes } from '@angular/router';
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

export const routes: Routes = [
  { path: '', component: Splash, canActivate: [sinSesion] },
  { path: 'onboarding', component: Onboarding, canActivate: [sinSesion] },
  { path: 'login', component: Login, canActivate: [sinSesion] },
  { path: 'registro', component: Register, canActivate: [sinSesion] },
  { path: 'metas', component: Goals, canActivate: [conSesion] },
  { path: 'inicio', component: Home, canActivate: [conSesion] },
  { path: 'checkin/animo', component: CheckinMood, canActivate: [conSesion] },
  { path: 'checkin/sueno', component: CheckinSleep, canActivate: [conSesion] },
  { path: 'checkin/agua', component: CheckinWater, canActivate: [conSesion] },
  { path: 'checkin/ejercicio', component: CheckinExercise, canActivate: [conSesion] },
  { path: 'checkin/estres', component: CheckinStress, canActivate: [conSesion] },
  { path: 'checkin/resumen', component: CheckinSummary, canActivate: [conSesion] },
  { path: 'checkin/listo', component: CheckinDone, canActivate: [conSesion] },
  { path: 'estadisticas', component: Stats, canActivate: [conSesion] },
  { path: 'historial', component: History, canActivate: [conSesion] },
  { path: 'historial/dia', component: DayDetail, canActivate: [conSesion] },
  { path: 'respira', component: Breathe, canActivate: [conSesion] },
  { path: 'respira/sesion', component: BreatheSession, canActivate: [conSesion] },
  { path: 'recordatorios', component: Reminders, canActivate: [conSesion] },
  { path: 'bienestar', component: Wellness, canActivate: [conSesion] },
  { path: 'perfil', component: Profile, canActivate: [conSesion] },
  { path: 'privacidad', component: Privacy, canActivate: [conSesion] },
];
