import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Stepper } from '../../domain/checkin/stepper/stepper';
import { CHECKIN_VACIO, CheckinEntry } from '../../models/checkin.model';

@Component({
  selector: 'app-checkin-sleep',
  imports: [RouterLink, ReactiveFormsModule, Stepper],
  templateUrl: './checkin-sleep.html',
  styleUrl: './checkin-sleep.scss',
})
export class CheckinSleep {
  private checkin: CheckinEntry = {
    ...CHECKIN_VACIO,
    ...JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}'),
  };
  inicioCtrl = new FormControl(this.checkin.sleepStart, { nonNullable: true });
  finCtrl = new FormControl(this.checkin.sleepEnd, { nonNullable: true });

  horasDormidas() {
    if (!this.inicioCtrl.value || !this.finCtrl.value) {
      return '0 h';
    }
    const [hi, mi] = this.inicioCtrl.value.split(':').map(Number);
    const [hf, mf] = this.finCtrl.value.split(':').map(Number);
    let minutos = hf * 60 + mf - (hi * 60 + mi);
    if (minutos < 0) {
      minutos += 24 * 60;
    }
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return resto === 0 ? horas + ' h' : horas + ' h ' + resto + ' min';
  }

  guardar() {
    const actualizado: CheckinEntry = {
      ...this.checkin,
      sleepStart: this.inicioCtrl.value,
      sleepEnd: this.finCtrl.value,
    };
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify(actualizado));
  }
}
