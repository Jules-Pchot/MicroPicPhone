import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../styles/theme';
import { getHistory, clearHistory, deleteAnalysis, formatDate } from '../services/historyService';

export default function HistoryScreen({ navigation }) {
    const [history, setHistory] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadHistory = async () => {
        setRefreshing(true);
        const data = await getHistory();
        setHistory(data);
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const handleClearAll = () => {
        Alert.alert(
            'Effacer l\'historique',
            'Voulez-vous vraiment supprimer tout l\'historique ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Effacer',
                    style: 'destructive',
                    onPress: async () => {
                        await clearHistory();
                        setHistory([]);
                    },
                },
            ]
        );
    };

    const handleDelete = async (id) => {
        await deleteAnalysis(id);
        loadHistory();
    };

    const renderItem = ({ item }) => {
        const isGo = item.prediction === 'GO';

        return (
            <TouchableOpacity
                style={[styles.card, { borderLeftColor: isGo ? colors.go : colors.noGo }]}
                onPress={() => navigation.navigate('Result', { result: item, imageUri: item.imageUri })}
                onLongPress={() => {
                    Alert.alert(
                        'Supprimer',
                        'Supprimer cette analyse ?',
                        [
                            { text: 'Annuler', style: 'cancel' },
                            { text: 'Supprimer', style: 'destructive', onPress: () => handleDelete(item.id) },
                        ]
                    );
                }}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.badge, { backgroundColor: isGo ? colors.go : colors.noGo }]}>
                        <Text style={styles.badgeText}>{item.prediction}</Text>
                    </View>
                    <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
                </View>

                <Text style={styles.phase}>
                    {item.phase === 'expo' ? '🦠 Exponentielle' :
                        item.phase === 'stationnaire' ? '⏸️ Stationnaire' : '💀 Mort'}
                </Text>

                <View style={styles.confidenceRow}>
                    <Text style={styles.confidenceLabel}>Confiance:</Text>
                    <View style={styles.confidenceBarBg}>
                        <View
                            style={[
                                styles.confidenceBarFill,
                                {
                                    width: `${Math.round(item.confidence * 100)}%`,
                                    backgroundColor: isGo ? colors.go : colors.noGo
                                }
                            ]}
                        />
                    </View>
                    <Text style={styles.confidenceValue}>{Math.round(item.confidence * 100)}%</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Retour</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Historique</Text>
                {history.length > 0 && (
                    <TouchableOpacity onPress={handleClearAll}>
                        <Text style={styles.clearButton}>Effacer</Text>
                    </TouchableOpacity>
                )}
            </View>

            {history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📋</Text>
                    <Text style={styles.emptyText}>Aucune analyse</Text>
                    <Text style={styles.emptySubtext}>
                        Vos analyses apparaîtront ici
                    </Text>
                    <TouchableOpacity
                        style={styles.newAnalysisBtn}
                        onPress={() => navigation.navigate('Camera')}
                    >
                        <Text style={styles.newAnalysisBtnText}>📷 Nouvelle analyse</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    refreshing={refreshing}
                    onRefresh={loadHistory}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    clearButton: {
        fontSize: 14,
        color: colors.noGo,
        fontWeight: '500',
    },
    list: {
        padding: spacing.md,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    badge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    date: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    phase: {
        fontSize: 14,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    confidenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    confidenceLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        width: 70,
    },
    confidenceBarBg: {
        flex: 1,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        marginHorizontal: spacing.xs,
        overflow: 'hidden',
    },
    confidenceBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    confidenceValue: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text,
        width: 35,
        textAlign: 'right',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: spacing.md,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
    },
    newAnalysisBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
    },
    newAnalysisBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
