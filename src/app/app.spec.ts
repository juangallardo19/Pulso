import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('se crea', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('tiene un router-outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
  });

  it('al abrir la app aplica el tema oscuro guardado', () => {
    localStorage.setItem('pulso-ajustes', JSON.stringify({ darkMode: true }));
    TestBed.createComponent(App);
    expect(document.documentElement.classList.contains('tema-oscuro')).toBe(true);
    localStorage.clear();
    document.documentElement.classList.remove('tema-oscuro');
  });

  it('con el tema claro guardado no pone el oscuro', () => {
    localStorage.setItem('pulso-ajustes', JSON.stringify({ darkMode: false }));
    TestBed.createComponent(App);
    expect(document.documentElement.classList.contains('tema-oscuro')).toBe(false);
    localStorage.clear();
  });
});
