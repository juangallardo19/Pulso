import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldError } from './field-error';

describe('FieldError', () => {
  let component: FieldError;
  let fixture: ComponentFixture<FieldError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldError],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldError);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mensaje', 'Campo requerido');
    await fixture.whenStable();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('muestra el mensaje', () => {
    const html: HTMLElement = fixture.nativeElement;
    expect(html.textContent).toContain('Campo requerido');
  });

  it('por defecto no tiene la clase show', () => {
    expect(fixture.nativeElement.querySelector('.error-text.show')).toBeNull();
  });

  it('agrega la clase show cuando visible es true', async () => {
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.error-text.show')).not.toBeNull();
  });
});
