import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Link, usePathname, useGlobalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ALL_FOLDER, TODAY_FOLDER } from '../constants/preservedFolders';
import { useRouter } from 'expo-router';
import { useActivityContext } from '../context/ActivityContext';

export function AppFooter() {
    const pathname = usePathname();
    const params = useGlobalSearchParams();
    const { deleteActivity } = useActivityContext();
    const router = useRouter();

    const showAddActivityButton = useMemo(() => 
        pathname === '/folders' ||
        pathname === `/activities/${ALL_FOLDER}` ||
        pathname === `/activities/${TODAY_FOLDER}`,
        [pathname]
    );

    const showDeleteButton = useMemo(() => 
        pathname.startsWith('/activity/') && params.source === 'All',
        [pathname, params.source]
    );

    const handleDeleteActivity = useCallback(() => {
        Alert.alert(
            'Delete Activity',
            'Are you sure you want to delete this activity?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        const activityId = pathname.split('/').pop();
                        if (activityId) {
                            deleteActivity(activityId);
                            router.back();
                        }
                    }
                }
            ]
        );
    }, [pathname, deleteActivity, router]);

    return (
        <View style={styles.footer}>
            <View style={styles.footerContent}>
                {showAddActivityButton ? (
                    <Link href="/new-activity" asChild>
                        <Pressable style={styles.leftButton}>
                            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                        </Pressable>
                    </Link>
                ) : <View style={styles.placeholder} />}

                {showDeleteButton ? (
                    <Pressable onPress={handleDeleteActivity} style={styles.rightButton}>
                        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                    </Pressable>
                ) : <View style={styles.placeholder} />}
            </View>
        </View>
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
        backgroundColor: 'rgba(255,255,255,0.8)',
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
    placeholder: {
        width: 40,
        height: 40,
    }
});