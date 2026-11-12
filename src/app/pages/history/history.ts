import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { DayCell } from '../../domain/history/day-cell/day-cell';
import { Day } from '../../models/day.model';
import { CheckinEntry } from '../../models/checkin.model';

@Component({
  selector: 'app-history',
  imports: [CommonModule, RouterLink, NavBar, DayCell],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History {
  historial: CheckinEntry[] = JSON.parse(localStorage.getItem('pulso-historial') ?? '[]');

  hoy = new Date();
  private fechaHoy = this.hoy.toLocaleDateString('en-CA');

  // Mes que se está viendo (empieza en el mes actual)
  anio = this.hoy.getFullYear();
  mes = this.hoy.getMonth();
  nombreMes = '';
  emptyDays: number[] = [];
  totalDias = 0;
  dias: Day[] = [];

  constructor() {
    this.armarMes();
  }

  private armarMes() {
    const primero = new Date(this.anio, this.mes, 1);
    this.nombreMes = primero.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
    // Lunes = primera columna
    this.emptyDays = Array((primero.getDay() + 6) % 7).fill(0);
    this.totalDias = new Date(this.anio, this.mes + 1, 0).getDate();
    this.dias = this.armarDias();
  }

  // delta = -1 (mes anterior) o 1 (mes siguiente). No se puede pasar del mes actual.
  cambiarMes(delta: number) {
    if (delta > 0 && !this.haySiguiente()) {
      return;
    }
    const nuevo = new Date(this.anio, this.mes + delta, 1);
    this.anio = nuevo.getFullYear();
    this.mes = nuevo.getMonth();
    this.armarMes();
  }

  haySiguiente() {
    return this.anio < this.hoy.getFullYear() || this.mes < this.hoy.getMonth();
  }

  armarDias(): Day[] {
    const lista: Day[] = [];
    for (let n = 1; n <= this.totalDias; n++) {
      const fecha = new Date(this.anio, this.mes, n).toLocaleDateString('en-CA');
      const registro = this.historial.find((d) => d.date === fecha);
      lista.push({
        number: n,
        mood: registro ? registro.mood : 0,
        isToday: fecha === this.fechaHoy,
        date: fecha,
      });
    }
    return lista;
  }

  // Cuántos días del mes tienen ese ánimo
  contar(valor: number) {
    return this.dias.filter((d) => d.mood === valor).length;
  }

  registrosDelMes() {
    return this.dias.filter((d) => d.mood !== 0).length;
  }

  elegirDia(dia: Day) {
    localStorage.setItem('pulso-dia-seleccionado', dia.date ?? '');
  }
}
