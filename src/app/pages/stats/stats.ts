import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { CheckinEntry } from '../../models/checkin.model';
import { MOODS } from '../../models/mood.model';

@Component({
  selector: 'app-stats',
  imports: [CommonModule, RouterLink, NavBar],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {
  // Ordenado por fecha para que "los últimos" sean los más recientes
  historial: CheckinEntry[] = (
    JSON.parse(localStorage.getItem('pulso-historial') ?? '[]') as CheckinEntry[]
  ).sort((a, b) => a.date.localeCompare(b.date));
  metaSueno: number = JSON.parse(localStorage.getItem('pulso-goals') ?? '{}').sleepHours ?? 8;

  periodo = signal<'semana' | 'mes'>('semana');

  registros() {
    return this.historial.slice(this.periodo() === 'semana' ? -7 : -30);
  }

  promedio(campo: 'mood' | 'water' | 'stress' | 'exerciseMinutes') {
    const lista = this.registros();
    if (lista.length === 0) return 0;
    return lista.reduce((suma, d) => suma + d[campo], 0) / lista.length;
  }

  animoPromedio() {
    return MOODS[Math.round(this.promedio('mood')) - 1]?.label ?? 'Sin datos';
  }

  horas(d: CheckinEntry) {
    if (!d.sleepStart || !d.sleepEnd) return 0;
    const [hi, mi] = d.sleepStart.split(':').map(Number);
    const [hf, mf] = d.sleepEnd.split(':').map(Number);
    let minutos = hf * 60 + mf - (hi * 60 + mi);
    if (minutos < 0) minutos += 24 * 60;
    return minutos / 60;
  }

  suenoPromedio() {
    const lista = this.registros();
    if (lista.length === 0) return '0 h';
    const minutos = Math.round(
      (lista.reduce((suma, d) => suma + this.horas(d), 0) / lista.length) * 60,
    );
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return resto === 0 ? horas + ' h' : horas + ' h ' + resto + ' min';
  }

  alturaBarra(d: CheckinEntry) {
    return Math.min(100, (this.horas(d) / 12) * 100);
  }

  alturaMeta() {
    return Math.min(100, (this.metaSueno / 12) * 100);
  }

  cumpleMeta(d: CheckinEntry) {
    return this.horas(d) >= this.metaSueno;
  }

  estresPromedio() {
    return Math.round(this.promedio('stress') * 10) / 10;
  }
}
