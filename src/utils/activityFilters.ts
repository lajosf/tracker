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

    const createdDate = startOfDay(new Date(activity.createdAt));
    const targetDateStart = startOfDay(targetDate);

    if (targetDateStart < createdDate) {
        return false;
    }

    switch (activity.repetitionType) {
        case 'daily':
            return true;
        case 'weekly':
            return createdDate.getDay() === targetDate.getDay();
        case 'specific days':
            return activity.selectedDays?.includes(targetDate.getDay()) ?? false;
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

        case YESTERDAY_FOLDER: {
            const yesterday = subDays(startOfDay(new Date()), 1);
            return activities.filter(activity => {
                const createdDate = startOfDay(new Date(activity.createdAt));
                return shouldShowActivity(activity, yesterday) &&
                    predicates.isNotDeleted(activity) &&
                    yesterday >= createdDate;
            });
        }

        case LAST_7DAYS_FOLDER: {
            const today = startOfDay(new Date());
            const yesterday = subDays(today, 1);
            const sevenDaysAgo = subDays(yesterday, 6); // 6 more days before yesterday
            return activities.filter(activity => {
                const currentDate = new Date(sevenDaysAgo);
                while (currentDate <= yesterday) { // Only go up to yesterday
                    if (shouldShowActivity(activity, currentDate)) {
                        return true;
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return false;
            });
        }

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