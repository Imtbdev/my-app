import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';


export default function DecisionTimeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.touchable} onPress={() => navigation.navigate('WhosGoing')}>
                <Image source={require('../assets/its-decision-time.android.png')} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    touchable: { alignItems: 'center', justifyContent: 'center' }
});