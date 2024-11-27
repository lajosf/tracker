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
const LAST_WEEK_DATE = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

export const ACTIVITIES: Activity[] = [

    { id: '1', name: 'Today1', folder: 'none', done: false, createdAt: new Date().toISOString(), deletedAt: null },
    { id: '2', name: 'Yesterday', folder: 'none', done: false, createdAt: YESTERDAY_DATE, deletedAt: null },
    { id: '3', name: 'Every Tuesday', folder: 'none', done: false, createdAt: A_TUESDAY_IN_THE_PAST, deletedAt: null },
    { id: '4', name: 'LastWeek1', folder: 'none', done: false, createdAt: LAST_WEEK_DATE, deletedAt: null },
    { id: '5', name: 'LastWeek2', folder: 'none', done: false, createdAt: LAST_WEEK_DATE, deletedAt: null },
    { id: '6', name: 'Deleted1', folder: 'none', done: false, createdAt: new Date().toISOString(), deletedAt: new Date().toISOString() },
    { id: '7', name: 'Deleted2', folder: 'none', done: false, createdAt: new Date().toISOString(), deletedAt: new Date().toISOString() },
];

export default { FOLDERS, ACTIVITIES };