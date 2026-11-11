import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breathe-session',
  imports: [CommonModule, RouterLink],
  templateUrl: './breathe-session.html',
  styleUrl: './breathe-session.scss',
})
export class BreatheSession {
  // Lo guarda la página Respira al tocar "Comenzar"
  sesion: { name: string; minutes: number } = JSON.parse(
    localStorage.getItem('pulso-respiracion') ?? 'null',
  ) ?? { name: 'Respiración 4-7-8', minutes: 1 };

  pausado = signal(false);

  alternarPausa() {
    this.pausado.update((p) => !p);
  }
}
