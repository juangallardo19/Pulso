import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CheckinDone } from './checkin-done';

// Pruebas de clic: verifican que cada botón del HTML esté conectado a su función
describe('CheckinDone · botones', () => {
  let component: CheckinDone;
  let fixture: ComponentFixture<CheckinDone>;
  let html: HTMLElement;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinDone],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinDone);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
    await fixture.whenStable();
  }

  function clic(selector: string) {
    (html.querySelector(selector) as HTMLElement).click();
  }

  function hoy() {
    return JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}');
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('"Ir al inicio" lleva a /inicio', async () => {
    await crear();
    expect(html.querySelector('.btn-primary')!.getAttribute('href')).toBe('/inicio');
  });
});
