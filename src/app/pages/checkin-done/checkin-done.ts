import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CheckinEntry } from '../../models/checkin.model';

@Component({
  selector: 'app-checkin-done',
  imports: [RouterLink],
  templateUrl: './checkin-done.html',
  styleUrl: './checkin-done.scss',
})
export class CheckinDone {
  private historial: CheckinEntry[] = JSON.parse(localStorage.getItem('pulso-historial') ?? '[]');
  racha = this.historial.length;
}
