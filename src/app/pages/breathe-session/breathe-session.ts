import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreathExercise, TECNICAS } from '../../models/breath-exercise.model';

@Component({
  selector: 'app-breathe-session',
  imports: [CommonModule, RouterLink],
  templateUrl: './breathe-session.html',
  styleUrl: './breathe-session.scss',
})
export class BreatheSession implements OnDestroy {
  // Lo guarda la página Respira al tocar "Comenzar"
  sesion: { name: string; minutes: number } = JSON.parse(
    localStorage.getItem('pulso-respiracion') ?? 'null',
  ) ?? { name: TECNICAS[0].name, minutes: 1 };

  tecnica: BreathExercise = TECNICAS.find((t) => t.name === this.sesion.name) ?? TECNICAS[0];
  totalSegundos = this.sesion.minutes * 60;
  private duracionCiclo = this.tecnica.pasos.reduce((suma, p) => suma + p.segundos, 0);

  transcurrido = signal(0); // segundos que lleva la sesión
  pausado = signal(false);

  // El círculo empieza pequeño y un instante después arranca la primera inhalación,
  // así también se ve crecer la primera vez
  iniciado = signal(false);
  private arranque = setTimeout(() => this.iniciado.set(true), 50);

  // Cada segundo avanza la sesión (si no está en pausa ni terminada)
  private reloj = setInterval(() => this.avanzar(), 1000);

  avanzar() {
    if (!this.pausado() && !this.terminado()) {
      this.transcurrido.update((t) => t + 1);
    }
  }

  terminado() {
    return this.transcurrido() >= this.totalSegundos;
  }

  // Posición de la fase actual dentro del ciclo (0 = Inhala, ...)
  indicePaso() {
    let resto = this.transcurrido() % this.duracionCiclo;
    for (let i = 0; i < this.tecnica.pasos.length; i++) {
      if (resto < this.tecnica.pasos[i].segundos) {
        return i;
      }
      resto -= this.tecnica.pasos[i].segundos;
    }
    return 0;
  }

  pasoActual() {
    return this.tecnica.pasos[this.indicePaso()];
  }

  // Segundos que faltan para cambiar de fase (cuenta regresiva dentro del círculo)
  segundosDelPaso() {
    let resto = this.transcurrido() % this.duracionCiclo;
    for (const paso of this.tecnica.pasos) {
      if (resto < paso.segundos) {
        return paso.segundos - resto;
      }
      resto -= paso.segundos;
    }
    return 0;
  }

  // Tiempo que falta de la sesión, como 2:05
  tiempoRestante() {
    const faltan = Math.max(0, this.totalSegundos - this.transcurrido());
    const segundos = faltan % 60;
    return Math.floor(faltan / 60) + ':' + (segundos < 10 ? '0' : '') + segundos;
  }

  // Tamaño del círculo: crece al inhalar, se encoge al exhalar y se queda quieto al sostener
  escala() {
    if (!this.iniciado() || this.terminado()) {
      return 0.7;
    }
    const indice = this.indicePaso();
    const nombre = this.tecnica.pasos[indice].nombre;
    if (nombre === 'Inhala') return 1;
    if (nombre === 'Exhala') return 0.7;
    const anterior =
      this.tecnica.pasos[(indice - 1 + this.tecnica.pasos.length) % this.tecnica.pasos.length];
    return anterior.nombre === 'Inhala' ? 1 : 0.7;
  }

  alternarPausa() {
    this.pausado.update((p) => !p);
  }

  reiniciar() {
    this.transcurrido.set(0);
    this.pausado.set(false);
  }

  // Al salir de la página se detiene el reloj
  ngOnDestroy() {
    clearInterval(this.reloj);
    clearTimeout(this.arranque);
  }
}
