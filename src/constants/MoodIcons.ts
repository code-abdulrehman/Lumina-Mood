/**
 * Custom image data for moods.
 * Using require() for direct image tag usage with PNG assets.
 */
export const CUSTOM_MOOD_IMAGES: Record<string, any> = {
    awesome: require('../../assets/moods/winking-face-with-tongue.png'),
    great: require('../../assets/moods/star-struck.png'),
    good: require('../../assets/moods/smiling-face.png'),
    neutral: require('../../assets/moods/neutral-face.png'),
    down: require('../../assets/moods/disappointed-face.png'),
    unhappy: require('../../assets/moods/pouting-face.png'),
    awful: require('../../assets/moods/nauseated-face.png'),
};
