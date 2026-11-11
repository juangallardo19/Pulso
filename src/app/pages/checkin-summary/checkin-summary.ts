import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stepper } from '../../domain/checkin/stepper/stepper';

@Component({
  selector: 'app-checkin-summary',
  imports: [RouterLink, Stepper],
  templateUrl: './checkin-summary.html',
  styleUrl: './checkin-summary.scss',
})
export class CheckinSummary {}
