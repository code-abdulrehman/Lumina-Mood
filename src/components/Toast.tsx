import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    visible: boolean;
    message: string;
    type: ToastType;
    onHide: () => void;
}

export const Toast = ({ visible, message, type, onHide }: ToastProps) => {
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 8
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: true
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                })
            ]).start();
        }
    }, [visible]);

    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return '#10B981';
            case 'error': return '#EF4444';
            case 'info': return '#3B82F6';
            default: return '#3B82F6';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle color="#FFF" size={24} />;
            case 'error': return <AlertCircle color="#FFF" size={24} />;
            case 'info': return <Info color="#FFF" size={24} />;
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    top: insets.top + (Platform.OS === 'android' ? 10 : 0),
                    transform: [{ translateY }],
                    opacity
                }
            ]}
        >
            <View style={[styles.content, { backgroundColor: getBackgroundColor() }]}>
                <View style={styles.iconContainer}>
                    {getIcon()}
                </View>
                <Text style={styles.message}>{message}</Text>
                <TouchableOpacity onPress={onHide} style={styles.closeButton}>
                    <X color="#FFF" size={20} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 20,
        right: 20,
        zIndex: 9999,
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        width: '100%',
    },
    iconContainer: {
        marginRight: 12,
    },
    message: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
        fontFamily: 'NunitoSans_600SemiBold',
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    },
});
