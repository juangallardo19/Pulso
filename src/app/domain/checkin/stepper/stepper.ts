import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  imports: [CommonModule],
  templateUrl: './stepper.html',
  styleUrl: './stepper.scss',
})
export class Stepper {
  @Input({ required: true }) paso!: number;
  @Input() total: number = 6;
  puntos = [1, 2, 3, 4, 5, 6];
}
