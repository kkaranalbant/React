// app/(tabs)/index.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import JoinGameScreen from './JoinGameScreen';
import GameTableScreen from './GameTableScreen';
import {LogBox} from 'react-native';
import WebViewConfig from './WebViewConfig';

export type RootStackParamList = {
    JoinGame: undefined;
    GameTable: {
        gameId: number;
        userId: number;
        gameData: any;
        gameTable: any;
    };
};

// Stack değişkenini tanımlayalım
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Index() {
    LogBox.ignoreAllLogs();

    return (
        <Stack.Navigator
            initialRouteName="JoinGame"
            screenOptions={{
                headerShown: true,
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen
                name="JoinGame"
                component={JoinGameScreen}
                options={{title: 'Oyuna Katıl'}}
            />
            <Stack.Screen
                name="GameTable"
                component={GameTableScreen}
                options={{title: 'Oyun Tahtası'}}
            />
        </Stack.Navigator>
    );
}