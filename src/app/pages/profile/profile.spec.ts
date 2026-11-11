import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Profile } from './profile';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('muestra el nombre y el correo guardados', async () => {
    localStorage.setItem(
      'pulso-user',
      JSON.stringify({ name: 'Laura Gómez', email: 'laura@uni.edu.co' }),
    );
    await crear();
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('Laura Gómez');
    expect(texto).toContain('laura@uni.edu.co');
  });

  it('sin usuario guardado dice Estudiante', async () => {
    await crear();
    expect(fixture.nativeElement.textContent).toContain('Estudiante');
  });

  it('muestra las metas guardadas', async () => {
    localStorage.setItem(
      'pulso-goals',
      JSON.stringify({ sleepHours: 7, waterGlasses: 6, exerciseMinutes: 45 }),
    );
    await crear();
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('7 h');
    expect(texto).toContain('6 vasos');
    expect(texto).toContain('45 min');
  });

  it('cambiarModoOscuro(true) guarda darkMode en pulso-ajustes', async () => {
    await crear();
    component.cambiarModoOscuro(true);
    expect(component.ajustes().darkMode).toBe(true);
    const guardado = JSON.parse(localStorage.getItem('pulso-ajustes') ?? '{}');
    expect(guardado.darkMode).toBe(true);
  });

  it('cerrarSesion borra pulso-user', async () => {
    localStorage.setItem('pulso-user', JSON.stringify({ name: 'Laura', email: 'l@u.co' }));
    await crear();
    component.cerrarSesion();
    expect(localStorage.getItem('pulso-user')).toBeNull();
  });
});
