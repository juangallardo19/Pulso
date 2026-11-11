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

  it('con 3 días en el historial la racha es 3', async () => {
    localStorage.setItem(
      'pulso-historial',
      JSON.stringify([{ date: '2026-11-09' }, { date: '2026-11-10' }, { date: '2026-11-11' }]),
    );
    await crear();
    expect(component.racha).toBe(3);
  });

  it('sin historial la racha es 0', async () => {
    await crear();
    expect(component.racha).toBe(0);
  });
});
