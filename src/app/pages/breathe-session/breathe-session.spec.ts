import { BreatheSession } from './breathe-session';
import { guardar, montar, Pantalla } from '../../../testing/dom';

// Avanza el reloj de la sesión N segundos y actualiza la pantalla
async function esperar(p: Pantalla<BreatheSession>, segundos: number) {
  vi.advanceTimersByTime(segundos * 1000);
  await p.actualizar();
}

// Sesión de respiración: el reloj se controla con temporizadores falsos y todo se lee del HTML
describe('BreatheSession', () => {
  beforeEach(() => {
    localStorage.clear();
    // Solo se falsea el reloj de la sesión (setInterval); el resto de Angular usa el tiempo real
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('sin nada elegido usa la 4-7-8 de 1 minuto', async () => {
    const p = await montar(BreatheSession);
    expect(p.texto('.title h3')).toBe('Respiración 4-7-8');
    expect(p.texto('.restante')).toBe('1:00 restantes');
    expect(p.todos('.step').map((s) => s.textContent?.replace(/\s+/g, ''))).toEqual([
      '4Inhala',
      '7Sostén',
      '8Exhala',
    ]);
  });

  it('con "Respiración en caja" muestra sus 4 pasos de 4 segundos', async () => {
    guardar('pulso-respiracion', { name: 'Respiración en caja', minutes: 3 });
    const p = await montar(BreatheSession);
    expect(p.texto('.title h3')).toBe('Respiración en caja');
    expect(p.texto('.restante')).toBe('3:00 restantes');
    expect(p.todos('.step').map((s) => s.textContent?.replace(/\s+/g, ''))).toEqual([
      '4Inhala',
      '4Sostén',
      '4Exhala',
      '4Sostén',
    ]);
  });

  it('empieza inhalando y avanza de fase con el tiempo (4-7-8)', async () => {
    const p = await montar(BreatheSession);
    expect(p.texto('.word')).toBe('Inhala');
    expect(p.texto('.cuenta')).toBe('4');
    expect(p.tieneClase('.step', 'activo', 0)).toBe(true);

    await esperar(p, 4);
    expect(p.texto('.word')).toBe('Sostén');
    expect(p.texto('.cuenta')).toBe('7');
    expect(p.tieneClase('.step', 'activo', 1)).toBe(true);

    await esperar(p, 7);
    expect(p.texto('.word')).toBe('Exhala');
    expect(p.tieneClase('.step', 'activo', 2)).toBe(true);

    await esperar(p, 8);
    expect(p.texto('.word')).toBe('Inhala'); // vuelve a empezar el ciclo
    expect(p.texto('.restante')).toBe('0:41 restantes');
  });

  it('en caja, el segundo "Sostén" viene después de exhalar', async () => {
    guardar('pulso-respiracion', { name: 'Respiración en caja', minutes: 1 });
    const p = await montar(BreatheSession);
    await esperar(p, 12);
    expect(p.texto('.word')).toBe('Sostén');
    expect(p.tieneClase('.step', 'activo', 3)).toBe(true);
  });

  it('el círculo crece al inhalar y se encoge al exhalar', async () => {
    const p = await montar(BreatheSession);
    expect(p.el('.core').style.transform).toBe('scale(0.7)'); // empieza pequeño
    await new Promise((listo) => setTimeout(listo, 80)); // arranque de la primera inhalación
    await esperar(p, 1);
    expect(p.el('.core').style.transform).toBe('scale(1)');
    await esperar(p, 10);
    expect(p.el('.core').style.transform).toBe('scale(0.7)');
  });

  it('el botón de pausa detiene el tiempo y al tocarlo otra vez sigue', async () => {
    const p = await montar(BreatheSession);
    await esperar(p, 2);
    await p.clic('.pause');
    expect(p.atributo('.pause', 'aria-label')).toBe('Reanudar');
    expect(p.tieneClase('main', 'pausado')).toBe(true);
    await esperar(p, 10);
    expect(p.texto('.restante')).toBe('0:58 restantes');

    await p.clic('.pause');
    expect(p.atributo('.pause', 'aria-label')).toBe('Pausar');
    await esperar(p, 3);
    expect(p.texto('.restante')).toBe('0:55 restantes');
  });

  it('al acabar el tiempo muestra "Sesión completa" y oculta la pausa', async () => {
    const p = await montar(BreatheSession);
    expect(p.visible('.fin')).toBe(false);
    await esperar(p, 60);
    expect(p.visible('.fin')).toBe(true);
    expect(p.texto('.word')).toBe('¡Listo!');
    expect(p.texto('.restante')).toBe('1 min completados');
    expect(p.visible('.pause')).toBe(false);
  });

  it('"Repetir" vuelve a empezar la sesión', async () => {
    const p = await montar(BreatheSession);
    await esperar(p, 60);
    await p.clic('.fin .btn-secondary');
    expect(p.visible('.fin')).toBe(false);
    expect(p.texto('.restante')).toBe('1:00 restantes');
    expect(p.texto('.word')).toBe('Inhala');
  });

  it('"Volver a Respira" y la X llevan a /respira', async () => {
    const p = await montar(BreatheSession);
    expect(p.href('[aria-label="Cerrar"]')).toBe('/respira');
    expect(p.href('.fin .btn-primary')).toBe('/respira');
  });
});
