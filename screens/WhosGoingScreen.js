import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WhosGoingScreen({ navigation }) {
    const [people, setPeople] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        const loadPeople = async () => {
            const storedPeople = await AsyncStorage.getItem('people');
            if (storedPeople) setPeople(JSON.parse(storedPeople));
        };
        loadPeople();
    }, []);

    const toggleSelection = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleNext = () => {
        const selectedPeople = people.filter(p => selectedIds.includes(p.id));
        navigation.navigate('PreFilters', { selectedPeople });
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedIds.includes(item.id);
        return (
            <TouchableOpacity
                style={[styles.listItem, isSelected && styles.selectedItem]}
                onPress={() => toggleSelection(item.id)}
            >
                <Text style={styles.text}>
                    {item.firstName} {item.lastName}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Who’s Going?</Text>
            <FlatList
                data={people}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                extraData={selectedIds}
            />
            <Button
                title="Next"
                onPress={handleNext}
                disabled={selectedIds.length === 0}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    text: { fontSize: 18, margin: 10 },
    listItem: {
        padding: 10,
        margin: 5,
        backgroundColor: '#ddd',
        borderRadius: 5,
        width: 300,
        alignItems: 'center'
    },
    selectedItem: {
        backgroundColor: '#90ee90',
    }
});
