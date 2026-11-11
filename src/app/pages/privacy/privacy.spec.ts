import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Privacy } from './privacy';

describe('Privacy', () => {
  let component: Privacy;
  let fixture: ComponentFixture<Privacy>;

  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('pulso-historial', JSON.stringify([{ date: '2026-11-10', mood: 4 }]));

    await TestBed.configureTestingModule({
      imports: [Privacy],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Privacy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('muestra dos interruptores de ajustes', () => {
    expect(fixture.nativeElement.querySelectorAll('app-toggle-switch').length).toBe(2);
  });

  it('cambiarCompartir guarda el ajuste en pulso-ajustes', () => {
    component.cambiarCompartir(true);
    const guardado = JSON.parse(localStorage.getItem('pulso-ajustes') ?? '{}');
    expect(guardado.shareAnonymousData).toBe(true);
  });

  it('si confirma, eliminarDatos borra el historial y muestra el aviso', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.eliminarDatos();
    await fixture.whenStable();
    expect(localStorage.getItem('pulso-historial')).toBeNull();
    expect(component.eliminado()).toBe(true);
    expect(fixture.nativeElement.querySelector('.eliminado.oculto')).toBeNull();
  });

  it('si cancela, eliminarDatos no borra nada', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.eliminarDatos();
    expect(localStorage.getItem('pulso-historial')).not.toBeNull();
    expect(component.eliminado()).toBe(false);
  });
});
