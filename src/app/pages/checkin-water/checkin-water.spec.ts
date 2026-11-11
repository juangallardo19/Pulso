import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckinWater } from './checkin-water';

describe('CheckinWater', () => {
  let component: CheckinWater;
  let fixture: ComponentFixture<CheckinWater>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinWater],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinWater);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());

  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('toma la meta de pulso-goals', async () => {
    localStorage.setItem(
      'pulso-goals',
      JSON.stringify({ sleepHours: 8, waterGlasses: 6, exerciseMinutes: 30 }),
    );
    await crear();
    expect(component.meta).toBe(6);
  });

  it('sin pulso-goals la meta es 8', async () => {
    await crear();
    expect(component.meta).toBe(8);
  });

  it('sumar() sube a 1', async () => {
    await crear();
    component.sumar();
    expect(component.vasos()).toBe(1);
  });

  it('quitar() en 0 sigue en 0', async () => {
    await crear();
    component.quitar();
    expect(component.vasos()).toBe(0);
  });

  it('faltan() no baja de 0', async () => {
    await crear();
    for (let i = 0; i < 10; i++) {
      component.sumar();
    }
    expect(component.faltan()).toBe(0);
  });

  it('guardar() escribe water', async () => {
    await crear();
    component.sumar();
    component.sumar();
    component.guardar();
    const hoy = JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}');
    expect(hoy.water).toBe(2);
  });
});
