import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BreatheSession } from './breathe-session';

describe('BreatheSession', () => {
  let component: BreatheSession;
  let fixture: ComponentFixture<BreatheSession>;

  async function crear() {
    await TestBed.configureTestingModule({
      imports: [BreatheSession],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BreatheSession);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('se crea', async () => {
    await crear();
    expect(component).toBeTruthy();
  });

  it('muestra la técnica y los minutos guardados', async () => {
    localStorage.setItem(
      'pulso-respiracion',
      JSON.stringify({ name: 'Respiración en caja', minutes: 3 }),
    );
    await crear();
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('Respiración en caja');
    expect(texto).toContain('3 min');
  });

  it('sin datos guardados usa la 4-7-8 de 1 minuto', async () => {
    await crear();
    expect(component.sesion).toEqual({ name: 'Respiración 4-7-8', minutes: 1 });
  });

  it('al pausar congela la animación y cambia el botón a Reanudar', async () => {
    await crear();
    fixture.nativeElement.querySelector('.pause').click();
    await fixture.whenStable();
    expect(component.pausado()).toBe(true);
    expect(fixture.nativeElement.querySelector('main.session.pausado')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.pause').getAttribute('aria-label')).toBe(
      'Reanudar',
    );
    expect(fixture.nativeElement.querySelector('.pause .i-play')).not.toBeNull();
  });

  it('al tocar otra vez se reanuda', async () => {
    await crear();
    component.alternarPausa();
    component.alternarPausa();
    expect(component.pausado()).toBe(false);
  });
});
