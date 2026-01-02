import { MoodConfig } from '../types/mood';
import { CUSTOM_MOOD_IMAGES } from '../constants/MoodIcons';

export const MOOD_CONFIGS: MoodConfig[] = [
    {
        level: 'awesome',
        icon: 'Zap',
        label: 'Awesome',
        color: '#8B5CF6', // Purple
        customImage: CUSTOM_MOOD_IMAGES.awesome,
    },
    {
        level: 'great',
        icon: 'Smile',
        label: 'Great',
        color: '#FCD34D', // Amber
        customImage: CUSTOM_MOOD_IMAGES.great,
    },
    {
        level: 'good',
        icon: 'SmilePlus',
        label: 'Good',
        color: '#6EE7B7', // Emerald
        customImage: CUSTOM_MOOD_IMAGES.good,
    },
    {
        level: 'neutral',
        icon: 'Meh',
        label: 'Neutral',
        color: '#93C5FD', // Blue
        customImage: CUSTOM_MOOD_IMAGES.neutral,
    },
    {
        level: 'down',
        icon: 'Frown',
        label: 'Down',
        color: '#F87171', // Red/Salmon
        customImage: CUSTOM_MOOD_IMAGES.down,
    },
    {
        level: 'unhappy',
        icon: 'Annoyed',
        label: 'Bad',
        color: '#A78BFA', // Violet
        customImage: CUSTOM_MOOD_IMAGES.unhappy,
    },
    {
        level: 'awful',
        icon: 'Skull',
        label: 'Awful',
        color: '#4B5563', // Gray
        customImage: CUSTOM_MOOD_IMAGES.awful,
    },
];
