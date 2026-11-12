import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Goals as Metas } from '../../models/goals.model';

@Component({
  selector: 'app-goals',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './goals.html',
  styleUrl: './goals.scss',
})
export class Goals {
  private fb = inject(FormBuilder);

  // Si ya había metas guardadas se están editando (se llega desde el perfil).
  // Si no, es el paso 2 del registro y cada meta empieza sin elegir.
  private guardadas: Metas | null = JSON.parse(localStorage.getItem('pulso-goals') ?? 'null');
  editando = this.guardadas !== null;

  goalsForm = this.fb.group({
    sleepHours: [this.guardadas?.sleepHours ?? null, Validators.required],
    waterGlasses: [this.guardadas?.waterGlasses ?? null, Validators.required],
    exerciseMinutes: [this.guardadas?.exerciseMinutes ?? null, Validators.required],
  });

  // A dónde lleva el botón: al perfil si se estaba editando, al inicio si es el registro
  destino() {
    return this.editando ? '/perfil' : '/inicio';
  }

  guardarMetas() {
    if (this.goalsForm.invalid) {
      return;
    }
    const metas: Metas = {
      sleepHours: Number(this.goalsForm.value.sleepHours),
      waterGlasses: Number(this.goalsForm.value.waterGlasses),
      exerciseMinutes: Number(this.goalsForm.value.exerciseMinutes),
    };
    localStorage.setItem('pulso-goals', JSON.stringify(metas));
  }
}
