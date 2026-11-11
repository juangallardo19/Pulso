import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodOption } from './mood-option';

describe('MoodOption', () => {
  let component: MoodOption;
  let fixture: ComponentFixture<MoodOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodOption],
    }).compileComponents();

    fixture = TestBed.createComponent(MoodOption);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mood', { value: 4, label: 'Bien', image: 'moods/4.svg' });
    await fixture.whenStable();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('muestra la etiqueta del ánimo', () => {
    const html: HTMLElement = fixture.nativeElement;
    expect(html.textContent).toContain('Bien');
  });

  it('la imagen usa mood.image', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toBe('moods/4.svg');
  });

  it('emite el valor al hacer clic', () => {
    const espia = vi.spyOn(component.elegir, 'emit');
    fixture.nativeElement.querySelector('a').click();
    expect(espia).toHaveBeenCalledWith(4);
  });

  it('agrega la clase selected cuando selected es true', async () => {
    fixture.componentRef.setInput('selected', true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.selected')).not.toBeNull();
  });
});
