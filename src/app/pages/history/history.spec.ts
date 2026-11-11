import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { History } from './history';
import { CheckinEntry, CHECKIN_VACIO } from '../../models/checkin.model';

// Fechas del mes actual para que siempre caigan en el calendario
const hoy = new Date();
const fechaDelMes = (n: number) =>
  new Date(hoy.getFullYear(), hoy.getMonth(), n).toLocaleDateString('en-CA');

const historialDePrueba: CheckinEntry[] = [
  { ...CHECKIN_VACIO, date: fechaDelMes(1), mood: 3 },
  { ...CHECKIN_VACIO, date: fechaDelMes(2), mood: 5 },
  { ...CHECKIN_VACIO, date: fechaDelMes(3), mood: 2 },
];

describe('History', () => {
  let component: History;
  let fixture: ComponentFixture<History>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [History],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(History);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('dias tiene tantos elementos como días del mes', async () => {
    await crear();
    const totalDelMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    expect(component.dias.length).toBe(totalDelMes);
  });

  it('un día guardado tiene su mood y uno sin guardar tiene mood 0', async () => {
    localStorage.setItem('pulso-historial', JSON.stringify(historialDePrueba));
    await crear();
    expect(component.dias[1].mood).toBe(5);
    expect(component.dias[9].mood).toBe(0);
  });

  it('elegirDia() guarda la fecha en pulso-dia-seleccionado', async () => {
    await crear();
    component.elegirDia(component.dias[0]);
    expect(localStorage.getItem('pulso-dia-seleccionado')).toBe(fechaDelMes(1));
  });

  it('sin historial se ve el mensaje de primer check-in', async () => {
    await crear();
    const mensaje: HTMLElement = fixture.nativeElement.querySelector('.empty');
    expect(mensaje.classList.contains('oculto')).toBe(false);
    expect(mensaje.textContent).toContain('Aún no tienes registros');
  });

  it('con historial el mensaje está oculto', async () => {
    localStorage.setItem('pulso-historial', JSON.stringify(historialDePrueba));
    await crear();
    expect(fixture.nativeElement.querySelector('.empty').classList.contains('oculto')).toBe(true);
  });
});
