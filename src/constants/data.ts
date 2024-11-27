import { Activity, PreservedFolderType } from "../types/types";

export const FOLDERS: PreservedFolderType[] = [
    'All',
    'Today',
    'This Week',
    'Yesterday',
    'Last Week',
    'Recently Deleted'
];

const YESTERDAY_DATE = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
const A_TUESDAY_IN_THE_PAST = new Date('2024-01-09').toISOString() // Setting to a specific Tuesday
const A_WEDNESDAY_IN_THE_PAST = new Date('2024-01-10').toISOString() // Setting to a specific Wednesday

export const ACTIVITIES: Activity[] = [
    { id: '1', name: 'Daily1', folder: 'none', createdAt: new Date().toISOString(), deletedAt: null, repetitionType: 'daily' },
    { id: '2', name: 'Daily2', folder: 'none', createdAt: YESTERDAY_DATE, deletedAt: null, repetitionType: 'daily' },
    { id: '3', name: 'Weekly - Every Tuesday', folder: 'none', createdAt: A_TUESDAY_IN_THE_PAST, deletedAt: null, repetitionType: 'weekly' },
    { id: '4', name: 'Weekly - Every Wednesday', folder: 'none', createdAt: A_WEDNESDAY_IN_THE_PAST, deletedAt: null, repetitionType: 'weekly' }
];

export default { FOLDERS, ACTIVITIES };