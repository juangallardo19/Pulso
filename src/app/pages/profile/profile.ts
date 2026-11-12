import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { ToggleSwitch } from '../../domain/settings/toggle-switch/toggle-switch';
import { User } from '../../models/user.model';
import { Goals, METAS_POR_DEFECTO } from '../../models/goals.model';
import {
  AJUSTES_POR_DEFECTO,
  aplicarTema,
  Settings,
  temaOscuroElegido,
} from '../../models/settings.model';
import { cerrarSesion as cerrarSesionDeCuenta } from '../../models/cuenta.model';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, NavBar, ToggleSwitch],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private guardado: User | null = JSON.parse(localStorage.getItem('pulso-user') ?? 'null');
  // Sin cuenta creada no se inventa un nombre: se muestra "Invitado"
  tieneCuenta = this.guardado !== null;
  usuario: User = this.guardado ?? { name: 'Invitado', email: '' };

  // Las metas solo se muestran si el usuario las guardó en /metas
  tieneMetas = localStorage.getItem('pulso-goals') !== null;
  metas: Goals = {
    ...METAS_POR_DEFECTO,
    ...JSON.parse(localStorage.getItem('pulso-goals') ?? '{}'),
  };

  ajustes = signal<Settings>({
    ...AJUSTES_POR_DEFECTO,
    ...JSON.parse(localStorage.getItem('pulso-ajustes') ?? '{}'),
    darkMode: temaOscuroElegido(),
  });

  // Cambia el tema de toda la app al instante y lo guarda para la próxima vez
  cambiarModoOscuro(valor: boolean) {
    this.ajustes.update((a) => ({ ...a, darkMode: valor }));
    localStorage.setItem('pulso-ajustes', JSON.stringify(this.ajustes()));
    aplicarTema(valor);
  }

  // Guarda los datos en la cuenta y cierra la sesión (la cuenta sigue existiendo)
  cerrarSesion() {
    cerrarSesionDeCuenta();
    this.tieneCuenta = false;
    this.usuario = { name: 'Invitado', email: '' };
  }
}
