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
  private ejemplo: Reminder[] = [
    {
      id: 1,
      title: 'Check-in diario',
      time: '20:30',
      icon: 'i-check',
      iconColor: 'c-primary',
      bubble: 'bg-lav',
      dayColor: 'primary',
      activeDays: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
      isActive: true,
    },
    {
      id: 2,
      title: 'Tomar agua',
      time: '10:00',
      icon: 'i-droplet',
      iconColor: 'c-secondary',
      bubble: 'bg-mint',
      dayColor: 'secondary',
      activeDays: ['L', 'M', 'X', 'J', 'V'],
      isActive: true,
    },
    {
      id: 3,
      title: 'Hora de dormir',
      time: '23:00',
      icon: 'i-moon',
      iconColor: 'c-sleep',
      bubble: 'bg-blue',
      dayColor: 'sleep',
      activeDays: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
      isActive: false,
    },
    {
      id: 4,
      title: 'Respirar',
      time: '15:00',
      icon: 'i-wind',
      iconColor: 'c-primary',
      bubble: 'bg-lav',
      dayColor: 'primary',
      activeDays: ['L', 'X', 'V'],
      isActive: true,
    },
  ];

  recordatorios = signal<Reminder[]>(
    JSON.parse(localStorage.getItem('pulso-recordatorios') ?? 'null') ?? this.ejemplo,
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
