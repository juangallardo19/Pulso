# Pulso · Cosas a tener en cuenta

Lo que usamos en Pulso **que no salió en las clases** (repo `book-angular-6a`, hasta la clase 6b), por qué lo necesitamos y dónde está. Lo visto en clase (componentes, rutas, `*ngFor`, `[ngClass]`, signals, formularios reactivos, `@Input`/`@Output`, `localStorage`) no se repite aquí.

---

## 1. Angular

| Qué | Para qué | Dónde |
|---|---|---|
| **Guards de rutas** (`CanActivateFn`, `inject(Router)`, `createUrlTree`) | Sin sesión, cualquier página interna manda al login; con sesión, login y registro mandan al inicio | `src/app/guards/sesion.guard.ts`, `app.routes.ts` |
| **`OnDestroy` / `ngOnDestroy`** | Detener los relojes al salir de una página para que no sigan corriendo | `breathe-session.ts`, `app.ts` |
| **Variable de plantilla** (`#hora`) | Pasarle el campo de hora a la función que abre el selector | `reminders.html` |
| **Variables CSS desde la plantilla** (`[style.--avance]`) | Llenar los anillos de "Tu día" según el avance real | `home.html`, `home.scss` |
| **Funciones exportadas en los modelos** | Lógica que usan varias páginas sin crear servicios (que no se han visto) | `checkin.model.ts` (`calcularRacha`), `cuenta.model.ts`, `reminder.model.ts`, `settings.model.ts` |
| **Importar un JSON** (`resolveJsonModule` en `tsconfig.json`) | Los datos de Bienestar U viven en un archivo JSON aparte | `src/app/data/bienestar.json`, `wellness.ts` |

## 2. JavaScript del navegador

| Qué | Para qué | Dónde |
|---|---|---|
| **`setInterval` / `clearInterval` / `setTimeout`** | El reloj de la sesión de respiración (cuenta segundo a segundo) y la revisión de recordatorios cada 30 s | `breathe-session.ts`, `app.ts` |
| **API de notificaciones** (`Notification`) | Avisar a la hora de un recordatorio | `reminder.model.ts` |
| **`showPicker()`** | Abrir el selector de hora al tocar cualquier parte del campo | `reminders.ts` |
| **`matchMedia('(prefers-color-scheme: dark)')`** y una clase en `<html>` | Modo oscuro: lo que elija la persona o, si nunca lo tocó, el del sistema | `settings.model.ts`, `styles.scss`, `app.ts` |
| **`toLocaleDateString('en-CA')`** | Fechas `AAAA-MM-DD` con la hora local (no la de Londres) | check-in, historial, inicio |

## 3. La "base de datos" (solo frontend)

No hay servidor ni base de datos real (ni Postgres ni similares). Todo se guarda como **JSON en `localStorage`**, que persiste al recargar y al cerrar el navegador:

```text
pulso-cuentas → [ { name, email, password, datos: { 'pulso-historial': '…', 'pulso-goals': '…', … } } ]
pulso-user    → { name, email } de la cuenta con la sesión abierta
pulso-historial, pulso-goals, pulso-recordatorios, … → los datos de la cuenta abierta
```

- Al **iniciar sesión** se cargan los datos de esa cuenta; al **cerrar sesión** se guardan de vuelta en ella. Así cada cuenta ve solo lo suyo.
- Los arreglos normales (`[]`) viven en memoria y se pierden al recargar; por eso se guardan en `localStorage`.

## 4. Pruebas unitarias

| Qué | Para qué | Dónde |
|---|---|---|
| **Vitest + jsdom** (`ng test`) | Viene con Angular 21; en clase solo estaban los `.spec.ts` que genera el CLI | `tsconfig.spec.json` |
| **Ayudante `montar` / `clic` / `escribir` / `mover`** | Que todas las pruebas usen los botones y campos del HTML como una persona | `src/testing/dom.ts` |
| **`vi.useFakeTimers`** | Probar la sesión de respiración segundo a segundo sin esperar el minuto real | `breathe-session.spec.ts` |
| **`vi.stubGlobal` / `vi.spyOn`** | Simular `alert`, `confirm` y las notificaciones del navegador | varios `.spec.ts` |
| **`RouterTestingHarness`** | Probar que las rutas y los guards llevan a la página correcta | `app.routes.spec.ts` |

## 5. Limitaciones conocidas

- **Contraseñas sin cifrar.** Se guardan tal cual en `localStorage`: es una app de clase solo de frontend. En una app real irían cifradas y en un servidor.
- **Datos solo en ese navegador.** En otro computador o en otro navegador la app empieza vacía. Borrar los datos del sitio borra las cuentas.
- **Avisos de recordatorios** solo mientras Pulso esté abierto y si la persona dio permiso al navegador.
- **Bienestar U:** el bloque y el piso de cada oficina no están publicados en ucc.edu.co; hay que confirmarlos en el conmutador (602 7370660). Dos páginas oficiales dan horarios distintos para Bienestar (se usó el del directorio de Bienestar).

## 6. Imágenes

Fotos de [Unsplash](https://unsplash.com/license) (licencia libre: se pueden usar gratis, también en proyectos, sin pedir permiso). Se usan en baja opacidad, mezcladas con el diseño pastel.

| Archivo | Dónde se usa | Autor |
|---|---|---|
| `public/images/fondo-acceso.webp` (1200×2133) | Panel de login, registro y metas | [Muhammed Evren](https://unsplash.com/@muhammed_evren) |
| `public/images/cielo-inicio.webp` (1920×1283) | Bloque "Hola" del inicio | [Clint Patterson](https://unsplash.com/@cbpsc1) |

## 7. CSS moderno que no salió en clase

| Qué | Para qué |
|---|---|
| `@media (hover: hover)` | Los efectos al pasar el mouse solo en dispositivos con mouse |
| `color-mix()` | Oscurecer un poco un color del tema al pasar el mouse |
| `backdrop-filter: blur()` | Efecto de vidrio en las insignias y en el panel de caritas |
| `:has()` | Resaltar el campo de hora al pasar el mouse |
| `::-webkit-calendar-picker-indicator` | Pintar de morado el ícono del reloj de los campos de hora |
| `animation-fill-mode: backwards` | La animación de entrada ya no bloquea el hover de los botones |

## 8. Configuración del equipo

- Si `angular.json` aparece modificado con una línea `"analytics"`, no se sube. Se evita para siempre con:
  ```bash
  ng analytics disable --global
  ```
  y luego `git restore angular.json`.
