import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RestaurantDetailScreen({ route }) {
    const { restaurant } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{restaurant.name}</Text>
            <Text>Cuisine: {restaurant.type}</Text>
            <Text>Price: {`💲`.repeat(restaurant.price)}</Text>
            <Text>Rating: {`⭐`.repeat(restaurant.rating)}</Text>
            <Text>Phone: {restaurant.phone}</Text>
            <Text>Address: {restaurant.address}</Text>
            <Text>Website: {restaurant.website}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
});
