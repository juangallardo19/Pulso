import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSwitch } from './toggle-switch';

describe('ToggleSwitch', () => {
  let component: ToggleSwitch;
  let fixture: ComponentFixture<ToggleSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleSwitch],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleSwitch);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('etiqueta', 'Modo oscuro');
    await fixture.whenStable();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('el aria-label es la etiqueta', () => {
    const boton: HTMLElement = fixture.nativeElement.querySelector('.toggle');
    expect(boton.getAttribute('aria-label')).toBe('Modo oscuro');
  });

  it('agrega la clase on cuando on es true', async () => {
    fixture.componentRef.setInput('on', true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.toggle.on')).not.toBeNull();
  });

  it('al hacer clic estando apagado emite true', () => {
    const espia = vi.spyOn(component.cambiar, 'emit');
    fixture.nativeElement.querySelector('.toggle').click();
    expect(espia).toHaveBeenCalledWith(true);
  });

  it('al hacer clic estando encendido emite false', async () => {
    fixture.componentRef.setInput('on', true);
    await fixture.whenStable();
    const espia = vi.spyOn(component.cambiar, 'emit');
    fixture.nativeElement.querySelector('.toggle').click();
    expect(espia).toHaveBeenCalledWith(false);
  });
});
