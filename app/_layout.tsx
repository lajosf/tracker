import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StorageService } from '../src/services/StorageService';
import { ActivityProvider } from '../src/context/ActivityContext';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppFooter } from '../src/components/AppFooter';

/**
 * Root layout component for the application.
 * Handles the initialization of preserved folders on app start,
 * sets up the navigation stack, and provides the ActivityContext to all child components.
 * Also includes debugging functionality to log storage content during development.
 */
export default function Layout() {
    useEffect(() => {
        StorageService.initializePreservedFolders();
        
        const logStorageContent = async () => {
            try {
                const keys = await AsyncStorage.getAllKeys();
                const items = await AsyncStorage.multiGet(keys);
                console.log('📦 Storage Content:');
                items.forEach(([key, value]) => {
                    console.log(`\n🔑 ${key}:`);
                    console.log(JSON.parse(value || '{}'));
                });
            } catch (error) {
                console.error('Error logging storage:', error);
            }
        };

        logStorageContent();
    }, []);

    return (
        <ActivityProvider>
            <View style={styles.container}>
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#fff',
                        },
                        headerTintColor: '#000',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                />
                <AppFooter />
            </View>
        </ActivityProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});