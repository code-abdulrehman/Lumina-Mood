import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { useMood } from '../context/MoodContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MeshBackground } from '../components/MeshBackground';
import { APP_ROUTES } from './routes';
import { AnimatedMoodIcon } from '../components/AnimatedMoodIcon';

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
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        borderTopWidth: 0,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -0.5 },
                        shadowOpacity: 0.2,
                        shadowRadius: 1,
                        elevation: 3,
                        height: (Platform.OS === 'ios' ? 70 : 80) + insets.bottom,
                        paddingBottom: insets.bottom || 20,
                        paddingTop: 10,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                    },
                    tabBarActiveTintColor: primaryColor,
                    tabBarInactiveTintColor: theme.textSecondary,
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: '700',
                        marginBottom: Platform.OS === 'android' ? 5 : 0,
                    },
                }}
                detachInactiveScreens={true}
            >
                {APP_ROUTES.map((route) => {
                    const isHomeTab = route.name === 'Mood';

                    return (
                        <Tab.Screen
                            key={route.name}
                            name={route.name}
                            component={route.component}
                            options={{
                                tabBarLabel: ({ focused, color }) => {
                                    // Home tab: never show label
                                    if (isHomeTab) return null;

                                    // Other tabs: always show label
                                    return (
                                        <Text style={{
                                            color: focused ? primaryColor : color,
                                            fontSize: 10,
                                            fontWeight: '700',
                                            marginTop: 4,
                                            marginBottom: Platform.OS === 'android' ? 5 : 0
                                        }}>
                                            {route.label}
                                        </Text>
                                    );
                                },
                                tabBarIcon: ({ focused, color }) => {
                                    // Home tab: ALWAYS show active style with custom image
                                    if (isHomeTab) {
                                        return (
                                            <View style={{
                                                backgroundColor: primaryColor,
                                                marginTop: 10,
                                                borderRadius: 20,
                                                width: 50,
                                                height: 50,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: Platform.OS === 'android' ? 0 : 0,
                                                shadowColor: primaryColor,
                                                shadowOffset: { width: 0, height: 4 },
                                                shadowOpacity: 0.3,
                                                shadowRadius: 4,
                                                elevation: 5,
                                                overflow: 'hidden'
                                            }}>
                                                <AnimatedMoodIcon />
                                            </View>
                                        );
                                    }

                                    // Other tabs: show primary color icon when focused (no background)
                                    if (focused) {
                                        return (
                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <route.icon
                                                    size={24}
                                                    color={primaryColor}
                                                    strokeWidth={2.5}
                                                />
                                            </View>
                                        );
                                    }

                                    // Other tabs: inactive state
                                    return (
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <route.icon
                                                size={24}
                                                color={color}
                                                strokeWidth={2}
                                            />
                                        </View>
                                    );
                                },
                            }}
                        />
                    );
                })}
            </Tab.Navigator>
        </MeshBackground>
    );
};