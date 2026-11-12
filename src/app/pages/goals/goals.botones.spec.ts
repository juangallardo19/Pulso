import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Goals } from './goals';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('Goals · botones', () => {
  let component: Goals;
  let fixture: ComponentFixture<Goals>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [Goals],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(Goals);
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

  it('mover los tres sliders y tocar "Continuar" guarda las metas', async () => {
    await crear();
    const mover = (clase: string, valor: string) => {
      const slider: HTMLInputElement = html.querySelector('input.' + clase)!;
      slider.value = valor;
      slider.dispatchEvent(new Event('input'));
    };
    mover('sleep', '7');
    mover('water', '10');
    mover('exercise', '45');
    await fixture.whenStable();
    const boton: HTMLAnchorElement = html.querySelector('.btn-primary')!;
    boton.click();
    expect(leer('pulso-goals')).toEqual({ sleepHours: 7, waterGlasses: 10, exerciseMinutes: 45 });
    expect(boton.getAttribute('href')).toBe('/inicio');
  });

  it('"Volver" lleva al registro', async () => {
    await crear();
    expect(html.querySelector('[aria-label="Volver"]')!.getAttribute('href')).toBe('/registro');
  });
});
