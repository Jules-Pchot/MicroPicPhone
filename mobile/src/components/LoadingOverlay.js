import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, spacing } from '../styles/theme';

export default function LoadingOverlay({ visible, message = "Analyse en cours..." }) {
    const spinAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const dotsAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Animation de rotation
            Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();

            // Animation de pulsation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 800,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Animation des points
            Animated.loop(
                Animated.timing(dotsAnim, {
                    toValue: 3,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                })
            ).start();
        }
    }, [visible]);

    if (!visible) return null;

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                {/* Cercle animé */}
                <Animated.View
                    style={[
                        styles.spinner,
                        {
                            transform: [{ rotate: spin }, { scale: pulseAnim }],
                        },
                    ]}
                >
                    <View style={styles.spinnerInner}>
                        <Text style={styles.bacteriaIcon}>🦠</Text>
                    </View>
                </Animated.View>

                {/* Message */}
                <Text style={styles.message}>{message}</Text>

                {/* Barre de progression animée */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                {
                                    width: dotsAnim.interpolate({
                                        inputRange: [0, 3],
                                        outputRange: ['0%', '100%'],
                                    }),
                                },
                            ]}
                        />
                    </View>
                </View>

                <Text style={styles.subMessage}>
                    Traitement de l'image par le modèle IA...
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    container: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: spacing.xl,
        alignItems: 'center',
        minWidth: 280,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    spinner: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: colors.primary,
        borderTopColor: colors.go,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    spinnerInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.goLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bacteriaIcon: {
        fontSize: 40,
    },
    message: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.md,
    },
    progressContainer: {
        width: '100%',
        marginBottom: spacing.sm,
    },
    progressBar: {
        height: 6,
        backgroundColor: colors.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    subMessage: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
