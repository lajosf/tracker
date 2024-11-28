import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Activity } from '../../../src/types/types';
import { filterActivities } from '../../../src/utils/activityFilters';
import { useActivityContext } from '../../../src/context/ActivityContext';
import { useState, useEffect } from 'react';
import { subDays, startOfDay } from 'date-fns';
import { LAST_7DAYS_FOLDER, TODAY_FOLDER, YESTERDAY_FOLDER, ALL_FOLDER } from '../../../src/constants/preservedFolders';

export default function ActivitiesScreen(): JSX.Element {
    const { name } = useLocalSearchParams<{ name: string }>();
    const { activities, getActivitiesWithHistory } = useActivityContext();
    const [activitiesWithHistory, setActivitiesWithHistory] = useState<Array<Activity & { isDone: boolean }>>([]);

    useEffect(() => {
        const loadActivities = async () => {
            const today = startOfDay(new Date());
            
            switch (name) {
                case YESTERDAY_FOLDER: {
                    const yesterday = subDays(today, 1);
                    const yesterdayActivities = await getActivitiesWithHistory(yesterday, yesterday);
                    setActivitiesWithHistory(yesterdayActivities);
                    break;
                }
                case LAST_7DAYS_FOLDER: {
                    const sevenDaysAgo = subDays(today, 7);
                    const weekActivities = await getActivitiesWithHistory(sevenDaysAgo, today);
                    setActivitiesWithHistory(weekActivities);
                    break;
                }
                case ALL_FOLDER:
                default:
                    setActivitiesWithHistory(
                        filterActivities(activities, name).map(a => ({ ...a, isDone: false }))
                    );
            }
        };

        loadActivities();
    }, [name, activities]);

    const renderItem = ({ item }: { item: Activity & { isDone: boolean } }) => (
        <View style={styles.activityItem}>
            <Text style={[styles.activityText, item.isDone && styles.doneActivity]}>
                {item.name}
            </Text>
        </View>
    );

    return (
        <>
            <Stack.Screen
                options={{
                    title: name,
                    headerBackTitle: 'Folders'
                }}
            />
            <View style={styles.container}>
                <FlatList
                    data={activitiesWithHistory}
                    renderItem={renderItem}
                    keyExtractor={(item: Activity) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 60,
    },
    activityItem: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f8f8f8',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    activityText: {
        fontSize: 16,
        color: '#333',
    },
    doneActivity: {
        textDecorationLine: 'line-through',
    },
});