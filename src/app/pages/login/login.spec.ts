import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('el formulario empieza inválido', async () => {
    await crear();
    expect(component.loginForm.valid).toBe(false);
  });

  it('es válido con un correo y una contraseña correctos', async () => {
    await crear();
    component.loginForm.setValue({ email: 'laura@uni.edu.co', password: '12345678' });
    expect(component.loginForm.valid).toBe(true);
  });

  it('es inválido con un correo sin @', async () => {
    await crear();
    component.loginForm.setValue({ email: 'laura.uni.edu.co', password: '12345678' });
    expect(component.loginForm.valid).toBe(false);
  });

  it('es inválido con una contraseña de 5 letras', async () => {
    await crear();
    component.loginForm.setValue({ email: 'laura@uni.edu.co', password: '12345' });
    expect(component.loginForm.valid).toBe(false);
  });

  it('solo marca el correo como inválido después de tocarlo', async () => {
    await crear();
    expect(component.campoInvalido('email')).toBe(false);
    component.loginForm.get('email')?.markAsTouched();
    expect(component.campoInvalido('email')).toBe(true);
  });

  it('avisa si el correo no es el que está registrado', async () => {
    localStorage.setItem('pulso-user', JSON.stringify({ name: 'Laura', email: 'laura@uni.edu.co' }));
    await crear();
    component.loginForm.setValue({ email: 'otro@uni.edu.co', password: '12345678' });
    expect(component.correoNoRegistrado()).toBe(true);
    component.loginForm.setValue({ email: 'laura@uni.edu.co', password: '12345678' });
    expect(component.correoNoRegistrado()).toBe(false);
  });

  it('no avisa nada si no hay ningún usuario guardado', async () => {
    await crear();
    component.loginForm.setValue({ email: 'otro@uni.edu.co', password: '12345678' });
    expect(component.correoNoRegistrado()).toBe(false);
  });

  it('deshabilita el botón mientras el formulario es inválido', async () => {
    await crear();
    const boton: HTMLElement = fixture.nativeElement.querySelector('.btn-primary');
    expect(boton.classList).toContain('deshabilitado');

    // Simula que el usuario escribe en los dos campos
    const correo: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    const clave: HTMLInputElement = fixture.nativeElement.querySelector('#password');
    correo.value = 'laura@uni.edu.co';
    correo.dispatchEvent(new Event('input'));
    clave.value = '12345678';
    clave.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(boton.classList).not.toContain('deshabilitado');
  });
});
