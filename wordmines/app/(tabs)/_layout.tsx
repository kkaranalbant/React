import {Tabs} from 'expo-router';
import React from 'react';
import {Platform} from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();


    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // iOS'da blur efekti için şeffaf arkaplan
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="house.fill" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="paperplane.fill" color={color}/>,
                }}
            />
            {/* Oyun ekranlarını ekleyin */}
            <Tabs.Screen
                name="JoinGameScreen"
                options={{
                    title: 'Oyun',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="gamecontroller.fill" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="GameTableScreen"
                options={{
                    title: 'Tahta',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="square.grid.3x3.fill" color={color}/>,
                    // Bu ekranın tab bar'da gözükmemesi için:
                    tabBarButton: () => null,
                }}
            />
        </Tabs>
    );
}