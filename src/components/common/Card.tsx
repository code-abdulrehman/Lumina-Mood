import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useMood } from '../../context/MoodContext';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({ children, style, backgroundColor }) => {
    const { theme } = useMood();
    const bg = backgroundColor || theme.card; // Default to theme.card or white depending on context (usually theme.card is #fff or similar)

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: bg,
                borderRadius: theme.radiusLarge
            },
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 1,
        elevation: 1,
        marginBottom: 24,
    },
});
