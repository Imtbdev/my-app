import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardType } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CUISINE_TYPES = [
    "Algerian", "American", "BBQ", "Belgian", "Brazilian", "British", "Cajun",
    "Canadian", "Chinese", "Cuban", "Egyptian", "Filipino", "French", "German",
    "Greek", "Haitian", "Hawaiian", "Indian", "Irish", "Italian", "Japanese",
    "Jewish", "Kenyan", "Korean", "Latvian", "Libyan", "Mediterranean", "Mexican",
    "Mormon", "Nigerian", "Other", "Peruvian", "Polish", "Portuguese", "Russian",
    "Salvadorian", "Sandwiche Shop", "Scottish", "Seafood", "Spanish", "Steak House",
    "Sushi", "Swedish", "Tahitian", "Thai", "Tibetan", "Turkish", "Welsh"
];
const RATINGS = ["1", "2", "3", "4", "5"];
const PRICES = ["1", "2", "3", "4", "5"];

export default function AddRestaurantScreen({ navigation, route }) {
    const [name, setName] = useState('');
    const [type, setType] = useState(CUISINE_TYPES[0]);
    const [price, setPrice] = useState("1");
    const [rating, setRating] = useState("1");
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [website, setWebsite] = useState('');
    const [delivery, setDelivery] = useState(true);
    const [errors, setErrors] = useState({});

    // Validation Functions
    const validateName = () => {
        if (!name.trim()) return "Name is required.";
        if (name.length < 3) return "Name must be at least 3 characters.";
        return null;
    };

    const validatePhone = () => {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phone.trim()) return "Phone number is required.";
        if (!phoneRegex.test(phone)) return "Phone number must be 10 digits.";
        return null;
    };

    const validateAddress = () => {
        if (!address.trim()) return "Address is required.";
        if (address.length < 5) return "Address must be at least 5 characters.";
        return null;
    };

    const validateWebsite = () => {
        const urlRegex = /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!website.trim()) return "Website is required.";
        if (!urlRegex.test(website)) return "Website must start with http:// or https://.";
        return null;
    };

    const validateDelivery = () => {
        if (delivery === '') return "Delivery option is required.";
        return null;
    };

    const clearError = (field) => {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: null }));
    };

    const validateAll = () => {
        const newErrors = {};
        newErrors.name = validateName();
        newErrors.phone = validatePhone();
        newErrors.address = validateAddress();
        newErrors.website = validateWebsite();
        newErrors.delivery = validateDelivery();
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === null);
    };

    const handleSave = () => {
        if (validateAll()) {
            if (route.params?.addRestaurant) {
                route.params.addRestaurant({
                    name,
                    type,
                    price: Number(price),
                    rating: Number(rating),
                    phone,
                    address,
                    website,
                    delivery
                });
            }
            navigation.goBack();
        } else {
            Alert.alert("Validation Error", "Please fix the errors before submitting.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, errors.name && styles.errorInput]}
                placeholder="Restaurant Name"
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    clearError('name');
                }}
                keyboardType="default"
            />
            {errors.name && <Text style={styles.errorMessage}>{errors.name}</Text>}

            <Text style={styles.label}>Cuisine Type</Text>
            <Picker
                selectedValue={type}
                onValueChange={(value) => setType(value)}
                style={styles.picker}
            >
                {CUISINE_TYPES.map((cuisine) => (
                    <Picker.Item key={cuisine} label={cuisine} value={cuisine} />
                ))}
            </Picker>

            <Text style={styles.label}>Price Level</Text>
            <Picker
                selectedValue={price}
                onValueChange={(value) => setPrice(value)}
                style={styles.picker}
            >
                {PRICES.map((price) => (
                    <Picker.Item key={price} label={price} value={price} />
                ))}
            </Picker>

            <Text style={styles.label}>Rating</Text>
            <Picker
                selectedValue={rating}
                onValueChange={(value) => setRating(value)}
                style={styles.picker}
            >
                {RATINGS.map((rating) => (
                    <Picker.Item key={rating} label={rating} value={rating} />
                ))}
            </Picker>

            <Text style={styles.label}>Delivery:</Text>
            <Picker
                selectedValue={delivery}
                style={styles.picker}
                onValueChange={(value) => {
                    setDelivery(value);
                    clearError('delivery');
                }}
            >
                <Picker.Item label="Yes" value={true} />
                <Picker.Item label="No" value={false} />
            </Picker>
            {errors.delivery && <Text style={styles.errorMessage}>{errors.delivery}</Text>}

            <TextInput
                style={[styles.input, errors.phone && styles.errorInput]}
                placeholder="Phone"
                value={phone}
                onChangeText={(text) => {
                    setPhone(text);
                    clearError('phone');
                }}
                keyboardType="numeric"
            />
            {errors.phone && <Text style={styles.errorMessage}>{errors.phone}</Text>}

            <TextInput
                style={[styles.input, errors.address && styles.errorInput]}
                placeholder="Address"
                value={address}
                onChangeText={(text) => {
                    setAddress(text);
                    clearError('address');
                }}
                keyboardType="default"
            />
            {errors.address && <Text style={styles.errorMessage}>{errors.address}</Text>}

            <TextInput
                style={[styles.input, errors.website && styles.errorInput]}
                placeholder="Website"
                value={website}
                onChangeText={(text) => {
                    setWebsite(text);
                    clearError('website');
                }}
                keyboardType="url"
            />
            {errors.website && <Text style={styles.errorMessage}>{errors.website}</Text>}

            <Button title="Save" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 10,
        borderColor: '#ccc',
    },
    errorInput: {
        borderColor: 'red',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    picker: {
        marginBottom: 16,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 8,
    },
});