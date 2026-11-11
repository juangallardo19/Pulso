import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCard } from './service-card';

describe('ServiceCard', () => {
  let component: ServiceCard;
  let fixture: ComponentFixture<ServiceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('service', {
      name: 'Psicología',
      category: 'Psicología',
      description: 'Orientación individual y grupal',
      place: 'Bloque B, piso 2',
      hours: 'L–V · 8:00–17:00',
      phone: '601 555 0101',
      icon: 'i-mind c-primary',
      bubble: 'bg-lav',
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
