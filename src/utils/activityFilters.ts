import { Activity } from '../types/types';
import {
    isToday,
    isSameDay,
    isThisWeek,
    isYesterday,
    isSameWeek,
    subWeeks
} from 'date-fns';

import {
    ALL_FOLDER,
    TODAY_FOLDER,
    THIS_WEEK_FOLDER,
    YESTERDAY_FOLDER,
    LAST_WEEK_FOLDER,
    RECENTLY_DELETED_FOLDER
} from '../constants/preservedFolders';

export const shouldShowActivity = (activity: Activity, targetDate: Date = new Date()): boolean => {
    if (!activity.createdAt) return false;
    if (activity.deletedAt) return false;

    const createdDate = new Date(activity.createdAt);

    switch (activity.repetitionType) {
        case 'daily':
            return true;

        case 'weekly':
            return createdDate.getDay() === targetDate.getDay();

        case 'bi-weekly': {
            const daysDiff = Math.floor((targetDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
            const weeksDiff = Math.floor(daysDiff / 7);
            return weeksDiff % 2 === 0 && createdDate.getDay() === targetDate.getDay();
        }

        case 'monthly':
            return createdDate.getDate() === targetDate.getDate();

        case 'day-of-week':
            return createdDate.getDay() === targetDate.getDay();

        default:
            return false;
    }
};

export const filterActivities = (
    activities: Activity[],
    folderName: string
): Activity[] => {
    switch (folderName) {
        case ALL_FOLDER:
            return activities.filter(activity => !activity.deletedAt);

        case TODAY_FOLDER:
            return activities.filter(activity =>
                shouldShowActivity(activity) && !activity.deletedAt
            );

        case THIS_WEEK_FOLDER:
            return activities.filter(activity => {
                if (activity.deletedAt) return false;
                
                if (isThisWeek(new Date(activity.createdAt))) return true;
                
                const today = new Date();
                switch (activity.repetitionType) {
                    case 'daily':
                        return true;
                    case 'weekly':
                    case 'day-of-week':
                        return shouldShowActivity(activity, today);
                    case 'bi-weekly': {
                        const createdDate = new Date(activity.createdAt);
                        const daysDiff = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
                        const weeksDiff = Math.floor(daysDiff / 7);
                        return weeksDiff % 2 === 0;
                    }
                    case 'monthly':
                        return new Date(activity.createdAt).getDate() === today.getDate();
                    default:
                        return false;
                }
            });

        case RECENTLY_DELETED_FOLDER:
            return activities.filter(activity => activity.deletedAt !== null);

        default:
            return activities.filter(activity =>
                activity.folder === folderName && !activity.deletedAt
            );
    }
};