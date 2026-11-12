import { calcularRacha, CHECKIN_VACIO } from './checkin.model';

// La fecha "hoy" se fija para que la prueba no dependa del día en que se corre
const hoy = new Date(2026, 10, 11); // 11 de noviembre de 2026
const dia = (fecha: string) => ({ ...CHECKIN_VACIO, date: fecha });

describe('calcularRacha', () => {
  it('sin historial es 0', () => {
    expect(calcularRacha([], hoy)).toBe(0);
  });

  it('cuenta los días seguidos hasta hoy', () => {
    const historial = [dia('2026-11-09'), dia('2026-11-10'), dia('2026-11-11')];
    expect(calcularRacha(historial, hoy)).toBe(3);
  });

  it('si hoy aún no hay check-in, cuenta desde ayer', () => {
    const historial = [dia('2026-11-09'), dia('2026-11-10')];
    expect(calcularRacha(historial, hoy)).toBe(2);
  });

  it('un día sin registro corta la racha', () => {
    const historial = [dia('2026-11-07'), dia('2026-11-08'), dia('2026-11-10'), dia('2026-11-11')];
    expect(calcularRacha(historial, hoy)).toBe(2);
  });

  it('si el último registro es de hace 2 días, la racha es 0', () => {
    expect(calcularRacha([dia('2026-11-09')], hoy)).toBe(0);
  });

  it('funciona aunque el historial esté desordenado', () => {
    const historial = [dia('2026-11-11'), dia('2026-11-09'), dia('2026-11-10')];
    expect(calcularRacha(historial, hoy)).toBe(3);
  });
});
