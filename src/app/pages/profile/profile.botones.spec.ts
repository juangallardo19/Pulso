import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Profile } from './profile';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('Profile · botones', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
    await fixture.whenStable();
  }

  function clic(selector: string, indice = 0) {
    (html.querySelectorAll(selector)[indice] as HTMLElement).click();
  }

  function leer(llave: string) {
    return JSON.parse(localStorage.getItem(llave) ?? 'null');
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('el interruptor de modo oscuro se enciende y se guarda', async () => {
    await crear();
    clic('app-toggle-switch .toggle');
    await fixture.whenStable();
    expect(html.querySelector('app-toggle-switch .toggle')!.classList).toContain('on');
    expect(leer('pulso-ajustes').darkMode).toBe(true);
  });

  it('"Cerrar sesión" borra el usuario y lleva al login', async () => {
    localStorage.setItem('pulso-user', JSON.stringify({ name: 'Laura', email: 'l@u.co' }));
    await crear();
    const boton: HTMLAnchorElement = html.querySelector('.logout')!;
    boton.click();
    expect(localStorage.getItem('pulso-user')).toBeNull();
    expect(boton.getAttribute('href')).toBe('/login');
  });

  it('los accesos del perfil llevan a su página', async () => {
    await crear();
    const destinos = [...html.querySelectorAll('.settings a, .goals a')].map((a) =>
      a.getAttribute('href'),
    );
    expect(destinos).toEqual(['/metas', '/recordatorios', '/bienestar', '/privacidad']);
  });
});
