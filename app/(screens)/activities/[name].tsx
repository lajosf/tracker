import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Activity } from '../../../src/types/types';
import { filterActivities } from '../../../src/utils/activityFilters';
import { useActivityContext } from '../../../src/context/ActivityContext';

export default function ActivitiesScreen(): JSX.Element {
    const { name } = useLocalSearchParams<{ name: string }>();
    const { activities } = useActivityContext();

    const activitiesToListUnderTheFolder = filterActivities(activities, name);

    const renderItem = ({ item }: { item: Activity }) => (
        <View style={styles.activityItem}>
            <Text style={styles.activityText}>{item.name}</Text>
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
                    data={activitiesToListUnderTheFolder}
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
});