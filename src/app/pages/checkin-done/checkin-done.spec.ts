import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckinDone } from './checkin-done';

describe('CheckinDone', () => {
  let component: CheckinDone;
  let fixture: ComponentFixture<CheckinDone>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinDone],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinDone);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());

  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  // Fecha de hace N días en formato AAAA-MM-DD (la racha depende de la fecha real)
  function haceDias(n: number) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toLocaleDateString('en-CA');
  }

  it('con 3 días seguidos hasta hoy la racha es 3', async () => {
    localStorage.setItem(
      'pulso-historial',
      JSON.stringify([{ date: haceDias(2) }, { date: haceDias(1) }, { date: haceDias(0) }]),
    );
    await crear();
    expect(component.racha).toBe(3);
  });

  it('un día sin check-in corta la racha', async () => {
    localStorage.setItem(
      'pulso-historial',
      JSON.stringify([{ date: haceDias(5) }, { date: haceDias(4) }, { date: haceDias(0) }]),
    );
    await crear();
    expect(component.racha).toBe(1);
  });

  it('sin historial la racha es 0', async () => {
    await crear();
    expect(component.racha).toBe(0);
  });
});
