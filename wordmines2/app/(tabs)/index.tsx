// app/(tabs)/index.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import JoinGameScreen from './JoinGameScreen';
import GameTableScreen from './GameTableScreen';
import { LogBox } from 'react-native';

const Stack = createNativeStackNavigator();

export default function Index() {

    LogBox.ignoreAllLogs();

    return (
        <Stack.Navigator initialRouteName="JoinGame">
            <Stack.Screen
                name="JoinGame"
                component={JoinGameScreen}
                options={{ title: 'Oyuna Katıl' }}
            />
            <Stack.Screen
                name="GameTable"
                component={GameTableScreen}
                options={{ title: 'Oyun Tahtası' }}
            />
        </Stack.Navigator>
    );
}
