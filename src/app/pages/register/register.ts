import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldError } from '../../domain/account/field-error/field-error';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FieldError],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', Validators.required],
    consent: [false, Validators.requiredTrue],
  });

  barras = [1, 2, 3];

  verClave = signal(false);

  alternarClave() {
    this.verClave.update((v) => !v);
  }

  campoInvalido(nombre: 'name' | 'email' | 'password' | 'confirm' | 'consent') {
    const ctrl = this.registerForm.get(nombre);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  contrasenasCoinciden() {
    return this.registerForm.value.password === this.registerForm.value.confirm;
  }

  confirmacionInvalida() {
    const ctrl = this.registerForm.get('confirm');
    return !!ctrl && ctrl.touched && !this.contrasenasCoinciden();
  }

  // 0 = vacía, 1 = débil (< 8), 2 = media (8 a 11), 3 = fuerte (12 o más)
  fuerza() {
    const largo = (this.registerForm.value.password ?? '').length;
    if (largo === 0) return 0;
    if (largo < 8) return 1;
    if (largo < 12) return 2;
    return 3;
  }

  textoFuerza() {
    return ['', 'Débil', 'Media', 'Fuerte'][this.fuerza()];
  }

  crearCuenta() {
    const usuario: User = {
      name: this.registerForm.value.name ?? '',
      email: this.registerForm.value.email ?? '',
    };
    localStorage.setItem('pulso-user', JSON.stringify(usuario));
  }
}
