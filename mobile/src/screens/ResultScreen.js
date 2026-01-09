import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { colors, spacing, borderRadius } from '../styles/theme';

export default function ResultScreen({ route, navigation }) {
  const { result, imageUri } = route.params;
  const isGo = result.prediction === 'GO';

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isGo ? colors.goLight : colors.noGoLight }
    ]}>
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

      {/* Action Instructions */}
      <View style={[
        styles.instructionCard,
        { borderColor: isGo ? colors.go : colors.noGo }
      ]}>
        <Text style={styles.instructionTitle}>
          {isGo ? 'Action recommandée' : 'Instruction'}
        </Text>
        <Text style={styles.instructionText}>
          {isGo 
            ? 'Vous pouvez procéder au déversement de la solution. Les bactéries sont dans un état optimal pour la bio-minéralisation.'
            : 'Ne pas déverser la solution. Les bactéries ne sont pas encore dans l\'état optimal. Patientez et effectuez une nouvelle analyse dans quelques minutes.'
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
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>
            Retour à l'accueil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  homeButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  homeButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
