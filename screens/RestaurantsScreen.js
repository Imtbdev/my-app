import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RestaurantsScreen({ navigation }) {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const loadRestaurants = async () => {
            const storedRestaurants = await AsyncStorage.getItem('restaurants');
            if (storedRestaurants) setRestaurants(JSON.parse(storedRestaurants));
        };
        loadRestaurants();
    }, []);

    const saveRestaurants = async (updatedRestaurants) => {
        await AsyncStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
        setRestaurants(updatedRestaurants);
    };

    const handleDelete = (id) => {
        const updatedRestaurants = restaurants.filter((restaurant) => restaurant.id !== id);
        saveRestaurants(updatedRestaurants);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={restaurants}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
                        >
                            <Text style={styles.name}>{item.name}</Text>
                            <Text>{item.type} · {`💲`.repeat(item.price)} · {`⭐`.repeat(item.rating)}</Text>
                        </TouchableOpacity>
                        <Button title="Delete" color="red" onPress={() => handleDelete(item.id)} />
                    </View>
                )}
            />
            <Button
                title="Add Restaurant"
                onPress={() => navigation.navigate('AddRestaurant', {
                    addRestaurant: async (newRestaurant) => {
                        const updatedRestaurants = [...restaurants, { id: String(restaurants.length + 1), ...newRestaurant }];
                        saveRestaurants(updatedRestaurants);
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