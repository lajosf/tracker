import { Activity } from '../types/types';
import {
    isThisWeek,
} from 'date-fns';

import {
    ALL_FOLDER,
    TODAY_FOLDER,
    THIS_WEEK_FOLDER,
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

const isActivityRepeatingThisWeek = (activity: Activity, today: Date): boolean => {
    switch (activity.repetitionType) {
        case 'daily':
            return true;
        case 'weekly':
            return true;
        default:
            return false;
    }
};

const isActivityInThisWeek = (activity: Activity): boolean => {
    if (!activity.createdAt) return false;
    return isThisWeek(new Date(activity.createdAt));
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

        case THIS_WEEK_FOLDER:
            return activities.filter(activity => {
                if (!predicates.isNotDeleted(activity)) return false;

                const today = new Date();
                return isActivityInThisWeek(activity) ||
                    isActivityRepeatingThisWeek(activity, today);
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