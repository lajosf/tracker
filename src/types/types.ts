import { PRESERVED_FOLDERS } from "../constants/preservedFolders";

export type FolderType = 'system' | 'user';
export type RepetitionType = 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'nth-day' | 'day-of-week' | 'day-of-month' | 'nth-time-of-day' | 'nth-time-of-week' | 'nth-time-of-month';
export type PreservedFolderType = typeof PRESERVED_FOLDERS[number];

export interface Folder {
    id: string;
    name: string;
    type: FolderType;
    createdAt: string;
}

export interface Activity {
    id: string;
    name: string;
    folder: string;
    done: boolean;
    repetitionType: RepetitionType;
    completedAt?: string | null;
    createdAt: string;
    deletedAt?: string | null;
}