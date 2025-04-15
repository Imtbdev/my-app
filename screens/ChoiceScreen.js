import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChoiceScreen({ navigation, route }) {
    const [restaurants, setRestaurants] = useState([]);
    const [peopleStatus, setPeopleStatus] = useState([]);
    const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [currentRestaurant, setCurrentRestaurant] = useState(null);

    const selectedPeople = route.params?.selectedPeople || [];
    const filtersFromRoute = route.params?.filters || {};

    useEffect(() => {
        const loadRestaurants = async () => {
            const storedRestaurants = await AsyncStorage.getItem('restaurants');
            if (storedRestaurants) {
                setRestaurants(JSON.parse(storedRestaurants));
            }
        };

        const initPeopleStatus = selectedPeople.map(person => ({
            ...person,
            voted: false,
            vetoed: 'no',
            filters: filtersFromRoute[person.id] || {}
        }));

        setPeopleStatus(initPeopleStatus);
        loadRestaurants();
    }, []);

    useEffect(() => {
        if (restaurants.length && peopleStatus.length) {
            const person = peopleStatus[currentPersonIndex];
            const options = applyFilters(person.filters || {}, restaurants);
            setCurrentOptions(options);
            setCurrentRestaurant(null);
        }
    }, [restaurants, currentPersonIndex, peopleStatus]);

    const applyFilters = (filters, list) => {
        return list.filter(r => {
            return (
                (!filters.cuisine || r.cuisine === filters.cuisine) &&
                (!filters.price || r.price <= parseInt(filters.maxPrice)) &&
                (!filters.rating || r.rating >= parseFloat(filters.minRating)) &&
                (filters.delivery === undefined || r.delivery === filters.delivery)
            );
        });
    };

    const proposeRestaurant = () => {
        if (!currentOptions.length) {
            Alert.alert("No suitable restaurants for current user");
            return;
        }
        const randomIndex = Math.floor(Math.random() * currentOptions.length);
        setCurrentRestaurant(currentOptions[randomIndex]);
    };

    const handleVote = (veto = false) => {
        const updated = [...peopleStatus];
        const votedPerson = updated[currentPersonIndex];
        votedPerson.voted = true;

        let updatedRestaurants = [...restaurants];

        if (veto && currentRestaurant?.id) {
            votedPerson.vetoed = currentRestaurant.id;
            updatedRestaurants = updatedRestaurants.filter(r => r.id !== currentRestaurant.id);
            setRestaurants(updatedRestaurants);
        }

        setPeopleStatus(updated);
        setCurrentRestaurant(null);

        if (currentPersonIndex < peopleStatus.length - 1) {
            setCurrentPersonIndex(i => i + 1);
        }
    };

    const getFinalRestaurant = () => {
        const vetoedIds = peopleStatus.map(p => p.vetoed).filter(v => v !== 'no');
        const allowedRestaurants = restaurants.filter(r => !vetoedIds.includes(r.id));

        if (allowedRestaurants.length === 0) {
            Alert.alert("No restaurant satisfies all votes 😢");
        } else {
            const final = allowedRestaurants[Math.floor(Math.random() * allowedRestaurants.length)];
            navigation.navigate('PostChoice', { restaurant: final });
        }
    };

    const currentPerson = peopleStatus[currentPersonIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Voting — {currentPerson?.firstName} {currentPerson?.lastName}</Text>

            {currentRestaurant ? (
                <View style={styles.restaurantBox}>
                    <Text style={styles.restaurantTitle}>Proposed Restaurant:</Text>
                    <Text style={styles.restaurantName}>{currentRestaurant.name}</Text>
                    <Text>Cuisine: {currentRestaurant.type}</Text>
                    <Text>Price: {'$'.repeat(currentRestaurant.price)}</Text>
                    <Text>Rating: {currentRestaurant.rating} ★</Text>
                    <Text>Delivery: {currentRestaurant.delivery ? 'Yes' : 'No'}</Text>
                    {currentRestaurant.address && <Text>Address: {currentRestaurant.address}</Text>}
                    <Button title="Accept" onPress={() => handleVote(false)} />
                    <Button title="Veto" onPress={() => handleVote(true)} color="#dc3545" />
                </View>
            ) : (
                <Button title="Propose Restaurant" onPress={proposeRestaurant} />
            )}

            <View style={{ marginTop: 30 }}>
                <Text style={styles.subtext}>Participants:</Text>
                <FlatList
                    data={peopleStatus}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.personStatus}>
                            <Text style={styles.personText}>
                                {item.firstName} {item.lastName} — Voted: {item.voted ? 'Yes' : 'No'}, Vetoed: {item.vetoed}
                            </Text>
                        </View>
                    )}
                />
            </View>

            {peopleStatus.every(p => p.voted) && (
                <Button title="Get Result" onPress={getFinalRestaurant} color="#28a745" />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    text: { fontSize: 20, marginVertical: 10 },
    subtext: { fontSize: 16, marginTop: 20, fontWeight: 'bold' },
    personStatus: {
        padding: 8,
        marginVertical: 4,
        backgroundColor: '#eee',
        borderRadius: 6,
        width: '100%'
    },
    personText: { fontSize: 16 },
    restaurantBox: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center'
    },
    restaurantTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    restaurantName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5
    }
});
