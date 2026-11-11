import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { ToggleSwitch } from '../../domain/settings/toggle-switch/toggle-switch';
import { AJUSTES_POR_DEFECTO, Settings } from '../../models/settings.model';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink, NavBar, ToggleSwitch],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
})
export class Privacy {
  ajustes = signal<Settings>({
    ...AJUSTES_POR_DEFECTO,
    ...JSON.parse(localStorage.getItem('pulso-ajustes') ?? '{}'),
  });

  eliminado = signal(false);

  cambiarCompartir(valor: boolean) {
    this.ajustes.update((a) => ({ ...a, shareAnonymousData: valor }));
    this.guardarAjustes();
  }

  cambiarConsejos(valor: boolean) {
    this.ajustes.update((a) => ({ ...a, showInsights: valor }));
    this.guardarAjustes();
  }

  private guardarAjustes() {
    localStorage.setItem('pulso-ajustes', JSON.stringify(this.ajustes()));
  }

  eliminarDatos() {
    if (confirm('¿Seguro? Se borrarán todos tus registros. Esta acción no se puede deshacer.')) {
      [
        'pulso-checkin-hoy',
        'pulso-historial',
        'pulso-recordatorios',
        'pulso-dia-seleccionado',
        'pulso-goals',
        'pulso-ajustes',
        'pulso-respiracion',
      ].forEach((llave) => localStorage.removeItem(llave));
      this.ajustes.set({ ...AJUSTES_POR_DEFECTO });
      this.eliminado.set(true);
    }
  }
}
