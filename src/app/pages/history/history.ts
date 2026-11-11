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
  anio = this.hoy.getFullYear();
  mes = this.hoy.getMonth();
  nombreMes = this.hoy.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

  // Lunes = primera columna
  emptyDays = Array((new Date(this.anio, this.mes, 1).getDay() + 6) % 7).fill(0);
  totalDias = new Date(this.anio, this.mes + 1, 0).getDate();

  dias: Day[] = this.armarDias();

  armarDias(): Day[] {
    const lista: Day[] = [];
    for (let n = 1; n <= this.totalDias; n++) {
      const fecha = new Date(this.anio, this.mes, n).toLocaleDateString('en-CA');
      const registro = this.historial.find((d) => d.date === fecha);
      lista.push({
        number: n,
        mood: registro ? registro.mood : 0,
        isToday: n === this.hoy.getDate(),
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
