import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stepper } from '../../domain/checkin/stepper/stepper';

@Component({
  selector: 'app-checkin-mood',
  imports: [RouterLink, Stepper],
  templateUrl: './checkin-mood.html',
  styleUrl: './checkin-mood.scss',
})
export class CheckinMood {}
