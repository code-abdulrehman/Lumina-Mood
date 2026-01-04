import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

interface ScreenWrapperProps {
    children: React.ReactNode;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
    const isFocused = useIsFocused();
    const [shouldRender, setShouldRender] = useState(isFocused);

    useEffect(() => {
        if (isFocused) {
            setShouldRender(true);
        } else if (Platform.OS === 'web') {
            // On web, immediately hide when unfocused
            setShouldRender(false);
        }
    }, [isFocused]);

    // On web, don't render at all when not focused
    if (Platform.OS === 'web' && !isFocused) {
        return null;
    }

    return (
        <View
            style={[
                styles.container,
                Platform.OS === 'web' && !isFocused && styles.hidden
            ]}
        >
            {shouldRender && children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    hidden: {
        display: 'none',
        opacity: 0,
        pointerEvents: 'none',
    },
});
