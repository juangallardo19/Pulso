import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { ChipOption } from '../../domain/checkin/chip-option/chip-option';
import { ServiceCard } from '../../domain/wellness/service-card/service-card';
import { WellnessService } from '../../models/wellness-service.model';
import bienestar from '../../data/bienestar.json';

@Component({
  selector: 'app-wellness',
  imports: [CommonModule, NavBar, ChipOption, ServiceCard],
  templateUrl: './wellness.html',
  styleUrl: './wellness.scss',
})
export class Wellness {
  // Datos reales del campus Pasto, guardados en src/app/data/bienestar.json
  datos = bienestar;
  servicios: WellnessService[] = bienestar.servicios;

  // "Todos" + las categorías que existan en el JSON, sin repetir
  categorias = ['Todos', ...new Set(bienestar.servicios.map((s) => s.category))];
  filtro = signal('Todos');

  serviciosFiltrados() {
    return this.filtro() === 'Todos'
      ? this.servicios
      : this.servicios.filter((s) => s.category === this.filtro());
  }

  contactar(telefono: string) {
    alert('Comunícate al ' + telefono);
  }
}
