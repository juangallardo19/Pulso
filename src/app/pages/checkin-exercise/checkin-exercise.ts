import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChipOption } from '../../domain/checkin/chip-option/chip-option';
import { Stepper } from '../../domain/checkin/stepper/stepper';
import { CHECKIN_VACIO, CheckinEntry } from '../../models/checkin.model';

@Component({
  selector: 'app-checkin-exercise',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Stepper, ChipOption],
  templateUrl: './checkin-exercise.html',
  styleUrl: './checkin-exercise.scss',
})
export class CheckinExercise {
  private checkin: CheckinEntry = {
    ...CHECKIN_VACIO,
    ...JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}'),
  };
  minutosCtrl = new FormControl(this.checkin.exerciseMinutes, { nonNullable: true });
  metaMinutos: number =
    JSON.parse(localStorage.getItem('pulso-goals') ?? '{}').exerciseMinutes ?? 30;
  tipos = ['Caminar', 'Correr', 'Gimnasio', 'Deporte', 'Yoga', 'Otro'];
  elegidos = signal<string[]>(this.checkin.exerciseTypes);

  alternarTipo(tipo: string) {
    if (this.elegidos().includes(tipo)) {
      this.elegidos.update((l) => l.filter((t) => t !== tipo));
    } else {
      this.elegidos.update((l) => [...l, tipo]);
    }
  }

  guardar() {
    const actualizado: CheckinEntry = {
      ...this.checkin,
      exerciseMinutes: this.minutosCtrl.value,
      exerciseTypes: this.elegidos(),
    };
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify(actualizado));
  }
}
