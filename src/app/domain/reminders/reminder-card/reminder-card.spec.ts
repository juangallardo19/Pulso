import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderCard } from './reminder-card';
import { Reminder } from '../../../models/reminder.model';

const ejemplo: Reminder = {
  id: 1,
  title: 'Tomar agua',
  time: '10:00',
  icon: 'i-droplet',
  iconColor: 'c-secondary',
  bubble: 'bg-mint',
  dayColor: 'primary',
  activeDays: ['L', 'X'],
  isActive: true,
};

describe('ReminderCard', () => {
  let component: ReminderCard;
  let fixture: ComponentFixture<ReminderCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReminderCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ReminderCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('reminder', ejemplo);
    await fixture.whenStable();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });
});
