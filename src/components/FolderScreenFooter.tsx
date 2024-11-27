import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export function FolderScreenFooter() {
    return (
        <BlurView intensity={30} tint="dark" style={styles.footer}>
            <View style={styles.footerContent}>
                {/* Buttons will go here later */}
            </View>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 45,
        borderTopWidth: 0.5,
        borderTopColor: '#38383A',
        backgroundColor: '#3b3b3b',
    },
    footerContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
    }
});