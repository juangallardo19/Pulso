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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
