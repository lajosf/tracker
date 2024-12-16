import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { useActivityContext } from '../../src/context/ActivityContext';
import { Activity, RepetitionType } from '../../src/types/types';
import { DaysOfWeekSelector } from '../../src/components/DaysOfWeekSelector';

export default function NewActivityScreen() {
    const [name, setName] = useState('');
    const [repetitionType, setRepetitionType] = useState<RepetitionType>('daily');
    const [selectedDays, setSelectedDays] = useState<number[]>([new Date().getDay()]);
    const { addActivity } = useActivityContext();

    const handleDone = () => {
        if (!name.trim()) {
            router.back();
            return;
        }

        const newActivity: Activity = {
            id: Date.now().toString(),
            name: name.trim(),
            folder: 'none',
            repetitionType,
            selectedDays: repetitionType === 'days-of-week' ? selectedDays : undefined,
            createdAt: new Date().toISOString(),
            deletedAt: null,
        };

        addActivity(newActivity);
        router.back();
    };

    const handleRepetitionChange = () => {
        const types: RepetitionType[] = ['daily', 'weekly', 'days-of-week'];
        const currentIndex = types.indexOf(repetitionType);
        const nextIndex = (currentIndex + 1) % types.length;
        setRepetitionType(types[nextIndex]);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'New Activity',
                    headerRight: () => (
                        <Pressable onPress={handleDone}>
                            <Text style={styles.doneButton}>Done</Text>
                        </Pressable>
                    ),
                }}
            />
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Activity Name"
                    value={name}
                    onChangeText={setName}
                    autoFocus
                />
                <Pressable
                    style={styles.repetitionButton}
                    onPress={handleRepetitionChange}
                >
                    <Text style={styles.repetitionLabel}>Repeat</Text>
                    <Text style={styles.repetitionValue}>{repetitionType}</Text>
                </Pressable>
                
                {repetitionType === 'days-of-week' && (
                    <View style={styles.daysContainer}>
                        <DaysOfWeekSelector
                            selectedDays={selectedDays}
                            onDaysChange={setSelectedDays}
                        />
                    </View>
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
    doneButton: {
        color: '#007AFF',
        fontSize: 17,
        fontWeight: '600',
    },
    repetitionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    repetitionLabel: {
        fontSize: 16,
        color: '#000',
    },
    repetitionValue: {
        fontSize: 16,
        color: '#007AFF',
    },
    daysContainer: {
        marginTop: 20,
    },
}); 