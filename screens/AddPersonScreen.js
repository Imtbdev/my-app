import React, { useState, useRef } from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Text,
    ToastAndroid,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const RELATIONSHIP_TYPES = Array.from(new Set(['Me', 'Family', 'Friend', 'Coworker', 'Other']));

export default function AddPersonScreen({ navigation, route }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [relationship, setRelationship] = useState(RELATIONSHIP_TYPES[0]);
    const [errors, setErrors] = useState({});

    const lastNameRef = useRef(null);

    const validateField = (name, value) => {
        switch (name) {
            case 'firstName':
                if (!value.trim()) return 'First name is required';
                if (value.length < 2) return 'First name must be at least 2 characters';
                return '';
            case 'lastName':
                if (!value.trim()) return 'Last name is required';
                if (value.length < 2) return 'Last name must be at least 2 characters';
                return '';
            default:
                return '';
        }
    };

    const handleBlur = (field, value) => {
        const message = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    const handleChange = (field, value) => {
        if (field === 'firstName') setFirstName(value);
        if (field === 'lastName') setLastName(value);
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const handleSave = () => {
        const firstNameError = validateField('firstName', firstName);
        const lastNameError = validateField('lastName', lastName);

        const newErrors = {
            firstName: firstNameError,
            lastName: lastNameError
        };

        setErrors(newErrors);

        if (firstNameError || lastNameError) {
            ToastAndroid.show('Please fix the errors before saving', ToastAndroid.SHORT);
            if (firstNameError) {
                return;
            } else if (lastNameError) {
                lastNameRef.current?.focus();
                return;
            }
        } else {
            if (route.params?.addPerson) {
                route.params.addPerson({ firstName, lastName, relationship });
            }
            navigation.goBack();
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <TextInput
                    style={[styles.input, errors.firstName ? styles.errorInput : null]}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={(value) => handleChange('firstName', value)}
                    onBlur={() => handleBlur('firstName', firstName)}
                    returnKeyType="next"
                    onSubmitEditing={() => lastNameRef.current?.focus()}
                />
                {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

                <TextInput
                    ref={lastNameRef}
                    style={[styles.input, errors.lastName ? styles.errorInput : null]}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={(value) => handleChange('lastName', value)}
                    onBlur={() => handleBlur('lastName', lastName)}
                    returnKeyType="done"
                />
                {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

                <Picker selectedValue={relationship} onValueChange={setRelationship}>
                    {RELATIONSHIP_TYPES.map((type, index) => (
                        <Picker.Item key={`${type}-${index}`} label={type} value={type} />
                    ))}
                </Picker>

                <Button title="Save" onPress={handleSave} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 16 },
    input: {
        borderBottomWidth: 1,
        marginBottom: 8,
        padding: 8,
    },
    errorInput: {
        borderBottomColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 8,
    },
});
