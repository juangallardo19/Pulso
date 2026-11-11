import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reminder, SEMANA } from '../../../models/reminder.model';

@Component({
  selector: 'app-reminder-card',
  imports: [CommonModule],
  templateUrl: './reminder-card.html',
  styleUrl: './reminder-card.scss',
})
export class ReminderCard {
  @Input({ required: true }) reminder!: Reminder;
  @Output() alternar = new EventEmitter<number>();
  @Output() eliminar = new EventEmitter<number>();

  semana = SEMANA;

  claseDia(dia: string) {
    return this.reminder.activeDays.includes(dia) ? 'on ' + this.reminder.dayColor : '';
  }

  tocarToggle() {
    this.alternar.emit(this.reminder.id);
  }

  borrar() {
    this.eliminar.emit(this.reminder.id);
  }
}
