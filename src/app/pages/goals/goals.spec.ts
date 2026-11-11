import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Goals } from './goals';

describe('Goals', () => {
  let component: Goals;
  let fixture: ComponentFixture<Goals>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [Goals],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Goals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('sin metas guardadas arranca en 8 h, 8 vasos y 30 min', async () => {
    await crear();
    expect(component.goalsForm.value).toEqual({
      sleepHours: 8,
      waterGlasses: 8,
      exerciseMinutes: 30,
    });
  });

  it('arranca con las metas que ya estaban guardadas', async () => {
    localStorage.setItem(
      'pulso-goals',
      JSON.stringify({ sleepHours: 7, waterGlasses: 6, exerciseMinutes: 45 }),
    );
    await crear();
    expect(component.goalsForm.value.waterGlasses).toBe(6);
    expect(component.goalsForm.value.exerciseMinutes).toBe(45);
  });

  it('guardarMetas escribe lo que tiene el formulario', async () => {
    await crear();
    component.goalsForm.setValue({ sleepHours: 9, waterGlasses: 10, exerciseMinutes: 60 });
    component.guardarMetas();
    const guardado = JSON.parse(localStorage.getItem('pulso-goals') ?? '{}');
    expect(guardado).toEqual({ sleepHours: 9, waterGlasses: 10, exerciseMinutes: 60 });
  });

  it('muestra en pantalla el valor del slider de agua al moverlo', async () => {
    await crear();
    // Simula que el usuario mueve el slider de agua
    const slider: HTMLInputElement = fixture.nativeElement.querySelector('input.water');
    slider.value = '12';
    slider.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(component.goalsForm.value.waterGlasses).toBe(12);
    const metricas = fixture.nativeElement.querySelectorAll('.metric');
    expect(metricas[1].textContent).toContain('12');
  });
});
