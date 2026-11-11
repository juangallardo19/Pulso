import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Register } from './register';

const datosValidos = {
  name: 'Laura Gómez',
  email: 'laura@uni.edu.co',
  password: '12345678',
  confirm: '12345678',
  consent: true,
};

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('es válido con todos los datos correctos', () => {
    component.registerForm.setValue(datosValidos);
    expect(component.registerForm.valid).toBe(true);
  });

  it('es inválido si no acepta el aviso de privacidad', () => {
    component.registerForm.setValue({ ...datosValidos, consent: false });
    expect(component.registerForm.valid).toBe(false);
  });

  it('detecta cuando las contraseñas no coinciden', () => {
    component.registerForm.setValue({ ...datosValidos, confirm: '87654321' });
    expect(component.contrasenasCoinciden()).toBe(false);
  });

  it('calcula la fuerza de la contraseña según su largo', () => {
    component.registerForm.get('password')?.setValue('1234');
    expect(component.textoFuerza()).toBe('Débil');
    component.registerForm.get('password')?.setValue('12345678');
    expect(component.textoFuerza()).toBe('Media');
    component.registerForm.get('password')?.setValue('123456789012');
    expect(component.textoFuerza()).toBe('Fuerte');
  });

  it('crearCuenta guarda el nombre y el correo en pulso-user', () => {
    component.registerForm.setValue(datosValidos);
    component.crearCuenta();
    const guardado = JSON.parse(localStorage.getItem('pulso-user') ?? 'null');
    expect(guardado.name).toBe('Laura Gómez');
    expect(guardado.email).toBe('laura@uni.edu.co');
  });

  it('nunca guarda la contraseña', () => {
    component.registerForm.setValue(datosValidos);
    component.crearCuenta();
    const guardado = JSON.parse(localStorage.getItem('pulso-user') ?? 'null');
    expect(guardado.password).toBeUndefined();
    expect(guardado.confirm).toBeUndefined();
  });
});
