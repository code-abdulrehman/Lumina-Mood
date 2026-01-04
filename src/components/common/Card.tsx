import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useMood } from '../../context/MoodContext';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    backgroundColor?: string;
    onPress?: () => void;
    activeOpacity?: number;
    padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    backgroundColor,
    onPress,
    activeOpacity = 0.7,
    padding = 'medium'
}) => {
    const { theme } = useMood();
    const bg = backgroundColor || theme.card;

    const getPadding = () => {
        switch (padding) {
            case 'none': return 0;
            case 'small': return 12;
            case 'medium': return 20;
            case 'large': return 24;
            default: return 20;
        }
    };

    const cardStyles = [
        styles.card,
        {
            backgroundColor: bg,
            borderRadius: theme.radiusLarge,
            padding: getPadding(),
        },
        style
    ];

    if (onPress) {
        return (
            <TouchableOpacity
                style={cardStyles}
                onPress={onPress}
                activeOpacity={activeOpacity}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={cardStyles}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 1,
        elevation: 1,
        marginBottom: 24,
    },
});
