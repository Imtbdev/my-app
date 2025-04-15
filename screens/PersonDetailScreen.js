import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PersonDetailScreen({ route }) {
    const { person } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{person.firstName} {person.lastName}</Text>
            <Text>Relationship: {person.relationship}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
});
