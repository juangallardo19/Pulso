import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { aplicarTema, temaOscuroElegido } from './models/settings.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    // Al abrir la app se aplica el tema guardado (o el del sistema)
    aplicarTema(temaOscuroElegido());
  }
}
