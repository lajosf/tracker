import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StorageService } from '../src/services/StorageService';
import { ActivityProvider } from '../src/context/ActivityContext';

export default function Layout() {
    useEffect(() => {
        StorageService.initializePreservedFolders();
    }, []);
    return (
        <ActivityProvider>
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
        </ActivityProvider>
    );
}