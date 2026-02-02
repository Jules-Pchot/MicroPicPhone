import axios from 'axios';

// URL de l'API - À modifier selon votre déploiement
// En développement local, utiliser l'IP de votre machine
// Exemple: 'http://192.168.1.100:8000'
const API_BASE_URL = 'http://10.101.26.205:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 secondes max pour l'analyse
});

/**
 * Envoie une image au serveur pour prédiction
 * @param {string} imageUri - URI locale de l'image
 * @returns {Promise<{
 *   prediction: string,      // "GO" ou "NO-GO"
 *   phase: string,           // "expo", "stationnaire", "mort"
 *   confidence: number,      // 0-1
 *   message: string,         // Message explicatif
 *   probabilities: object,   // Probabilités par classe
 *   processing_time: number  // Temps en secondes
 * }>}
 */
export const predictImage = async (imageUri) => {
  // Créer un FormData pour envoyer l'image
  const formData = new FormData();

  // Extraire le nom du fichier de l'URI
  const filename = imageUri.split('/').pop();

  // Déterminer le type MIME
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('file', {
    uri: imageUri,
    name: filename,
    type,
  });

  try {
    const response = await api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erreur API:', error);

    // Gestion des erreurs détaillée
    if (error.response) {
      // Erreur du serveur
      throw new Error(error.response.data?.detail || 'Erreur du serveur');
    } else if (error.request) {
      // Pas de réponse (problème réseau)
      throw new Error('Serveur indisponible. Vérifiez votre connexion.');
    } else {
      throw new Error('Impossible d\'analyser l\'image');
    }
  }
};

/**
 * Vérifie que l'API est accessible et retourne les infos du modèle
 * @returns {Promise<{
 *   status: string,
 *   model_loaded: boolean,
 *   device: string,
 *   timestamp: number
 * }>}
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Serveur indisponible');
  }
};

/**
 * Récupère les informations détaillées sur le modèle
 * @returns {Promise<{
 *   model_loaded: boolean,
 *   model_path: string,
 *   device: string,
 *   classes: string[],
 *   input_size: string,
 *   architecture: string
 * }>}
 */
export const getModelInfo = async () => {
  try {
    const response = await api.get('/info');
    return response.data;
  } catch (error) {
    throw new Error('Impossible de récupérer les infos du modèle');
  }
};

/**
 * Met à jour l'URL de base de l'API
 * Utile pour basculer entre dev et prod
 * @param {string} newBaseUrl - Nouvelle URL (ex: 'https://api.biomicro.com')
 */
export const setApiBaseUrl = (newBaseUrl) => {
  api.defaults.baseURL = newBaseUrl;
};

/**
 * Retourne l'URL actuelle de l'API
 * @returns {string}
 */
export const getApiBaseUrl = () => {
  return api.defaults.baseURL;
};

export default api;
