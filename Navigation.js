import React from 'react';
import { Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import RestaurantsScreen from './screens/RestaurantsScreen';
import DecisionTimeScreen from './screens/DecisionTimeScreen';
import WhosGoingScreen from './screens/WhosGoingScreen';
import PreFiltersScreen from './screens/PreFiltersScreen';
import ChoiceScreen from './screens/ChoiceScreen';
import PostChoiceScreen from './screens/PostChoiceScreen';
import PeopleListScreen from './screens/PeopleListScreen';
import AddRestaurantScreen from './screens/AddRestaurantScreen';
import RestaurantDetailScreen from './screens/RestaurantDetailScreen';
import AddPersonScreen from './screens/AddPersonScreen';
import PersonDetailScreen from './screens/PersonDetailScreen';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const headerOptions = (title, icon) => ({
    headerTitle: () => (
        <Image source={icon} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
    ),
    headerTitleAlign: 'center',
});

function RestaurantsStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, }}>
            <Stack.Screen
                name="RestaurantsList"
                component={RestaurantsScreen}
                options={headerOptions('Restaurants', require('./assets/icon-restaurants.png'))}
            />
            <Stack.Screen name="AddRestaurant" component={AddRestaurantScreen} />
            <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
        </Stack.Navigator>
    );
}

function PeopleStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, }}>
            <Stack.Screen
                name="PeopleList"
                component={PeopleListScreen}
                options={headerOptions('People', require('./assets/icon-people.png'))}
            />
            <Stack.Screen name="AddPerson" component={AddPersonScreen} />
            <Stack.Screen name="PersonDetail" component={PersonDetailScreen} />
        </Stack.Navigator>
    );
}

function DecisionStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, }}>
            <Stack.Screen name="DecisionTime" component={DecisionTimeScreen} />
            <Stack.Screen name="WhosGoing" component={WhosGoingScreen} />
            <Stack.Screen name="PreFilters" component={PreFiltersScreen} />
            <Stack.Screen name="Choice" component={ChoiceScreen} />
            <Stack.Screen name="PostChoice" component={PostChoiceScreen} />
        </Stack.Navigator>
    );
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen
                    name="Restaurants"
                    component={RestaurantsStack}
                    options={{
                        tabBarIcon: () => (
                            <Image source={require('./assets/icon-restaurants.png')} style={{ width: 20, height: 20 }} />
                        )
                    }}
                />
                <Tab.Screen
                    name="Decision"
                    component={DecisionStack}
                    options={{
                        tabBarIcon: () => (
                            <Image source={require('./assets/icon-decision.png')} style={{ width: 20, height: 20 }} />
                        )
                    }}
                />
                <Tab.Screen
                    name="People"
                    component={PeopleStack}
                    options={{
                        tabBarIcon: () => (
                            <Image source={require('./assets/icon-people.png')} style={{ width: 20, height: 20 }} />
                        )
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
