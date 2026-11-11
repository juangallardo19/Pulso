import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stepper } from '../../domain/checkin/stepper/stepper';

@Component({
  selector: 'app-checkin-sleep',
  imports: [RouterLink, Stepper],
  templateUrl: './checkin-sleep.html',
  styleUrl: './checkin-sleep.scss',
})
export class CheckinSleep {}
