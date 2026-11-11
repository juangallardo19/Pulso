import { Component, inject } from '@angular/core';
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

  correoNoRegistrado() {
    const guardado = JSON.parse(localStorage.getItem('pulso-user') ?? 'null');
    const correo = this.loginForm.value.email ?? '';
    return guardado !== null && correo !== '' && guardado.email !== correo;
  }

  entrar() {
    console.log('.:: Login:', this.loginForm.value.email);
  }
}
