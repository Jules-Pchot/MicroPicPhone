import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'app_settings';

// Paramètres par défaut
const DEFAULT_SETTINGS = {
    confidenceThreshold: 0.7, // Seuil de confiance pour afficher un avertissement
    enableVibration: true,
    autoSaveToHistory: true,
    darkMode: false,
};

/**
 * Récupère les paramètres de l'application
 */
export const getSettings = async () => {
    try {
        const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
        if (settingsJson) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(settingsJson) };
        }
        return DEFAULT_SETTINGS;
    } catch (error) {
        console.error('Erreur lecture paramètres:', error);
        return DEFAULT_SETTINGS;
    }
};

/**
 * Sauvegarde les paramètres
 */
export const saveSettings = async (settings) => {
    try {
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Erreur sauvegarde paramètres:', error);
        return false;
    }
};

/**
 * Met à jour un paramètre spécifique
 */
export const updateSetting = async (key, value) => {
    try {
        const settings = await getSettings();
        settings[key] = value;
        await saveSettings(settings);
        return true;
    } catch (error) {
        console.error('Erreur mise à jour paramètre:', error);
        return false;
    }
};

/**
 * Réinitialise les paramètres par défaut
 */
export const resetSettings = async () => {
    try {
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
    } catch (error) {
        console.error('Erreur réinitialisation:', error);
        return DEFAULT_SETTINGS;
    }
};

export { DEFAULT_SETTINGS };
