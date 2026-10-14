import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-stats',
  imports: [RouterLink, NavBar],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {}
