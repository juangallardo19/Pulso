import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Onboarding } from './onboarding';

describe('Onboarding', () => {
  let component: Onboarding;
  let fixture: ComponentFixture<Onboarding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Onboarding],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Onboarding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('el link Omitir lleva a /registro', () => {
    const omitir: HTMLAnchorElement = fixture.nativeElement.querySelector('.skip');
    expect(omitir.textContent).toContain('Omitir');
    expect(omitir.getAttribute('href')).toBe('/registro');
  });

  it('hay un link a /login', () => {
    expect(fixture.nativeElement.querySelector('a[href="/login"]')).not.toBeNull();
  });
});
