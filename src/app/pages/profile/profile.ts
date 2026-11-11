import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { User } from '../../models/user.model';
import { Goals, METAS_POR_DEFECTO } from '../../models/goals.model';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, NavBar],
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
}
