import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, NavBar],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {}
