import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRESERVED_FOLDERS } from '../constants/preservedFolders';
import { Activity, Folder } from '../types/types';
import { STORAGE_KEYS } from '../constants/storage';

/**
 * Service for managing persistent storage operations.
 * Responsible for:
 * - Initializing and managing system folders
 * - Storing and retrieving activities
 * - Managing folder data
 * - Handling AsyncStorage operations
 * - Maintaining data structure consistency
 */
export class StorageService {
    static async initializePreservedFolders(): Promise<void> {
        try {
            const existingFolders = await this.getFolders();

            // Check if we already have preserved folders
            const hasPreservedFolders = existingFolders.some(
                folder => folder.type === 'system'
            );

            if (!hasPreservedFolders) {
                const preservedFolders: Folder[] = PRESERVED_FOLDERS.map(name => ({
                    // For All -> system-all
                    // For Today -> system-today  
                    // For This Week -> system-this-week
                    // For Yesterday -> system-yesterday
                    // For Last Week -> system-last-week
                    // For Recently Deleted -> system-recently-deleted
                    id: `system-${name.toLowerCase().replace(/\s+/g, '-')}`,
                    name,
                    type: 'system',
                    createdAt: new Date().toISOString()
                }));

                await this.setFolders([...existingFolders, ...preservedFolders]);
            }
        } catch (error) {
            console.error('Error initializing preserved folders:', error);
        }
    }

    // Folder operations
    static async getFolders(): Promise<Folder[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.FOLDERS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting folders:', error);
            return [];
        }
    }

    static async setFolders(folders: Folder[]): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
        } catch (error) {
            console.error('Error setting folders:', error);
        }
    }

    static async getActivities(folderId: string): Promise<Activity[]> {
        try {
            const key = `${STORAGE_KEYS.ACTIVITIES}-${folderId}`;
            const data = await AsyncStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting activities:', error);
            return [];
        }
    }

    static async setActivities(folderId: string, activities: Activity[]): Promise<void> {
        try {
            const key = `${STORAGE_KEYS.ACTIVITIES}-${folderId}`;
            await AsyncStorage.setItem(key, JSON.stringify(activities));
        } catch (error) {
            console.error('Error setting activities:', error);
        }
    }
}