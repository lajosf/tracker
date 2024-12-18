import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Link, usePathname, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ALL_FOLDER } from '../constants/preservedFolders';

export function AppFooter() {
    const pathname = usePathname();
    const { source } = useLocalSearchParams<{ source: string }>();
    
    const showAddActivityButton = pathname === '/folders' || pathname === `/activities/${ALL_FOLDER}`;
    const showDeleteButton = pathname.includes('/activity/') && source === ALL_FOLDER;

    const handleDeleteActivity = () => {
        Alert.alert(
            'Delete Activity',
            'Are you sure you want to delete this activity?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        // Delete functionality will be implemented in the next step
                    }
                }
            ]
        );
    };

    return (
        <BlurView intensity={75} tint="light" style={styles.footer}>
            <View style={styles.footerContent}>
                {showAddActivityButton && (
                    <Link href="/new-activity" asChild style={styles.leftButton}>
                        <Pressable>
                            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                        </Pressable>
                    </Link>
                )}
                {showDeleteButton && (
                    <Pressable onPress={handleDeleteActivity} style={styles.rightButton}>
                        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                    </Pressable>
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    leftButton: {
        padding: 8,
    },
    rightButton: {
        padding: 8,
    },
});