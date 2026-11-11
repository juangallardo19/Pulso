import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chip-option',
  imports: [],
  templateUrl: './chip-option.html',
  styleUrl: './chip-option.scss',
})
export class ChipOption {
  @Input({ required: true }) label!: string;
  @Input() active: boolean = false;
  @Output() alternar = new EventEmitter<string>();

  tocar() {
    this.alternar.emit(this.label);
  }
}
