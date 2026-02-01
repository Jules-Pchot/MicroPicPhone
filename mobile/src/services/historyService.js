import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'analysis_history';
const MAX_HISTORY_ITEMS = 20;

/**
 * Sauvegarde une analyse dans l'historique
 */
export const saveAnalysis = async (analysis) => {
    try {
        const history = await getHistory();

        const newEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            prediction: analysis.prediction,
            phase: analysis.phase,
            confidence: analysis.confidence,
            message: analysis.message,
            probabilities: analysis.probabilities,
            imageUri: analysis.imageUri || null,
        };

        // Ajouter au début de l'historique
        const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);

        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

        return newEntry;
    } catch (error) {
        console.error('Erreur sauvegarde historique:', error);
        return null;
    }
};

/**
 * Récupère l'historique des analyses
 */
export const getHistory = async () => {
    try {
        const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error('Erreur lecture historique:', error);
        return [];
    }
};

/**
 * Efface tout l'historique
 */
export const clearHistory = async () => {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
        return true;
    } catch (error) {
        console.error('Erreur suppression historique:', error);
        return false;
    }
};

/**
 * Supprime une entrée de l'historique
 */
export const deleteAnalysis = async (id) => {
    try {
        const history = await getHistory();
        const updatedHistory = history.filter(item => item.id !== id);
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        return true;
    } catch (error) {
        console.error('Erreur suppression entrée:', error);
        return false;
    }
};

/**
 * Formate une date pour l'affichage
 */
export const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;

    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
};
