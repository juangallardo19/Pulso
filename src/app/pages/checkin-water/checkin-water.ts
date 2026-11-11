import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stepper } from '../../domain/checkin/stepper/stepper';
import { CHECKIN_VACIO, CheckinEntry } from '../../models/checkin.model';

@Component({
  selector: 'app-checkin-water',
  imports: [RouterLink, Stepper],
  templateUrl: './checkin-water.html',
  styleUrl: './checkin-water.scss',
})
export class CheckinWater {
  private checkin: CheckinEntry = {
    ...CHECKIN_VACIO,
    ...JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}'),
  };
  vasos = signal(this.checkin.water);
  meta: number = JSON.parse(localStorage.getItem('pulso-goals') ?? '{}').waterGlasses ?? 8;

  sumar() {
    this.vasos.update((v) => v + 1);
  }

  quitar() {
    this.vasos.update((v) => (v > 0 ? v - 1 : 0));
  }

  faltan() {
    return Math.max(0, this.meta - this.vasos());
  }

  guardar() {
    const actualizado: CheckinEntry = {
      ...this.checkin,
      water: this.vasos(),
    };
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify(actualizado));
  }
}
