import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useMood } from '../../context/MoodContext';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, style, containerStyle, ...props }) => {
    const { theme } = useMood();

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
            <View style={[
                styles.inputContainer,
                {
                    borderColor: error ? '#EF4444' : theme.border,
                    backgroundColor: theme.card,
                    borderRadius: theme.radius
                }
            ]}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={[styles.input, { color: theme.text }, style]}
                    placeholderTextColor={theme.textSecondary}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 12,
        height: 50,
    },
    iconContainer: {
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 15,
        fontWeight: '500',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
    },
});
