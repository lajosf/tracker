import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Link, usePathname, useGlobalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ALL_FOLDER, TODAY_FOLDER } from '../constants/preservedFolders';

export function AppFooter() {
    const pathname = usePathname();
    const params = useGlobalSearchParams();
    
    const showAddActivityButton = pathname === '/folders' || 
        pathname === `/activities/${ALL_FOLDER}` || 
        pathname === `/activities/${TODAY_FOLDER}`;
        
    const showDeleteButton = pathname.startsWith('/activity/') && params.source === 'All';

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
                <Link href="/new-activity" asChild style={[styles.leftButton, !showAddActivityButton && styles.hidden]}>
                    <Pressable>
                        <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                    </Pressable>
                </Link>
                <Pressable 
                    onPress={handleDeleteActivity} 
                    style={[styles.rightButton, !showDeleteButton && styles.hidden]}
                >
                    <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                </Pressable>
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
    hidden: {
        opacity: 0,
        pointerEvents: 'none'
    }
});