import { MoodConfig } from '../types/mood';
import { CUSTOM_MOOD_IMAGES } from '../constants/MoodIcons';

export const MOOD_CONFIGS: MoodConfig[] = [
    {
        level: 'awful',
        icon: 'Skull',
        label: 'Awful',
        color: '#374151', // Dark Gray
        customImage: CUSTOM_MOOD_IMAGES.awful,
    },
    {
        level: 'unhappy',
        icon: 'Annoyed',
        label: 'Bad',
        color: '#6D28D9', // Deep Purple
        customImage: CUSTOM_MOOD_IMAGES.unhappy,
    },
    {
        level: 'down',
        icon: 'Frown',
        label: 'Down',
        color: '#60A5FA', // Low-energy Blue
        customImage: CUSTOM_MOOD_IMAGES.down,
    },
    {
        level: 'neutral',
        icon: 'Meh',
        label: 'Neutral',
        color: '#9CA3AF', // Neutral Gray
        customImage: CUSTOM_MOOD_IMAGES.neutral,
    },
    {
        level: 'good',
        icon: 'SmilePlus',
        label: 'Good',
        color: '#34D399', // Green
        customImage: CUSTOM_MOOD_IMAGES.good,
    },
    {
        level: 'great',
        icon: 'Smile',
        label: 'Great',
        color: '#FACC15', // Amber
        customImage: CUSTOM_MOOD_IMAGES.great,
    },
    {
        level: 'awesome',
        icon: 'Zap',
        label: 'Awesome',
        color: '#8B5CF6', // Purple
        customImage: CUSTOM_MOOD_IMAGES.awesome,
    },
];
