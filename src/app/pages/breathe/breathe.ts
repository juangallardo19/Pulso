import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { ChipOption } from '../../domain/checkin/chip-option/chip-option';
import { BreathExercise, TECNICAS } from '../../models/breath-exercise.model';

@Component({
  selector: 'app-breathe',
  imports: [CommonModule, RouterLink, NavBar, ChipOption],
  templateUrl: './breathe.html',
  styleUrl: './breathe.scss',
})
export class Breathe {
  tecnicas: BreathExercise[] = TECNICAS;

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
