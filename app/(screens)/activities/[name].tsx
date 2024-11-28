import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Activity } from '../../../src/types/types';
import { filterActivities } from '../../../src/utils/activityFilters';
import { useActivityContext } from '../../../src/context/ActivityContext';
import { useState, useEffect } from 'react';
import { subDays, startOfDay } from 'date-fns';
import { LAST_7DAYS_FOLDER, TODAY_FOLDER, YESTERDAY_FOLDER, ALL_FOLDER, RECENTLY_DELETED_FOLDER } from '../../../src/constants/preservedFolders';

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
                    const today = startOfDay(new Date());
                    const yesterday = subDays(today, 1);
                    const sevenDaysAgo = subDays(yesterday, 6);
                    const weekActivities = await getActivitiesWithHistory(sevenDaysAgo, yesterday);
                    setActivitiesWithHistory(weekActivities);
                    break;
                }
                case TODAY_FOLDER: {
                    const todayActivities = await getActivitiesWithHistory(today, today);
                    setActivitiesWithHistory(todayActivities);
                    break;
                }
                case ALL_FOLDER:
                case RECENTLY_DELETED_FOLDER:
                default:
                    setActivitiesWithHistory(
                        filterActivities(activities, name).map(a => ({ ...a, isDone: false }))
                    );
            }
        };

        loadActivities();
    }, [name, activities]);

    const renderItem = ({ item }: { item: Activity & { isDone: boolean } }) => (
        <Pressable
            style={styles.activityItem}
            onPress={() => {
                let targetDate = new Date();

                switch (name) {
                    case TODAY_FOLDER:
                        targetDate = new Date();
                        break;
                    case YESTERDAY_FOLDER:
                        targetDate = subDays(new Date(), 1);
                        break;
                    case LAST_7DAYS_FOLDER: {
                        const today = startOfDay(new Date());
                        const yesterday = subDays(today, 1);
                        const sevenDaysAgo = subDays(yesterday, 6);
                        targetDate = yesterday;
                        break;
                    }
                    default:
                        targetDate = new Date();
                }

                router.push({
                    pathname: `/activity/${item.id}`,
                    params: { date: targetDate.toISOString() }
                });
            }}
        >
            <Text style={[styles.activityText, item.isDone && styles.doneActivity]}>
                {item.name}
            </Text>
        </Pressable>
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