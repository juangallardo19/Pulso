import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { calcularRacha, CHECKIN_VACIO, CheckinEntry } from '../../models/checkin.model';
import { Goals, METAS_POR_DEFECTO } from '../../models/goals.model';
import { MOODS } from '../../models/mood.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, NavBar],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  usuario: User = JSON.parse(localStorage.getItem('pulso-user') ?? 'null') ?? {
    name: 'Estudiante',
    email: '',
  };
  nombre = this.usuario.name.split(' ')[0];
  private fechaLarga = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  fecha = this.fechaLarga.charAt(0).toUpperCase() + this.fechaLarga.slice(1);
  moods = MOODS;
  historial: CheckinEntry[] = JSON.parse(localStorage.getItem('pulso-historial') ?? '[]');
  private fechaHoy = new Date().toLocaleDateString('en-CA');
  // "Tu día" muestra solo datos de hoy: el check-in en curso (si es de hoy)
  // o el registro de hoy en el historial. Si no hay nada, empieza en cero.
  hoy: CheckinEntry = {
    ...CHECKIN_VACIO,
    ...(this.registroDeHoy() ?? {
      mood: 0,
      sleepStart: '',
      sleepEnd: '',
      exerciseMinutes: 0,
      stress: 0,
    }),
  };
  metas: Goals = {
    ...METAS_POR_DEFECTO,
    ...JSON.parse(localStorage.getItem('pulso-goals') ?? '{}'),
  };
  racha = calcularRacha(this.historial);
  vasos = signal(this.hoy.water);

  private registroDeHoy(): CheckinEntry | null {
    const enCurso = JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? 'null');
    if (enCurso && (!enCurso.date || enCurso.date === this.fechaHoy)) {
      return enCurso;
    }
    return this.historial.find((d) => d.date === this.fechaHoy) ?? null;
  }

  // Tocar una carita empieza el check-in con ese ánimo ya elegido
  elegirAnimo(valor: number) {
    const actual: CheckinEntry = {
      ...CHECKIN_VACIO,
      ...(this.registroDeHoy() ?? {}),
      date: this.fechaHoy,
      mood: valor,
    };
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify(actual));
  }

  // El punto de la campana solo aparece si hay recordatorios activos.
  // Sin recordatorios guardados, la página muestra ejemplos activos.
  hayRecordatorios() {
    const guardados = JSON.parse(localStorage.getItem('pulso-recordatorios') ?? 'null');
    if (guardados === null) {
      return true;
    }
    return guardados.some((r: { isActive: boolean }) => r.isActive);
  }

  saludo() {
    const hora = new Date().getHours();
    if (hora < 12) {
      return 'Buenos días';
    }
    if (hora < 18) {
      return 'Buenas tardes';
    }
    return 'Buenas noches';
  }

  horas() {
    if (!this.hoy.sleepStart || !this.hoy.sleepEnd) {
      return 0;
    }
    const [hi, mi] = this.hoy.sleepStart.split(':').map(Number);
    const [hf, mf] = this.hoy.sleepEnd.split(':').map(Number);
    let minutos = hf * 60 + mf - (hi * 60 + mi);
    if (minutos < 0) {
      minutos += 24 * 60;
    }
    return Math.round((minutos / 60) * 10) / 10;
  }

  progreso() {
    const agua = Math.min(100, (this.vasos() / this.metas.waterGlasses) * 100);
    const ejercicio = Math.min(100, (this.hoy.exerciseMinutes / this.metas.exerciseMinutes) * 100);
    const sueno = Math.min(100, (this.horas() / this.metas.sleepHours) * 100);
    return Math.round((agua + ejercicio + sueno) / 3);
  }

  mostrarAlerta() {
    const ultimos = this.historial.slice(-3);
    return ultimos.length === 3 && ultimos.every((d) => d.mood === 1);
  }

  sumar() {
    this.vasos.update((v) => v + 1);
    this.guardarAgua();
  }

  quitar() {
    this.vasos.update((v) => (v > 0 ? v - 1 : 0));
    this.guardarAgua();
  }

  private guardarAgua() {
    const actual: CheckinEntry = {
      ...CHECKIN_VACIO,
      ...JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}'),
      date: this.fechaHoy,
      water: this.vasos(),
    };
    localStorage.setItem('pulso-checkin-hoy', JSON.stringify(actual));
  }
}
