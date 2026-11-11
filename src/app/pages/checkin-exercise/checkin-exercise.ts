import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stepper } from '../../domain/checkin/stepper/stepper';

@Component({
  selector: 'app-checkin-exercise',
  imports: [RouterLink, Stepper],
  templateUrl: './checkin-exercise.html',
  styleUrl: './checkin-exercise.scss',
})
export class CheckinExercise {}
