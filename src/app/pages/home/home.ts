import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NavBar],
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
}
