import { aplicarTema, temaOscuroElegido } from './settings.model';

// "Base de datos" de Pulso: un JSON guardado en localStorage (persiste al recargar y al cerrar
// el navegador). No hay servidor: todo vive en el navegador de quien usa la app.
//
// pulso-cuentas → [ { name, email, password, datos: { 'pulso-historial': '...', ... } }, ... ]
// pulso-user    → { name, email } de la cuenta con la sesión abierta (si no existe, no hay sesión)
//
// Las páginas leen y escriben llaves como pulso-historial o pulso-goals. Al iniciar sesión se
// copian ahí los datos de esa cuenta; al cerrar sesión se guardan de vuelta en su cuenta.

export interface Cuenta {
  name: string;
  email: string;
  password: string;
  datos: Record<string, string>;
}

// Llaves que pertenecen a cada cuenta
export const LLAVES_DE_DATOS = [
  'pulso-checkin-hoy',
  'pulso-historial',
  'pulso-dia-seleccionado',
  'pulso-recordatorios',
  'pulso-goals',
  'pulso-ajustes',
  'pulso-respiracion',
];

export function leerCuentas(): Cuenta[] {
  return JSON.parse(localStorage.getItem('pulso-cuentas') ?? '[]');
}

function guardarCuentas(cuentas: Cuenta[]) {
  localStorage.setItem('pulso-cuentas', JSON.stringify(cuentas));
}

export function buscarCuenta(email: string): Cuenta | undefined {
  const buscado = email.trim().toLowerCase();
  return leerCuentas().find((c) => c.email.toLowerCase() === buscado);
}

export function haySesion(): boolean {
  return localStorage.getItem('pulso-user') !== null;
}

// Crea la cuenta y abre su sesión (empieza sin datos)
export function registrarCuenta(name: string, email: string, password: string) {
  const nueva: Cuenta = { name, email, password, datos: {} };
  guardarCuentas([...leerCuentas().filter((c) => c.email !== email), nueva]);
  abrirSesion(nueva);
}

// Deja en las llaves de las páginas solo los datos de esta cuenta
export function abrirSesion(cuenta: Cuenta) {
  LLAVES_DE_DATOS.forEach((llave) => {
    if (cuenta.datos[llave] !== undefined) {
      localStorage.setItem(llave, cuenta.datos[llave]);
    } else {
      localStorage.removeItem(llave);
    }
  });
  localStorage.setItem('pulso-user', JSON.stringify({ name: cuenta.name, email: cuenta.email }));
  aplicarTema(temaOscuroElegido()); // cada cuenta tiene su propio tema
}

// Guarda los datos actuales en la cuenta abierta y los quita de las llaves de las páginas
export function cerrarSesion() {
  const usuario = JSON.parse(localStorage.getItem('pulso-user') ?? 'null');
  if (usuario) {
    const datos: Record<string, string> = {};
    LLAVES_DE_DATOS.forEach((llave) => {
      const valor = localStorage.getItem(llave);
      if (valor !== null) {
        datos[llave] = valor;
      }
    });
    guardarCuentas(leerCuentas().map((c) => (c.email === usuario.email ? { ...c, datos } : c)));
  }
  LLAVES_DE_DATOS.forEach((llave) => localStorage.removeItem(llave));
  localStorage.removeItem('pulso-user');
  aplicarTema(temaOscuroElegido());
}
