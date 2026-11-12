import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Day } from '../../../models/day.model';

@Component({
  selector: 'app-day-cell',
  imports: [CommonModule, RouterLink],
  templateUrl: './day-cell.html',
  styleUrl: './day-cell.scss',
})
export class DayCell {
  @Input({ required: true }) day!: Day;
  @Output() elegir = new EventEmitter<Day>();

  claseCelda() {
    if (this.day.isToday) return 'today';
    if (this.day.mood === 0) return 'future';
    return '';
  }

  seleccionar() {
    this.elegir.emit(this.day);
  }
}
