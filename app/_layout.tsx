import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StorageService } from '../src/services/StorageService';

export default function Layout() {
    useEffect(() => {
        StorageService.initializePreservedFolders();
    }, []);
    return (
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
    );
}