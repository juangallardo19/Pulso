import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Reminders } from './reminders';

describe('Reminders', () => {
  let component: Reminders;
  let fixture: ComponentFixture<Reminders>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Reminders],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Reminders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('sin datos muestra los 4 recordatorios de ejemplo', () => {
    expect(component.recordatorios().length).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('app-reminder-card').length).toBe(4);
  });

  it('alternar(id) cambia isActive y lo guarda', () => {
    component.alternar(3);
    expect(component.recordatorios().find((r) => r.id === 3)?.isActive).toBe(true);
    const guardados = JSON.parse(localStorage.getItem('pulso-recordatorios') ?? '[]');
    expect(guardados.find((r: { id: number }) => r.id === 3).isActive).toBe(true);
  });

  it('eliminar(id) deja 3 recordatorios', () => {
    component.eliminar(1);
    expect(component.recordatorios().length).toBe(3);
    expect(JSON.parse(localStorage.getItem('pulso-recordatorios') ?? '[]').length).toBe(3);
  });

  it('agregar() con el formulario inválido no agrega', () => {
    component.nuevoForm.setValue({ title: 'ab', time: '' });
    component.agregar();
    expect(component.recordatorios().length).toBe(4);
  });

  it('agregar() con el formulario válido agrega y oculta el formulario', () => {
    component.formularioVisible.set(true);
    component.nuevoForm.setValue({ title: 'Estirar la espalda', time: '16:00' });
    component.agregar();
    expect(component.recordatorios().length).toBe(5);
    expect(component.recordatorios()[4].title).toBe('Estirar la espalda');
    expect(component.formularioVisible()).toBe(false);
  });

  it('lee los recordatorios guardados al crearse', () => {
    component.eliminar(1);
    const otra = TestBed.createComponent(Reminders);
    expect(otra.componentInstance.recordatorios().length).toBe(3);
  });
});
