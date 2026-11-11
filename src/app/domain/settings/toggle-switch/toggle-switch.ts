import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  imports: [],
  templateUrl: './toggle-switch.html',
  styleUrl: './toggle-switch.scss',
})
export class ToggleSwitch {
  @Input() on: boolean = false;
  @Input({ required: true }) etiqueta!: string;
  @Output() cambiar = new EventEmitter<boolean>();

  tocar() {
    this.cambiar.emit(!this.on);
  }
}
