import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Reminders } from './reminders';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('Reminders · botones', () => {
  let component: Reminders;
  let fixture: ComponentFixture<Reminders>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [Reminders],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(Reminders);
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

  it('"Nuevo recordatorio" muestra y oculta el formulario', async () => {
    await crear();
    const formulario = html.querySelector('form')!;
    expect(formulario.classList).toContain('oculto');
    clic('.new');
    await fixture.whenStable();
    expect(formulario.classList).not.toContain('oculto');
    clic('.new');
    await fixture.whenStable();
    expect(formulario.classList).toContain('oculto');
  });

  it('llenar el formulario y tocar "Guardar" agrega una tarjeta', async () => {
    await crear();
    const antes = html.querySelectorAll('app-reminder-card').length;
    clic('.new');
    const titulo: HTMLInputElement = html.querySelector('form input[type="text"]')!;
    const hora: HTMLInputElement = html.querySelector('form input[type="time"]')!;
    titulo.value = 'Estirar la espalda';
    titulo.dispatchEvent(new Event('input'));
    hora.value = '16:00';
    hora.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    clic('form .btn-primary');
    await fixture.whenStable();
    expect(html.querySelectorAll('app-reminder-card').length).toBe(antes + 1);
    expect(leer('pulso-recordatorios').at(-1).title).toBe('Estirar la espalda');
  });

  it('"Guardar" con el formulario vacío no agrega nada', async () => {
    await crear();
    const antes = component.recordatorios().length;
    clic('.new');
    clic('form .btn-primary');
    expect(component.recordatorios().length).toBe(antes);
  });

  it('el interruptor de una tarjeta la apaga y lo guarda', async () => {
    await crear();
    const primero = component.recordatorios()[0];
    clic('app-reminder-card .toggle', 0);
    await fixture.whenStable();
    expect(leer('pulso-recordatorios')[0].isActive).toBe(!primero.isActive);
  });

  it('la papelera de una tarjeta la elimina', async () => {
    await crear();
    const antes = html.querySelectorAll('app-reminder-card').length;
    clic('app-reminder-card [aria-label="Eliminar recordatorio"]', 0);
    await fixture.whenStable();
    expect(html.querySelectorAll('app-reminder-card').length).toBe(antes - 1);
  });

  it('"Volver" lleva al perfil', async () => {
    await crear();
    expect(html.querySelector('[aria-label="Volver"]')!.getAttribute('href')).toBe('/perfil');
  });
});
