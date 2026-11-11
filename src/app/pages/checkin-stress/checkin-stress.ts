import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stepper } from '../../domain/checkin/stepper/stepper';

@Component({
  selector: 'app-checkin-stress',
  imports: [RouterLink, Stepper],
  templateUrl: './checkin-stress.html',
  styleUrl: './checkin-stress.scss',
})
export class CheckinStress {}
