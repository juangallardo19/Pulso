import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldError } from '../../domain/account/field-error/field-error';

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
    return localStorage.getItem('pulso-user') === null;
  }

  correoNoRegistrado() {
    const guardado = JSON.parse(localStorage.getItem('pulso-user') ?? 'null');
    const correo = this.loginForm.value.email ?? '';
    return guardado !== null && correo !== '' && guardado.email !== correo;
  }

  verClave = signal(false);

  alternarClave() {
    this.verClave.update((v) => !v);
  }

  // No hay servidor: la contraseña no se guarda en ningún lado, así que no se puede recuperar
  olvideClave() {
    alert(
      'Pulso guarda tu cuenta solo en este dispositivo y no almacena tu contraseña. ' +
        'Si la olvidaste, crea una cuenta nueva desde "Regístrate".',
    );
  }

  entrar() {
    console.log('.:: Login:', this.loginForm.value.email);
  }
}
