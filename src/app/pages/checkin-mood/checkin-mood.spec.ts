import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckinMood } from './checkin-mood';

describe('CheckinMood', () => {
  let component: CheckinMood;
  let fixture: ComponentFixture<CheckinMood>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinMood],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinMood);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());

  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('arranca con ánimo 4', async () => {
    await crear();
    expect(component.seleccionado()).toBe(4);
  });

  it('seleccionar(2) cambia el signal', async () => {
    await crear();
    component.seleccionar(2);
    expect(component.seleccionado()).toBe(2);
  });

  it('guardar() escribe mood, note y la fecha de hoy', async () => {
    await crear();
    component.seleccionar(5);
    component.notaCtrl.setValue('Buen día');
    component.guardar();
    const hoy = JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}');
    expect(hoy.mood).toBe(5);
    expect(hoy.note).toBe('Buen día');
    expect(hoy.date).toBe(new Date().toLocaleDateString('en-CA'));
  });

  it('con un check-in guardado con mood 1 arranca en 1', async () => {
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify({ mood: 1 }));
    await crear();
    expect(component.seleccionado()).toBe(1);
  });
});
