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

  it('muestra el título y la hora', () => {
    const html: HTMLElement = fixture.nativeElement;
    expect(html.textContent).toContain('Tomar agua');
    expect(html.textContent).toContain('10:00');
  });

  it('con isActive: false tiene la clase off', async () => {
    fixture.componentRef.setInput('reminder', { ...ejemplo, isActive: false });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.reminder.off')).not.toBeNull();
  });

  it('el toggle emite el id por alternar', () => {
    const espia = vi.spyOn(component.alternar, 'emit');
    fixture.nativeElement.querySelector('.toggle').click();
    expect(espia).toHaveBeenCalledWith(1);
  });

  it('la basura emite el id por eliminar', () => {
    const espia = vi.spyOn(component.eliminar, 'emit');
    fixture.nativeElement.querySelector('.icon-btn').click();
    expect(espia).toHaveBeenCalledWith(1);
  });

  it('claseDia marca solo los días activos', () => {
    expect(component.claseDia('L')).toBe('on primary');
    expect(component.claseDia('M')).toBe('');
  });
});
