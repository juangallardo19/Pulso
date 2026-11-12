import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CheckinMood } from './checkin-mood';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('CheckinMood · botones', () => {
  let component: CheckinMood;
  let fixture: ComponentFixture<CheckinMood>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinMood],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinMood);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
    await fixture.whenStable();
  }

  function clic(selector: string) {
    (html.querySelector(selector) as HTMLElement).click();
  }

  function hoy() {
    return JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}');
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('tocar una carita la marca como seleccionada', async () => {
    await crear();
    const caritas = html.querySelectorAll('app-mood-option a');
    (caritas[0] as HTMLElement).click();
    await fixture.whenStable();
    expect(component.seleccionado()).toBe(1);
    expect(caritas[0].classList).toContain('selected');
    expect(html.querySelectorAll('app-mood-option a.selected').length).toBe(1);
  });

  it('"Siguiente" guarda el ánimo y la nota escritos', async () => {
    await crear();
    (html.querySelectorAll('app-mood-option a')[4] as HTMLElement).click();
    const nota: HTMLTextAreaElement = html.querySelector('textarea')!;
    nota.value = 'Buen día';
    nota.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    clic('.btn-primary');
    expect(hoy().mood).toBe(5);
    expect(hoy().note).toBe('Buen día');
  });

  it('volver y cerrar llevan al inicio', async () => {
    await crear();
    const links = [...html.querySelectorAll('.ci-top a')].map((a) => a.getAttribute('href'));
    expect(links).toEqual(['/inicio', '/inicio']);
  });
});
