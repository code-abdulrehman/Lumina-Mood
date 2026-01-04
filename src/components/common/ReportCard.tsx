import React, { forwardRef } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ReportCardProps {
    children: React.ReactNode;
    color: string;
    style?: ViewStyle | ViewStyle[];
}

export const ReportCard = forwardRef<View, ReportCardProps>(({ children, color, style }, ref) => {
    return (
        <View style={styles.cardContainer3D}>
            <View style={{ borderRadius: 25, overflow: 'hidden' }}>
                <View style={[styles.innerCard, { backgroundColor: color }, style]} ref={ref}>
                    {children}
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    cardContainer3D: {
        marginBottom: 30,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 15,
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 4,
    },
    innerCard: {
        padding: 20,
        minHeight: 200,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
        borderWidth: 1,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
    }
});
