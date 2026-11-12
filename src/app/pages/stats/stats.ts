import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { calcularRacha, CheckinEntry } from '../../models/checkin.model';
import { MOODS } from '../../models/mood.model';

@Component({
  selector: 'app-stats',
  imports: [CommonModule, RouterLink, NavBar],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {
  // Ordenado por fecha para que "los últimos" sean los más recientes
  historial: CheckinEntry[] = (
    JSON.parse(localStorage.getItem('pulso-historial') ?? '[]') as CheckinEntry[]
  ).sort((a, b) => a.date.localeCompare(b.date));
  private metas = JSON.parse(localStorage.getItem('pulso-goals') ?? '{}');
  metaSueno: number = this.metas.sleepHours ?? 8;
  metaAgua: number = this.metas.waterGlasses ?? 8;
  metaEjercicio: number = this.metas.exerciseMinutes ?? 30;
  racha = calcularRacha(this.historial);

  periodo = signal<'semana' | 'mes'>('semana');
  // 0 = los registros más recientes, 1 = el bloque anterior, etc.
  pagina = signal(0);

  semana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  private tamano() {
    return this.periodo() === 'semana' ? 7 : 30;
  }

  registros() {
    const fin = this.historial.length - this.pagina() * this.tamano();
    return this.historial.slice(Math.max(0, fin - this.tamano()), Math.max(0, fin));
  }

  cambiarPeriodo(nuevo: 'semana' | 'mes') {
    this.periodo.set(nuevo);
    this.pagina.set(0);
  }

  hayAnterior() {
    return this.historial.length - (this.pagina() + 1) * this.tamano() > 0;
  }

  haySiguiente() {
    return this.pagina() > 0;
  }

  anterior() {
    if (this.hayAnterior()) {
      this.pagina.update((p) => p + 1);
    }
  }

  siguiente() {
    if (this.haySiguiente()) {
      this.pagina.update((p) => p - 1);
    }
  }

  // Línea del gráfico de ánimo (viewBox 300 x 150), pasa por las mismas posiciones que las caritas
  trazo() {
    const lista = this.registros();
    return lista
      .map((d, i) => {
        const x = (i + 0.5) * (300 / lista.length);
        const y = ((100 - d.mood * 16.7) / 100) * 150;
        return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
      })
      .join(' ');
  }

  // Lunes = 0 ... Domingo = 6
  private diaSemana(d: CheckinEntry) {
    return (new Date(d.date + 'T00:00').getDay() + 6) % 7;
  }

  private estresDelDia(indice: number) {
    return this.registros()
      .filter((d) => this.diaSemana(d) === indice)
      .map((d) => d.stress);
  }

  // Intensidad del color: promedio de estrés de ese día de la semana (arriba)
  opacidadPromedio(indice: number) {
    const valores = this.estresDelDia(indice);
    if (valores.length === 0) return 0.08;
    return valores.reduce((s, v) => s + v, 0) / valores.length / 10;
  }

  // ... y el estrés más alto de ese día (abajo)
  opacidadMaxima(indice: number) {
    const valores = this.estresDelDia(indice);
    if (valores.length === 0) return 0.08;
    return Math.max(...valores) / 10;
  }

  // Compara el sueño de los días de estrés alto (7 o más) con el resto
  hallazgo() {
    const lista = this.registros();
    const altos = lista.filter((d) => d.stress >= 7);
    const bajos = lista.filter((d) => d.stress < 7);
    if (altos.length === 0 || bajos.length === 0) {
      return {
        titulo: 'Sigue registrando tus días',
        texto: 'Con días de estrés alto y bajo podremos mostrarte cómo afecta tu sueño.',
      };
    }
    const promedio = (l: CheckinEntry[]) => l.reduce((s, d) => s + this.horas(d), 0) / l.length;
    const minutos = Math.round((promedio(bajos) - promedio(altos)) * 60);
    if (minutos <= 15) {
      return {
        titulo: 'Tu sueño se mantiene estable',
        texto: 'Duermes parecido los días de más estrés y los más tranquilos.',
      };
    }
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    const diferencia = horas > 0 ? horas + ' h ' + resto + ' min' : resto + ' min';
    return {
      titulo: 'Duermes menos los días de más estrés',
      texto: 'Esos días dormiste ' + diferencia + ' menos que el resto.',
    };
  }

  promedio(campo: 'mood' | 'water' | 'stress' | 'exerciseMinutes') {
    const lista = this.registros();
    if (lista.length === 0) return 0;
    return lista.reduce((suma, d) => suma + d[campo], 0) / lista.length;
  }

  animoPromedio() {
    return MOODS[Math.round(this.promedio('mood')) - 1]?.label ?? 'Sin datos';
  }

  horas(d: CheckinEntry) {
    if (!d.sleepStart || !d.sleepEnd) return 0;
    const [hi, mi] = d.sleepStart.split(':').map(Number);
    const [hf, mf] = d.sleepEnd.split(':').map(Number);
    let minutos = hf * 60 + mf - (hi * 60 + mi);
    if (minutos < 0) minutos += 24 * 60;
    return minutos / 60;
  }

  suenoPromedio() {
    const lista = this.registros();
    if (lista.length === 0) return '0 h';
    const minutos = Math.round(
      (lista.reduce((suma, d) => suma + this.horas(d), 0) / lista.length) * 60,
    );
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return resto === 0 ? horas + ' h' : horas + ' h ' + resto + ' min';
  }

  alturaBarra(d: CheckinEntry) {
    return Math.min(100, (this.horas(d) / 12) * 100);
  }

  alturaMeta() {
    return Math.min(100, (this.metaSueno / 12) * 100);
  }

  cumpleMeta(d: CheckinEntry) {
    return this.horas(d) >= this.metaSueno;
  }

  estresPromedio() {
    return Math.round(this.promedio('stress') * 10) / 10;
  }

  // ---------- Resumen del periodo ----------

  // "5 nov – 11 nov" (las fechas del primer y del último registro que se ven)
  rangoTexto() {
    const lista = this.registros();
    if (lista.length === 0) return 'Sin registros todavía';
    // "5 nov" (sin el "de" ni el punto que agrega el navegador)
    const corta = (fecha: string) => {
      const dia = new Date(fecha + 'T00:00');
      const mes = dia.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '');
      return dia.getDate() + ' ' + mes;
    };
    const inicio = corta(lista[0].date);
    const fin = corta(lista[lista.length - 1].date);
    return inicio === fin ? inicio : inicio + ' – ' + fin;
  }

  aguaPromedio() {
    return Math.round(this.promedio('water') * 10) / 10;
  }

  avanceAgua() {
    return Math.min(100, Math.round((this.promedio('water') / this.metaAgua) * 100));
  }

  ejercicioPromedio() {
    return Math.round(this.promedio('exerciseMinutes'));
  }

  avanceEjercicio() {
    const meta = this.metaEjercicio || 1;
    return Math.min(100, Math.round((this.promedio('exerciseMinutes') / meta) * 100));
  }

  ejercicioTotal() {
    return this.registros().reduce((suma, d) => suma + d.exerciseMinutes, 0);
  }

  diasConEjercicio() {
    return this.registros().filter((d) => d.exerciseMinutes > 0).length;
  }

  // ---------- Frases que explican cada tarjeta ----------

  // El valor que más se repite en una lista (y cuántas veces)
  private masFrecuente<T>(valores: T[]): { valor: T; veces: number } | null {
    const conteo = new Map<T, number>();
    valores.forEach((v) => conteo.set(v, (conteo.get(v) ?? 0) + 1));
    let mejor: { valor: T; veces: number } | null = null;
    conteo.forEach((veces, valor) => {
      if (!mejor || veces > mejor.veces) mejor = { valor, veces };
    });
    return mejor;
  }

  explicacionAnimo() {
    const frecuente = this.masFrecuente(
      this.registros()
        .map((d) => d.mood)
        .filter((m) => m > 0),
    );
    if (!frecuente) return 'Haz tu check-in para ver cómo cambia tu ánimo.';
    const nombre = MOODS[frecuente.valor - 1]?.label.toLowerCase();
    const dias = frecuente.veces === 1 ? '1 día' : frecuente.veces + ' días';
    return 'Lo que más sentiste fue "' + nombre + '" (' + dias + ').';
  }

  explicacionSueno() {
    const lista = this.registros().filter((d) => this.horas(d) > 0);
    if (lista.length === 0) return 'Registra tus horas de sueño en el check-in.';
    const cumplidos = lista.filter((d) => this.cumpleMeta(d)).length;
    return (
      'Llegaste a tu meta de ' +
      this.metaSueno +
      ' h en ' +
      cumplidos +
      ' de ' +
      lista.length +
      ' noches.'
    );
  }

  explicacionEstres() {
    const lista = this.registros();
    if (lista.length === 0) return 'Aquí verás qué días te sientes más tenso.';
    const peor = lista.reduce((a, b) => (b.stress > a.stress ? b : a));
    const dia = new Date(peor.date + 'T00:00').toLocaleDateString('es-CO', { weekday: 'long' });
    const causa = this.masFrecuente(lista.flatMap((d) => d.stressCauses));
    const textoCausa = causa ? ' Lo que más te estresó: ' + causa.valor.toLowerCase() + '.' : '';
    return 'Tu día más tenso fue el ' + dia + ' (' + peor.stress + '/10).' + textoCausa;
  }
}
