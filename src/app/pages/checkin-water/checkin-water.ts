import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stepper } from '../../domain/checkin/stepper/stepper';

@Component({
  selector: 'app-checkin-water',
  imports: [RouterLink, Stepper],
  templateUrl: './checkin-water.html',
  styleUrl: './checkin-water.scss',
})
export class CheckinWater {}
