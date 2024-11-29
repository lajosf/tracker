import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ALL_FOLDER } from '../constants/preservedFolders';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function AppFooter() {
    const pathname = usePathname();
    const showAddActivityButton = pathname === '/folders' || pathname === `/activities/${ALL_FOLDER}`;
    const showDeleteButton = pathname === '/folders';

    const handleDelete = () => {
        Alert.alert(
            'Delete All Data',
            'This will delete all data. Are you sure?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            Alert.alert('Success', 'All data has been deleted');
                        } catch (error) {
                            console.error('Error clearing storage:', error);
                            Alert.alert('Error', 'Failed to clear data');
                        }
                    }
                }
            ]
        );
    };

    return (
        <BlurView intensity={75} tint="light" style={styles.footer}>
            <View style={styles.footerContent}>
                {showDeleteButton && (
                    <Pressable onPress={handleDelete} style={styles.leftButton}>
                        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                    </Pressable>
                )}
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
    leftButton: {
        padding: 8,
    },
    rightButton: {
        padding: 8,
    },
});