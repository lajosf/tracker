import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ALL_FOLDER } from '../constants/preservedFolders';

export function AppFooter() {
    const pathname = usePathname();
    const showAddActivityButton = pathname === '/folders' || pathname === `/activities/${ALL_FOLDER}`;

    return (
        <BlurView intensity={75} tint="light" style={styles.footer}>
            <View style={styles.footerContent}>
                {showAddActivityButton && (
                    <Link href="/new-activity" asChild style={styles.rightButton}>
                        <Pressable>
                            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                        </Pressable>
                    </Link>
                )}
            </View>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 45,
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(0,0,0,0.2)',
    },
    footerContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    rightButton: {
        padding: 8,
    },
});