import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DayDetail } from './day-detail';
import { CheckinMood } from '../checkin-mood/checkin-mood';
import { CheckinSummary } from '../checkin-summary/checkin-summary';
import { CHECKIN_VACIO } from '../../models/checkin.model';

const diaPasado = { ...CHECKIN_VACIO, date: '2026-11-05', mood: 2, note: 'Día de parcial' };

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('DayDetail · botones', () => {
  let fixture: ComponentFixture<DayDetail>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [DayDetail, CheckinMood, CheckinSummary],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(DayDetail);
    html = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('pulso-historial', JSON.stringify([diaPasado]));
    localStorage.setItem('pulso-dia-seleccionado', '2026-11-05');
  });

  afterEach(() => localStorage.clear());

  it('"Editar registro" carga ese día en el check-in', async () => {
    await crear();
    (html.querySelector('.edit') as HTMLElement).click();
    const enCurso = JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}');
    expect(enCurso.date).toBe('2026-11-05');
    expect(enCurso.note).toBe('Día de parcial');
  });

  it('el lápiz del encabezado también carga ese día', async () => {
    await crear();
    (html.querySelector('[aria-label="Editar registro"]') as HTMLElement).click();
    expect(JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}').date).toBe('2026-11-05');
  });

  it('al editar, el día se corrige en su fecha y no se crea uno nuevo', async () => {
    await crear();
    (html.querySelector('.edit') as HTMLElement).click();

    // Paso 1 del check-in: cambia el ánimo
    const animo = TestBed.createComponent(CheckinMood);
    await animo.whenStable();
    animo.componentInstance.seleccionar(5);
    animo.componentInstance.guardar();

    // Resumen: guarda el día
    const resumen = TestBed.createComponent(CheckinSummary);
    await resumen.whenStable();
    resumen.componentInstance.guardarDia();

    const historial = JSON.parse(localStorage.getItem('pulso-historial') ?? '[]');
    expect(historial.length).toBe(1);
    expect(historial[0].date).toBe('2026-11-05');
    expect(historial[0].mood).toBe(5);
  });

  it('si el día no tiene registro, el check-in empieza vacío', async () => {
    localStorage.setItem('pulso-dia-seleccionado', '2026-11-01');
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify({ date: '2026-10-01' }));
    await crear();
    (html.querySelector('[aria-label="Editar registro"]') as HTMLElement).click();
    expect(localStorage.getItem('pulso-checkin-hoy')).toBeNull();
  });

  it('"Volver" lleva al historial', async () => {
    await crear();
    expect(html.querySelector('[aria-label="Volver"]')!.getAttribute('href')).toBe('/historial');
  });
});
