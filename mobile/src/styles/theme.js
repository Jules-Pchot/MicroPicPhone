// Palette de couleurs pour l'application BioMicro
// Thème industriel/scientifique adapté aux chauffeurs de camions

export const colors = {
  // Couleurs principales
  primary: '#1B4D3E',        // Vert foncé (confiance, écologie)
  secondary: '#2D7D6B',      // Vert medium
  accent: '#4ECDC4',         // Turquoise (action)

  // États GO/NO-GO
  go: '#22C55E',             // Vert succès - Phase expo
  goLight: '#DCFCE7',        // Fond vert clair
  noGo: '#EF4444',           // Rouge alerte - Phase mort
  noGoLight: '#FEE2E2',      // Fond rouge clair
  warning: '#F59E0B',        // Orange - Phase stationnaire
  warningLight: '#FEF3C7',   // Fond orange clair

  // Couleurs des phases
  phaseExpo: '#22C55E',      // Vert - Croissance active
  phaseStationnaire: '#F59E0B', // Orange - Maximum atteint
  phaseMort: '#EF4444',      // Rouge - Déclin

  // Neutres
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',

  // Ombres
  shadow: 'rgba(0, 0, 0, 0.08)',
};

export const fonts = {
  regular: 'System',
  bold: 'System',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Constantes pour les phases bactériennes
export const PHASES = {
  EXPO: 'expo',
  STATIONNAIRE: 'stationnaire',
  MORT: 'mort',
};

export const PHASE_LABELS = {
  expo: 'Phase Exponentielle',
  stationnaire: 'Phase Stationnaire',
  mort: 'Phase de Mort',
};

export const PHASE_DESCRIPTIONS = {
  expo: 'Croissance active des bactéries. Moment optimal pour le déversement.',
  stationnaire: 'Bactéries au maximum. Attendre la prochaine culture.',
  mort: 'Culture en déclin. Préparer une nouvelle culture.',
};
