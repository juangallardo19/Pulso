import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipOption } from './chip-option';

describe('ChipOption', () => {
  let component: ChipOption;
  let fixture: ComponentFixture<ChipOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipOption],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipOption);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Caminar');
    await fixture.whenStable();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('muestra el label', () => {
    const html: HTMLElement = fixture.nativeElement;
    expect(html.textContent).toContain('Caminar');
  });

  it('emite el label al hacer clic', () => {
    const espia = vi.spyOn(component.alternar, 'emit');
    fixture.nativeElement.querySelector('.chip').click();
    expect(espia).toHaveBeenCalledWith('Caminar');
  });

  it('agrega la clase active cuando active es true', async () => {
    fixture.componentRef.setInput('active', true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.chip.active')).not.toBeNull();
  });
});
