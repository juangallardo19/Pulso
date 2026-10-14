import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-day-detail',
  imports: [RouterLink, NavBar],
  templateUrl: './day-detail.html',
  styleUrl: './day-detail.scss',
})
export class DayDetail {}
