import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());

  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('con pulso-user Laura Gómez saluda a Laura', async () => {
    localStorage.setItem(
      'pulso-user',
      JSON.stringify({ name: 'Laura Gómez', email: 'laura@uni.edu.co' }),
    );
    await crear();
    expect(component.nombre).toBe('Laura');
    expect(fixture.nativeElement.textContent).toContain('Laura');
  });

  it('sin usuario saluda a Estudiante', async () => {
    await crear();
    expect(fixture.nativeElement.textContent).toContain('Estudiante');
  });

  it('saludo() devuelve uno de los 3 saludos', async () => {
    await crear();
    expect(['Buenos días', 'Buenas tardes', 'Buenas noches']).toContain(component.saludo());
  });

  it('sumar() guarda water en pulso-checkin-hoy', async () => {
    await crear();
    component.sumar();
    component.sumar();
    const hoy = JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}');
    expect(hoy.water).toBe(2);
    expect(component.vasos()).toBe(2);
  });

  it('quitar() en 0 sigue en 0', async () => {
    await crear();
    component.quitar();
    expect(component.vasos()).toBe(0);
  });

  it('mostrarAlerta() es true con 3 días de ánimo muy mal', async () => {
    localStorage.setItem(
      'pulso-historial',
      JSON.stringify([
        { date: '2026-11-09', mood: 1 },
        { date: '2026-11-10', mood: 1 },
        { date: '2026-11-11', mood: 1 },
      ]),
    );
    await crear();
    expect(component.mostrarAlerta()).toBe(true);
    expect(fixture.nativeElement.querySelector('.alert.oculto')).toBeNull();
  });

  it('mostrarAlerta() es false con solo 2 días de ánimo muy mal', async () => {
    localStorage.setItem(
      'pulso-historial',
      JSON.stringify([
        { date: '2026-11-10', mood: 1 },
        { date: '2026-11-11', mood: 1 },
      ]),
    );
    await crear();
    expect(component.mostrarAlerta()).toBe(false);
    expect(fixture.nativeElement.querySelector('.alert.oculto')).not.toBeNull();
  });

  it('progreso() nunca pasa de 100', async () => {
    localStorage.setItem(
      'pulso-checkin-hoy',
      JSON.stringify({
        sleepStart: '20:00',
        sleepEnd: '10:00',
        water: 20,
        exerciseMinutes: 200,
      }),
    );
    await crear();
    expect(component.progreso()).toBe(100);
  });
});
