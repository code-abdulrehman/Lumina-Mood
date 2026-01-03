import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useMood } from '../context/MoodContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MeshBackground } from '../components/MeshBackground';
import { APP_ROUTES } from './routes';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    const insets = useSafeAreaInsets();
    const { primaryColor, theme } = useMood();

    return (
        <MeshBackground>
            <Tab.Navigator
                initialRouteName="Mood"
                screenOptions={{
                    headerShown: false,
                    // Fix for web: ensure proper stacking context
                    sceneStyle: Platform.OS === 'web'
                        ? {
                            backgroundColor: 'transparent',
                            position: 'absolute' as any,
                            width: '100%',
                            height: '100%',
                        }
                        : { backgroundColor: 'transparent' },
                    lazy: true,
                    tabBarStyle: {
                        backgroundColor: theme.background,
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                        borderTopWidth: 0,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -0.5 },
                        shadowOpacity: 0.2,
                        shadowRadius: 1,
                        elevation: 3,
                        height: (Platform.OS === 'ios' ? 55 : 60) + insets.bottom,
                        paddingBottom: insets.bottom || 10,
                        paddingTop: 10,
                    },
                    tabBarActiveTintColor: primaryColor,
                    tabBarInactiveTintColor: theme.text + '50',
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: '700',
                        marginBottom: Platform.OS === 'android' ? 5 : 0,
                    },
                }}
                detachInactiveScreens={true}
            >
                {APP_ROUTES.map((route) => (
                    <Tab.Screen
                        key={route.name}
                        name={route.name}
                        component={route.component}
                        options={{
                            tabBarLabel: route.label,
                            tabBarIcon: ({ color }) => <route.icon size={22} color={color} />,
                        }}
                    />
                ))}
            </Tab.Navigator>
        </MeshBackground>
    );
};