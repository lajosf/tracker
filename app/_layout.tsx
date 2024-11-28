import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StorageService } from '../src/services/StorageService';
import { ActivityProvider } from '../src/context/ActivityContext';
import { AppFooter } from '../src/components/AppFooter';
import { View, StyleSheet } from 'react-native';

export default function Layout() {
    useEffect(() => {
        StorageService.initializePreservedFolders();
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