import { Activity } from '../types/types';
import {
    isYesterday,
    subDays,
    isWithinInterval,
    startOfDay
} from 'date-fns';

import {
    ALL_FOLDER,
    TODAY_FOLDER,
    YESTERDAY_FOLDER,
    LAST_7DAYS_FOLDER,
    RECENTLY_DELETED_FOLDER
} from '../constants/preservedFolders';

const predicates = {
    isNotDeleted: (activity: Activity): boolean => !activity.deletedAt,
    isDeleted: (activity: Activity): boolean => activity.deletedAt !== null,
    matchesFolder: (folderName: string) => (activity: Activity): boolean =>
        activity.folder === folderName,
};

export const shouldShowActivity = (activity: Activity, targetDate: Date = new Date()): boolean => {
    if (!activity.createdAt) return false;
    if (activity.deletedAt) return false;

    const createdDate = new Date(activity.createdAt);

    switch (activity.repetitionType) {
        case 'daily':
            return true;
        case 'weekly':
            return createdDate.getDay() === targetDate.getDay();
        default:
            return false;
    }
};

const isActivityInLast7Days = (activity: Activity): boolean => {
    if (!activity.createdAt) return false;
    const createdDate = new Date(activity.createdAt);
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);
    
    return isWithinInterval(createdDate, { start: sevenDaysAgo, end: today });
};

export const filterActivities = (
    activities: Activity[],
    folderName: string
): Activity[] => {
    switch (folderName) {
        case ALL_FOLDER:
            return activities.filter(predicates.isNotDeleted);

        case TODAY_FOLDER:
            return activities.filter(activity =>
                shouldShowActivity(activity) && predicates.isNotDeleted(activity)
            );

        case YESTERDAY_FOLDER:
            return activities.filter(activity => {
                if (!predicates.isNotDeleted(activity) || !activity.createdAt) return false;
                return isYesterday(new Date(activity.createdAt)) ||
                    (activity.repetitionType === 'daily' || activity.repetitionType === 'weekly');
            });

        case LAST_7DAYS_FOLDER:
            return activities.filter(activity => {
                if (!predicates.isNotDeleted(activity)) return false;
                return isActivityInLast7Days(activity) || activity.repetitionType === 'daily';
            });

        case RECENTLY_DELETED_FOLDER:
            return activities.filter(predicates.isDeleted);

        default:
            return activities.filter(activity =>
                predicates.matchesFolder(folderName)(activity) &&
                predicates.isNotDeleted(activity)
            );
    }
};

export const filterActivitiesForLast7Days = async (
    activities: Activity[],
    getActivitiesWithHistory: (startDate: Date, endDate: Date) => Promise<Array<Activity & { isDone: boolean }>>
): Promise<Array<Activity & { isDone: boolean }>> => {
    const today = startOfDay(new Date());
    const sevenDaysAgo = subDays(today, 7);
    
    return getActivitiesWithHistory(sevenDaysAgo, today);
};