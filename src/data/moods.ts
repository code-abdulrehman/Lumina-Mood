import { MoodConfig } from '../types/mood';
import { CUSTOM_MOOD_IMAGES } from '../constants/MoodIcons';

export const MOOD_CONFIGS: MoodConfig[] = [
    {
        level: 'awful',
        icon: 'Skull',
        label: 'Awful',
        color: '#1F2933', // Near-black → hopelessness, extreme low
        customImage: CUSTOM_MOOD_IMAGES.awful,
    },
    {
        level: 'unhappy',
        icon: 'Annoyed',
        label: 'Angry / Bad',
        color: '#7F1D1D', // Dark Red → anger, frustration
        customImage: CUSTOM_MOOD_IMAGES.unhappy,
    },
    {
        level: 'down',
        icon: 'Frown',
        label: 'Sad',
        color: '#2563EB', // Blue → sadness ("feeling blue")
        customImage: CUSTOM_MOOD_IMAGES.down,
    },
    {
        level: 'neutral',
        icon: 'Meh',
        label: 'Neutral',
        color: '#9CA3AF', // Gray → emotional flatness
        customImage: CUSTOM_MOOD_IMAGES.neutral,
    },
    {
        level: 'good',
        icon: 'SmilePlus',
        label: 'Good',
        color: '#16A34A', // Green → balance, okay, stability
        customImage: CUSTOM_MOOD_IMAGES.good,
    },
    {
        level: 'great',
        icon: 'Smile',
        label: 'Happy',
        color: '#FACC15', // Yellow → happiness, warmth
        customImage: CUSTOM_MOOD_IMAGES.great,
    },
    {
        level: 'awesome',
        icon: 'Zap',
        label: 'Awesome',
        color: '#F97316', // Orange → excitement, high energy
        customImage: CUSTOM_MOOD_IMAGES.awesome,
    },
];
