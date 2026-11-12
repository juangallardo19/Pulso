import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DayCell } from './day-cell';

describe('DayCell', () => {
  let component: DayCell;
  let fixture: ComponentFixture<DayCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayCell],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();

    fixture = TestBed.createComponent(DayCell);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('day', { number: 5, mood: 4, date: '2026-11-05' });
    await fixture.whenStable();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('con mood: 0 la imagen está oculta y se ve el número', async () => {
    fixture.componentRef.setInput('day', { number: 12, mood: 0, date: '2026-11-12' });
    await fixture.whenStable();
    const html: HTMLElement = fixture.nativeElement;
    expect(html.querySelector('img')?.classList.contains('oculto')).toBe(true);
    expect(html.querySelector('.num')?.classList.contains('oculto')).toBe(false);
    expect(html.textContent).toContain('12');
  });

  it('con mood: 4 la imagen es moods/4.svg', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toBe('moods/4.svg');
  });

  it('con isToday tiene la clase today', async () => {
    fixture.componentRef.setInput('day', { number: 5, mood: 4, isToday: true, date: '2026-11-05' });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.cell.today')).not.toBeNull();
  });

  it('al tocar la celda emite el Day', () => {
    const espia = vi.spyOn(component.elegir, 'emit');
    (fixture.nativeElement.querySelector('a.cell') as HTMLElement).click();
    expect(espia).toHaveBeenCalledWith({ number: 5, mood: 4, date: '2026-11-05' });
  });
});
