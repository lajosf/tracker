import React, { createContext, useState, useContext, useEffect } from 'react';
import { Activity } from '../types/types';
import { StorageService } from '../services/StorageService';
import { ActivityHistoryService } from '../services/ActivityHistoryService';
import { shouldShowActivity } from '../utils/activityFilters';
import { logger } from '../utils/logger';

interface ActivityContextType {
    activities: Activity[];
    addActivity: (activity: Activity) => void;
    updateActivity: (activity: Activity) => void;
    getActivitiesWithHistory: (startDate: Date, endDate: Date) => Promise<Array<Activity & { isDone: boolean }>>;
    isInitialized: boolean;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load activities and initialize history when app starts
    useEffect(() => {
        const initializeApp = async () => {
            try {
                // Load activities first
                const storedActivities = await StorageService.getActivities('none');
                setActivities(storedActivities);

                // Initialize missing history for all loaded activities
                await ActivityHistoryService.initializeMissingHistory(storedActivities);

                setIsInitialized(true);
            } catch (error) {
                logger.error('Failed to initialize app:', error);
            }
        };

        initializeApp();
    }, []); // Empty dependency array means this runs once when app starts

    // When new activity is added, also initialize its history
    const addActivity = async (activity: Activity) => {
        try {
            setActivities(prevActivities => {
                const newActivities = [...prevActivities, activity];
                StorageService.setActivities('none', newActivities);

                // Initialize history for the new activity
                ActivityHistoryService.initializeMissingHistory([activity])
                    .catch(error => logger.error('Failed to initialize history for new activity:', error));

                return newActivities;
            });
        } catch (error) {
            logger.error('Failed to add activity:', error);
        }
    };

    const updateActivity = async (updatedActivity: Activity) => {
        setActivities(prevActivities => {
            const newActivities = prevActivities.map(activity =>
                activity.id === updatedActivity.id ? updatedActivity : activity
            );
            StorageService.setActivities('none', newActivities);
            return newActivities;
        });
    };

    const getActivitiesWithHistory = async (startDate: Date, endDate: Date) => {
        const history = await ActivityHistoryService.getHistoryForDateRange(startDate, endDate);

        // Get all activities that should show for any day in the range
        const activitiesInRange = activities.filter(activity => {
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                if (shouldShowActivity(activity, currentDate)) {
                    return true;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return false;
        });

        return activitiesInRange.map(activity => ({
            ...activity,
            isDone: history.some(h =>
                h.activityId === activity.id &&
                h.isDone
            )
        }));
    };

    return (
        <ActivityContext.Provider value={{
            activities,
            addActivity,
            updateActivity,
            getActivitiesWithHistory,
            isInitialized
        }}>
            {children}
        </ActivityContext.Provider>
    );
};

export const useActivityContext = () => {
    const context = useContext(ActivityContext);
    if (!context) {
        throw new Error('useActivityContext must be used within an ActivityProvider');
    }
    return context;
};