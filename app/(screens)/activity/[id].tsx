import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useActivityContext } from '../../../src/context/ActivityContext';
import { startOfDay, isToday, parseISO } from 'date-fns';
import { ActivityHistoryService } from '../../../src/services/ActivityHistoryService';
import { ALL_FOLDER } from '../../../src/constants/preservedFolders';
import { RepetitionType } from '../../../src/types/types';
import { DaysOfWeekSelector } from '../../../src/components/DaysOfWeekSelector';
import { AppFooter } from '../../../src/components/AppFooter';

export default function ActivityScreen() {
    const { id, date, source } = useLocalSearchParams<{ 
        id: string; 
        date?: string;
        source: string;
    }>();
    
    const { activities, updateActivity } = useActivityContext();
    const [isDone, setIsDone] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedRepetitionType, setEditedRepetitionType] = useState<RepetitionType>('daily');
    const [selectedDays, setSelectedDays] = useState<number[]>([new Date().getDay()]);
    
    const activity = activities.find(a => a.id === id);
    const isFromAllFolder = source === ALL_FOLDER;
    const targetDate = date ? startOfDay(parseISO(date)) : startOfDay(new Date());
    const isHistorical = !isToday(targetDate);

    useEffect(() => {
        if (activity) {
            setEditedName(activity.name);
            setEditedRepetitionType(activity.repetitionType);
            setSelectedDays(activity.selectedDays || [new Date().getDay()]);
        }
    }, [activity]);

    useEffect(() => {
        if (!isFromAllFolder) {
            const loadActivityStatus = async () => {
                const history = await ActivityHistoryService.getHistoryForDate(targetDate);
                const activityHistory = history.find(h => h.activityId === id);
                setIsDone(activityHistory?.isDone ?? false);
            };
            loadActivityStatus();
        }
    }, [id, targetDate, isFromAllFolder]);

    const handleToggleDone = async () => {
        if (isHistorical) return;

        const history = await ActivityHistoryService.getHistoryForDate(targetDate);
        const updatedHistory = history.map(h =>
            h.activityId === id ? { ...h, isDone: !isDone } : h
        );

        await ActivityHistoryService.setHistoryForDate(targetDate, updatedHistory);
        setIsDone(!isDone);
    };

    const handleRepetitionChange = () => {
        const types: RepetitionType[] = ['daily', 'weekly', 'specific days'];
        const currentIndex = types.indexOf(editedRepetitionType);
        const nextIndex = (currentIndex + 1) % types.length;
        setEditedRepetitionType(types[nextIndex]);
    };

    const handleSave = () => {
        if (activity) {
            const updatedActivity = {
                ...activity,
                name: editedName.trim(),
                repetitionType: editedRepetitionType,
                selectedDays: editedRepetitionType === 'specific days' ? selectedDays : undefined,
            };
            updateActivity(updatedActivity);
            router.back();
        }
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
                    headerBackTitle: 'Back',
                    headerRight: isFromAllFolder ? () => (
                        <Pressable onPress={handleSave}>
                            <Text style={styles.saveButton}>Save</Text>
                        </Pressable>
                    ) : undefined
                }}
            />
            <View style={styles.container}>
                {isFromAllFolder ? (
                    <>
                        <View style={styles.editSection}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={editedName}
                                onChangeText={setEditedName}
                                placeholder="Activity name"
                            />
                        </View>
                        <Pressable
                            style={styles.repetitionButton}
                            onPress={handleRepetitionChange}
                        >
                            <Text style={styles.label}>Repeats</Text>
                            <Text style={styles.value}>{editedRepetitionType}</Text>
                        </Pressable>
                        {editedRepetitionType === 'specific days' && (
                            <View style={styles.daysSelector}>
                                <DaysOfWeekSelector
                                    selectedDays={selectedDays}
                                    onDaysChange={setSelectedDays}
                                />
                            </View>
                        )}
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </View>
            <AppFooter />
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
    editSection: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    repetitionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    daysSelector: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    input: {
        fontSize: 16,
        color: '#333',
        padding: 8,
        marginTop: 4,
        backgroundColor: '#f8f8f8',
        borderRadius: 4,
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    value: {
        fontSize: 16,
        color: '#007AFF',
    },
    saveButton: {
        color: '#007AFF',
        fontSize: 17,
        fontWeight: '600',
        paddingHorizontal: 16,
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