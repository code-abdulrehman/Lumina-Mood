import React, { useState, useEffect, useRef } from 'react';
import { Animated, Image } from 'react-native';
import { CUSTOM_MOOD_IMAGES } from '../constants/MoodIcons';

export const AnimatedMoodIcon = () => {
    const moodImages = [
        CUSTOM_MOOD_IMAGES.awful,
        CUSTOM_MOOD_IMAGES.unhappy,
        CUSTOM_MOOD_IMAGES.down,
        CUSTOM_MOOD_IMAGES.neutral,
        CUSTOM_MOOD_IMAGES.good,
        CUSTOM_MOOD_IMAGES.great,
        CUSTOM_MOOD_IMAGES.awesome,
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            // Slide out current image (to left)
            Animated.timing(slideAnim, {
                toValue: -50,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                // Update to next mood
                setCurrentIndex((prev) => (prev + 1) % moodImages.length);

                // Reset position to right
                slideAnim.setValue(50);

                // Slide in new image (from right to center)
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, [slideAnim]);

    return (
        <Animated.View
            style={{
                transform: [{ translateX: slideAnim }],
            }}
        >
            <Image
                source={moodImages[currentIndex]}
                style={{ width: 38, height: 38 }}
                resizeMode="contain"
            />
        </Animated.View>
    );
};
