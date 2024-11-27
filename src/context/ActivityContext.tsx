import React, { createContext, useState, useContext, useEffect } from 'react';
import { Activity } from '../types/types';
import { ACTIVITIES } from '../constants/data';

interface ActivityContextType {
    activities: Activity[];
    addActivity: (activity: Activity) => void;
    updateActivity: (activity: Activity) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        setActivities(ACTIVITIES);
    }, []);

    const addActivity = (activity: Activity) => {
        setActivities(prevActivities => [...prevActivities, activity]);
    };

    const updateActivity = (updatedActivity: Activity) => {
        setActivities(prevActivities =>
            prevActivities.map(activity =>
                activity.id === updatedActivity.id ? updatedActivity : activity
            )
        );
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