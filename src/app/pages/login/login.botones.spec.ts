import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Login } from './login';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('Login · botones', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let html: HTMLElement;

  function escribir(selector: string, valor: string) {
    const input: HTMLInputElement = html.querySelector(selector)!;
    input.value = valor;
    input.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('el ojo muestra y oculta la contraseña', async () => {
    const clave: HTMLInputElement = html.querySelector('#password')!;
    expect(clave.type).toBe('password');

    (html.querySelector('.ver-clave') as HTMLElement).click();
    await fixture.whenStable();
    expect(clave.type).toBe('text');
    expect(html.querySelector('.ver-clave')!.getAttribute('aria-label')).toBe('Ocultar contraseña');

    (html.querySelector('.ver-clave') as HTMLElement).click();
    await fixture.whenStable();
    expect(clave.type).toBe('password');
  });

  it('"¿Olvidaste tu contraseña?" muestra un aviso', () => {
    const aviso = vi.spyOn(window, 'alert').mockImplementation(() => {});
    (html.querySelector('.forgot') as HTMLElement).click();
    expect(aviso).toHaveBeenCalled();
  });

  it('"Iniciar sesión" llama a entrar() y lleva a /inicio', async () => {
    escribir('#email', 'laura@uni.edu.co');
    escribir('#password', '12345678');
    await fixture.whenStable();

    const espia = vi.spyOn(component, 'entrar');
    const boton: HTMLAnchorElement = html.querySelector('.btn-primary')!;
    boton.click();
    expect(espia).toHaveBeenCalled();
    expect(boton.getAttribute('href')).toBe('/inicio');
  });

  it('el link "Regístrate" lleva a /registro', () => {
    expect(html.querySelector('.auth-footer a')!.getAttribute('href')).toBe('/registro');
  });
});
