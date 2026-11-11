import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckinExercise } from './checkin-exercise';

describe('CheckinExercise', () => {
  let component: CheckinExercise;
  let fixture: ComponentFixture<CheckinExercise>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinExercise],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinExercise);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());

  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('alternarTipo agrega y quita Yoga', async () => {
    await crear();
    component.alternarTipo('Yoga');
    expect(component.elegidos()).toContain('Yoga');
    component.alternarTipo('Yoga');
    expect(component.elegidos()).not.toContain('Yoga');
  });

  it('guardar() escribe los minutos y los tipos', async () => {
    await crear();
    component.minutosCtrl.setValue(45);
    component.alternarTipo('Correr');
    component.guardar();
    const hoy = JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}');
    expect(hoy.exerciseMinutes).toBe(45);
    expect(hoy.exerciseTypes).toEqual(['Correr']);
  });
});
