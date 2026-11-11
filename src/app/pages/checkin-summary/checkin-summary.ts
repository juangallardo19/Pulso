import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stepper } from '../../domain/checkin/stepper/stepper';
import { CHECKIN_VACIO, CheckinEntry } from '../../models/checkin.model';
import { MOODS } from '../../models/mood.model';

@Component({
  selector: 'app-checkin-summary',
  imports: [RouterLink, Stepper],
  templateUrl: './checkin-summary.html',
  styleUrl: './checkin-summary.scss',
})
export class CheckinSummary {
  checkin: CheckinEntry = {
    ...CHECKIN_VACIO,
    ...JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}'),
  };

  moodLabel() {
    return MOODS.find((m) => m.value === this.checkin.mood)?.label ?? '';
  }

  moodImage() {
    return 'moods/' + this.checkin.mood + '.svg';
  }

  horasDormidas() {
    if (!this.checkin.sleepStart || !this.checkin.sleepEnd) {
      return '0 h';
    }
    const [hi, mi] = this.checkin.sleepStart.split(':').map(Number);
    const [hf, mf] = this.checkin.sleepEnd.split(':').map(Number);
    let minutos = hf * 60 + mf - (hi * 60 + mi);
    if (minutos < 0) {
      minutos += 24 * 60;
    }
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return resto === 0 ? horas + ' h' : horas + ' h ' + resto + ' min';
  }

  guardarDia() {
    const dia: CheckinEntry = {
      ...this.checkin,
      date: this.checkin.date || new Date().toLocaleDateString('en-CA'),
    };
    const historial: CheckinEntry[] = JSON.parse(localStorage.getItem('pulso-historial') ?? '[]');
    const sinHoy = historial.filter((d) => d.date !== dia.date);
    localStorage.setItem('pulso-historial', JSON.stringify([...sinHoy, dia]));
    localStorage.removeItem('pulso-checkin-hoy');
  }
}
