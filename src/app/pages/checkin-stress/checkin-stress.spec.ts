import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckinStress } from './checkin-stress';

describe('CheckinStress', () => {
  let component: CheckinStress;
  let fixture: ComponentFixture<CheckinStress>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [CheckinStress],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinStress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());

  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('claseNivel() da bajo, medio y alto con 2, 5 y 9', async () => {
    await crear();
    component.nivelCtrl.setValue(2);
    expect(component.claseNivel()).toBe('bajo');
    component.nivelCtrl.setValue(5);
    expect(component.claseNivel()).toBe('medio');
    component.nivelCtrl.setValue(9);
    expect(component.claseNivel()).toBe('alto');
  });

  it('guardar() escribe stress y stressCauses', async () => {
    await crear();
    component.nivelCtrl.setValue(8);
    component.alternarCausa('Parcial');
    component.alternarCausa('Dinero');
    component.guardar();
    const hoy = JSON.parse(localStorage.getItem('pulso-checkin-hoy') ?? '{}');
    expect(hoy.stress).toBe(8);
    expect(hoy.stressCauses).toEqual(['Parcial', 'Dinero']);
  });
});
