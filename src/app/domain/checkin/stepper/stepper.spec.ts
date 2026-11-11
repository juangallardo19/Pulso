import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stepper } from './stepper';

describe('Stepper', () => {
  let component: Stepper;
  let fixture: ComponentFixture<Stepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stepper],
    }).compileComponents();

    fixture = TestBed.createComponent(Stepper);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('paso', 1);
    await fixture.whenStable();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('con paso 3 marca 3 puntos como hechos', async () => {
    fixture.componentRef.setInput('paso', 3);
    await fixture.whenStable();
    const hechos = fixture.nativeElement.querySelectorAll('span.done');
    expect(hechos.length).toBe(3);
  });

  it('el aria-label dice Paso 3 de 6', async () => {
    fixture.componentRef.setInput('paso', 3);
    await fixture.whenStable();
    const stepper: HTMLElement = fixture.nativeElement.querySelector('.stepper');
    expect(stepper.getAttribute('aria-label')).toBe('Paso 3 de 6');
  });
});
