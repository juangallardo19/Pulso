# Pulso

Pulso es una app de bienestar estudiantil hecha en **Angular 21** (componentes standalone). Permite registrar un check-in diario (ánimo, sueño, agua, ejercicio y estrés), ver el historial y las estadísticas, programar recordatorios, hacer ejercicios de respiración y encontrar los servicios de Bienestar U.

Los datos se guardan en el navegador con `localStorage`; no hay servidor.

## Cómo correrlo

```bash
npm install
ng serve -o
```

La app abre en `http://localhost:4200/`.

```bash
ng test                  # pruebas unitarias en modo watch
ng test --watch=false    # pruebas unitarias una sola vez
ng build                 # compila en dist/
```

## Funcionalidades por pantalla

| Pantalla | Ruta | Qué hace |
|---|---|---|
| Splash y onboarding | `/`, `/onboarding` | Presentación de la app |
| Login y registro | `/login`, `/registro` | Formularios reactivos con validaciones; el registro guarda `pulso-user` (sin contraseña) |
| Metas | `/metas` | Define horas de sueño, vasos de agua y minutos de ejercicio (`pulso-goals`) |
| Inicio | `/inicio` | Saludo con el nombre y la fecha, ánimos con `*ngFor`, progreso del día, contador de agua sincronizado con el check-in, racha y alerta empática tras 3 días con ánimo "Muy mal" |
| Check-in diario | `/checkin/animo` … `/checkin/listo` | 6 pasos (ánimo, sueño, agua, ejercicio, estrés y resumen); guarda el día en `pulso-historial` |
| Historial y detalle del día | `/historial`, `/historial/dia` | Calendario del mes armado desde el historial y detalle del día elegido |
| Estadísticas | `/estadisticas` | Promedios con cambio semana / mes |
| Recordatorios | `/recordatorios` | Crear, activar, desactivar y eliminar recordatorios (`pulso-recordatorios`) |
| Respira | `/respira`, `/respira/sesion` | Ejercicios de respiración guiada |
| Bienestar U | `/bienestar` | Tarjetas de servicios con filtro por categoría y botón para contactar |
| Perfil y privacidad | `/perfil`, `/privacidad` | Datos del usuario y ajustes (`pulso-ajustes`) |

## Equipo

| Integrante | Rol | Ramas |
|---|---|---|
| juangallardo19 | Maquetado, cuenta, ajustes y respira · cierre | `feature/estilos-paginas`, `feature/formularios`, `feature/perfil-respira` |
| seba4s | Check-in diario, inicio y Bienestar U | `feature/checkin`, `feature/inicio-bienestar` |
| andresc1108 | Recordatorios, historial, estadísticas y pruebas de integración | `feature/recordatorios-historial`, `test/pruebas-unitarias` |

## Conceptos de Angular usados por clase

| Clase | Concepto | Dónde se usa |
|---|---|---|
| 3 | Componentes, `routerLink`, interpolación, event y property binding, `*ngFor`, interfaces | Todas las páginas y `src/app/models/` |
| 4a | Signals (`signal`, `set`, `update`) | Contadores de agua, ánimo elegido, chips, filtro de Bienestar U |
| 4b | `[ngClass]` y `localStorage` | Nivel de estrés, íconos de servicios, guardado del check-in y del historial |
| 5a | `FormControl`, `Validators`, clases y estilos dinámicos, `valueChanges` | Nota del ánimo, horas de sueño, sliders, login |
| 5b | `FormBuilder` con `inject()` | Registro, metas y recordatorios |
| 5c | Separar `pages/` de `domain/` | Componentes reutilizables en `src/app/domain/` |
| 6 | `@Input` | `stepper`, `mood-option`, `chip-option`, `service-card`, entre otros |
| 6b | `@Output` con `EventEmitter` | `mood-option` (`elegir`), `chip-option` (`alternar`), `service-card` (`contactar`), entre otros |

## Pruebas
