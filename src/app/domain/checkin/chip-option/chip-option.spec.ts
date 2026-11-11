import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipOption } from './chip-option';

describe('ChipOption', () => {
  let component: ChipOption;
  let fixture: ComponentFixture<ChipOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipOption],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipOption);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Caminar');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
