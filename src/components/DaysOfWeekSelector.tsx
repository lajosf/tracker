import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface Props {
    selectedDays: number[];
    onDaysChange: (days: number[]) => void;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function DaysOfWeekSelector({ selectedDays, onDaysChange }: Props) {
    const toggleDay = (dayIndex: number) => {
        if (selectedDays.includes(dayIndex)) {
            // Don't allow deselecting if it's the last selected day
            if (selectedDays.length > 1) {
                onDaysChange(selectedDays.filter(d => d !== dayIndex));
            }
        } else {
            onDaysChange([...selectedDays, dayIndex]);
        }
    };

    return (
        <View style={styles.container}>
            {DAYS.map((day, index) => (
                <Pressable
                    key={index}
                    style={[
                        styles.dayButton,
                        selectedDays.includes(index) && styles.selectedDay
                    ]}
                    onPress={() => toggleDay(index)}
                >
                    <Text style={[
                        styles.dayText,
                        selectedDays.includes(index) && styles.selectedDayText
                    ]}>
                        {day}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    dayButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    selectedDay: {
        backgroundColor: '#007AFF',
    },
    dayText: {
        fontSize: 15,
        color: '#666',
    },
    selectedDayText: {
        color: '#fff',
    },
}); 