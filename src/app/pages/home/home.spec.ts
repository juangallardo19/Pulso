import { Home } from './home';
import { CheckinMood } from '../checkin-mood/checkin-mood';
import { CHECKIN_VACIO } from '../../models/checkin.model';
import { guardar, haceDias, leer, montar } from '../../../testing/dom';

const registro = (dias: number, cambios = {}) => ({
  ...CHECKIN_VACIO,
  date: haceDias(dias),
  ...cambios,
});

// Inicio: todo se prueba tocando y leyendo el HTML
describe('Home', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('saluda con el primer nombre de la cuenta', async () => {
    guardar('pulso-user', { name: 'Laura Gómez', email: 'laura@uni.edu.co' });
    const p = await montar(Home);
    expect(p.texto('.page-header h2')).toMatch(
      /^(Buenos días|Buenas tardes|Buenas noches), Laura$/,
    );
    expect(p.texto('.hero-text h3')).toBe('Hola, Laura');
  });

  it('sin cuenta saluda a "Invitado" (no inventa un nombre)', async () => {
    const p = await montar(Home);
    expect(p.texto('.hero-text h3')).toBe('Hola, Invitado');
  });

  it('muestra la fecha de hoy', async () => {
    const p = await montar(Home);
    const hoy = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
    expect(p.texto('.page-header .small').toLowerCase()).toContain(hoy.toLowerCase());
  });

  it('sin registros de hoy, "Tu día" empieza en cero', async () => {
    const p = await montar(Home);
    const anillos = p.texto('.rings');
    expect(anillos).toContain('0 h');
    expect(anillos).toContain('0 / 8');
    expect(anillos).toContain('0 min');
    expect(p.texto('.rings-card .link')).toBe('0 %');
    expect(p.existe('.hero-panel .selected')).toBe(false);
  });

  it('"Tu día" no muestra datos de días anteriores', async () => {
    guardar('pulso-historial', [registro(1, { water: 7, mood: 5 })]);
    const p = await montar(Home);
    expect(p.texto('.counter .metric')).toBe('0');
    expect(p.existe('.hero-panel .selected')).toBe(false);
  });

  it('"Tu día" sí muestra el registro de hoy y las metas guardadas', async () => {
    guardar('pulso-goals', { sleepHours: 8, waterGlasses: 6, exerciseMinutes: 30 });
    guardar('pulso-historial', [
      registro(0, {
        water: 3,
        mood: 3,
        exerciseMinutes: 30,
        sleepStart: '23:00',
        sleepEnd: '07:00',
      }),
    ]);
    const p = await montar(Home);
    expect(p.texto('.rings')).toContain('8 h');
    expect(p.texto('.rings')).toContain('3 / 6');
    expect(p.texto('.rings')).toContain('30 min');
    expect(p.texto('.rings-card .link')).toBe('83 %');
    expect(p.texto('.hero-panel .selected')).toBe('Regular');
  });

  it('tocar una carita empieza el check-in con esa carita elegida', async () => {
    const p = await montar(Home, [CheckinMood]);
    await p.clic('.hero-panel .mood-option', 1);
    expect(p.href('.hero-panel .mood-option', 1)).toBe('/checkin/animo');

    const checkin = await montar(CheckinMood);
    expect(checkin.texto('.mood.selected')).toBe('Mal');
  });

  it('los botones + y − del agua cambian el número y lo guardan', async () => {
    const p = await montar(Home);
    await p.clic('.counter .add');
    await p.clic('.counter .add');
    expect(p.texto('.counter .metric')).toBe('2');
    expect(p.texto('.rings')).toContain('2 / 8');
    await p.clic('.counter .round-btn', 0);
    expect(p.texto('.counter .metric')).toBe('1');
    expect(leer('pulso-checkin-hoy').water).toBe(1);
  });

  it('el botón − del agua no baja de 0', async () => {
    const p = await montar(Home);
    await p.clic('.counter .round-btn', 0);
    expect(p.texto('.counter .metric')).toBe('0');
  });

  it('los anillos de "Tu día" se llenan según el avance de cada meta', async () => {
    guardar('pulso-goals', { sleepHours: 8, waterGlasses: 4, exerciseMinutes: 30 });
    guardar('pulso-checkin-hoy', {
      sleepStart: '00:00',
      sleepEnd: '04:00',
      water: 1,
      exerciseMinutes: 30,
    });
    const p = await montar(Home);
    const avance = (selector: string) => p.el(selector).style.getPropertyValue('--avance');
    expect(avance('.sleep-ring')).toBe('50%');
    expect(avance('.water-ring')).toBe('25%');
    expect(avance('.exercise-ring')).toBe('100%');
    await p.clic('.counter .add');
    expect(avance('.water-ring')).toBe('50%');
  });

  it('sin registros de hoy los anillos están vacíos', async () => {
    const p = await montar(Home);
    expect(p.el('.sleep-ring').style.getPropertyValue('--avance')).toBe('0%');
    expect(p.el('.water-ring').style.getPropertyValue('--avance')).toBe('0%');
    expect(p.el('.exercise-ring').style.getPropertyValue('--avance')).toBe('0%');
  });

  it('el progreso nunca pasa de 100 %', async () => {
    guardar('pulso-checkin-hoy', {
      sleepStart: '20:00',
      sleepEnd: '10:00',
      water: 20,
      exerciseMinutes: 200,
    });
    const p = await montar(Home);
    expect(p.texto('.rings-card .link')).toBe('100 %');
  });

  it('la racha cuenta solo días seguidos', async () => {
    guardar('pulso-historial', [registro(6), registro(1), registro(0)]);
    const p = await montar(Home);
    expect(p.texto('.bg-coral .metric')).toBe('2');
  });

  it('la alerta aparece tras 3 días seguidos de ánimo "Muy mal"', async () => {
    guardar('pulso-historial', [
      registro(2, { mood: 1 }),
      registro(1, { mood: 1 }),
      registro(0, { mood: 1 }),
    ]);
    const p = await montar(Home);
    expect(p.visible('.card.alert')).toBe(true);
    expect(p.href('.card.alert .link')).toBe('/bienestar');
  });

  it('con solo 2 días de ánimo "Muy mal" no hay alerta', async () => {
    guardar('pulso-historial', [registro(1, { mood: 1 }), registro(0, { mood: 1 })]);
    const p = await montar(Home);
    expect(p.visible('.card.alert')).toBe(false);
  });

  it('el punto de la campana aparece solo con recordatorios activos', async () => {
    guardar('pulso-recordatorios', [{ id: 1, isActive: false }]);
    let p = await montar(Home);
    expect(p.visible('.dot')).toBe(false);

    localStorage.clear();
    guardar('pulso-recordatorios', [{ id: 1, isActive: true }]);
    p = await montar(Home);
    expect(p.visible('.dot')).toBe(true);
  });

  it('los accesos llevan a su página', async () => {
    const p = await montar(Home);
    expect(p.href('[aria-label="Recordatorios"]')).toBe('/recordatorios');
    expect(p.href('.breathe-card')).toBe('/respira');
  });
});
