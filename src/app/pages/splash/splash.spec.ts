import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Splash } from './splash';

describe('Splash', () => {
  let component: Splash;
  let fixture: ComponentFixture<Splash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Splash],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Splash);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('tiene un link a /onboarding', () => {
    expect(fixture.nativeElement.querySelector('a[href="/onboarding"]')).not.toBeNull();
  });

  it('tiene un link a /login', () => {
    expect(fixture.nativeElement.querySelector('a[href="/login"]')).not.toBeNull();
  });
});
