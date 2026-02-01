import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { colors, spacing, borderRadius } from '../styles/theme';

export default function ResultScreen({ route, navigation }) {
  const { result, imageUri } = route.params;
  const isGo = result.prediction === 'GO';
  const resultViewRef = useRef();

  // Couleur selon la phase détectée
  const getPhaseColor = () => {
    switch (result.phase) {
      case 'expo':
        return colors.go;
      case 'stationnaire':
        return colors.warning || '#F59E0B';
      case 'mort':
        return colors.noGo;
      default:
        return colors.textSecondary;
    }
  };

  // Nom français de la phase
  const getPhaseName = () => {
    switch (result.phase) {
      case 'expo':
        return 'Phase Exponentielle';
      case 'stationnaire':
        return 'Phase Stationnaire';
      case 'mort':
        return 'Phase de Mort';
      default:
        return result.phase;
    }
  };

  // Icône selon la phase
  const getPhaseIcon = () => {
    switch (result.phase) {
      case 'expo':
        return '🦠';
      case 'stationnaire':
        return '⏸️';
      case 'mort':
        return '💀';
      default:
        return '❓';
    }
  };

  // Partager le résultat
  const shareResult = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Erreur', 'Le partage n\'est pas disponible sur cet appareil');
        return;
      }

      const uri = await captureRef(resultViewRef, {
        format: 'png',
        quality: 1,
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Partager le résultat BioMicro',
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le résultat');
    }
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isGo ? colors.goLight : colors.noGoLight }
    ]}>
      <ScrollView ref={resultViewRef} contentContainerStyle={styles.scrollContent}>
        {/* Result Header */}
        <View style={styles.header}>
          <View style={[
            styles.resultBadge,
            { backgroundColor: isGo ? colors.go : colors.noGo }
          ]}>
            <Text style={styles.resultIcon}>{isGo ? '✓' : '✗'}</Text>
          </View>

          <Text style={[
            styles.resultTitle,
            { color: isGo ? colors.go : colors.noGo }
          ]}>
            {result.prediction}
          </Text>

          <Text style={styles.resultMessage}>
            {result.message}
          </Text>
        </View>

        {/* Phase détectée */}
        <View style={[styles.phaseCard, { borderColor: getPhaseColor() }]}>
          <Text style={styles.phaseIcon}>{getPhaseIcon()}</Text>
          <Text style={[styles.phaseName, { color: getPhaseColor() }]}>
            {getPhaseName()}
          </Text>
          <Text style={styles.phaseDescription}>
            {result.phase === 'expo' &&
              'Les bactéries sont en croissance active. C\'est le moment optimal pour le déversement.'}
            {result.phase === 'stationnaire' &&
              'Les bactéries ont atteint leur maximum. Attendez la prochaine phase.'}
            {result.phase === 'mort' &&
              'La culture bactérienne est en déclin. Préparez une nouvelle culture.'}
          </Text>
        </View>

        {/* Image Preview */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        </View>

        {/* Confidence Score */}
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Indice de confiance</Text>
          <View style={styles.confidenceBar}>
            <View style={[
              styles.confidenceFill,
              {
                width: `${Math.round(result.confidence * 100)}%`,
                backgroundColor: isGo ? colors.go : colors.noGo
              }
            ]} />
          </View>
          <Text style={styles.confidenceValue}>
            {Math.round(result.confidence * 100)}%
          </Text>
        </View>

        {/* Probabilités par classe */}
        {result.probabilities && (
          <View style={styles.probabilitiesContainer}>
            <Text style={styles.probabilitiesTitle}>Probabilités par phase</Text>
            {Object.entries(result.probabilities).map(([phase, prob]) => (
              <View key={phase} style={styles.probabilityRow}>
                <Text style={styles.probabilityLabel}>
                  {phase === 'expo' ? '🦠 Expo' :
                    phase === 'stationnaire' ? '⏸️ Stationnaire' : '💀 Mort'}
                </Text>
                <View style={styles.probabilityBarBg}>
                  <View
                    style={[
                      styles.probabilityBarFill,
                      {
                        width: `${Math.round(prob * 100)}%`,
                        backgroundColor: phase === result.phase ? getPhaseColor() : colors.border
                      }
                    ]}
                  />
                </View>
                <Text style={styles.probabilityValue}>
                  {Math.round(prob * 100)}%
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Temps de traitement */}
        {result.processing_time && (
          <Text style={styles.processingTime}>
            ⚡ Analysé en {result.processing_time.toFixed(2)}s
          </Text>
        )}

        {/* Action Instructions */}
        <View style={[
          styles.instructionCard,
          { borderColor: isGo ? colors.go : colors.noGo }
        ]}>
          <Text style={styles.instructionTitle}>
            {isGo ? '✅ Action recommandée' : '⚠️ Instruction'}
          </Text>
          <Text style={styles.instructionText}>
            {isGo
              ? 'Vous pouvez procéder au déversement de la solution. Les bactéries sont dans un état optimal pour la bio-minéralisation.'
              : result.phase === 'stationnaire'
                ? 'Ne pas déverser la solution. Les bactéries sont au maximum mais pas en phase de croissance active. Patientez quelques heures.'
                : 'Ne pas utiliser cette culture. Les bactéries sont en phase de mort. Préparez une nouvelle culture avant de réessayer.'
            }
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.newAnalysisButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.newAnalysisButtonText}>
              📷 Nouvelle analyse
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={shareResult}
          >
            <Text style={styles.shareButtonText}>
              📤 Partager
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeButtonText}>
              Retour à l'accueil
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  resultBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultIcon: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  resultTitle: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 2,
  },
  resultMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  phaseCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  phaseIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  phaseName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  phaseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  imageContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: borderRadius.md,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  confidenceContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  confidenceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  probabilitiesContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  probabilitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  probabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  probabilityLabel: {
    width: 100,
    fontSize: 12,
    color: colors.textSecondary,
  },
  probabilityBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  probabilityBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  probabilityValue: {
    width: 40,
    fontSize: 12,
    color: colors.text,
    textAlign: 'right',
  },
  processingTime: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  instructionCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    padding: spacing.lg,
    marginTop: 'auto',
  },
  newAnalysisButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  newAnalysisButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  shareButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  homeButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
