import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-reminders',
  imports: [RouterLink, NavBar],
  templateUrl: './reminders.html',
  styleUrl: './reminders.scss',
})
export class Reminders {}
