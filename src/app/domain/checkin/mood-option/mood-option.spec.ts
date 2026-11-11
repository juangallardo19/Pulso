import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodOption } from './mood-option';

describe('MoodOption', () => {
  let component: MoodOption;
  let fixture: ComponentFixture<MoodOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodOption],
    }).compileComponents();

    fixture = TestBed.createComponent(MoodOption);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mood', { value: 4, label: 'Bien', image: 'moods/4.svg' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
