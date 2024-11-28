import React, { createContext, useState, useContext, useEffect } from 'react';
import { Activity } from '../types/types';
import { StorageService } from '../services/StorageService';

interface ActivityContextType {
    activities: Activity[];
    addActivity: (activity: Activity) => void;
    updateActivity: (activity: Activity) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        // Load activities from storage when component mounts
        const loadActivities = async () => {
            const storedActivities = await StorageService.getActivities('none');
            setActivities(storedActivities);
        };
        loadActivities();
    }, []);

    const addActivity = async (activity: Activity) => {
        setActivities(prevActivities => {
            const newActivities = [...prevActivities, activity];
            StorageService.setActivities('none', newActivities);
            return newActivities;
        });
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

    return (
        <ActivityContext.Provider value={{ activities, addActivity, updateActivity }}>
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