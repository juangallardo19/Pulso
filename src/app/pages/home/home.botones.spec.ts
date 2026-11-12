import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';
import { CheckinMood } from '../checkin-mood/checkin-mood';
import { CHECKIN_VACIO } from '../../models/checkin.model';

function haceDias(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString('en-CA');
}

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('Home · botones', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [Home, CheckinMood],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('tocar una carita empieza el check-in con ese ánimo elegido', async () => {
    await crear();
    const caritas = html.querySelectorAll('.hero-panel .mood-option');
    (caritas[1] as HTMLElement).click();
    expect(JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}').mood).toBe(2);
    expect(caritas[1].getAttribute('href')).toBe('/checkin/animo');

    // El paso 1 del check-in arranca con "Mal" seleccionado
    const animo = TestBed.createComponent(CheckinMood);
    await animo.whenStable();
    expect(animo.componentInstance.seleccionado()).toBe(2);
  });

  it('los botones + y − del agua cambian el número en pantalla', async () => {
    await crear();
    const botones = html.querySelectorAll('.counter .round-btn');
    (botones[1] as HTMLElement).click();
    (botones[1] as HTMLElement).click();
    await fixture.whenStable();
    expect(html.querySelector('.counter .metric')!.textContent).toContain('2');
    (botones[0] as HTMLElement).click();
    await fixture.whenStable();
    expect(html.querySelector('.counter .metric')!.textContent).toContain('1');
  });

  it('"Tu día" no muestra datos de días anteriores', async () => {
    localStorage.setItem(
      'pulso-historial',
      JSON.stringify([{ ...CHECKIN_VACIO, date: haceDias(1), water: 7, mood: 5 }]),
    );
    await crear();
    expect(component.vasos()).toBe(0);
    expect(html.querySelector('.hero-panel .selected')).toBeNull();
  });

  it('"Tu día" sí muestra el registro de hoy', async () => {
    localStorage.setItem(
      'pulso-historial',
      JSON.stringify([{ ...CHECKIN_VACIO, date: haceDias(0), water: 5, mood: 3 }]),
    );
    await crear();
    expect(component.vasos()).toBe(5);
    expect(html.querySelector('.hero-panel .selected')!.textContent).toContain('Regular');
  });

  it('la racha cuenta solo días seguidos', async () => {
    localStorage.setItem(
      'pulso-historial',
      JSON.stringify([
        { ...CHECKIN_VACIO, date: haceDias(6) },
        { ...CHECKIN_VACIO, date: haceDias(1) },
        { ...CHECKIN_VACIO, date: haceDias(0) },
      ]),
    );
    await crear();
    expect(component.racha).toBe(2);
  });

  it('el punto de la campana se oculta si no hay recordatorios activos', async () => {
    localStorage.setItem('pulso-recordatorios', JSON.stringify([{ id: 1, isActive: false }]));
    await crear();
    expect(html.querySelector('.dot')!.classList).toContain('oculto');
  });

  it('el punto de la campana se ve si hay recordatorios activos', async () => {
    localStorage.setItem('pulso-recordatorios', JSON.stringify([{ id: 1, isActive: true }]));
    await crear();
    expect(html.querySelector('.dot')!.classList).not.toContain('oculto');
  });

  it('los accesos llevan a su página', async () => {
    await crear();
    expect(html.querySelector('[aria-label="Recordatorios"]')!.getAttribute('href')).toBe(
      '/recordatorios',
    );
    expect(html.querySelector('.breathe-card')!.getAttribute('href')).toBe('/respira');
  });
});
