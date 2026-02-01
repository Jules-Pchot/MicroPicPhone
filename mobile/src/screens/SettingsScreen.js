import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, spacing, borderRadius } from '../styles/theme';
import { getSettings, saveSettings, resetSettings, DEFAULT_SETTINGS } from '../services/settingsService';

export default function SettingsScreen({ navigation }) {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const savedSettings = await getSettings();
        setSettings(savedSettings);
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        await saveSettings(settings);
        setHasChanges(false);
        Alert.alert('Succès', 'Paramètres sauvegardés !');
    };

    const handleReset = () => {
        Alert.alert(
            'Réinitialiser',
            'Remettre tous les paramètres par défaut ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Réinitialiser',
                    style: 'destructive',
                    onPress: async () => {
                        const defaultSettings = await resetSettings();
                        setSettings(defaultSettings);
                        setHasChanges(false);
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Retour</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Paramètres</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Section Analyse */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔬 Analyse</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Seuil de confiance</Text>
                            <Text style={styles.settingDescription}>
                                Affiche un avertissement si la confiance est inférieure à ce seuil
                            </Text>
                        </View>
                        <View style={styles.sliderContainer}>
                            <Text style={styles.sliderValue}>
                                {Math.round(settings.confidenceThreshold * 100)}%
                            </Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0.5}
                                maximumValue={0.95}
                                step={0.05}
                                value={settings.confidenceThreshold}
                                onValueChange={(value) => updateSetting('confidenceThreshold', value)}
                                minimumTrackTintColor={colors.primary}
                                maximumTrackTintColor={colors.border}
                                thumbTintColor={colors.primary}
                            />
                        </View>
                    </View>
                </View>

                {/* Section Général */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚙️ Général</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Vibration</Text>
                            <Text style={styles.settingDescription}>
                                Vibre lors d'un résultat GO/NO-GO
                            </Text>
                        </View>
                        <Switch
                            value={settings.enableVibration}
                            onValueChange={(value) => updateSetting('enableVibration', value)}
                            trackColor={{ false: colors.border, true: colors.goLight }}
                            thumbColor={settings.enableVibration ? colors.go : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Sauvegarde automatique</Text>
                            <Text style={styles.settingDescription}>
                                Enregistre chaque analyse dans l'historique
                            </Text>
                        </View>
                        <Switch
                            value={settings.autoSaveToHistory}
                            onValueChange={(value) => updateSetting('autoSaveToHistory', value)}
                            trackColor={{ false: colors.border, true: colors.goLight }}
                            thumbColor={settings.autoSaveToHistory ? colors.go : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Info version */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ℹ️ À propos</Text>
                    <View style={styles.aboutItem}>
                        <Text style={styles.aboutLabel}>Version</Text>
                        <Text style={styles.aboutValue}>1.0.0</Text>
                    </View>
                    <View style={styles.aboutItem}>
                        <Text style={styles.aboutLabel}>Modèle IA</Text>
                        <Text style={styles.aboutValue}>BacteriaCNN v1</Text>
                    </View>
                    <View style={styles.aboutItem}>
                        <Text style={styles.aboutLabel}>Classes</Text>
                        <Text style={styles.aboutValue}>expo, stationnaire, mort</Text>
                    </View>
                </View>

                {/* Boutons */}
                <View style={styles.buttonContainer}>
                    {hasChanges && (
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>💾 Sauvegarder</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <Text style={styles.resetButtonText}>🔄 Réinitialiser</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl + 20,
        paddingBottom: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '500',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    content: {
        flex: 1,
        padding: spacing.md,
    },
    section: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.md,
    },
    settingItem: {
        marginBottom: spacing.sm,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    settingInfo: {
        flex: 1,
        marginRight: spacing.md,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.text,
    },
    settingDescription: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    sliderContainer: {
        marginTop: spacing.sm,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderValue: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.primary,
        textAlign: 'center',
    },
    aboutItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.xs,
    },
    aboutLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    aboutValue: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
    },
    buttonContainer: {
        marginTop: spacing.md,
        marginBottom: spacing.xxl,
    },
    saveButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    resetButton: {
        backgroundColor: colors.surface,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    resetButtonText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
});
