import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { ChipOption } from '../../domain/checkin/chip-option/chip-option';
import { ServiceCard } from '../../domain/wellness/service-card/service-card';
import { WellnessService } from '../../models/wellness-service.model';

@Component({
  selector: 'app-wellness',
  imports: [CommonModule, NavBar, ChipOption, ServiceCard],
  templateUrl: './wellness.html',
  styleUrl: './wellness.scss',
})
export class Wellness {
  servicios: WellnessService[] = [
    {
      name: 'Psicología',
      category: 'Psicología',
      description: 'Orientación individual y grupal',
      place: 'Bloque B, piso 2',
      hours: 'L–V · 8:00–17:00',
      phone: '601 555 0101',
      icon: 'i-mind c-primary',
      bubble: 'bg-lav',
    },
    {
      name: 'Enfermería',
      category: 'Enfermería',
      description: 'Primeros auxilios y consulta',
      place: 'Edificio central',
      hours: 'L–V · 7:00–19:00',
      phone: '601 555 0102',
      icon: 'i-medic c-secondary',
      bubble: 'bg-mint',
    },
    {
      name: 'Deportes',
      category: 'Deportes',
      description: 'Gimnasio, yoga y pausas activas',
      place: 'Coliseo',
      hours: 'L–S · 6:00–20:00',
      phone: '601 555 0103',
      icon: 'i-dumbbell c-accent',
      bubble: 'bg-coral',
    },
  ];
  categorias = ['Todos', 'Psicología', 'Enfermería', 'Deportes'];
  filtro = signal('Todos');

  serviciosFiltrados() {
    return this.filtro() === 'Todos'
      ? this.servicios
      : this.servicios.filter((s) => s.category === this.filtro());
  }

  contactar(telefono: string) {
    alert('Puedes comunicarte al ' + telefono);
  }
}
