import { PRESERVED_FOLDERS } from "../constants/preservedFolders";

export type FolderType = 'system' | 'user';

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
    completedAt?: string | null;
    createdAt: string;
    deletedAt?: string | null;
}
