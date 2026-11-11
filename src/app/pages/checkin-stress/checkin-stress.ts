import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChipOption } from '../../domain/checkin/chip-option/chip-option';
import { Stepper } from '../../domain/checkin/stepper/stepper';
import { CHECKIN_VACIO, CheckinEntry } from '../../models/checkin.model';

@Component({
  selector: 'app-checkin-stress',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Stepper, ChipOption],
  templateUrl: './checkin-stress.html',
  styleUrl: './checkin-stress.scss',
})
export class CheckinStress {
  private checkin: CheckinEntry = {
    ...CHECKIN_VACIO,
    ...JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}'),
  };
  nivelCtrl = new FormControl(this.checkin.stress, { nonNullable: true });
  causas = ['Parcial', 'Trabajo', 'Familia', 'Dinero', 'Salud', 'Otro'];
  elegidas = signal<string[]>(this.checkin.stressCauses);

  alternarCausa(causa: string) {
    if (this.elegidas().includes(causa)) {
      this.elegidas.update((l) => l.filter((c) => c !== causa));
    } else {
      this.elegidas.update((l) => [...l, causa]);
    }
  }

  claseNivel() {
    const nivel = this.nivelCtrl.value;
    if (nivel <= 3) {
      return 'bajo';
    }
    if (nivel <= 6) {
      return 'medio';
    }
    return 'alto';
  }

  guardar() {
    const actualizado: CheckinEntry = {
      ...this.checkin,
      stress: this.nivelCtrl.value,
      stressCauses: this.elegidas(),
    };
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify(actualizado));
  }
}
