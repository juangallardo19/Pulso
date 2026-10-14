import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NavBar],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
