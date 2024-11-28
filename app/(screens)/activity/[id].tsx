import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useActivityContext } from '../../../src/context/ActivityContext';
import { startOfDay, isToday, parseISO } from 'date-fns';
import { ActivityHistoryService } from '../../../src/services/ActivityHistoryService';

export default function ActivityScreen() {
    const { id, date } = useLocalSearchParams<{ id: string; date: string }>();
    const { activities } = useActivityContext();
    const [isDone, setIsDone] = useState(false);
    const activity = activities.find(a => a.id === id);

    const targetDate = date ? startOfDay(parseISO(date)) : startOfDay(new Date());
    const isHistorical = !isToday(targetDate);

    useEffect(() => {
        const loadActivityStatus = async () => {
            const history = await ActivityHistoryService.getHistoryForDate(targetDate);
            const activityHistory = history.find(h => h.activityId === id);
            setIsDone(activityHistory?.isDone ?? false);
        };

        loadActivityStatus();
    }, [id, targetDate]);

    const handleToggleDone = async () => {
        if (isHistorical) return;

        const history = await ActivityHistoryService.getHistoryForDate(targetDate);
        const updatedHistory = history.map(h =>
            h.activityId === id ? { ...h, isDone: !isDone } : h
        );

        await ActivityHistoryService.setHistoryForDate(targetDate, updatedHistory);
        setIsDone(!isDone);
    };

    if (!activity) {
        router.back();
        return null;
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: activity.name,
                    headerBackTitle: 'Back'
                }}
            />
            <View style={styles.container}>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Repeats</Text>
                    <Text style={styles.value}>{activity.repetitionType}</Text>
                </View>

                <Pressable
                    style={[
                        styles.doneButton,
                        isDone && styles.doneButtonActive,
                        isHistorical && styles.doneButtonHistorical
                    ]}
                    onPress={handleToggleDone}
                    disabled={isHistorical}
                >
                    <Text style={[
                        styles.doneButtonText,
                        isDone && styles.doneButtonTextActive,
                        isHistorical && styles.doneButtonTextHistorical
                    ]}>
                        {isDone ? 'Done' : 'Mark as Done'}
                    </Text>
                </Pressable>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    infoSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    doneButton: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        marginTop: 16,
    },
    doneButtonActive: {
        backgroundColor: '#4CAF50',
    },
    doneButtonHistorical: {
        opacity: 0.5,
    },
    doneButtonText: {
        fontSize: 16,
        color: '#666',
    },
    doneButtonTextActive: {
        color: '#fff',
    },
    doneButtonTextHistorical: {
        color: '#999',
    },
});