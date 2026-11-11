import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-field-error',
  imports: [],
  templateUrl: './field-error.html',
  styleUrl: './field-error.scss',
})
export class FieldError {
  @Input({ required: true }) mensaje!: string;
  @Input() visible: boolean = false;
}
