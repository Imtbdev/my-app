import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PeopleListScreen({ navigation }) {
    const [people, setPeople] = useState([]);

    useEffect(() => {
        const loadPeople = async () => {
            const storedPeople = await AsyncStorage.getItem('people');
            if (storedPeople) setPeople(JSON.parse(storedPeople));
        };
        loadPeople();
    }, []);

    const savePeople = async (updatedPeople) => {
        await AsyncStorage.setItem('people', JSON.stringify(updatedPeople));
        setPeople(updatedPeople);
    };

    const handleDelete = (id) => {
        const updatedPeople = people.filter((person) => person.id !== id);
        savePeople(updatedPeople);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={people}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('PersonDetail', { person: item })}
                        >
                            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
                            <Text>{item.relationship}</Text>
                        </TouchableOpacity>
                        <Button title="Delete" color="red" onPress={() => handleDelete(item.id)} />
                    </View>
                )}
            />
            <Button
                title="Add Person"
                onPress={() => navigation.navigate('AddPerson', {
                    addPerson: async (newPerson) => {
                        const updatedPeople = [...people, { id: String(Date.now()), ...newPerson }];
                        savePeople(updatedPeople);
                    }
                })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    item: {
        padding: 16,
        marginBottom: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});