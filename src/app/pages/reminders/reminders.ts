import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { ReminderCard } from '../../domain/reminders/reminder-card/reminder-card';
import { Reminder, SEMANA } from '../../models/reminder.model';

@Component({
  selector: 'app-reminders',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, NavBar, ReminderCard],
  templateUrl: './reminders.html',
  styleUrl: './reminders.scss',
})
export class Reminders {
  // Empieza vacío: solo se muestran los recordatorios que la persona crea
  recordatorios = signal<Reminder[]>(
    JSON.parse(localStorage.getItem('pulso-recordatorios') ?? '[]'),
  );

  private guardar() {
    localStorage.setItem('pulso-recordatorios', JSON.stringify(this.recordatorios()));
  }

  alternar(id: number) {
    this.recordatorios.update((l) =>
      l.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)),
    );
    this.guardar();
  }

  eliminar(id: number) {
    this.recordatorios.update((l) => l.filter((r) => r.id !== id));
    this.guardar();
  }

  activos() {
    return this.recordatorios().filter((r) => r.isActive).length;
  }

  private fb = inject(FormBuilder);
  nuevoForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    time: ['', Validators.required],
  });
  formularioVisible = signal(false);

  agregar() {
    if (this.nuevoForm.invalid) return;
    const nuevo: Reminder = {
      id: Date.now(),
      title: this.nuevoForm.value.title ?? '',
      time: this.nuevoForm.value.time ?? '',
      icon: 'i-bell',
      iconColor: 'c-primary',
      bubble: 'bg-lav',
      dayColor: 'primary',
      activeDays: [...SEMANA],
      isActive: true,
    };
    this.recordatorios.update((l) => [...l, nuevo]);
    this.guardar();
    this.nuevoForm.reset();
    this.formularioVisible.set(false);
  }
}
