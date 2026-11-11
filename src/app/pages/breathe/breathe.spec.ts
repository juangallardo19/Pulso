import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Breathe } from './breathe';

describe('Breathe', () => {
  let component: Breathe;
  let fixture: ComponentFixture<Breathe>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Breathe],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Breathe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('muestra las 2 técnicas', () => {
    expect(fixture.nativeElement.querySelectorAll('.technique').length).toBe(2);
  });

  it('al tocar la segunda técnica se marca como seleccionada', async () => {
    const tarjetas = fixture.nativeElement.querySelectorAll('.technique');
    tarjetas[1].click();
    await fixture.whenStable();
    expect(component.seleccionada()).toBe(1);
    expect(tarjetas[1].classList).toContain('selected');
    expect(tarjetas[0].classList).not.toContain('selected');
  });

  it('marca como activa la duración elegida', async () => {
    component.duracion.set('3 min');
    fixture.detectChanges();
    await fixture.whenStable();
    const activa = fixture.nativeElement.querySelector('.chip.active');
    expect(activa.textContent).toContain('3 min');
  });

  it('comenzar guarda la técnica y los minutos elegidos', () => {
    component.seleccionada.set(1);
    component.duracion.set('3 min');
    component.comenzar();
    const guardado = JSON.parse(localStorage.getItem('pulso-respiracion') ?? '{}');
    expect(guardado).toEqual({ name: 'Respiración en caja', minutes: 3 });
  });
});
