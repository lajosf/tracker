import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ALL_FOLDER } from '../constants/preservedFolders';

export function FolderScreenFooter() {
    const pathname = usePathname();
    const showAddActivityButton = pathname === '/folders' || pathname === `/activities/${ALL_FOLDER}`;

    return (
        <BlurView intensity={30} tint="dark" style={styles.footer}>
            <View style={styles.footerContent}>
                {showAddActivityButton && (
                    <Link href="/new-activity" asChild>
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
        borderTopColor: '#38383A',
        backgroundColor: '#3b3b3b',
        opacity: 0.5,
    },
    footerContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
    }
});