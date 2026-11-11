import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavBar } from './nav-bar';

describe('NavBar', () => {
  let component: NavBar;
  let fixture: ComponentFixture<NavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('la barra lateral tiene 7 links', () => {
    expect(fixture.nativeElement.querySelectorAll('.sidebar .side-link').length).toBe(7);
  });

  it('la barra inferior tiene 5 links', () => {
    expect(fixture.nativeElement.querySelectorAll('.bottom-nav a').length).toBe(5);
  });

  it('hay un link a /perfil', () => {
    expect(fixture.nativeElement.querySelector('a[href="/perfil"]')).not.toBeNull();
  });
});
