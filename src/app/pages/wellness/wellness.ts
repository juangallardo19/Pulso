import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-wellness',
  imports: [RouterLink, NavBar],
  templateUrl: './wellness.html',
  styleUrl: './wellness.scss',
})
export class Wellness {}
