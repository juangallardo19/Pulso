import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DayCell } from './day-cell';

describe('DayCell', () => {
  let component: DayCell;
  let fixture: ComponentFixture<DayCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayCell],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DayCell);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('day', { number: 5, mood: 4, date: '2026-11-05' });
    await fixture.whenStable();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });
});
