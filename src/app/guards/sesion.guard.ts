import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { haySesion } from '../models/cuenta.model';

// Páginas internas: sin sesión se va al login
export const conSesion: CanActivateFn = () =>
  haySesion() ? true : inject(Router).createUrlTree(['/login']);

// Bienvenida, login y registro: con sesión abierta se va directo al inicio
export const sinSesion: CanActivateFn = () =>
  haySesion() ? inject(Router).createUrlTree(['/inicio']) : true;
