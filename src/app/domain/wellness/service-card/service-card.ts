import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WellnessService } from '../../../models/wellness-service.model';

@Component({
  selector: 'app-service-card',
  imports: [CommonModule],
  templateUrl: './service-card.html',
  styleUrl: './service-card.scss',
})
export class ServiceCard {
  @Input({ required: true }) service!: WellnessService;
  @Output() contactar = new EventEmitter<string>();

  llamar() {
    this.contactar.emit(this.service.phone);
  }
}
