import {Slot} from 'expo-router';
import {LogProvider} from './LogProvider';
import {LogBox} from 'react-native';

export default function RootLayout() {
    LogBox.ignoreAllLogs(); // Optional: Disable all logs
    return (
        <LogProvider>
            <Slot/>
        </LogProvider>
    );
}