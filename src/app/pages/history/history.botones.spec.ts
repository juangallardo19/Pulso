import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { History } from './history';
import { CHECKIN_VACIO } from '../../models/checkin.model';

// Fecha AAAA-MM-DD del día 5 de hace N meses
function diaDelMes(mesesAtras: number) {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() - mesesAtras, 5).toLocaleDateString('en-CA');
}

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('History · botones', () => {
  let component: History;
  let fixture: ComponentFixture<History>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [History],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(History);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
    await fixture.whenStable();
  }

  function clic(selector: string) {
    (html.querySelector(selector) as HTMLElement).click();
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('"Mes anterior" muestra el mes pasado con sus registros', async () => {
    localStorage.setItem(
      'pulso-historial',
      JSON.stringify([{ ...CHECKIN_VACIO, date: diaDelMes(1), mood: 2 }]),
    );
    await crear();
    const mesActual = component.nombreMes;
    expect(component.contar(2)).toBe(0);

    clic('[aria-label="Mes anterior"]');
    await fixture.whenStable();
    expect(component.nombreMes).not.toBe(mesActual);
    expect(component.contar(2)).toBe(1);
    expect(html.querySelector('.nombre-mes')!.textContent).toContain(component.nombreMes);
  });

  it('"Mes siguiente" vuelve al mes actual', async () => {
    await crear();
    const mesActual = component.nombreMes;
    clic('[aria-label="Mes anterior"]');
    clic('[aria-label="Mes siguiente"]');
    await fixture.whenStable();
    expect(component.nombreMes).toBe(mesActual);
  });

  it('no deja avanzar más allá del mes actual', async () => {
    await crear();
    const mesActual = component.nombreMes;
    expect(html.querySelector('[aria-label="Mes siguiente"]')!.classList).toContain(
      'deshabilitado',
    );
    component.cambiarMes(1);
    expect(component.nombreMes).toBe(mesActual);
  });

  it('cambia de año al pasar de enero a diciembre', async () => {
    await crear();
    const anioActual = component.anio;
    const mesesHastaDiciembre = component.mes + 1;
    for (let i = 0; i < mesesHastaDiciembre; i++) {
      component.cambiarMes(-1);
    }
    expect(component.mes).toBe(11);
    expect(component.anio).toBe(anioActual - 1);
  });

  it('el día de hoy solo se marca en el mes actual', async () => {
    await crear();
    expect(component.dias.filter((d) => d.isToday).length).toBe(1);
    component.cambiarMes(-1);
    expect(component.dias.filter((d) => d.isToday).length).toBe(0);
  });

  it('tocar un día guarda su fecha para el detalle', async () => {
    localStorage.setItem(
      'pulso-historial',
      JSON.stringify([{ ...CHECKIN_VACIO, date: diaDelMes(0), mood: 4 }]),
    );
    await crear();
    (html.querySelectorAll('app-day-cell a')[4] as HTMLElement).click();
    expect(localStorage.getItem('pulso-dia-seleccionado')).toBe(diaDelMes(0));
  });

  it('los accesos llevan a estadísticas y al check-in', async () => {
    await crear();
    expect(html.querySelector('[aria-label="Ver estadísticas"]')!.getAttribute('href')).toBe(
      '/estadisticas',
    );
    expect(html.querySelector('.more')!.getAttribute('href')).toBe('/estadisticas');
    expect(html.querySelector('.fab')!.getAttribute('href')).toBe('/checkin/animo');
  });
});
