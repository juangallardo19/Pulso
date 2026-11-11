import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Wellness } from './wellness';

describe('Wellness', () => {
  let component: Wellness;
  let fixture: ComponentFixture<Wellness>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Wellness],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Wellness);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('con Todos muestra las 3 tarjetas de servicio', () => {
    const tarjetas = fixture.nativeElement.querySelectorAll('app-service-card');
    expect(tarjetas.length).toBe(3);
  });

  it('al filtrar por Enfermería queda 1 tarjeta', async () => {
    component.filtro.set('Enfermería');
    await fixture.whenStable();
    const tarjetas = fixture.nativeElement.querySelectorAll('app-service-card');
    expect(tarjetas.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Primeros auxilios y consulta');
  });

  it('contactar llama a alert con el teléfono', () => {
    const espia = vi.spyOn(window, 'alert').mockImplementation(() => {});
    component.contactar('106');
    expect(espia).toHaveBeenCalledWith('Puedes comunicarte al 106');
  });
});
