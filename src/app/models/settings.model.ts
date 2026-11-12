export interface Settings {
  darkMode: boolean;
  shareAnonymousData: boolean;
  showInsights: boolean;
}

export const AJUSTES_POR_DEFECTO: Settings = {
  darkMode: false,
  shareAnonymousData: false,
  showInsights: true,
};

// ¿Va el tema oscuro? Lo que eligió la persona en el perfil o, si nunca lo tocó, lo del sistema
export function temaOscuroElegido(): boolean {
  const ajustes = JSON.parse(localStorage.getItem('pulso-ajustes') ?? '{}');
  if (typeof ajustes.darkMode === 'boolean') {
    return ajustes.darkMode;
  }
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

// Prende o apaga el tema oscuro en toda la app (clase en <html>, ver styles.scss)
export function aplicarTema(oscuro: boolean) {
  document.documentElement.classList.toggle('tema-oscuro', oscuro);
}
