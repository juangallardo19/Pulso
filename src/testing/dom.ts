// Ayudantes para las pruebas unitarias: todas las acciones pasan por el HTML,
// igual que lo haría una persona (clic, escribir, mover un slider) y se revisa lo que se ve.
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

// Monta una página o componente. La ruta comodín evita errores al hacer clic en links.
// Se puede llamar varias veces en una misma prueba para pasar de una pantalla a otra
// (los datos siguen en localStorage, como al navegar en la app).
export async function montar<T>(componente: Type<T>, otros: Type<unknown>[] = []) {
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [componente, ...otros],
    providers: [provideRouter([{ path: '**', children: [] }])],
  }).compileComponents();
  const fixture = TestBed.createComponent(componente);
  await fixture.whenStable();
  return new Pantalla(fixture);
}

export class Pantalla<T> {
  constructor(public fixture: ComponentFixture<T>) {}

  get componente(): T {
    return this.fixture.componentInstance;
  }

  get html(): HTMLElement {
    return this.fixture.nativeElement;
  }

  todos(selector: string): HTMLElement[] {
    return Array.from(this.html.querySelectorAll<HTMLElement>(selector));
  }

  el(selector: string, indice = 0): HTMLElement {
    const elemento = this.todos(selector)[indice];
    if (!elemento) {
      throw new Error(`No existe en el HTML: ${selector} [${indice}]`);
    }
    return elemento;
  }

  existe(selector: string) {
    return this.todos(selector).length > 0;
  }

  cuantos(selector: string) {
    return this.todos(selector).length;
  }

  async actualizar() {
    await this.fixture.whenStable();
  }

  async clic(selector: string, indice = 0) {
    this.el(selector, indice).click();
    await this.actualizar();
  }

  // Escribe en un input o textarea (también sirve para sliders y campos de hora)
  async escribir(selector: string, valor: string | number, indice = 0) {
    const campo = this.el(selector, indice) as HTMLInputElement;
    campo.value = String(valor);
    campo.dispatchEvent(new Event('input'));
    campo.dispatchEvent(new Event('change'));
    campo.dispatchEvent(new Event('blur'));
    await this.actualizar();
  }

  async mover(selector: string, valor: number, indice = 0) {
    await this.escribir(selector, valor, indice);
  }

  texto(selector = ':scope', indice = 0) {
    const elemento = selector === ':scope' ? this.html : this.el(selector, indice);
    return (elemento.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  tieneClase(selector: string, clase: string, indice = 0) {
    return this.el(selector, indice).classList.contains(clase);
  }

  // Visible = ni el elemento ni ninguno de sus padres tiene la clase "oculto"
  visible(selector: string, indice = 0) {
    let actual: HTMLElement | null = this.el(selector, indice);
    while (actual) {
      if (actual.classList.contains('oculto')) {
        return false;
      }
      actual = actual.parentElement;
    }
    return true;
  }

  href(selector: string, indice = 0) {
    return this.el(selector, indice).getAttribute('href');
  }

  atributo(selector: string, nombre: string, indice = 0) {
    return this.el(selector, indice).getAttribute(nombre);
  }
}

export function leer(llave: string) {
  return JSON.parse(localStorage.getItem(llave) ?? 'null');
}

export function guardar(llave: string, valor: unknown) {
  localStorage.setItem(llave, JSON.stringify(valor));
}

// Fecha AAAA-MM-DD de hace N días
export function haceDias(n: number) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - n);
  return fecha.toLocaleDateString('en-CA');
}
