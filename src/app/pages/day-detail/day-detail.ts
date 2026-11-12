import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { CHECKIN_VACIO, CheckinEntry } from '../../models/checkin.model';
import { MOODS } from '../../models/mood.model';

@Component({
  selector: 'app-day-detail',
  imports: [CommonModule, RouterLink, NavBar],
  templateUrl: './day-detail.html',
  styleUrl: './day-detail.scss',
})
export class DayDetail {
  fecha = localStorage.getItem('pulso-dia-seleccionado') ?? '';
  historial: CheckinEntry[] = JSON.parse(localStorage.getItem('pulso-historial') ?? '[]');
  existe = this.historial.some((d) => d.date === this.fecha);
  registro: CheckinEntry = this.historial.find((d) => d.date === this.fecha) ?? {
    ...CHECKIN_VACIO,
    date: this.fecha,
  };
  metaAgua: number = JSON.parse(localStorage.getItem('pulso-goals') ?? '{}').waterGlasses ?? 8;

  fechaBonita() {
    if (!this.fecha) return 'Día sin seleccionar';
    return new Date(this.fecha + 'T00:00').toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  mood() {
    return MOODS.find((m) => m.value === this.registro.mood) ?? MOODS[3];
  }

  horasDormidas() {
    if (!this.registro.sleepStart || !this.registro.sleepEnd) return '0 h';
    const [hi, mi] = this.registro.sleepStart.split(':').map(Number);
    const [hf, mf] = this.registro.sleepEnd.split(':').map(Number);
    let minutos = hf * 60 + mf - (hi * 60 + mi);
    if (minutos < 0) minutos += 24 * 60;
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return resto === 0 ? horas + ' h' : horas + ' h ' + resto + ' min';
  }

  // Los registros anteriores a este cambio no tienen calidad
  textoCalidad() {
    return this.registro.sleepQuality ? ' · calidad ' + this.registro.sleepQuality : '';
  }

  // Carga este día en el check-in para corregirlo. Si el día no tiene registro,
  // el check-in empieza vacío para el día de hoy.
  editar() {
    if (this.existe) {
      localStorage.setItem('pulso-checkin-hoy', JSON.stringify(this.registro));
    } else {
      localStorage.removeItem('pulso-checkin-hoy');
    }
  }

  tiposEjercicio() {
    return this.registro.exerciseTypes.join(', ').toLowerCase();
  }
}
