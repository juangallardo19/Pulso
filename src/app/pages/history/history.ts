import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { Day } from '../../models/day.model';

@Component({
  selector: 'app-history',
  imports: [CommonModule, RouterLink, NavBar],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History {
  // Octubre 2026 empieza en jueves: 3 espacios vacíos antes del día 1
  emptyDays = [1, 2, 3];

  // Días que ya tienen registro de ánimo
  days: Day[] = [
    { number: 1, mood: 3 },
    { number: 2, mood: 4 },
    { number: 3, mood: 4 },
    { number: 4, mood: 2 },
    { number: 5, mood: 3 },
    { number: 6, mood: 5 },
    { number: 7, mood: 4, isToday: true },
  ];

  // Días que aún no llegan
  futureDays = [
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];
}
