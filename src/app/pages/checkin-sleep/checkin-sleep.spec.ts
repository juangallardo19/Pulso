import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckinSleep } from './checkin-sleep';

describe('CheckinSleep', () => {
  let component: CheckinSleep;
  let fixture: ComponentFixture<CheckinSleep>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinSleep],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinSleep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());

  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('de 23:30 a 07:00 da 7 h 30 min', async () => {
    await crear();
    component.inicioCtrl.setValue('23:30');
    component.finCtrl.setValue('07:00');
    expect(component.horasDormidas()).toBe('7 h 30 min');
  });

  it('de 01:00 a 06:00 da 5 h', async () => {
    await crear();
    component.inicioCtrl.setValue('01:00');
    component.finCtrl.setValue('06:00');
    expect(component.horasDormidas()).toBe('5 h');
  });

  it('guardar() escribe sleepStart y sleepEnd', async () => {
    await crear();
    component.inicioCtrl.setValue('22:00');
    component.finCtrl.setValue('06:30');
    component.guardar();
    const hoy = JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}');
    expect(hoy.sleepStart).toBe('22:00');
    expect(hoy.sleepEnd).toBe('06:30');
  });
});
