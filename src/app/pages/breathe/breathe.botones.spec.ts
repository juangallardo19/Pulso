import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Breathe } from './breathe';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('Breathe · botones', () => {
  let component: Breathe;
  let fixture: ComponentFixture<Breathe>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [Breathe],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(Breathe);
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

  it('tocar un chip de duración lo activa', async () => {
    await crear();
    clic('.duration .chip', 2);
    await fixture.whenStable();
    expect(component.duracion()).toBe('5 min');
    expect(html.querySelector('.duration .chip.active')!.textContent).toContain('5 min');
  });

  it('"Comenzar" guarda lo elegido y lleva a la sesión', async () => {
    await crear();
    clic('.technique', 1);
    clic('.duration .chip', 1);
    const boton: HTMLAnchorElement = html.querySelector('.start')!;
    boton.click();
    expect(leer('pulso-respiracion')).toEqual({ name: 'Respiración en caja', minutes: 3 });
    expect(boton.getAttribute('href')).toBe('/respira/sesion');
  });
});
