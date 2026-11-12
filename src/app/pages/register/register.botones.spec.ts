import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Register } from './register';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('Register · botones', () => {
  let fixture: ComponentFixture<Register>;
  let html: HTMLElement;

  function escribir(selector: string, valor: string) {
    const input: HTMLInputElement = html.querySelector(selector)!;
    input.value = valor;
    input.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it('el ojo muestra las dos contraseñas a la vez', async () => {
    (html.querySelector('.ver-clave') as HTMLElement).click();
    await fixture.whenStable();
    expect((html.querySelector('#password') as HTMLInputElement).type).toBe('text');
    expect((html.querySelector('#confirm') as HTMLInputElement).type).toBe('text');
  });

  it('la barra de fuerza cambia mientras se escribe', async () => {
    escribir('#password', '123456789012');
    await fixture.whenStable();
    expect(html.querySelector('.strength small')!.textContent).toContain('Fuerte');
    expect(html.querySelectorAll('.strength span.on').length).toBe(3);
  });

  it('el botón "Crear cuenta" se habilita y guarda el usuario al hacer clic', async () => {
    const boton: HTMLAnchorElement = html.querySelector('.btn-primary')!;
    expect(boton.classList).toContain('deshabilitado');

    escribir('#name', 'Laura Gómez');
    escribir('#email', 'laura@uni.edu.co');
    escribir('#password', '12345678');
    escribir('#confirm', '12345678');
    (html.querySelector('.consent input') as HTMLInputElement).click();
    await fixture.whenStable();

    expect(boton.classList).not.toContain('deshabilitado');
    boton.click();
    const guardado = JSON.parse(localStorage.getItem('pulso-user') ?? 'null');
    expect(guardado).toEqual({ name: 'Laura Gómez', email: 'laura@uni.edu.co' });
    expect(boton.getAttribute('href')).toBe('/metas');
  });
});
