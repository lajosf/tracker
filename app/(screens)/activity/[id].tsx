import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useActivityContext } from '../../../src/context/ActivityContext';
import { startOfDay, isToday, parseISO } from 'date-fns';
import { ActivityHistoryService } from '../../../src/services/ActivityHistoryService';
import { ALL_FOLDER } from '../../../src/constants/preservedFolders';
import { RepetitionType } from '../../../src/types/types';
import { DaysOfWeekSelector } from '../../../src/components/DaysOfWeekSelector';

/**
 * Screen component for viewing and editing individual activity details.
 * Provides:
 * - Activity information display
 * - Status toggling for activity completion
 * - Activity editing capabilities
 * - Repetition pattern management
 * - Historical status viewing
 */
export default function ActivityScreen() {
    const { id, date, source } = useLocalSearchParams<{ 
        id: string; 
        date?: string;
        source: string;
    }>();
    
    console.log('ActivityScreen params:', {
        id,
        date,
        source,
        rawParams: useLocalSearchParams()
    });

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
                setIsDone(activityHistory?.isDone || false);
            };
            loadActivityStatus();
        }
    }, [id, targetDate, isFromAllFolder]);

    const handleToggleDone = async () => {
        const newIsDone = !isDone;
        setIsDone(newIsDone);
        await ActivityHistoryService.setActivityStatus(id, targetDate, newIsDone);
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
                name: editedName,
                repetitionType: editedRepetitionType,
                selectedDays: editedRepetitionType === 'specific days' ? selectedDays : undefined,
            };
            updateActivity(updatedActivity);
        }
        router.back();
    };

    if (!activity) {
        return (
            <View style={styles.container}>
                <Text>Activity not found</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: activity.name,
                    headerRight: isFromAllFolder ? () => (
                        <Pressable onPress={handleSave}>
                            <Text style={styles.saveButton}>Save</Text>
                        </Pressable>
                    ) : undefined,
                }}
            />
            <View style={styles.container}>
                {isFromAllFolder ? (
                    <>
                        <TextInput
                            style={styles.input}
                            value={editedName}
                            onChangeText={setEditedName}
                            placeholder="Activity Name"
                        />
                        <Pressable
                            style={styles.repetitionButton}
                            onPress={handleRepetitionChange}
                        >
                            <Text style={styles.label}>Repeat</Text>
                            <Text style={styles.value}>{editedRepetitionType}</Text>
                        </Pressable>
                        
                        {editedRepetitionType === 'specific days' && (
                            <View style={styles.daysContainer}>
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
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    input: {
        fontSize: 16,
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 20,
    },
    repetitionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderRadius: 4,
    },
    daysContainer: {
        marginTop: 20,
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