import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { ToggleSwitch } from '../../domain/settings/toggle-switch/toggle-switch';
import { User } from '../../models/user.model';
import { Goals, METAS_POR_DEFECTO } from '../../models/goals.model';
import { AJUSTES_POR_DEFECTO, Settings } from '../../models/settings.model';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, NavBar, ToggleSwitch],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  usuario: User = JSON.parse(localStorage.getItem('pulso-user') ?? 'null') ?? {
    name: 'Estudiante',
    email: '',
  };

  metas: Goals = {
    ...METAS_POR_DEFECTO,
    ...JSON.parse(localStorage.getItem('pulso-goals') ?? '{}'),
  };

  ajustes = signal<Settings>({
    ...AJUSTES_POR_DEFECTO,
    ...JSON.parse(localStorage.getItem('pulso-ajustes') ?? '{}'),
  });

  // Solo se guarda la preferencia: aplicar el tema a toda la app
  // requeriría tocar app.html y styles.scss, que están congelados.
  cambiarModoOscuro(valor: boolean) {
    this.ajustes.update((a) => ({ ...a, darkMode: valor }));
    localStorage.setItem('pulso-ajustes', JSON.stringify(this.ajustes()));
  }

  cerrarSesion() {
    localStorage.removeItem('pulso-user');
  }
}
