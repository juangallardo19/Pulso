import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { aplicarTema, temaOscuroElegido } from './models/settings.model';
import { avisarRecordatorios } from './models/reminder.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnDestroy {
  // Cada 30 segundos revisa si toca algún recordatorio (mientras la app esté abierta)
  private reloj = setInterval(() => avisarRecordatorios(), 30000);

  constructor() {
    // Al abrir la app se aplica el tema guardado (o el del sistema)
    aplicarTema(temaOscuroElegido());
  }

  ngOnDestroy() {
    clearInterval(this.reloj);
  }
}
