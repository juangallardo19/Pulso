import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { ChipOption } from '../../domain/checkin/chip-option/chip-option';
import { BreathExercise } from '../../models/breath-exercise.model';

@Component({
  selector: 'app-breathe',
  imports: [CommonModule, RouterLink, NavBar, ChipOption],
  templateUrl: './breathe.html',
  styleUrl: './breathe.scss',
})
export class Breathe {
  tecnicas: BreathExercise[] = [
    {
      name: 'Respiración 4-7-8',
      description: 'Ideal antes de dormir o de un parcial.',
      phases: ['4 inhala', '7 sostén', '8 exhala'],
      color: 'primary',
      tint: 'bg-lav',
    },
    {
      name: 'Respiración en caja',
      description: 'Para recuperar el foco con calma.',
      phases: ['4', '4', '4', '4'],
      color: 'secondary',
      tint: 'bg-mint',
    },
  ];

  seleccionada = signal(0);

  duraciones = ['1 min', '3 min', '5 min'];
  duracion = signal('1 min');

  comenzar() {
    localStorage.setItem(
      'pulso-respiracion',
      JSON.stringify({
        name: this.tecnicas[this.seleccionada()].name,
        minutes: parseInt(this.duracion()),
      }),
    );
  }
}
