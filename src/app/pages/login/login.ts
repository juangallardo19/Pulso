import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldError } from '../../domain/account/field-error/field-error';
import { abrirSesion, buscarCuenta, leerCuentas } from '../../models/cuenta.model';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, FieldError],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  campoInvalido(nombre: 'email' | 'password') {
    const ctrl = this.loginForm.get(nombre);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  // No hay ninguna cuenta creada en este navegador
  sinCuenta() {
    return leerCuentas().length === 0;
  }

  private cuenta() {
    return buscarCuenta(this.loginForm.value.email ?? '');
  }

  // El correo está bien escrito pero no pertenece a ninguna cuenta
  correoNoRegistrado() {
    const email = this.loginForm.get('email');
    return !this.sinCuenta() && !!email && email.valid && !this.cuenta();
  }

  // Hay cuenta con ese correo, pero la contraseña escrita no es la suya
  claveIncorrecta() {
    const clave = this.loginForm.get('password');
    const cuenta = this.cuenta();
    return !!cuenta && !!clave && clave.valid && clave.value !== cuenta.password;
  }

  puedeEntrar() {
    const cuenta = this.cuenta();
    return this.loginForm.valid && !!cuenta && cuenta.password === this.loginForm.value.password;
  }

  verClave = signal(false);

  alternarClave() {
    this.verClave.update((v) => !v);
  }

  // No hay servidor ni correo de recuperación: las cuentas viven en este navegador
  olvideClave() {
    alert(
      'Pulso guarda tu cuenta solo en este navegador y no tiene correo de recuperación. ' +
        'Si olvidaste tu contraseña, crea una cuenta nueva desde "Regístrate".',
    );
  }

  // Abre la sesión y carga los datos de esa cuenta
  entrar() {
    const cuenta = this.cuenta();
    if (this.puedeEntrar() && cuenta) {
      abrirSesion(cuenta);
    }
  }
}
