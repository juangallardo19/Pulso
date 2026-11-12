import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { ReminderCard } from '../../domain/reminders/reminder-card/reminder-card';
import {
  NOMBRES_DIAS,
  notificacionesDisponibles,
  pedirPermisoDeAvisos,
  Reminder,
  SEMANA,
} from '../../models/reminder.model';

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

  semana = SEMANA;
  nombresDias = NOMBRES_DIAS;
  diasElegidos = signal<string[]>([]);

  // Tocar un día lo agrega o lo quita del recordatorio
  alternarDia(dia: string) {
    this.diasElegidos.update((dias) =>
      dias.includes(dia) ? dias.filter((d) => d !== dia) : [...dias, dia],
    );
  }

  // Atajos: todos los días o solo de lunes a viernes
  elegirDias(dias: string[]) {
    this.diasElegidos.set([...dias]);
  }

  puedeGuardar() {
    return this.nuevoForm.valid && this.diasElegidos().length > 0;
  }

  // Al tocar cualquier parte del campo de hora se abre el selector del navegador
  abrirSelectorDeHora(campo: HTMLInputElement) {
    campo.focus();
    if (typeof campo.showPicker === 'function') {
      try {
        campo.showPicker();
      } catch {
        // Algunos navegadores solo lo permiten con un clic directo: el campo igual queda enfocado
      }
    }
  }

  // Avisos del navegador: "si" (con permiso), "no" (bloqueados) o "preguntar"
  estadoAvisos() {
    if (!notificacionesDisponibles()) return 'no';
    if (Notification.permission === 'granted') return 'si';
    if (Notification.permission === 'denied') return 'no';
    return 'preguntar';
  }

  agregar() {
    if (!this.puedeGuardar()) return;
    const nuevo: Reminder = {
      id: Date.now(),
      title: this.nuevoForm.value.title ?? '',
      time: this.nuevoForm.value.time ?? '',
      icon: 'i-bell',
      iconColor: 'c-primary',
      bubble: 'bg-lav',
      dayColor: 'primary',
      activeDays: SEMANA.filter((d) => this.diasElegidos().includes(d)),
      isActive: true,
    };
    this.recordatorios.update((l) => [...l, nuevo]);
    this.guardar();
    this.nuevoForm.reset();
    this.diasElegidos.set([]);
    this.formularioVisible.set(false);
    pedirPermisoDeAvisos();
  }
}
