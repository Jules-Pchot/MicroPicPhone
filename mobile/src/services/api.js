import axios from 'axios';

// URL de l'API - À modifier selon votre déploiement
const API_BASE_URL = 'http://localhost:8000'; // Changer pour https://votre-api.railway.app en production

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 secondes max pour l'analyse
});

/**
 * Envoie une image au serveur pour prédiction
 * @param {string} imageUri - URI locale de l'image
 * @returns {Promise<{prediction: string, confidence: number, message: string}>}
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
    throw new Error('Impossible d\'analyser l\'image');
  }
};

/**
 * Vérifie que l'API est accessible
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Serveur indisponible');
  }
};
