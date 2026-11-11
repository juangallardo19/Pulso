import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Goals as Metas, METAS_POR_DEFECTO } from '../../models/goals.model';

@Component({
  selector: 'app-goals',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './goals.html',
  styleUrl: './goals.scss',
})
export class Goals {
  private fb = inject(FormBuilder);

  // Si ya había metas guardadas, el formulario arranca con ellas
  private guardadas: Metas = {
    ...METAS_POR_DEFECTO,
    ...JSON.parse(localStorage.getItem('pulso-goals') ?? '{}'),
  };

  goalsForm = this.fb.group({
    sleepHours: [this.guardadas.sleepHours],
    waterGlasses: [this.guardadas.waterGlasses],
    exerciseMinutes: [this.guardadas.exerciseMinutes],
  });

  guardarMetas() {
    const metas: Metas = {
      sleepHours: Number(this.goalsForm.value.sleepHours),
      waterGlasses: Number(this.goalsForm.value.waterGlasses),
      exerciseMinutes: Number(this.goalsForm.value.exerciseMinutes),
    };
    localStorage.setItem('pulso-goals', JSON.stringify(metas));
  }
}
