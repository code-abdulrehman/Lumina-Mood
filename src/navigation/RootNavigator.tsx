import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMood } from '../context/MoodContext';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { TabNavigator } from './TabNavigator';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
    const { isOnboarded, isLoading, theme } = useMood();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isOnboarded ? (
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            ) : (
                <Stack.Screen name="Main" component={TabNavigator} />
            )}
        </Stack.Navigator>
    );
};
