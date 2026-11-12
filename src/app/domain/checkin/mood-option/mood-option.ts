import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Mood } from '../../../models/mood.model';

@Component({
  selector: 'app-mood-option',
  imports: [],
  templateUrl: './mood-option.html',
  styleUrl: './mood-option.scss',
})
export class MoodOption {
  @Input({ required: true }) mood!: Mood;
  @Input() selected: boolean = false;
  @Output() elegir = new EventEmitter<number>();

  seleccionar() {
    this.elegir.emit(this.mood.value);
  }
}
