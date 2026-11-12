import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MoodOption } from '../../domain/checkin/mood-option/mood-option';
import { Stepper } from '../../domain/checkin/stepper/stepper';
import { CHECKIN_VACIO, CheckinEntry } from '../../models/checkin.model';
import { MOODS } from '../../models/mood.model';

@Component({
  selector: 'app-checkin-mood',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Stepper, MoodOption],
  templateUrl: './checkin-mood.html',
  styleUrl: './checkin-mood.scss',
})
export class CheckinMood {
  moods = MOODS;
  private checkin: CheckinEntry = {
    ...CHECKIN_VACIO,
    ...JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}'),
  };
  seleccionado = signal(this.checkin.mood);
  notaCtrl = new FormControl(this.checkin.note, { nonNullable: true });

  seleccionar(valor: number) {
    this.seleccionado.set(valor);
  }

  // Si se está editando un día que ya está en el historial, se conserva su fecha.
  // Si no, el check-in es de hoy.
  private fechaDelRegistro() {
    const historial: CheckinEntry[] = JSON.parse(localStorage.getItem('pulso-historial') ?? '[]');
    const editando =
      this.checkin.date !== '' && historial.some((d) => d.date === this.checkin.date);
    return editando ? this.checkin.date : new Date().toLocaleDateString('en-CA');
  }

  guardar() {
    const actualizado: CheckinEntry = {
      ...this.checkin,
      date: this.fechaDelRegistro(),
      mood: this.seleccionado(),
      note: this.notaCtrl.value,
    };
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify(actualizado));
  }
}
