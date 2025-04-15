import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView, Button } from 'react-native';

export default function PostChoiceScreen({ route, navigation }) {
    const { restaurant } = route.params;

    const handleRestartVoting = () => {
        navigation.navigate('DecisionTime')
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>🎉 Final Choice 🎉</Text>
            <Text style={styles.name}>{restaurant.name}</Text>

            <View style={styles.infoBlock}>
                <Text style={styles.label}>Cuisine:</Text>
                <Text style={styles.value}>{restaurant.type}</Text>
            </View>

            <View style={styles.infoBlock}>
                <Text style={styles.label}>Price:</Text>
                <Text style={styles.value}>{'$'.repeat(restaurant.price)}</Text>
            </View>

            <View style={styles.infoBlock}>
                <Text style={styles.label}>Rating:</Text>
                <Text style={styles.value}>{restaurant.rating} ★</Text>
            </View>

            {restaurant.address ? (
                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{restaurant.address}</Text>
                </View>
            ) : null}

            <View style={styles.infoBlock}>
                <Text style={styles.label}>Delivery:</Text>
                <Text style={styles.value}>{restaurant.delivery ? 'Yes 🚚' : 'No'}</Text>
            </View>

            {restaurant.phone ? (
                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.value}>{restaurant.phone}</Text>
                </View>
            ) : null}

            {restaurant.website ? (
                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Website:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(restaurant.website)}>
                        <Text style={[styles.value, styles.link]}>{restaurant.website}</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            <View style={styles.buttonContainer}>
                <Button title="Start New Voting" onPress={handleRestartVoting} color="#007bff" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        flexGrow: 1
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20
    },
    name: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 15
    },
    infoBlock: {
        marginBottom: 10
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16
    },
    value: {
        fontSize: 16
    },
    link: {
        color: '#007bff',
        textDecorationLine: 'underline'
    },
    buttonContainer: {
        marginTop: 30,
        alignSelf: 'stretch'
    }
});
