import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { FOLDERS } from '../../src/constants/data';
import { PreservedFolderType } from '../../src/types/types';

export default function FoldersScreen(): JSX.Element {
    const renderItem = ({ item }: { item: PreservedFolderType }) => (
        <Link
            href={{
                pathname: "/activities/[name]",
                params: { name: item }
            }}
            asChild
        >
            <Pressable style={styles.folderItem}>
                <Text style={styles.folderText}>{item}</Text>
            </Pressable>
        </Link>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Folders</Text>
            <FlatList
                data={FOLDERS}
                renderItem={renderItem}
                keyExtractor={(item: PreservedFolderType) => item}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#000',
    },
    folderItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    folderText: {
        fontSize: 16,
        color: '#333',
    },
});