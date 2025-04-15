import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, Button, StyleSheet, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PreFiltersScreen({ navigation, route }) {
    const { selectedPeople } = route.params;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cuisineOptions, setCuisineOptions] = useState([]);
    const [filters, setFilters] = useState({});
    const [currentFilter, setCurrentFilter] = useState({
        cuisine: '',
        maxPrice: '5',
        minRating: '1',
        delivery: false,
    });

    const currentPerson = selectedPeople[currentIndex];

    useEffect(() => {
        const loadCuisines = async () => {
            const stored = await AsyncStorage.getItem('restaurants');
            if (!stored) return;
            const restaurants = JSON.parse(stored);
            const cuisines = [...new Set(restaurants.map(r => r.type))];
            setCuisineOptions(cuisines);
        };
        loadCuisines();
    }, []);

    useEffect(() => {
        if (cuisineOptions.length > 0) {
            setCurrentFilter(f => ({ ...f, cuisine: cuisineOptions[0] }));
        }
    }, [cuisineOptions]);

    const handleNext = () => {
        selectedPeople[currentIndex].filters = currentFilter;

        if (currentIndex < selectedPeople.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setCurrentFilter({
                cuisine: cuisineOptions[0],
                maxPrice: '5',
                minRating: '1',
                delivery: false
            });
        } else {
            navigation.navigate('Choice', { selectedPeople });
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Filters for {currentPerson.firstName}</Text>

            <Text style={styles.label}>Preferred Cuisine:</Text>
            <Picker
                selectedValue={currentFilter.cuisine}
                onValueChange={(value) => setCurrentFilter(f => ({ ...f, cuisine: value }))}
                style={styles.picker}
            >
                {cuisineOptions.map(cuisine => (
                    <Picker.Item key={cuisine} label={cuisine} value={cuisine} />
                ))}
            </Picker>

            <Text style={styles.label}>Max Price:</Text>
            <Picker
                selectedValue={currentFilter.maxPrice}
                onValueChange={(value) => setCurrentFilter(f => ({ ...f, maxPrice: value }))}
                style={styles.picker}
            >
                {[1, 2, 3, 4, 5].map(p => (
                    <Picker.Item key={p} label={`$`.repeat(p)} value={String(p)} />
                ))}
            </Picker>

            <Text style={styles.label}>Min Rating:</Text>
            <Picker
                selectedValue={currentFilter.minRating}
                onValueChange={(value) => setCurrentFilter(f => ({ ...f, minRating: value }))}
                style={styles.picker}
            >
                {[1, 2, 3, 4, 5].map(r => (
                    <Picker.Item key={r} label={`${r}★`} value={String(r)} />
                ))}
            </Picker>

            <View style={styles.switchRow}>
                <Text style={styles.label}>Needs Delivery:</Text>
                <Switch
                    value={currentFilter.delivery}
                    onValueChange={(val) => setCurrentFilter(f => ({ ...f, delivery: val }))}
                />
            </View>

            <Button title={currentIndex < selectedPeople.length - 1 ? "Next Person" : "Continue"} onPress={handleNext} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    text: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 16, marginTop: 10 },
    picker: { height: 50, width: '100%' },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'space-between',
    }
});
