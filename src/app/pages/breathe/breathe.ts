import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-breathe',
  imports: [RouterLink, NavBar],
  templateUrl: './breathe.html',
  styleUrl: './breathe.scss',
})
export class Breathe {}
